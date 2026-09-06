-- 1. Move log_security_event out of the API-exposed schema
CREATE SCHEMA IF NOT EXISTS security_internal;
REVOKE ALL ON SCHEMA security_internal FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA security_internal TO service_role;

REVOKE ALL ON FUNCTION public.log_security_event(text, text, text, jsonb, text, text, text) FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.log_security_event(text, text, text, jsonb, text, text, text) SET SCHEMA security_internal;
ALTER FUNCTION security_internal.log_security_event(text, text, text, jsonb, text, text, text) SET search_path = public, security_internal;
REVOKE ALL ON FUNCTION security_internal.log_security_event(text, text, text, jsonb, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION security_internal.log_security_event(text, text, text, jsonb, text, text, text) TO service_role;

-- keep the trigger working with the relocated function
CREATE OR REPLACE FUNCTION public.flag_suspicious_request_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'security_internal'
AS $function$
BEGIN
  IF NEW.action IN ('claim','status_change','update') AND NEW.actor_user_id IS NOT NULL THEN
    IF NEW.old_driver_id IS NOT NULL
       AND NEW.new_driver_id IS DISTINCT FROM NEW.old_driver_id
       AND NEW.action <> 'claim' THEN
      PERFORM security_internal.log_security_event(
        'suspicious.access',
        'warning',
        'ambulance_requests:' || NEW.request_id::text,
        jsonb_build_object(
          'reason','driver_reassignment',
          'old_driver_id', NEW.old_driver_id,
          'new_driver_id', NEW.new_driver_id
        ),
        NULL, NULL, NULL
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.flag_suspicious_request_change() FROM PUBLIC, anon, authenticated;

-- 2. Audit log: no client write path, ever
REVOKE INSERT, UPDATE, DELETE ON public.ambulance_request_audit_log FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.ambulance_request_audit_log TO authenticated;
GRANT ALL ON public.ambulance_request_audit_log TO service_role;

DROP POLICY IF EXISTS "Audit log is append-only via trigger (no client insert)" ON public.ambulance_request_audit_log;
CREATE POLICY "Audit log is append-only via trigger (no client insert)"
  ON public.ambulance_request_audit_log AS RESTRICTIVE FOR INSERT
  TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "Audit log is immutable" ON public.ambulance_request_audit_log;
CREATE POLICY "Audit log is immutable"
  ON public.ambulance_request_audit_log AS RESTRICTIVE FOR UPDATE
  TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Audit log cannot be deleted" ON public.ambulance_request_audit_log;
CREATE POLICY "Audit log cannot be deleted"
  ON public.ambulance_request_audit_log AS RESTRICTIVE FOR DELETE
  TO anon, authenticated USING (false);

-- 3. ambulance_requests: deletes are admin-only, explicitly
REVOKE DELETE ON public.ambulance_requests FROM PUBLIC, anon;
DROP POLICY IF EXISTS "Only admins can delete requests" ON public.ambulance_requests;
CREATE POLICY "Only admins can delete requests"
  ON public.ambulance_requests AS RESTRICTIVE FOR DELETE
  TO anon, authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Stop broadcasting driver PII / live location over Realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.driver_profiles;