import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Navigation, Phone, AlertTriangle, Heart, Bone, Brain, Flame,
  Stethoscope, ChevronRight, Loader2, CheckCircle2, Truck, Clock, User, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "location" | "details" | "dispatching" | "tracking";

interface EmergencyType {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const emergencyTypes: EmergencyType[] = [
  { id: "cardiac", label: "Cardiac Emergency", icon: <Heart className="w-5 h-5" />, color: "text-accent" },
  { id: "trauma", label: "Trauma / Injury", icon: <Bone className="w-5 h-5" />, color: "text-accent" },
  { id: "stroke", label: "Stroke / Neuro", icon: <Brain className="w-5 h-5" />, color: "text-accent" },
  { id: "burns", label: "Burns", icon: <Flame className="w-5 h-5" />, color: "text-accent" },
  { id: "breathing", label: "Breathing Difficulty", icon: <Stethoscope className="w-5 h-5" />, color: "text-accent" },
  { id: "other", label: "Other Emergency", icon: <AlertTriangle className="w-5 h-5" />, color: "text-accent" },
];

const paramedics = [
  { name: "Dr. Arjun Mehta", id: "AMB-DL-4821", experience: "12 yrs", photo: "AM" },
  { name: "Dr. Priya Sharma", id: "AMB-MU-3157", experience: "8 yrs", photo: "PS" },
  { name: "Dr. Ravi Kumar", id: "AMB-BG-6093", experience: "15 yrs", photo: "RK" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const EmergencyRequestModal = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<Step>("location");
  const [locationText, setLocationText] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const [paramedic] = useState(() => paramedics[Math.floor(Math.random() * paramedics.length)]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("location");
      setLocationText("");
      setDetecting(false);
      setCoords(null);
      setSelectedType(null);
      setPatientName("");
      setPatientPhone("");
      setNotes("");
      setDispatchProgress(0);
      setEta(0);
    }
  }, [open]);

