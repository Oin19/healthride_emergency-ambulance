CREATE TABLE public.patient_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth date,
  gender text,
  blood_group text,
  relationship text NOT NULL DEFAULT 'self',
  is_self boolean NOT NULL DEFAULT false,
  phone text,
  allergies text,
  conditions text,
  medications text,
  medical_history text,
  critical_notes text,
  insurance_provider text,
  insurance_policy_number text,
  insurance_scheme text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_profiles_account ON public.patient_profiles(account_user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_profiles TO authenticated;
GRANT ALL ON public.patient_profiles TO service_role;

ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Account holders can view own patient profiles"
  ON public.patient_profiles FOR SELECT TO authenticated
  USING (account_user_id = auth.uid());

CREATE POLICY "Account holders can add patient profiles"
  ON public.patient_profiles FOR INSERT TO authenticated
  WITH CHECK (
    account_user_id = auth.uid()
    AND char_length(full_name) BETWEEN 1 AND 120
    AND (gender IS NULL OR gender IN ('male','female','other','prefer_not_to_say'))
    AND (phone IS NULL OR char_length(phone) <= 20)
  );

CREATE POLICY "Account holders can edit own patient profiles"
  ON public.patient_profiles FOR UPDATE TO authenticated
  USING (account_user_id = auth.uid())
  WITH CHECK (
    account_user_id = auth.uid()
    AND char_length(full_name) BETWEEN 1 AND 120
    AND (gender IS NULL OR gender IN ('male','female','other','prefer_not_to_say'))
    AND (phone IS NULL OR char_length(phone) <= 20)
  );

CREATE POLICY "Account holders can delete own patient profiles"
  ON public.patient_profiles FOR DELETE TO authenticated
  USING (account_user_id = auth.uid());

CREATE POLICY "Admins can view all patient profiles"
  ON public.patient_profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_patient_profiles_updated_at
  BEFORE UPDATE ON public.patient_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.ambulance_requests
  ADD COLUMN patient_profile_id uuid REFERENCES public.patient_profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_ambulance_requests_patient_profile ON public.ambulance_requests(patient_profile_id);