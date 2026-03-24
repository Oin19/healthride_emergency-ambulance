
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: admins can read all roles, users can read own
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Driver registrations table
CREATE TABLE public.driver_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile text NOT NULL,
  license_number text NOT NULL,
  vehicle_number text NOT NULL,
  ownership_type text NOT NULL DEFAULT 'self',
  hospital_name text,
  ambulance_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.driver_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access driver registrations" ON public.driver_registrations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert driver registration" ON public.driver_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Hospital registrations table
CREATE TABLE public.hospital_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name text NOT NULL,
  id_type text NOT NULL DEFAULT 'nin',
  id_number text NOT NULL,
  facilities text,
  address text NOT NULL,
  business_contact text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hospital_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access hospital registrations" ON public.hospital_registrations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert hospital registration" ON public.hospital_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_driver_registrations_updated_at
  BEFORE UPDATE ON public.driver_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospital_registrations_updated_at
  BEFORE UPDATE ON public.hospital_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
