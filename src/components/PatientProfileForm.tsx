import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, User, Stethoscope, Shield, Phone } from "lucide-react";
import {
  BLOOD_GROUPS, GENDERS, INSURANCE_SCHEMES, RELATIONSHIPS, emptyPatient,
  relationshipLabel, type PatientProfile, type PatientProfileInput,
} from "@/lib/patientProfiles";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: PatientProfile | null;
  saving: boolean;
  onSubmit: (input: PatientProfileInput) => Promise<void>;
}

const PatientProfileForm = ({ open, onOpenChange, initial, saving, onSubmit }: Props) => {
  const [form, setForm] = useState<PatientProfileInput>(emptyPatient());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      const { id: _id, account_user_id: _a, created_at: _c, updated_at: _u, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(emptyPatient());
    }
  }, [open, initial]);

  const set = <K extends keyof PatientProfileInput>(key: K, value: PatientProfileInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.full_name.trim()) { setError("Please enter the patient's name."); return; }
    if (form.phone && !/^[0-9+\-\s]{6,20}$/.test(form.phone)) { setError("Please enter a valid phone number."); return; }
    setError(null);
    await onSubmit({ ...form, full_name: form.full_name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{initial ? "Edit patient" : "Add a patient"}</DialogTitle>
          <DialogDescription>
            This information is shared with the ambulance crew when you book for this person.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="gap-1.5"><User className="w-3.5 h-3.5 hidden sm:block" /> Basic</TabsTrigger>
            <TabsTrigger value="medical" className="gap-1.5"><Stethoscope className="w-3.5 h-3.5 hidden sm:block" /> Medical</TabsTrigger>
            <TabsTrigger value="insurance" className="gap-1.5"><Shield className="w-3.5 h-3.5 hidden sm:block" /> Insurance</TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5"><Phone className="w-3.5 h-3.5 hidden sm:block" /> Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Full name *</Label>
                <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Patient's full name" />
              </div>
              <div className="space-y-2">
                <Label>Relationship to you</Label>
                <Select value={form.relationship} onValueChange={(v) => set("relationship", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{relationshipLabel(r)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
              </div>
              <div className="space-y-2">
                <Label>Date of birth</Label>
                <Input type="date" value={form.date_of_birth || ""} onChange={(e) => set("date_of_birth", e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender || ""} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood group</Label>
                <Select value={form.blood_group || ""} onValueChange={(v) => set("blood_group", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <div className="space-y-2">
              <Label>Allergies</Label>
              <Textarea rows={2} value={form.allergies || ""} onChange={(e) => set("allergies", e.target.value)} placeholder="Penicillin, peanuts, etc." />
            </div>
            <div className="space-y-2">
              <Label>Medical conditions</Label>
              <Textarea rows={2} value={form.conditions || ""} onChange={(e) => set("conditions", e.target.value)} placeholder="Diabetes, hypertension, asthma, etc." />
            </div>
            <div className="space-y-2">
              <Label>Current medications</Label>
              <Textarea rows={2} value={form.medications || ""} onChange={(e) => set("medications", e.target.value)} placeholder="Metformin 500mg, Amlodipine 5mg, etc." />
            </div>
            <div className="space-y-2">
              <Label>Medical history</Label>
              <Textarea rows={3} value={form.medical_history || ""} onChange={(e) => set("medical_history", e.target.value)} placeholder="Past surgeries, hospitalisations, chronic illnesses" />
            </div>
            <div className="space-y-2">
              <Label className="text-accent">Critical medical notes</Label>
              <Textarea rows={2} value={form.critical_notes || ""} onChange={(e) => set("critical_notes", e.target.value)} placeholder="Pacemaker, on blood thinners, DNR, oxygen dependent — anything paramedics must know first" className="border-accent/40" />
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <div className="space-y-2">
              <Label>Insurance scheme</Label>
              <Select value={form.insurance_scheme || ""} onValueChange={(v) => set("insurance_scheme", v)}>
                <SelectTrigger><SelectValue placeholder="Select scheme" /></SelectTrigger>
                <SelectContent>
                  {INSURANCE_SCHEMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider / insurer</Label>
                <Input value={form.insurance_provider || ""} onChange={(e) => set("insurance_provider", e.target.value)} placeholder="e.g. Star Health, Govt of WB" />
              </div>
              <div className="space-y-2">
                <Label>Policy / card number</Label>
                <Input value={form.insurance_policy_number || ""} onChange={(e) => set("insurance_policy_number", e.target.value)} placeholder="POL-123456" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <p className="text-sm text-muted-foreground">Who should we call about this patient in an emergency?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Contact name</Label>
                <Input value={form.emergency_contact_name || ""} onChange={(e) => set("emergency_contact_name", e.target.value)} placeholder="Name" />
              </div>
              <div className="space-y-2">
                <Label>Contact phone</Label>
                <Input value={form.emergency_contact_phone || ""} onChange={(e) => set("emergency_contact_phone", e.target.value)} placeholder="10-digit mobile" />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input value={form.emergency_contact_relationship || ""} onChange={(e) => set("emergency_contact_relationship", e.target.value)} placeholder="Son, neighbour…" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button variant="emergency" onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {initial ? "Save changes" : "Add patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientProfileForm;
