
-- 1) Recreate dispatch_queue as SECURITY INVOKER (respect querying user's RLS)
DROP VIEW IF EXISTS public.dispatch_queue;
CREATE VIEW public.dispatch_queue
WITH (security_invoker = true) AS
SELECT id, city, emergency_type, patient_lat, patient_lng, created_at, status
FROM public.ambulance_requests
WHERE status = 'pending'
  AND driver_id IS NULL
  AND EXISTS (SELECT 1 FROM public.driver_profiles WHERE driver_profiles.user_id = auth.uid());

GRANT SELECT ON public.dispatch_queue TO authenticated;
GRANT ALL ON public.dispatch_queue TO service_role;

-- 2) Require authentication to insert registration requests (anti-flood)
DROP POLICY IF EXISTS "Anyone can submit driver registration" ON public.driver_registrations;
DROP POLICY IF EXISTS "Public can insert driver registrations" ON public.driver_registrations;
DROP POLICY IF EXISTS "Anyone can insert driver registrations" ON public.driver_registrations;
DROP POLICY IF EXISTS "Validated driver registrations" ON public.driver_registrations;

CREATE POLICY "Authenticated users can submit driver registration"
ON public.driver_registrations
FOR INSERT
TO authenticated
WITH CHECK (
  length(mobile) = 10
  AND mobile ~ '^[0-9]+$'
  AND length(license_number) BETWEEN 3 AND 50
  AND length(vehicle_number) BETWEEN 3 AND 30
  AND ownership_type IN ('self','hospital')
  AND ambulance_type IN (
    'Basic Life Support (BLS)',
    'Advanced Life Support (ALS)',
    'Patient Transport Ambulance',
    'Neonatal Ambulance',
    'Mortuary Van'
  )
  AND (ownership_type = 'self' OR (hospital_name IS NOT NULL AND length(hospital_name) BETWEEN 2 AND 200))
  AND status = 'pending'
);

REVOKE INSERT ON public.driver_registrations FROM anon;

DROP POLICY IF EXISTS "Anyone can submit hospital registration" ON public.hospital_registrations;
DROP POLICY IF EXISTS "Public can insert hospital registrations" ON public.hospital_registrations;
DROP POLICY IF EXISTS "Anyone can insert hospital registrations" ON public.hospital_registrations;
DROP POLICY IF EXISTS "Validated hospital registrations" ON public.hospital_registrations;

CREATE POLICY "Authenticated users can submit hospital registration"
ON public.hospital_registrations
FOR INSERT
TO authenticated
WITH CHECK (
  length(hospital_name) BETWEEN 2 AND 200
  AND id_type IN ('nin','hfr')
  AND ((id_type = 'nin' AND length(id_number) = 10) OR (id_type = 'hfr' AND length(id_number) = 12))
  AND id_number ~ '^[0-9]+$'
  AND length(address) BETWEEN 5 AND 500
  AND length(business_contact) = 10
  AND business_contact ~ '^[0-9]+$'
  AND status = 'pending'
);

REVOKE INSERT ON public.hospital_registrations FROM anon;
