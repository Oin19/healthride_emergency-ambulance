import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import healthrideLogo from "@/assets/healthride-logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PatientProfileForm from "@/components/PatientProfileForm";
import {
  ArrowLeft, Loader2, LogOut, Plus, Users, Pencil, Trash2, Eye, Droplets, AlertTriangle,
  Shield, Phone, Stethoscope, Pill, History, UserPlus,
} from "lucide-react";
import {
  ageFromDob, createPatientProfile, deletePatientProfile, fetchPatientProfiles, initials,
  relationshipLabel, updatePatientProfile, type PatientProfile, type PatientProfileInput, emptyPatient,
} from "@/lib/patientProfiles";

const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
  value ? (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  ) : null;

const Family = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PatientProfile | null>(null);
  const [viewing, setViewing] = useState<PatientProfile | null>(null);
  const [selfSeed, setSelfSeed] = useState<PatientProfile | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        setPatients(await fetchPatientProfiles(user.id));
      } catch (e: any) {
        toast({ title: "Could not load patients", description: e.message, variant: "destructive" });
      }
      setLoading(false);
    })();
  }, [user]);

  const hasSelf = patients.some((p) => p.is_self);

  /** Pre-fill "Myself" from the existing account health profile so nothing has to be re-typed. */
  const addMyself = async () => {
    if (!user) return;
    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    let seed: PatientProfileInput = { ...emptyPatient(), relationship: "self", is_self: true };
    if (p) {
      const [ins, med, con] = await Promise.all([
        supabase.from("insurance_details").select("*").eq("profile_id", p.id).maybeSingle(),
        supabase.from("medical_history").select("*").eq("profile_id", p.id).maybeSingle(),
        supabase.from("emergency_contacts").select("*").eq("profile_id", p.id).limit(1).maybeSingle(),
      ]);
      seed = {
        ...seed,
        full_name: p.full_name || "",
        phone: p.phone,
        date_of_birth: p.date_of_birth,
        blood_group: p.blood_type,
        insurance_provider: ins.data?.provider ?? null,
        insurance_policy_number: ins.data?.policy_number ?? null,
        conditions: med.data?.conditions ?? null,
        allergies: med.data?.allergies ?? null,
        medications: med.data?.medications ?? null,
        emergency_contact_name: con.data?.contact_name ?? null,
        emergency_contact_phone: con.data?.phone ?? null,
        emergency_contact_relationship: con.data?.relationship ?? null,
      };
    }
    setSelfSeed({ ...seed, id: "", account_user_id: user.id, created_at: "", updated_at: "" } as PatientProfile);
    setEditing(null);
    setFormOpen(true);
  };

  const openAdd = () => { setSelfSeed(null); setEditing(null); setFormOpen(true); };
  const openEdit = (p: PatientProfile) => { setSelfSeed(null); setEditing(p); setViewing(null); setFormOpen(true); };

  const handleSubmit = async (input: PatientProfileInput) => {
    if (!user) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updatePatientProfile(editing.id, input);
        setPatients((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
        toast({ title: "Saved", description: `${updated.full_name}'s profile updated.` });
      } else {
        const created = await createPatientProfile(user.id, input);
        setPatients((ps) => [...ps, created]);
        toast({ title: "Patient added", description: `${created.full_name} can now be selected when booking.` });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (p: PatientProfile) => {
    if (!confirm(`Remove ${p.full_name} from your family profiles?`)) return;
    try {
      await deletePatientProfile(p.id);
      setPatients((ps) => ps.filter((x) => x.id !== p.id));
      setViewing(null);
      toast({ title: "Removed", description: `${p.full_name} was removed.` });
    } catch (e: any) {
      toast({ title: "Could not remove", description: e.message, variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Family – Patient Profiles | HealthRide</title>
        <meta name="description" content="Manage patient profiles for your family members so you can book an ambulance for anyone in seconds." />
      </Helmet>

      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <img src={healthrideLogo} alt="HealthRide" className="w-8 h-8" />
              HealthRide
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>My account</Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-accent" /> My Family
            </h1>
            <p className="text-muted-foreground">
              Keep a profile for everyone you might book for — parents, children, grandparents. Pick them in one tap during an emergency.
            </p>
          </div>
          <div className="flex gap-2">
            {!hasSelf && (
              <Button variant="outline" onClick={addMyself}>
                <UserPlus className="w-4 h-4" /> Add myself
              </Button>
            )}
            <Button variant="emergency" onClick={openAdd}>
              <Plus className="w-4 h-4" /> Add patient
            </Button>
          </div>
        </div>

        {patients.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">No patient profiles yet</h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
                  Add yourself and your family members so paramedics get the right medical details the moment you book.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={addMyself}><UserPlus className="w-4 h-4" /> Add myself</Button>
                <Button variant="emergency" onClick={openAdd}><Plus className="w-4 h-4" /> Add a family member</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((p) => {
              const age = ageFromDob(p.date_of_birth);
              return (
                <Card key={p.id} className="shadow-card hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-emergency text-primary-foreground flex items-center justify-center font-display font-bold shrink-0">
                        {initials(p.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{p.full_name}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <Badge variant={p.is_self ? "default" : "secondary"}>{relationshipLabel(p.relationship)}</Badge>
                          {age !== null && <span>{age} yrs</span>}
                          {p.gender && <span className="capitalize">{p.gender.replace(/_/g, " ")}</span>}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {p.blood_group && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">
                          <Droplets className="w-3 h-3" /> {p.blood_group}
                        </span>
                      )}
                      {p.insurance_scheme && p.insurance_scheme !== "None" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          <Shield className="w-3 h-3" /> {p.insurance_scheme}
                        </span>
                      )}
                      {p.allergies && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive">
                          <AlertTriangle className="w-3 h-3" /> Allergies
                        </span>
                      )}
                    </div>
                    {p.critical_notes && (
                      <p className="text-xs text-accent border border-accent/30 bg-accent/5 rounded-md px-2 py-1.5 line-clamp-2">
                        <strong>Critical:</strong> {p.critical_notes}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" onClick={() => setViewing(p)}><Eye className="w-3.5 h-3.5" /> View</Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive ml-auto" onClick={() => handleDelete(p)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <PatientProfileForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing ?? selfSeed}
        saving={saving}
        onSubmit={handleSubmit}
      />

      {/* Detail view */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-emergency text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {initials(viewing.full_name)}
                  </span>
                  {viewing.full_name}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap gap-2 items-center">
                  <Badge variant={viewing.is_self ? "default" : "secondary"}>{relationshipLabel(viewing.relationship)}</Badge>
                  {ageFromDob(viewing.date_of_birth) !== null && <span>{ageFromDob(viewing.date_of_birth)} yrs</span>}
                  {viewing.gender && <span className="capitalize">{viewing.gender.replace(/_/g, " ")}</span>}
                  {viewing.blood_group && <span className="text-accent font-medium">{viewing.blood_group}</span>}
                </DialogDescription>
              </DialogHeader>

              {viewing.critical_notes && (
                <div className="rounded-lg border border-accent/40 bg-accent/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-accent font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Critical medical notes</p>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{viewing.critical_notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Stethoscope className="w-4 h-4 text-accent" /> Medical</h3>
                  <Field label="Allergies" value={viewing.allergies} />
                  <Field label="Conditions" value={viewing.conditions} />
                  <Field label="Medications" value={viewing.medications} />
                  <Field label="History" value={viewing.medical_history} />
                  {!viewing.allergies && !viewing.conditions && !viewing.medications && !viewing.medical_history && (
                    <p className="text-sm text-muted-foreground">No medical details added.</p>
                  )}
                </div>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> Insurance</h3>
                    <Field label="Scheme" value={viewing.insurance_scheme} />
                    <Field label="Provider" value={viewing.insurance_provider} />
                    <Field label="Policy / card no." value={viewing.insurance_policy_number} />
                    {!viewing.insurance_scheme && !viewing.insurance_provider && <p className="text-sm text-muted-foreground">No insurance added.</p>}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> Contact</h3>
                    <Field label="Patient phone" value={viewing.phone} />
                    <Field label="Emergency contact" value={viewing.emergency_contact_name ? `${viewing.emergency_contact_name}${viewing.emergency_contact_relationship ? ` (${viewing.emergency_contact_relationship})` : ""}` : null} />
                    <Field label="Emergency phone" value={viewing.emergency_contact_phone} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" size="sm" className="text-destructive mr-auto" onClick={() => handleDelete(viewing)}><Trash2 className="w-3.5 h-3.5" /> Remove</Button>
                <Button variant="outline" onClick={() => openEdit(viewing)}><Pencil className="w-4 h-4" /> Edit</Button>
                <Button variant="emergency" onClick={() => setViewing(null)}>Done</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Family;