  const detectLocation = useCallback(() => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationText(`${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
          setDetecting(false);
        },
        () => {
          // Fallback to Delhi coordinates
          setCoords({ lat: 28.6139, lng: 77.2090 });
          setLocationText("New Delhi (approximate)");
          setDetecting(false);
        },
        { timeout: 8000 }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.2090 });
      setLocationText("New Delhi (approximate)");
      setDetecting(false);
    }
  }, []);

  // Dispatch simulation
  useEffect(() => {
    if (step !== "dispatching") return;
    const totalTime = 4000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      setDispatchProgress(Math.min((elapsed / totalTime) * 100, 100));
      if (elapsed >= totalTime) {
        clearInterval(timer);
        setEta(Math.floor(Math.random() * 8) + 5);
        setStep("tracking");
      }
    }, interval);
    return () => clearInterval(timer);
  }, [step]);

  // ETA countdown
  useEffect(() => {
    if (step !== "tracking" || eta <= 0) return;
    const timer = setInterval(() => {
      setEta((prev) => Math.max(prev - 1, 0));
    }, 60000);
    return () => clearInterval(timer);
  }, [step, eta]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="font-display font-bold text-foreground">EMERGENCY REQUEST</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <motion.div
            className="h-full bg-gradient-emergency"
            animate={{
              width: step === "location" ? "25%" : step === "details" ? "50%" : step === "dispatching" ? "75%" : "100%",
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Location */}
              {step === "location" && (
                <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Where are you?</h2>
                    <p className="text-muted-foreground text-sm">We need your location to dispatch the nearest ambulance.</p>
                  </div>

                  <Button
                    variant="emergency"
                    className="w-full h-14 text-base gap-2"
                    onClick={detectLocation}
                    disabled={detecting}
                  >
                    {detecting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Detecting Location...</>
                    ) : coords ? (
                      <><CheckCircle2 className="w-5 h-5" /> Location Detected</>
                    ) : (
                      <><Navigation className="w-5 h-5" /> Detect My Location</>
                    )}
                  </Button>

                  {coords && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-success/10 border border-success/30">
                      <div className="flex items-center gap-2 text-success font-medium text-sm">
                        <MapPin className="w-4 h-4" /> {locationText}
                      </div>
                    </motion.div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                    <p className="relative bg-background text-muted-foreground text-xs text-center w-fit mx-auto px-3">or enter manually</p>
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={locationText}
                      onChange={(e) => {
                        setLocationText(e.target.value);
                        if (!coords) setCoords({ lat: 28.6139, lng: 77.2090 });
                      }}
                      placeholder="Building name, street, landmark..."
                      className="pl-10 h-12 bg-card border-border"
                    />
                  </div>

                  <Button
                    variant="emergency"
                    size="lg"
                    className="w-full gap-2"
                    disabled={!locationText.trim()}
                    onClick={() => setStep("details")}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Details */}
              {step === "details" && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Emergency Details</h2>
                    <p className="text-muted-foreground text-sm">Select the type of emergency and provide patient info.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {emergencyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all ${
                          selectedType === type.id
                            ? "border-accent bg-accent/10 shadow-emergency"
                            : "border-border bg-card hover:border-accent/40"
                        }`}
                      >
                        <span className={selectedType === type.id ? "text-accent" : "text-muted-foreground"}>{type.icon}</span>
                        <span className={`text-sm font-medium ${selectedType === type.id ? "text-foreground" : "text-muted-foreground"}`}>{type.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient name (optional)" className="pl-10 bg-card border-border" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="Contact number" className="pl-10 bg-card border-border" />
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes (symptoms, conditions...)"
                      className="w-full h-20 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="hero" onClick={() => setStep("location")} className="flex-1">Back</Button>
                    <Button
                      variant="emergency"
                      className="flex-[2] gap-2"
                      disabled={!selectedType}
                      onClick={() => setStep("dispatching")}
                    >
                      <AlertTriangle className="w-4 h-4" /> Dispatch Ambulance
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Dispatching */}
              {step === "dispatching" && (
                <motion.div key="dispatching" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 py-12">
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-ring" />
                    <div className="absolute inset-2 rounded-full bg-accent/30 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-emergency">
                      <Truck className="w-10 h-10 text-accent-foreground" />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Dispatching Ambulance</h2>
                    <p className="text-muted-foreground text-sm">Connecting you with the nearest available unit...</p>
                  </div>

                  <div className="max-w-xs mx-auto">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="h-full bg-gradient-emergency rounded-full" style={{ width: `${dispatchProgress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{Math.round(dispatchProgress)}% — Finding nearest ambulance</p>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Tracking */}
              {step === "tracking" && (
                <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* ETA Card */}
                  <div className="bg-gradient-emergency rounded-2xl p-6 text-center text-accent-foreground">
                    <p className="text-sm font-medium opacity-90 mb-1">Estimated Arrival</p>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-6 h-6" />
                      <span className="font-display text-5xl font-bold">{eta}</span>
                      <span className="text-lg font-medium">min</span>
                    </div>
                    <p className="text-sm opacity-80 mt-2">Ambulance is on the way</p>
                  </div>

                  {/* Paramedic Card */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Assigned Paramedic</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-trust flex items-center justify-center text-trust-foreground font-display font-bold text-lg">
                        {paramedic.photo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground">{paramedic.name}</h3>
                        <p className="text-sm text-muted-foreground">Unit {paramedic.id} · {paramedic.experience} experience</p>
                      </div>
                      <a href="tel:102" className="p-3 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors">
                        <Phone className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  {/* Live Map Placeholder */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="h-48 bg-secondary/50 relative flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative inline-block mb-3">
                          <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
                          <div className="absolute inset-0 rounded-full bg-accent animate-pulse-ring" />
                        </div>
                        <p className="text-sm text-muted-foreground">Live tracking active</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />{locationText}
                        </p>
                      </div>

                      {/* Animated route line */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                        <motion.path
                          d="M50,150 Q120,80 200,100 Q280,120 350,50"
                          fill="none"
                          stroke="hsl(var(--accent))"
                          strokeWidth="2.5"
                          strokeDasharray="8 4"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <motion.circle
                          r="6"
                          fill="hsl(var(--accent))"
                          initial={{ cx: 50, cy: 150 }}
                          animate={{ cx: 350, cy: 50 }}
                          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />
                        <circle cx="350" cy="50" r="5" fill="hsl(var(--success))" />
                      </svg>
                    </div>
                  </div>

                  {/* Status & Safety */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-card border border-border rounded-xl p-4 text-center">
                      <Shield className="w-5 h-5 mx-auto mb-1.5 text-trust" />
                      <p className="text-xs font-medium text-foreground">ALS Equipped</p>
                      <p className="text-[11px] text-muted-foreground">Advanced Life Support</p>
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-4 text-center">
                      <CheckCircle2 className="w-5 h-5 mx-auto mb-1.5 text-success" />
                      <p className="text-xs font-medium text-foreground">GPS Tracked</p>
                      <p className="text-[11px] text-muted-foreground">Real-time updates</p>
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-4 text-center">
                      <Phone className="w-5 h-5 mx-auto mb-1.5 text-accent" />
                      <p className="text-xs font-medium text-foreground">Call 102</p>
                      <p className="text-[11px] text-muted-foreground">National helpline</p>
                    </div>
                  </div>

                  <Button variant="hero" className="w-full" onClick={onClose}>
                    Close & Continue Tracking
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmergencyRequestModal;
