
-- Security events log (append-only)
CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  actor_user_id uuid,
  actor_email text,
  ip_address text,
  user_agent text,
  resource text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_events_created_at ON public.security_events (created_at DESC);
CREATE INDEX idx_security_events_type_created ON public.security_events (event_type, created_at DESC);
CREATE INDEX idx_security_events_actor_created ON public.security_events (actor_user_id, created_at DESC);
CREATE INDEX idx_security_events_ip_created ON public.security_events (ip_address, created_at DESC);

GRANT SELECT ON public.security_events TO authenticated;
GRANT ALL ON public.security_events TO service_role;

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can read
CREATE POLICY "Admins can view security events"
ON public.security_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- No direct client inserts/updates/deletes; use log_security_event() only.
-- (Absence of INSERT/UPDATE/DELETE policies = denied under RLS.)

-- Rate-limited logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type text,
  _severity text DEFAULT 'info',
  _resource text DEFAULT NULL,
  _details jsonb DEFAULT '{}'::jsonb,
  _ip_address text DEFAULT NULL,
  _user_agent text DEFAULT NULL,
  _actor_email text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_recent int;
  v_id uuid;
BEGIN
  IF _event_type IS NULL OR length(_event_type) = 0 OR length(_event_type) > 100 THEN
    RAISE EXCEPTION 'invalid event_type';
  END IF;
  IF _severity NOT IN ('info','warning','critical') THEN
    _severity := 'info';
  END IF;

  -- Basic rate limit: 30 events / minute per (user OR ip)
  SELECT count(*) INTO v_recent
  FROM public.security_events
  WHERE created_at > now() - interval '1 minute'
    AND (
      (v_uid IS NOT NULL AND actor_user_id = v_uid)
      OR (v_uid IS NULL AND _ip_address IS NOT NULL AND ip_address = _ip_address)
    );

  IF v_recent >= 30 THEN
    RETURN NULL; -- silently drop to avoid amplification
  END IF;

  INSERT INTO public.security_events
    (event_type, severity, actor_user_id, actor_email, ip_address, user_agent, resource, details)
  VALUES
    (_event_type, _severity, v_uid, _actor_email, _ip_address, _user_agent, _resource,
     COALESCE(_details, '{}'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.log_security_event(text,text,text,jsonb,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_security_event(text,text,text,jsonb,text,text,text) TO anon, authenticated;

-- Alerts view: suspicious patterns (5+ failures in 10 min from same actor or IP)
CREATE OR REPLACE VIEW public.security_alerts
WITH (security_invoker = true) AS
WITH recent AS (
  SELECT * FROM public.security_events
  WHERE created_at > now() - interval '24 hours'
    AND event_type IN (
      'auth.failed_login',
      'auth.password_reset_abuse',
      'rls.denied',
      'authorization.denied',
      'suspicious.access'
    )
)
SELECT
  'user'::text AS scope,
  COALESCE(actor_user_id::text, actor_email, 'unknown') AS scope_key,
  event_type,
  count(*)::int AS occurrences,
  min(created_at) AS first_seen,
  max(created_at) AS last_seen,
  max(severity) AS max_severity
FROM recent
WHERE actor_user_id IS NOT NULL OR actor_email IS NOT NULL
GROUP BY scope_key, event_type
HAVING count(*) >= 5
UNION ALL
SELECT
  'ip'::text AS scope,
  ip_address AS scope_key,
  event_type,
  count(*)::int,
  min(created_at),
  max(created_at),
  max(severity)
FROM recent
WHERE ip_address IS NOT NULL
GROUP BY ip_address, event_type
HAVING count(*) >= 5;

GRANT SELECT ON public.security_alerts TO authenticated;

-- Log ambulance_requests policy-denied access attempts via a trigger on the audit log too:
-- If a status_change reverts driver_id from set -> null unexpectedly, flag it.
CREATE OR REPLACE FUNCTION public.flag_suspicious_request_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Someone other than the assigned driver or the patient owner attempting an update
  IF NEW.action IN ('claim','status_change','update') AND NEW.actor_user_id IS NOT NULL THEN
    IF NEW.old_driver_id IS NOT NULL
       AND NEW.new_driver_id IS DISTINCT FROM NEW.old_driver_id
       AND NEW.action <> 'claim' THEN
      PERFORM public.log_security_event(
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
$$;

CREATE TRIGGER trg_flag_suspicious_request_change
AFTER INSERT ON public.ambulance_request_audit_log
FOR EACH ROW EXECUTE FUNCTION public.flag_suspicious_request_change();
