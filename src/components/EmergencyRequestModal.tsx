import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Navigation, Phone, AlertTriangle, Heart, Bone, Brain, Flame,
  Stethoscope, ChevronRight, Loader2, CheckCircle2, Truck, Clock, User, Shield, LogIn, Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cityCoordinates } from "@/data/cityCoordinates";
import LiveTrackingMap from "@/components/LiveTrackingMap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Step = "location" | "details" | "dispatching" | "tracking";

interface EmergencyType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const emergencyTypeIcons: Record<string, React.ReactNode> = {
  cardiac: <Heart className="w-5 h-5" />,
  trauma: <Bone className="w-5 h-5" />,
  stroke: <Brain className="w-5 h-5" />,
  burns: <Flame className="w-5 h-5" />,
  breathing: <Stethoscope className="w-5 h-5" />,
  other: <AlertTriangle className="w-5 h-5" />,
};
const emergencyTypeIds = ["cardiac", "trauma", "stroke", "burns", "breathing", "other"] as const;

// Find nearest city from coordinates
function findNearestCity(lat: number, lng: number): string {
  let closest = "Delhi";
  let minDist = Infinity;
  for (const [name, c] of Object.entries(cityCoordinates)) {
    const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
    if (d < minDist) { minDist = d; closest = name; }
  }
  return closest;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const EmergencyRequestModal = ({ open, onClose }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<Step>("location");
  const [locationText, setLocationText] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<{
    full_name: string; mobile: string; vehicle_number: string; ambulance_type: string;
    current_lat: number | null; current_lng: number | null;
  } | null>(null);
  const [eta, setEta] = useState(0);
  const [requestStatus, setRequestStatus] = useState("pending");

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
      setRequestId(null);
      setDriverInfo(null);
      setEta(0);
      setRequestStatus("pending");
    }
  }, [open]);

  // ============ Voice-to-form ============
  const startVoiceRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((tr) => tr.stop());
        const blobType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: blobType });
        if (blob.size < 1024) {
          toast.error("Recording too short — please hold and speak.");
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          toast.error("Please sign in to use voice input.");
          return;
        }
        setIsTranscribing(true);
        try {

          const ext = blobType.includes("mp4") ? "mp4" : blobType.includes("wav") ? "wav" : "webm";
          const fd = new FormData();
          fd.append("file", blob, `recording.${ext}`);
          // Map UI language to a hint for STT (bare ISO-639-1); omit for auto-detect
          const langMap: Record<string, string> = { en: "en", hi: "hi", bn: "bn", ta: "ta", te: "te" };
          const hint = langMap[i18n.language];
          if (hint) fd.append("language", hint);

          const { data, error } = await supabase.functions.invoke("voice-transcribe", { body: fd });
          if (error) throw error;
          const result = data as {
            transcript: string; emergency_type: string | null;
            patient_name: string | null; patient_phone: string | null; notes: string | null;
          };
          if (result.emergency_type) setSelectedType(result.emergency_type);
          if (result.patient_name) setPatientName(result.patient_name);
          if (result.patient_phone) setPatientPhone(result.patient_phone);
          if (result.notes || result.transcript) setNotes(result.notes || result.transcript);
          toast.success(t("emergency.voice_filled"));
        } catch (err) {
          console.error("voice-transcribe failed:", err);
          toast.error("Transcription failed. Please try again.");
        } finally {
          setIsTranscribing(false);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("mic access denied:", err);
      toast.error("Microphone access denied.");
      setIsRecording(false);
    }
  }, [isRecording, isTranscribing, i18n.language, t]);

  const stopVoiceRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    try { mediaRecorderRef.current?.stop(); } catch { /* noop */ }
  }, [isRecording]);

  // Clean up mic if modal closes mid-recording
  useEffect(() => {
    if (!open && isRecording) stopVoiceRecording();
  }, [open, isRecording, stopVoiceRecording]);

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

  // Create real ambulance request
  const dispatchAmbulance = useCallback(async () => {
    if (!coords || !selectedType || !user) return;

    setStep("dispatching");
    const city = findNearestCity(coords.lat, coords.lng);

    const { data, error } = await supabase
      .from("ambulance_requests")
      .insert({
        patient_user_id: user.id,
        emergency_type: selectedType,
        patient_name: patientName || null,
        patient_phone: patientPhone || null,
        patient_lat: coords.lat,
        patient_lng: coords.lng,
        patient_address: locationText || null,
        notes: notes || null,
        city,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating request:", error);
      setStep("details");
      return;
    }

    setRequestId(data.id);
    // Now wait for a driver to accept via realtime
    setStep("tracking");
    setRequestStatus("pending");
  }, [coords, selectedType, user, patientName, patientPhone, locationText, notes]);

  // Subscribe to request updates (driver acceptance, location updates)
  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`request-${requestId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "ambulance_requests",
        filter: `id=eq.${requestId}`,
      }, async (payload) => {
        const updated = payload.new as any;
        setRequestStatus(updated.status);
        if (updated.eta_minutes) setEta(updated.eta_minutes);

        // Fetch driver info when driver accepts
        if (updated.driver_id && !driverInfo) {
          const { data: driver } = await supabase
            .from("driver_profiles")
            .select("full_name, mobile, vehicle_number, ambulance_type, current_lat, current_lng")
            .eq("id", updated.driver_id)
            .single();
          if (driver) setDriverInfo(driver);
        }

        // Update driver location
        if (updated.driver_lat && updated.driver_lng) {
          setDriverInfo((prev) => prev ? { ...prev, current_lat: updated.driver_lat, current_lng: updated.driver_lng } : prev);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId, driverInfo]);

  // Also poll driver location periodically when we have a driver
  useEffect(() => {
    if (!requestId || !driverInfo || requestStatus === "completed") return;

    const pollInterval = setInterval(async () => {
      const { data } = await supabase
        .from("ambulance_requests")
        .select("driver_lat, driver_lng, eta_minutes, status")
        .eq("id", requestId)
        .single();
      if (data) {
        setRequestStatus(data.status);
        if (data.eta_minutes) setEta(data.eta_minutes);
        if (data.driver_lat && data.driver_lng) {
          setDriverInfo((prev) => prev ? { ...prev, current_lat: data.driver_lat, current_lng: data.driver_lng } : prev);
        }
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [requestId, driverInfo, requestStatus]);

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
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("emergency.step1_title")}</h2>
                    <p className="text-muted-foreground text-sm">{t("emergency.step1_sub")}</p>
                  </div>

                  {!user && (
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                      <p className="text-sm text-foreground mb-2 font-medium">{t("emergency.signin_required")}</p>
                      <Button variant="emergency" size="sm" onClick={() => { onClose(); navigate("/auth"); }} className="gap-1.5">
                        <LogIn className="w-4 h-4" /> {t("nav.signin")}
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="emergency"
                    className="w-full h-14 text-base gap-2"
                    onClick={detectLocation}
                    disabled={detecting || !user}
                  >
                    {detecting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {t("emergency.detecting")}</>
                    ) : coords ? (
                      <><CheckCircle2 className="w-5 h-5" /> {t("emergency.detected")}</>
                    ) : (
                      <><Navigation className="w-5 h-5" /> {t("emergency.detect")}</>
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
                    <p className="relative bg-background text-muted-foreground text-xs text-center w-fit mx-auto px-3">{t("emergency.or_manual")}</p>
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={locationText}
                      onChange={(e) => {
                        setLocationText(e.target.value);
                        if (!coords) setCoords({ lat: 28.6139, lng: 77.2090 });
                      }}
                      placeholder={t("emergency.loc_placeholder")}
                      className="pl-10 h-12 bg-card border-border"
                      disabled={!user}
                    />
                  </div>

                  <Button
                    variant="emergency"
                    size="lg"
                    className="w-full gap-2"
                    disabled={!locationText.trim() || !user}
                    onClick={() => setStep("details")}
                  >
                    {t("emergency.continue")} <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Details */}
              {step === "details" && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("emergency.step2_title")}</h2>
                    <p className="text-muted-foreground text-sm">{t("emergency.step2_sub")}</p>
                  </div>

                  {/* Press-and-hold voice input */}
                  <button
                    type="button"
                    onMouseDown={startVoiceRecording}
                    onMouseUp={stopVoiceRecording}
                    onMouseLeave={() => { if (isRecording) stopVoiceRecording(); }}
                    onTouchStart={(e) => { e.preventDefault(); startVoiceRecording(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopVoiceRecording(); }}
                    disabled={isTranscribing}
                    aria-label={t("emergency.voice_hold")}
                    className={`w-full flex items-center justify-center gap-3 rounded-xl border p-4 select-none transition-all ${
                      isRecording
                        ? "border-accent bg-accent/15 shadow-emergency scale-[0.99]"
                        : "border-accent/40 bg-accent/5 hover:bg-accent/10"
                    } ${isTranscribing ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        <span className="text-sm font-medium text-foreground">{t("emergency.voice_processing")}</span>
                      </>
                    ) : isRecording ? (
                      <>
                        <span className="relative flex w-3 h-3">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{t("emergency.voice_recording")}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium text-foreground">{t("emergency.voice_hold")}</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    {emergencyTypeIds.map((id) => (
                      <button
                        key={id}
                        onClick={() => setSelectedType(id)}
                        className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all ${
                          selectedType === id
                            ? "border-accent bg-accent/10 shadow-emergency"
                            : "border-border bg-card hover:border-accent/40"
                        }`}
                      >
                        <span className={selectedType === id ? "text-accent" : "text-muted-foreground"}>{emergencyTypeIcons[id]}</span>
                        <span className={`text-sm font-medium ${selectedType === id ? "text-foreground" : "text-muted-foreground"}`}>{t(`emergency.types.${id}`)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder={t("emergency.patient_name")} className="pl-10 bg-card border-border" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder={t("emergency.contact")} className="pl-10 bg-card border-border" />
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("emergency.notes_ph")}
                      aria-label={t("emergency.notes_ph")}
                      className="w-full h-20 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="hero" onClick={() => setStep("location")} className="flex-1">{t("emergency.back")}</Button>
                    <Button
                      variant="emergency"
                      className="flex-[2] gap-2"
                      disabled={!selectedType}
                      onClick={dispatchAmbulance}
                    >
                      <AlertTriangle className="w-4 h-4" /> {t("emergency.dispatch")}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Dispatching */}
              {step === "dispatching" && (
                <motion.div key="dispatching" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 py-12">
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-emergency">
                      <Truck className="w-10 h-10 text-accent-foreground" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Creating Request...</h2>
                    <p className="text-muted-foreground text-sm">Sending your emergency request to nearby drivers</p>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Tracking */}
              {step === "tracking" && (
                <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Status */}
                  {requestStatus === "pending" && !driverInfo && (
                    <div className="bg-accent/5 border border-accent/30 rounded-2xl p-6 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">Waiting for a Driver</h3>
                      <p className="text-muted-foreground text-sm">Your request has been sent to nearby ambulance drivers. Hang tight!</p>
                      <p className="text-xs text-muted-foreground mt-2">Request ID: {requestId?.slice(0, 8)}</p>
                    </div>
                  )}

                  {/* Driver Accepted */}
                  {driverInfo && (
                    <>
                      {/* ETA Card */}
                      <div className="bg-gradient-emergency rounded-2xl p-6 text-center text-accent-foreground">
                        <p className="text-sm font-medium opacity-90 mb-1">Estimated Arrival</p>
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-6 h-6" />
                          <span className="font-display text-5xl font-bold">{eta || "—"}</span>
                          <span className="text-lg font-medium">min</span>
                        </div>
                        <p className="text-sm opacity-80 mt-2">
                          {requestStatus === "accepted" ? "Driver is on the way" :
                           requestStatus === "arrived" ? "Driver has arrived!" :
                           requestStatus === "completed" ? "Trip completed" :
                           "Ambulance is en route"}
                        </p>
                      </div>

                      {/* Driver Card */}
                      <div className="bg-card border border-border rounded-xl p-5">
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Your Driver</p>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-trust flex items-center justify-center text-trust-foreground font-display font-bold text-lg">
                            {driverInfo.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-foreground">{driverInfo.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{driverInfo.vehicle_number} · {driverInfo.ambulance_type}</p>
                          </div>
                          <a href={`tel:${driverInfo.mobile}`} className="p-3 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors">
                            <Phone className="w-5 h-5" />
                          </a>
                        </div>
                      </div>

                      {/* Live Map showing driver location */}
                      {driverInfo.current_lat && driverInfo.current_lng && (
                        <div className="rounded-xl overflow-hidden border border-border">
                          <iframe
                            title="Driver Location"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(driverInfo.current_lng, coords?.lng || 0) - 0.01}%2C${Math.min(driverInfo.current_lat, coords?.lat || 0) - 0.008}%2C${Math.max(driverInfo.current_lng, coords?.lng || 0) + 0.01}%2C${Math.max(driverInfo.current_lat, coords?.lat || 0) + 0.008}&layer=mapnik&marker=${driverInfo.current_lat}%2C${driverInfo.current_lng}`}
                            style={{ width: "100%", height: "260px", border: 0 }}
                            allowFullScreen
                            loading="lazy"
                          />
                          <div className="flex items-center gap-2 px-3 py-2 bg-card text-xs text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Live tracking — Driver location updating in real-time
                          </div>
                        </div>
                      )}

                      {/* If no driver GPS yet, show patient location */}
                      {(!driverInfo.current_lat || !driverInfo.current_lng) && coords && (
                        <LiveTrackingMap patientCoords={coords} />
                      )}
                    </>
                  )}

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
