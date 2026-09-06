
CREATE OR REPLACE FUNCTION public.my_driver_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT id FROM public.driver_profiles WHERE user_id = auth.uid() $$;

REVOKE EXECUTE ON FUNCTION public.my_driver_ids() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_driver_ids() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_my_assigned_driver(_driver_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.ambulance_requests r WHERE r.driver_id = _driver_id AND r.patient_user_id = auth.uid()) $$;

REVOKE EXECUTE ON FUNCTION public.is_my_assigned_driver(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_my_assigned_driver(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Patients can view their assigned driver" ON public.driver_profiles;
CREATE POLICY "Patients can view their assigned driver"
ON public.driver_profiles FOR SELECT TO authenticated
USING (public.is_my_assigned_driver(id));

DROP POLICY IF EXISTS "Drivers can view assigned requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can view assigned requests"
ON public.ambulance_requests FOR SELECT TO authenticated
USING (driver_id IN (SELECT public.my_driver_ids()));

DROP POLICY IF EXISTS "Drivers can update their own assigned requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can update their own assigned requests"
ON public.ambulance_requests FOR UPDATE TO authenticated
USING (driver_id IN (SELECT public.my_driver_ids()))
WITH CHECK (driver_id IN (SELECT public.my_driver_ids()));

DROP POLICY IF EXISTS "Drivers can claim unassigned pending requests" ON public.ambulance_requests;
CREATE POLICY "Drivers can claim unassigned pending requests"
ON public.ambulance_requests FOR UPDATE TO authenticated
USING (status = 'pending' AND driver_id IS NULL AND EXISTS (SELECT 1 FROM public.my_driver_ids()))
WITH CHECK (driver_id IN (SELECT public.my_driver_ids()) AND status = ANY (ARRAY['accepted','en_route','arrived']));
