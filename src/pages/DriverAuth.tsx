import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Truck } from "lucide-react";
import healthrideLogo from "@/assets/healthride-logo.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCityList } from "@/data/cityCoordinates";

const ambulanceTypes = [
  "Basic Life Support (BLS)",
  "Advanced Life Support (ALS)",
  "Patient Transport Ambulance",
  "Neonatal Ambulance",
  "Mortuary Van",
];

const DriverAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Signup fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [city, setCity] = useState("");

  // Redirect if already logged in as driver
  useEffect(() => {
    if (!user) return;
    supabase
      .from("driver_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) navigate("/driver");
      });
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // Check if they have a driver profile
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) {
      const { data: dp } = await supabase
        .from("driver_profiles")
        .select("id")
        .eq("user_id", u.id)
        .maybeSingle();
      if (dp) {
        navigate("/driver");
      } else {
        toast({ title: "No driver profile", description: "This account doesn't have a driver profile. Please sign up as a driver.", variant: "destructive" });
        await supabase.auth.signOut();
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !vehicleNumber || !ambulanceType || !city) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    if (mobile.length !== 10) {
      toast({ title: "Invalid mobile", description: "Enter a valid 10-digit mobile.", variant: "destructive" });
      return;
    }
    setLoading(true);

    // Create auth account
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (signupError) {
      toast({ title: "Error", description: signupError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (signupData.user) {
      // Create driver profile
      const { error: profileError } = await supabase.from("driver_profiles").insert({
        user_id: signupData.user.id,
        full_name: fullName,
        mobile,
        vehicle_number: vehicleNumber,
        ambulance_type: ambulanceType,
        city,
      });

      if (profileError) {
        toast({ title: "Profile Error", description: profileError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    toast({ title: "Check your email", description: "We sent you a confirmation link. Verify your email to sign in." });
  };

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
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-emergency flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">Driver Portal</CardTitle>
          <CardDescription>Sign in or register as an ambulance driver</CardDescription>
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
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="driver@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <Button type="submit" variant="emergency" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Sign In as Driver
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4 max-h-[55vh] overflow-y-auto pr-1">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="driver@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" required />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Registration Number</Label>
                  <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())} placeholder="e.g. WB 12 AB 3456" required />
                </div>
                <div className="space-y-2">
                  <Label>Ambulance Type</Label>
                  <Select value={ambulanceType} onValueChange={setAmbulanceType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {ambulanceTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue placeholder="Select your city" /></SelectTrigger>
                    <SelectContent>
                      {getCityList().map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="emergency" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Register as Driver
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverAuth;
