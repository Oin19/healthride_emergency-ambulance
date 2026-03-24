import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, User, Truck, Building2 } from "lucide-react";
import healthrideLogo from "@/assets/healthride-logo.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "patient" | "driver" | "hospital";

const roleConfig = {
  patient: { label: "Patient", icon: User, description: "Book ambulances & manage health records" },
  driver: { label: "Ambulance Driver", icon: Truck, description: "Accept rides & manage dispatch" },
  hospital: { label: "Hospital", icon: Building2, description: "Manage admissions & coordinate care" },
};

const ambulanceTypes = [
  "Basic Life Support (BLS)",
  "Advanced Life Support (ALS)",
  "Patient Transport Ambulance",
  "Neonatal Ambulance",
  "Mortuary Van",
];

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Driver fields
  const [driverMobile, setDriverMobile] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");

  // Hospital fields
  const [hospName, setHospName] = useState("");
  const [ninOrHfr, setNinOrHfr] = useState("");
  const [idType, setIdType] = useState<"nin" | "hfr">("nin");
  const [facilities, setFacilities] = useState("");
  const [hospAddress, setHospAddress] = useState("");
  const [businessContact, setBusinessContact] = useState("");

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedRole === "patient") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { role: selectedRole },
        },
      });
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent you a confirmation link." });
      }
      return;
    }

    if (selectedRole === "driver") {
      if (driverMobile.length !== 10) {
        toast({ title: "Invalid mobile", description: "Enter a valid 10-digit mobile number.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!licenseNumber || !carNumber || !ambulanceType || !ownershipType) {
        toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (ownershipType === "hospital" && !hospitalName) {
        toast({ title: "Missing hospital", description: "Please enter the hospital name.", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error: dbError } = await supabase.from("driver_registrations").insert({
        mobile: driverMobile,
        license_number: licenseNumber,
        vehicle_number: carNumber,
        ownership_type: ownershipType,
        hospital_name: ownershipType === "hospital" ? hospitalName : null,
        ambulance_type: ambulanceType,
      });
      setLoading(false);
      if (dbError) {
        toast({ title: "Error", description: dbError.message, variant: "destructive" });
      } else {
        toast({ title: "Registration Submitted", description: "Your driver registration is under review. We'll contact you on " + driverMobile + "." });
      }
      return;
    }

    if (selectedRole === "hospital") {
      const idValid = idType === "nin" ? ninOrHfr.length === 10 : ninOrHfr.length === 12;
      if (!idValid) {
        toast({ title: "Invalid ID", description: idType === "nin" ? "NIN must be 10 digits." : "HFR ID must be 12 digits.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!hospName || !hospAddress || businessContact.length !== 10) {
        toast({ title: "Missing fields", description: "Please fill all fields with valid data.", variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({
        title: "Registration Submitted",
        description: "Your hospital registration is under review. We'll contact you at " + businessContact + ".",
      });
      setLoading(false);
      return;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const renderPatientSignup = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
      </div>
    </>
  );

  const renderDriverSignup = () => (
    <>
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <Input type="tel" value={driverMobile} onChange={(e) => setDriverMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" required />
      </div>
      <div className="space-y-2">
        <Label>Driving License Number</Label>
        <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())} placeholder="e.g. WB-1234567890" required />
      </div>
      <div className="space-y-2">
        <Label>Vehicle Registration Number</Label>
        <Input value={carNumber} onChange={(e) => setCarNumber(e.target.value.toUpperCase())} placeholder="e.g. WB 12 AB 3456" required />
      </div>
      <div className="space-y-2">
        <Label>Ambulance Ownership</Label>
        <Select value={ownershipType} onValueChange={setOwnershipType}>
          <SelectTrigger><SelectValue placeholder="Self or Hospital?" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Self-owned</SelectItem>
            <SelectItem value="hospital">Hospital-affiliated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {ownershipType === "hospital" && (
        <div className="space-y-2">
          <Label>Hospital Name</Label>
          <Input value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Enter affiliated hospital name" required />
        </div>
      )}
      <div className="space-y-2">
        <Label>Ambulance Type</Label>
        <Select value={ambulanceType} onValueChange={setAmbulanceType}>
          <SelectTrigger><SelectValue placeholder="Select ambulance type" /></SelectTrigger>
          <SelectContent>
            {ambulanceTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderHospitalSignup = () => (
    <>
      <div className="space-y-2">
        <Label>Hospital Name</Label>
        <Input value={hospName} onChange={(e) => setHospName(e.target.value)} placeholder="Full hospital name" required />
      </div>
      <div className="space-y-2">
        <Label>Identification Type</Label>
        <Select value={idType} onValueChange={(v) => { setIdType(v as "nin" | "hfr"); setNinOrHfr(""); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nin">NIN (10-digit)</SelectItem>
            <SelectItem value="hfr">HFR ID (12-digit)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{idType === "nin" ? "National Identification Number (NIN)" : "Health Facility Registry ID (HFR)"}</Label>
        <Input
          value={ninOrHfr}
          onChange={(e) => setNinOrHfr(e.target.value.replace(/\D/g, "").slice(0, idType === "nin" ? 10 : 12))}
          placeholder={idType === "nin" ? "10-digit NIN" : "12-digit HFR ID"}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Facilities & Specialties</Label>
        <Textarea value={facilities} onChange={(e) => setFacilities(e.target.value)} placeholder="e.g. ICU, Trauma Center, Cardiology, Radiology..." rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Hospital Address</Label>
        <Textarea value={hospAddress} onChange={(e) => setHospAddress(e.target.value)} placeholder="Full address with city & PIN code" rows={2} required />
      </div>
      <div className="space-y-2">
        <Label>Business Contact Number</Label>
        <Input
          type="tel"
          value={businessContact}
          onChange={(e) => setBusinessContact(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit contact number"
          required
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <Card className="w-full max-w-md shadow-elevated my-8">
        <CardHeader className="text-center">
          <img src={healthrideLogo} alt="HealthRide" className="mx-auto w-16 h-16 mb-4" />
          <CardTitle className="font-display text-2xl">Welcome to HealthRide</CardTitle>
          <CardDescription>Sign in or register to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <Button type="submit" variant="emergency" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.patient][]).map(([key, { label, icon: Icon }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedRole(key)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center ${
                          selectedRole === key
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{roleConfig[selectedRole].description}</p>
                </div>

                {selectedRole === "patient" && renderPatientSignup()}
                {selectedRole === "driver" && renderDriverSignup()}
                {selectedRole === "hospital" && renderHospitalSignup()}

                <Button type="submit" variant="emergency" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  {selectedRole === "patient" ? "Create Account" : "Submit Registration"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
