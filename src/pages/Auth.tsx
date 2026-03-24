import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <img src={healthrideLogo} alt="HealthRide" className="mx-auto w-16 h-16 mb-4" />
          <CardTitle className="font-display text-2xl">Welcome to HealthRide</CardTitle>
          <CardDescription>Sign in to manage your health profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
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

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
                </div>
                <Button type="submit" variant="emergency" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} Create Account
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
