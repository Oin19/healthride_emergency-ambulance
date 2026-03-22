import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Clock,
  Navigation,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ScheduleForm {
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  problem: string;
  notes: string;
}

const defaultForm: ScheduleForm = {
  patientName: "",
  patientPhone: "",
  date: "",
  time: "",
  pickup: "",
  destination: "",
  problem: "",
  notes: "",
};

type BookingState = "form" | "confirming" | "confirmed";

const TrackingMapSection = () => {
  const [form, setForm] = useState<ScheduleForm>(defaultForm);
  const [bookingState, setBookingState] = useState<BookingState>("form");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load profile data if logged in
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setForm((prev) => ({
          ...prev,
          patientName: data.full_name || prev.patientName,
          patientPhone: data.phone || prev.patientPhone,
        }));
      }
    };
    loadProfile();
  }, [user]);

  const detectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          setForm((prev) => ({
            ...prev,
            pickup: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
          }));
          setDetectingLocation(false);
        },
        () => {
          setCoords({ lat: 28.6139, lng: 77.209 });
          setForm((prev) => ({ ...prev, pickup: "New Delhi (approximate)" }));
          setDetectingLocation(false);
        },
        { timeout: 8000 }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.209 });
      setForm((prev) => ({ ...prev, pickup: "New Delhi (approximate)" }));
      setDetectingLocation(false);
    }
  };

  const update = (key: keyof ScheduleForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSubmit =
    form.patientName.trim() &&
    form.patientPhone.trim() &&
    form.date &&
    form.time &&
    form.pickup.trim() &&
    form.problem.trim();

  const handleSubmit = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setBookingState("confirming");
    setTimeout(() => setBookingState("confirmed"), 2500);
  };

  const handleReset = () => {
    setBookingState("form");
    setForm(defaultForm);
    setCoords(null);
  };

  // Set min date to today
  const today = new Date().toISOString().split("T")[0];

  const mapLat = coords?.lat ?? 28.6139;
  const mapLng = coords?.lng ?? 77.209;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.03}%2C${mapLat - 0.02}%2C${mapLng + 0.03}%2C${mapLat + 0.02}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <section id="tracking" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-trust tracking-wider uppercase">
            Schedule Transport
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Book Non-Emergency Transport
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Schedule a medical transport for appointments, hospital transfers,
            dialysis sessions, or any non-urgent care needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {bookingState === "form" && (
              <div className="rounded-2xl bg-card shadow-card border border-border p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="w-5 h-5 text-trust" />
                  <h3 className="font-display font-semibold text-foreground">
                    Schedule Details
                  </h3>
                </div>

                {/* Patient Info */}
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.patientName}
                      onChange={(e) => update("patientName", e.target.value)}
                      placeholder="Patient full name *"
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.patientPhone}
                      onChange={(e) => update("patientPhone", e.target.value)}
                      placeholder="Contact number *"
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.date}
                      min={today}
                      onChange={(e) => update("date", e.target.value)}
                      className="bg-secondary border-border text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                      className="bg-secondary border-border text-sm"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.pickup}
                      onChange={(e) => update("pickup", e.target.value)}
                      placeholder="Pickup location *"
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-xs"
                    onClick={detectLocation}
                    disabled={detectingLocation}
                  >
                    {detectingLocation ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Detecting…</>
                    ) : (
                      <><Navigation className="w-3 h-3" /> Use My Current Location</>
                    )}
                  </Button>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.destination}
                      onChange={(e) => update("destination", e.target.value)}
                      placeholder="Destination hospital/clinic"
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Problem */}
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={form.problem}
                    onChange={(e) => update("problem", e.target.value)}
                    placeholder="Reason for transport / medical condition *"
                    className="w-full min-h-[80px] rounded-lg border border-border bg-secondary pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>

                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Additional notes (wheelchair needed, oxygen, etc.)"
                  className="w-full h-16 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />

                <Button
                  variant="default"
                  size="lg"
                  className="w-full text-base bg-gradient-trust text-trust-foreground hover:opacity-90"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                >
                  <CalendarClock className="w-4 h-4 mr-2" />
                  {user ? "Schedule Transport" : "Sign In to Schedule"}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    You need to be signed in to schedule a transport.
                  </p>
                )}
              </div>
            )}

            {bookingState === "confirming" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-card shadow-card border border-border p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-trust/10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-trust animate-spin" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Scheduling Your Transport
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confirming availability for {form.date} at {form.time}…
                </p>
              </motion.div>
            )}

            {bookingState === "confirmed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-card shadow-card border border-border p-6 space-y-5"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Transport Confirmed!
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded-lg bg-secondary">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-medium text-foreground">{form.patientName}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-secondary">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium text-foreground">{form.date} at {form.time}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-secondary">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="font-medium text-foreground truncate ml-4 max-w-[180px]">{form.pickup}</span>
                  </div>
                  {form.destination && (
                    <div className="flex justify-between p-2 rounded-lg bg-secondary">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium text-foreground truncate ml-4 max-w-[180px]">{form.destination}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 rounded-lg bg-secondary">
                    <span className="text-muted-foreground">Reason</span>
                    <span className="font-medium text-foreground truncate ml-4 max-w-[180px]">{form.problem}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-trust/10 border border-trust/20 text-sm">
                  <Clock className="w-4 h-4 text-trust flex-shrink-0" />
                  <p className="text-trust">
                    A transport unit will be assigned 30 minutes before your scheduled time.
                  </p>
                </div>

                <Button variant="outline" className="w-full" onClick={handleReset}>
                  Schedule Another Transport
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Real Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl overflow-hidden border border-border shadow-elevated">
              <iframe
                title="Pickup Location Map"
                src={mapSrc}
                style={{ width: "100%", height: "480px", border: 0 }}
                allowFullScreen
                loading="lazy"
              />
              <div className="flex items-center justify-between px-4 py-2.5 bg-card border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>
                    {coords
                      ? `Location: ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`
                      : "Detect or enter your pickup location"}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">© OpenStreetMap</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrackingMapSection;
