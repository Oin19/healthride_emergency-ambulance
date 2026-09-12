import { supabase } from "@/integrations/supabase/client";

export interface PatientProfile {
  id: string;
  account_user_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  relationship: string;
  is_self: boolean;
  phone: string | null;
  allergies: string | null;
  conditions: string | null;
  medications: string | null;
  medical_history: string | null;
  critical_notes: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  insurance_scheme: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  created_at: string;
  updated_at: string;
}

export type PatientProfileInput = Omit<PatientProfile, "id" | "account_user_id" | "created_at" | "updated_at">;

export const RELATIONSHIPS = [
  "self", "mother", "father", "spouse", "child", "grandparent", "sibling", "relative", "friend", "other",
] as const;

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export const INSURANCE_SCHEMES = [
  "Ayushman Bharat (PM-JAY)", "Swasthya Sathi", "CGHS", "ESIC", "ECHS", "Private insurance", "None",
];

export const emptyPatient = (): PatientProfileInput => ({
  full_name: "",
  date_of_birth: null,
  gender: null,
  blood_group: null,
  relationship: "self",
  is_self: false,
  phone: null,
  allergies: null,
  conditions: null,
  medications: null,
  medical_history: null,
  critical_notes: null,
  insurance_provider: null,
  insurance_policy_number: null,
  insurance_scheme: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  emergency_contact_relationship: null,
});

export const relationshipLabel = (r: string) =>
  r === "self" ? "Myself" : r.charAt(0).toUpperCase() + r.slice(1);

export const ageFromDob = (dob: string | null): number | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 0 ? null : age;
};

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export async function fetchPatientProfiles(userId: string): Promise<PatientProfile[]> {
  const { data, error } = await supabase
    .from("patient_profiles")
    .select("*")
    .eq("account_user_id", userId)
    .order("is_self", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as PatientProfile[];
}

const clean = (p: PatientProfileInput): PatientProfileInput => {
  const out = { ...p };
  (Object.keys(out) as (keyof PatientProfileInput)[]).forEach((k) => {
    const v = out[k];
    if (typeof v === "string" && v.trim() === "" && k !== "full_name" && k !== "relationship") {
      (out as any)[k] = null;
    }
  });
  out.is_self = out.relationship === "self";
  return out;
};

export async function createPatientProfile(userId: string, input: PatientProfileInput) {
  const { data, error } = await supabase
    .from("patient_profiles")
    .insert({ ...clean(input), account_user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as PatientProfile;
}

export async function updatePatientProfile(id: string, input: PatientProfileInput) {
  const { data, error } = await supabase
    .from("patient_profiles")
    .update(clean(input))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as PatientProfile;
}

export async function deletePatientProfile(id: string) {
  const { error } = await supabase.from("patient_profiles").delete().eq("id", id);
  if (error) throw error;
}

/** Build a summary line paramedics can read at a glance. */
export const criticalSummary = (p: PatientProfile): string => {
  const parts: string[] = [];
  if (p.blood_group && p.blood_group !== "Unknown") parts.push(`Blood: ${p.blood_group}`);
  if (p.allergies) parts.push(`Allergies: ${p.allergies}`);
  if (p.conditions) parts.push(`Conditions: ${p.conditions}`);
  if (p.medications) parts.push(`Meds: ${p.medications}`);
  if (p.critical_notes) parts.push(`Critical: ${p.critical_notes}`);
  return parts.join(" | ");
};
