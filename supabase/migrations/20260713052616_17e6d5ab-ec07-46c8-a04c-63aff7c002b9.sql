
CREATE TABLE public.ambulance_request_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  action text NOT NULL,
  actor_user_id uuid,
  old_status text,
  new_status text,
  old_driver_id uuid,
  new_driver_id uuid,
  changed_fields jsonb,
  old_row jsonb,
  new_row jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_arq_audit_request_id ON public.ambulance_request_audit_log(request_id);
CREATE INDEX idx_arq_audit_created_at ON public.ambulance_request_audit_log(created_at DESC);

GRANT SELECT ON public.ambulance_request_audit_log TO authenticated;
GRANT ALL ON public.ambulance_request_audit_log TO service_role;

ALTER TABLE public.ambulance_request_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
ON public.ambulance_request_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.log_ambulance_request_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action text;
  v_changed jsonb := '{}'::jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    INSERT INTO public.ambulance_request_audit_log
      (request_id, action, actor_user_id, old_status, new_status, old_driver_id, new_driver_id, changed_fields, old_row, new_row)
    VALUES
      (NEW.id, v_action, auth.uid(), NULL, NEW.status, NULL, NEW.driver_id, NULL, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.driver_id IS DISTINCT FROM NEW.driver_id AND OLD.driver_id IS NULL AND NEW.driver_id IS NOT NULL THEN
      v_action := 'claim';
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
      v_action := 'status_change';
    ELSE
      v_action := 'update';
    END IF;

    IF OLD.status IS DISTINCT FROM NEW.status THEN
      v_changed := v_changed || jsonb_build_object('status', jsonb_build_array(OLD.status, NEW.status));
    END IF;
    IF OLD.driver_id IS DISTINCT FROM NEW.driver_id THEN
      v_changed := v_changed || jsonb_build_object('driver_id', jsonb_build_array(OLD.driver_id, NEW.driver_id));
    END IF;
    IF OLD.eta_minutes IS DISTINCT FROM NEW.eta_minutes THEN
      v_changed := v_changed || jsonb_build_object('eta_minutes', jsonb_build_array(OLD.eta_minutes, NEW.eta_minutes));
    END IF;
    IF OLD.driver_lat IS DISTINCT FROM NEW.driver_lat OR OLD.driver_lng IS DISTINCT FROM NEW.driver_lng THEN
      v_changed := v_changed || jsonb_build_object('driver_location', jsonb_build_array(
        jsonb_build_array(OLD.driver_lat, OLD.driver_lng),
        jsonb_build_array(NEW.driver_lat, NEW.driver_lng)
      ));
    END IF;
    IF OLD.notes IS DISTINCT FROM NEW.notes THEN
      v_changed := v_changed || jsonb_build_object('notes', jsonb_build_array(OLD.notes, NEW.notes));
    END IF;

    INSERT INTO public.ambulance_request_audit_log
      (request_id, action, actor_user_id, old_status, new_status, old_driver_id, new_driver_id, changed_fields, old_row, new_row)
    VALUES
      (NEW.id, v_action, auth.uid(), OLD.status, NEW.status, OLD.driver_id, NEW.driver_id, v_changed, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_ambulance_request_change() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_log_ambulance_request_change ON public.ambulance_requests;
CREATE TRIGGER trg_log_ambulance_request_change
AFTER INSERT OR UPDATE ON public.ambulance_requests
FOR EACH ROW EXECUTE FUNCTION public.log_ambulance_request_change();
