import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import healthrideLogo from "@/assets/healthride-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, Shield, Stethoscope, Phone, Loader2, LogOut, ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  blood_type: string | null;
  address: string | null;
}

interface Insurance {
  id: string;
  provider: string | null;
  policy_number: string | null;
  group_number: string | null;
}

interface MedicalHistory {
  id: string;
  conditions: string | null;
  allergies: string | null;
  medications: string | null;
}

interface EmergencyContact {
  id: string;
  contact_name: string;
  phone: string;
  relationship: string | null;
}

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [medical, setMedical] = useState<MedicalHistory | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setDataLoading(true);
    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
    if (p) {
      setProfile(p);
      const [ins, med, con] = await Promise.all([
        supabase.from("insurance_details").select("*").eq("profile_id", p.id).maybeSingle(),
        supabase.from("medical_history").select("*").eq("profile_id", p.id).maybeSingle(),
        supabase.from("emergency_contacts").select("*").eq("profile_id", p.id),
      ]);
      setInsurance(ins.data);
      setMedical(med.data);
      setContacts(con.data || []);
    }
    setDataLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      date_of_birth: profile.date_of_birth,
      blood_type: profile.blood_type,
      address: profile.address,
    }).eq("id", profile.id);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Personal details updated." });
  };

  const saveInsurance = async () => {
    if (!profile) return;
    setSaving(true);
    if (insurance?.id) {
      await supabase.from("insurance_details").update({
        provider: insurance.provider,
        policy_number: insurance.policy_number,
        group_number: insurance.group_number,
      }).eq("id", insurance.id);
    } else {
      const { data } = await supabase.from("insurance_details").insert({
        profile_id: profile.id,
        provider: insurance?.provider || null,
        policy_number: insurance?.policy_number || null,
        group_number: insurance?.group_number || null,
      }).select().single();
      if (data) setInsurance(data);
    }
    setSaving(false);
    toast({ title: "Saved", description: "Insurance details updated." });
  };

  const saveMedical = async () => {
    if (!profile) return;
    setSaving(true);
    if (medical?.id) {
      await supabase.from("medical_history").update({
        conditions: medical.conditions,
        allergies: medical.allergies,
        medications: medical.medications,
      }).eq("id", medical.id);
    } else {
      const { data } = await supabase.from("medical_history").insert({
        profile_id: profile.id,
        conditions: medical?.conditions || null,
        allergies: medical?.allergies || null,
        medications: medical?.medications || null,
      }).select().single();
      if (data) setMedical(data);
    }
    setSaving(false);
    toast({ title: "Saved", description: "Medical history updated." });
  };

  const addContact = async () => {
    if (!profile) return;
    const { data } = await supabase.from("emergency_contacts").insert({
      profile_id: profile.id,
      contact_name: "",
      phone: "",
    }).select().single();
    if (data) setContacts([...contacts, data]);
  };

  const updateContact = (idx: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...contacts];
    (updated[idx] as any)[field] = value;
    setContacts(updated);
  };

  const saveContact = async (contact: EmergencyContact) => {
    setSaving(true);
    await supabase.from("emergency_contacts").update({
      contact_name: contact.contact_name,
      phone: contact.phone,
      relationship: contact.relationship,
    }).eq("id", contact.id);
    setSaving(false);
    toast({ title: "Saved", description: "Emergency contact updated." });
  };

  const deleteContact = async (id: string) => {
    await supabase.from("emergency_contacts").delete().eq("id", id);
    setContacts(contacts.filter((c) => c.id !== id));
    toast({ title: "Deleted", description: "Emergency contact removed." });
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <img src={healthrideLogo} alt="HealthRide" className="w-8 h-8" />
              HealthRide
            </a>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">Your Health Profile</h1>
        <p className="text-muted-foreground mb-8">Keep your information up to date for faster emergency response.</p>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="gap-1.5"><User className="w-3.5 h-3.5 hidden sm:block" /> Personal</TabsTrigger>
            <TabsTrigger value="insurance" className="gap-1.5"><Shield className="w-3.5 h-3.5 hidden sm:block" /> Insurance</TabsTrigger>
            <TabsTrigger value="medical" className="gap-1.5"><Stethoscope className="w-3.5 h-3.5 hidden sm:block" /> Medical</TabsTrigger>
            <TabsTrigger value="emergency" className="gap-1.5"><Phone className="w-3.5 h-3.5 hidden sm:block" /> Contacts</TabsTrigger>
          </TabsList>

          {/* Personal */}
          <TabsContent value="personal">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Basic information used during emergencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile!, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={profile?.date_of_birth || ""} onChange={(e) => setProfile({ ...profile!, date_of_birth: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Input value={profile?.blood_type || ""} onChange={(e) => setProfile({ ...profile!, blood_type: e.target.value })} placeholder="O+" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea value={profile?.address || ""} onChange={(e) => setProfile({ ...profile!, address: e.target.value })} placeholder="123 Main St, City, State ZIP" />
                </div>
                <Button variant="emergency" onClick={saveProfile} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Save Details
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance */}
          <TabsContent value="insurance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Your insurance details for hospital billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Insurance Provider</Label>
                  <Input value={insurance?.provider || ""} onChange={(e) => setInsurance({ ...insurance!, provider: e.target.value })} placeholder="Blue Cross Blue Shield" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Policy Number</Label>
                    <Input value={insurance?.policy_number || ""} onChange={(e) => setInsurance({ ...insurance!, policy_number: e.target.value })} placeholder="POL-123456" />
                  </div>
                  <div className="space-y-2">
                    <Label>Group Number</Label>
                    <Input value={insurance?.group_number || ""} onChange={(e) => setInsurance({ ...insurance!, group_number: e.target.value })} placeholder="GRP-7890" />
                  </div>
                </div>
                <Button variant="emergency" onClick={saveInsurance} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Save Insurance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical */}
          <TabsContent value="medical">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Important medical details for paramedics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Conditions</Label>
                  <Textarea value={medical?.conditions || ""} onChange={(e) => setMedical({ ...medical!, conditions: e.target.value })} placeholder="Diabetes, Hypertension, etc." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Textarea value={medical?.allergies || ""} onChange={(e) => setMedical({ ...medical!, allergies: e.target.value })} placeholder="Penicillin, Peanuts, etc." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Medications</Label>
                  <Textarea value={medical?.medications || ""} onChange={(e) => setMedical({ ...medical!, medications: e.target.value })} placeholder="Metformin 500mg, Lisinopril 10mg, etc." rows={3} />
                </div>
                <Button variant="emergency" onClick={saveMedical} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Save Medical History
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts */}
          <TabsContent value="emergency">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>People to notify in an emergency</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addContact}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No emergency contacts yet. Add one above.</p>
                )}
                {contacts.map((c, i) => (
                  <div key={c.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input value={c.contact_name} onChange={(e) => updateContact(i, "contact_name", e.target.value)} placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input value={c.phone} onChange={(e) => updateContact(i, "phone", e.target.value)} placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Relationship</Label>
                        <Input value={c.relationship || ""} onChange={(e) => updateContact(i, "relationship", e.target.value)} placeholder="Spouse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => saveContact(c)}>
                        <Save className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteContact(c.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
