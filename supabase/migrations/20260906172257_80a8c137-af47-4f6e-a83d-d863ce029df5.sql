
CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app_private.my_driver_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT id FROM public.driver_profiles WHERE user_id = auth.uid() $$;

CREATE OR REPLACE FUNCTION app_private.is_my_assigned_driver(_driver_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.ambulance_requests r WHERE r.driver_id = _driver_id AND r.patient_user_id = auth.uid()) $$;

REVOKE EXECUTE ON FUNCTION app_private.my_driver_ids(), app_private.is_my_assigned_driver(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.my_driver_ids(), app_private.is_my_assigned_driver(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Patients can view their assigned driver" ON public.driver_profiles;
CREATE POLICY "Patients can view their assigned driver"
ON public.driver_profiles FOR SELECT TO authenticated
USING (app_private.is_my_assigned_driver(id));

DROP POLICY IF EXISTS "Drivers can view assigned requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can view assigned requests"
ON public.ambulance_requests FOR SELECT TO authenticated
USING (driver_id IN (SELECT app_private.my_driver_ids()));

DROP POLICY IF EXISTS "Drivers can update their own assigned requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can update their own assigned requests"
ON public.ambulance_requests FOR UPDATE TO authenticated
USING (driver_id IN (SELECT app_private.my_driver_ids()))
WITH CHECK (driver_id IN (SELECT app_private.my_driver_ids()));

DROP POLICY IF EXISTS "Drivers can claim unassigned pending requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can claim unassigned pending requests"
ON public.ambulance_requests FOR UPDATE TO authenticated
USING (status = 'pending' AND driver_id IS NULL AND EXISTS (SELECT 1 FROM app_private.my_driver_ids()))
WITH CHECK (driver_id IN (SELECT app_private.my_driver_ids()) AND status = ANY (ARRAY['accepted','en_route','arrived']));

DROP FUNCTION IF EXISTS public.my_driver_ids();
DROP FUNCTION IF EXISTS public.is_my_assigned_driver(uuid);
