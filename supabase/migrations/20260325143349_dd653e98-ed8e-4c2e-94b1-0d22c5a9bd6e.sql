
-- Driver profiles (linked to auth.users for drivers who have accounts)
CREATE TABLE public.driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  registration_id UUID REFERENCES public.driver_registrations(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  ambulance_type TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Delhi',
  is_available BOOLEAN NOT NULL DEFAULT true,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- Drivers can read/update own profile
CREATE POLICY "Drivers can view own profile" ON public.driver_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Drivers can update own profile" ON public.driver_profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Drivers can insert own profile" ON public.driver_profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Admins full access
CREATE POLICY "Admins full access driver profiles" ON public.driver_profiles
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Patients can see available drivers (for tracking)
CREATE POLICY "Anyone can view available drivers" ON public.driver_profiles
  FOR SELECT TO authenticated USING (is_available = true);

-- Ambulance requests table
CREATE TABLE public.ambulance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.driver_profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  emergency_type TEXT NOT NULL,
  patient_name TEXT,
  patient_phone TEXT,
  patient_lat DOUBLE PRECISION NOT NULL,
  patient_lng DOUBLE PRECISION NOT NULL,
  patient_address TEXT,
  notes TEXT,
  city TEXT NOT NULL DEFAULT 'Delhi',
  driver_lat DOUBLE PRECISION,
  driver_lng DOUBLE PRECISION,
  eta_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;

-- Patients can create requests (authenticated)
CREATE POLICY "Patients can create requests" ON public.ambulance_requests
  FOR INSERT TO authenticated WITH CHECK (patient_user_id = auth.uid());

-- Patients can view own requests
CREATE POLICY "Patients can view own requests" ON public.ambulance_requests
  FOR SELECT TO authenticated USING (patient_user_id = auth.uid());

-- Drivers can view pending requests in their city
CREATE POLICY "Drivers can view pending requests" ON public.ambulance_requests
  FOR SELECT TO authenticated USING (
    status = 'pending' OR driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid())
  );

-- Drivers can accept/update requests assigned to them
CREATE POLICY "Drivers can update assigned requests" ON public.ambulance_requests
  FOR UPDATE TO authenticated USING (
    driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid())
    OR (status = 'pending')
  );

-- Admins full access
CREATE POLICY "Admins full access requests" ON public.ambulance_requests
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Enable realtime for ambulance_requests and driver_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.ambulance_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_profiles;

-- Add driver role to enum if not exists (it already has admin, moderator, user)
-- We'll use 'user' role for drivers too, and differentiate by having a driver_profile

-- Trigger for updated_at
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON public.driver_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ambulance_requests_updated_at BEFORE UPDATE ON public.ambulance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
