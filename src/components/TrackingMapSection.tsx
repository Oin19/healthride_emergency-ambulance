import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  Clock,
  Navigation,
  Phone,
  User,
  Truck,
  HeartPulse,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RequestMode = "emergency" | "non-emergency";
type TrackingState = "idle" | "searching" | "dispatched" | "en-route" | "arriving";

interface AmbulanceMarker {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  label: string;
}

const PATIENT_POS = { x: 50, y: 50 };

const initialAmbulances: AmbulanceMarker[] = [
  { id: "a1", x: 18, y: 22, targetX: 50, targetY: 50, label: "Unit 7" },
  { id: "a2", x: 78, y: 70, targetX: 50, targetY: 50, label: "Unit 12" },
  { id: "a3", x: 30, y: 82, targetX: 50, targetY: 50, label: "Unit 3" },
];

const GRID_LINES = 8;

const TrackingMapSection = () => {
  const [mode, setMode] = useState<RequestMode>("emergency");
  const [state, setState] = useState<TrackingState>("idle");
  const [eta, setEta] = useState(480); // seconds
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // Animate ambulances toward patient
  useEffect(() => {
    if (state !== "dispatched" && state !== "en-route" && state !== "arriving") return;

    const interval = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((a) => {
          if (selectedUnit && a.id !== selectedUnit) return a;
          const dx = a.targetX - a.x;
          const dy = a.targetY - a.y;
          const speed = a.id === selectedUnit ? 0.8 : 0.3;
          return {
            ...a,
            x: a.x + dx * speed * 0.05,
            y: a.y + dy * speed * 0.05,
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [state, selectedUnit]);

  // ETA countdown
  useEffect(() => {
    if (state !== "en-route" && state !== "arriving") return;
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  // State machine
  useEffect(() => {
    if (state === "searching") {
      const t = setTimeout(() => {
        setSelectedUnit("a1");
        setState("dispatched");
      }, 2000);
      return () => clearTimeout(t);
    }
    if (state === "dispatched") {
      const t = setTimeout(() => {
        setEta(mode === "emergency" ? 480 : 1200);
        setState("en-route");
      }, 1500);
      return () => clearTimeout(t);
    }
    if (state === "en-route") {
      const t = setTimeout(() => setState("arriving"), 8000);
      return () => clearTimeout(t);
    }
  }, [state, mode]);

  const handleRequest = useCallback(() => {
    setAmbulances(initialAmbulances);
    setSelectedUnit(null);
    setState("searching");
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setAmbulances(initialAmbulances);
    setSelectedUnit(null);
    setEta(480);
  }, []);

  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section id="tracking" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-emergency tracking-wider uppercase">
            Live Tracking
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Watch Your Help Arrive
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Real-time GPS tracking with AI-optimized routing. Choose between
            emergency dispatch or scheduled non-emergency transport.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Mode Toggle */}
            <div className="rounded-2xl bg-card shadow-card border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3 font-display">
                Request Type
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode("emergency"); handleReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    mode === "emergency"
                      ? "bg-gradient-emergency text-emergency-foreground shadow-emergency"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Siren className="w-4 h-4" />
                  Emergency
                </button>
                <button
                  onClick={() => { setMode("non-emergency"); handleReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    mode === "non-emergency"
                      ? "bg-gradient-trust text-trust-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <CalendarClock className="w-4 h-4" />
                  Non-Emergency
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {mode === "emergency"
                  ? "Immediate dispatch — nearest available unit responds with lights & sirens."
                  : "Scheduled transport — book a medical ride for appointments, transfers, or non-urgent care."}
              </p>
            </div>

            {/* Action / Status */}
            <div className="rounded-2xl bg-card shadow-card border border-border p-5 space-y-4">
              {state === "idle" && (
                <Button
                  variant={mode === "emergency" ? "emergency" : "default"}
                  size="lg"
                  className="w-full text-base"
                  onClick={handleRequest}
                >
                  {mode === "emergency" ? (
                    <>
                      <Siren className="w-4 h-4 mr-2" /> Request Emergency Ambulance
                    </>
                  ) : (
                    <>
                      <CalendarClock className="w-4 h-4 mr-2" /> Schedule Transport
                    </>
                  )}
                </Button>
              )}

              <AnimatePresence mode="wait">
                {state === "searching" && (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emergency/10 flex items-center justify-center mb-3">
                      <Navigation className="w-5 h-5 text-emergency animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Finding nearest unit…
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Analyzing traffic & availability
                    </p>
                  </motion.div>
                )}

                {(state === "dispatched" || state === "en-route" || state === "arriving") && (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* ETA */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-emergency flex items-center justify-center">
                          <Clock className="w-5 h-5 text-emergency-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Estimated Arrival
                          </p>
                          <p className="font-display text-2xl font-bold text-foreground">
                            {formatEta(eta)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          state === "arriving"
                            ? "bg-success/15 text-success"
                            : "bg-emergency/15 text-emergency"
                        }`}
                      >
                        {state === "dispatched"
                          ? "Dispatched"
                          : state === "arriving"
                          ? "Arriving"
                          : "En Route"}
                      </span>
                    </div>

                    {/* Unit Info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-lg bg-trust/10 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-trust" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Unit 7 — Advanced Life Support
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 paramedics on board
                        </p>
                      </div>
                      <button className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors">
                        <Phone className="w-4 h-4 text-success" />
                      </button>
                    </div>

                    {/* Paramedic */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-emergency" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Sarah Mitchell, EMT-P
                        </p>
                        <p className="text-xs text-muted-foreground">
                          12 yrs experience · 4.9 ★
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleReset}
                    >
                      Reset Demo
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative aspect-[4/3] rounded-2xl bg-navy overflow-hidden border border-border shadow-elevated"
          >
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: GRID_LINES + 1 }).map((_, i) => {
                const pct = `${(i / GRID_LINES) * 100}%`;
                return (
                  <g key={i}>
                    <line
                      x1={pct} y1="0%" x2={pct} y2="100%"
                      stroke="hsl(220 40% 25%)" strokeWidth="0.5" opacity="0.3"
                    />
                    <line
                      x1="0%" y1={pct} x2="100%" y2={pct}
                      stroke="hsl(220 40% 25%)" strokeWidth="0.5" opacity="0.3"
                    />
                  </g>
                );
              })}
              {/* "Roads" */}
              <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
              <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
              <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
              <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
              <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="hsl(220 30% 30%)" strokeWidth="3" opacity="0.5" />
            </svg>

            {/* Patient marker */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${PATIENT_POS.x}%`, top: `${PATIENT_POS.y}%` }}
            >
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-emergency animate-pulse-ring absolute -inset-0" />
                <div className="w-5 h-5 rounded-full bg-emergency border-2 border-emergency-foreground relative z-10 flex items-center justify-center">
                  <HeartPulse className="w-3 h-3 text-emergency-foreground" />
                </div>
              </div>
              <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-emergency-foreground bg-emergency/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                You
              </span>
            </div>

            {/* Ambulance markers */}
            {ambulances.map((a) => {
              const isSelected = selectedUnit === a.id;
              const isVisible =
                state === "idle" ||
                state === "searching" ||
                (selectedUnit && a.id === selectedUnit);

              if (!isVisible) return null;

              return (
                <motion.div
                  key={a.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  animate={{ left: `${a.x}%`, top: `${a.y}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-gradient-emergency shadow-emergency scale-110"
                        : "bg-trust/80"
                    }`}
                  >
                    <Truck className={`w-4 h-4 ${isSelected ? "text-emergency-foreground" : "text-trust-foreground"}`} />
                  </div>
                  <span className={`absolute top-9 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    isSelected ? "bg-emergency/80 text-emergency-foreground" : "bg-trust/60 text-trust-foreground"
                  }`}>
                    {a.label}
                  </span>

                  {/* Route line for selected */}
                  {isSelected && (state === "en-route" || state === "dispatched" || state === "arriving") && (
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: "400px",
                        height: "400px",
                        transform: "translate(-50%, -50%)",
                        overflow: "visible",
                      }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2={`${(PATIENT_POS.x - a.x) * 4}px`}
                        y2={`${(PATIENT_POS.y - a.y) * 4}px`}
                        stroke="hsl(0 85% 55%)"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        opacity="0.6"
                      />
                    </svg>
                  )}
                </motion.div>
              );
            })}

            {/* Map label */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-navy-light/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] text-trust-foreground/80 font-medium">Live Map</span>
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 z-20 bg-navy-light/80 backdrop-blur-sm px-3 py-2 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emergency" />
                <span className="text-[10px] text-trust-foreground/70">Patient</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-trust" />
                <span className="text-[10px] text-trust-foreground/70">Ambulance</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrackingMapSection;
