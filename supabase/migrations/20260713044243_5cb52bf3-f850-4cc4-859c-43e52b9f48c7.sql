
-- 1. Change SECURITY DEFINER functions to SECURITY INVOKER (callers already have RLS-level access to the rows these read).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_own_profile(_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _profile_id AND user_id = auth.uid()) $$;

-- 2. Replace WITH CHECK (true) INSERT policies with real validation.
DROP POLICY IF EXISTS "Anyone can insert hospital registration" ON public.hospital_registrations;
CREATE POLICY "Anyone can submit valid hospital registration"
  ON public.hospital_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(hospital_name) BETWEEN 2 AND 200
    AND id_type IN ('nin','hfr')
    AND char_length(id_number) BETWEEN 10 AND 12
    AND char_length(business_contact) = 10
    AND char_length(address) BETWEEN 5 AND 500
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "Anyone can insert driver registration" ON public.driver_registrations;
CREATE POLICY "Anyone can submit valid driver registration"
  ON public.driver_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(mobile) = 10
    AND char_length(license_number) BETWEEN 5 AND 30
    AND char_length(vehicle_number) BETWEEN 5 AND 20
    AND ownership_type IN ('self','hospital')
    AND char_length(ambulance_type) > 0
    AND status = 'pending'
  );

-- 3. Restrict driver_profiles: drop broad "anyone available" policy, allow patients to see only their assigned driver.
DROP POLICY IF EXISTS "Anyone can view available drivers" ON public.driver_profiles;

CREATE POLICY "Patients can view their assigned driver"
  ON public.driver_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ambulance_requests r
      WHERE r.driver_id = driver_profiles.id
        AND r.patient_user_id = auth.uid()
    )
  );

-- 4. Restrict ambulance_requests: drivers only see rows assigned to them; split UPDATE into claim vs own-row update.
DROP POLICY IF EXISTS "Drivers can view pending requests" ON public.ambulance_requests;
DROP POLICY IF EXISTS "Drivers can update assigned requests" ON public.ambulance_requests;

CREATE POLICY "Drivers can view assigned requests"
  ON public.ambulance_requests
  FOR SELECT
  TO authenticated
  USING (
    driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Drivers can claim unassigned pending requests"
  ON public.ambulance_requests
  FOR UPDATE
  TO authenticated
  USING (
    status = 'pending'
    AND driver_id IS NULL
    AND EXISTS (SELECT 1 FROM public.driver_profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid())
    AND status IN ('accepted','en_route','arrived')
  );

CREATE POLICY "Drivers can update their own assigned requests"
  ON public.ambulance_requests
  FOR UPDATE
  TO authenticated
  USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()))
  WITH CHECK (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));

-- 5. Dispatch queue view: only non-PII fields exposed to drivers before they claim a request.
DROP VIEW IF EXISTS public.dispatch_queue;
CREATE VIEW public.dispatch_queue
WITH (security_invoker = false, security_barrier = true) AS
SELECT id, city, emergency_type, patient_lat, patient_lng, created_at, status
FROM public.ambulance_requests
WHERE status = 'pending'
  AND driver_id IS NULL
  AND EXISTS (SELECT 1 FROM public.driver_profiles WHERE user_id = auth.uid());

GRANT SELECT ON public.dispatch_queue TO authenticated;
