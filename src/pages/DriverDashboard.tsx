import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Phone, Navigation, Power, PowerOff, AlertTriangle,
  User, Clock, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import healthrideLogo from "@/assets/healthride-logo.png";
import { cityCoordinates, findNearestCity } from "@/data/cityCoordinates";

interface DriverProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  vehicle_number: string;
  ambulance_type: string;
  city: string;
  is_available: boolean;
  current_lat: number | null;
  current_lng: number | null;
}

interface AmbulanceRequest {
  id: string;
  patient_user_id: string | null;
  driver_id: string | null;
  emergency_type: string;
  patient_name: string | null;
  patient_phone: string | null;
  patient_lat: number;
  patient_lng: number;
  patient_address: string | null;
  notes: string | null;
  city: string;
  status: string;
  created_at: string;
}

// Limited row shape returned from the dispatch_queue view — no patient PII.
interface DispatchQueueEntry {
  id: string;
  city: string;
  emergency_type: string;
  patient_lat: number;
  patient_lng: number;
  created_at: string;
  status: string;
}

const DriverDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<DispatchQueueEntry[]>([]);
  const [activeRequest, setActiveRequest] = useState<AmbulanceRequest | null>(null);
  const [accepting, setAccepting] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load driver profile
  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("driver_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) {
        navigate("/auth");
        toast({ title: "No driver profile", description: "Please register as a driver first.", variant: "destructive" });
        return;
      }
      setProfile(data as DriverProfile);
      setLoading(false);
    };
    loadProfile();
  }, [user, navigate, toast]);

  // Start GPS tracking when available
  const startGPSTracking = useCallback(() => {
    if (!profile || !navigator.geolocation) return;
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const detectedCity = findNearestCity(lat, lng);
        await supabase
          .from("driver_profiles")
          .update({ current_lat: lat, current_lng: lng, city: detectedCity })
          .eq("id", profile.id);
        setProfile((prev) => prev ? { ...prev, current_lat: lat, current_lng: lng, city: detectedCity } : prev);
      },
      () => { /* ignore errors */ },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [profile]);

  const stopGPSTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (profile?.is_available) {
      startGPSTracking();
    } else {
      stopGPSTracking();
    }
    return stopGPSTracking;
  }, [profile?.is_available, startGPSTracking, stopGPSTracking]);

  // Listen for pending requests in driver's city via realtime
  useEffect(() => {
    if (!profile) return;

    // Initial fetch from the safe dispatch_queue view (no patient PII exposed).
    const fetchPending = async () => {
      const { data } = await supabase
        .from("dispatch_queue")
        .select("id, city, emergency_type, patient_lat, patient_lng, created_at, status")
        .eq("city", profile.city)
        .order("created_at", { ascending: false });
      if (data) setPendingRequests(data as DispatchQueueEntry[]);
    };
    fetchPending();
    // Poll the queue — RLS no longer streams unclaimed rows to drivers via realtime.
    const pendingInterval = setInterval(fetchPending, 5000);

    // Fetch active request (accepted by this driver)
    const fetchActive = async () => {
      const { data } = await supabase
        .from("ambulance_requests")
        .select("*")
        .eq("driver_id", profile.id)
        .in("status", ["accepted", "en_route", "arrived"])
        .maybeSingle();
      if (data) setActiveRequest(data as AmbulanceRequest);
    };
    fetchActive();

    // Realtime subscription — only rows the driver is assigned to are delivered now.
    const channel = supabase
      .channel("driver-requests")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "ambulance_requests",
      }, (payload) => {
        const req = payload.new as AmbulanceRequest;
        if (payload.eventType === "UPDATE") {
          if (req.status !== "pending") {
            setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
          }
          if (req.driver_id === profile.id) {
            setActiveRequest(req as AmbulanceRequest);
          }
        }
        if (payload.eventType === "DELETE") {
          setPendingRequests((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); clearInterval(pendingInterval); };
  }, [profile, toast]);

  const toggleAvailability = async () => {
    if (!profile) return;
    const newVal = !profile.is_available;
    await supabase.from("driver_profiles").update({ is_available: newVal }).eq("id", profile.id);
    setProfile((prev) => prev ? { ...prev, is_available: newVal } : prev);
    toast({ title: newVal ? "You're now online" : "You're now offline" });
  };

  const acceptRequest = async (request: DispatchQueueEntry) => {
    if (!profile) return;
    setAccepting(true);

    // Calculate ETA based on distance (rough estimate)
    const dist = getDistance(
      profile.current_lat || cityCoordinates[profile.city]?.lat || 28.6139,
      profile.current_lng || cityCoordinates[profile.city]?.lng || 77.2090,
      request.patient_lat,
      request.patient_lng
    );
    const etaMin = Math.max(3, Math.round(dist / 0.5)); // ~30km/h in city

    // Claim policy allows this only when driver_id IS NULL AND status='pending'.
    const { error } = await supabase
      .from("ambulance_requests")
      .update({
        driver_id: profile.id,
        status: "accepted",
        driver_lat: profile.current_lat,
        driver_lng: profile.current_lng,
        eta_minutes: etaMin,
      })
      .eq("id", request.id)
      .is("driver_id", null)
      .eq("status", "pending");

    if (error) {
      setAccepting(false);
      toast({ title: "Could not accept", description: "Request may have been taken.", variant: "destructive" });
      return;
    }

    // Full patient details are visible now that the driver is assigned.
    const { data: full } = await supabase
      .from("ambulance_requests")
      .select("*")
      .eq("id", request.id)
      .maybeSingle();

    setAccepting(false);
    if (full) {
      setActiveRequest(full as AmbulanceRequest);
      setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
      toast({ title: "Request Accepted!", description: `ETA: ${etaMin} minutes` });
    } else {
      toast({ title: "Could not accept", description: "Request may have been taken.", variant: "destructive" });
    }
  };

  const completeRequest = async () => {
    if (!activeRequest || !profile) return;
    await supabase
      .from("ambulance_requests")
      .update({ status: "completed" })
      .eq("id", activeRequest.id);
    setActiveRequest(null);
    toast({ title: "Trip completed" });
  };

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!profile) return null;

  const cityData = cityCoordinates[profile.city] || cityCoordinates.Delhi;
  const mapLat = profile.current_lat || cityData.lat;
  const mapLng = profile.current_lng || cityData.lng;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.05}%2C${mapLat - 0.04}%2C${mapLng + 0.05}%2C${mapLat + 0.04}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <img src={healthrideLogo} alt="HealthRide" className="w-7 h-7" />
            <span className="font-display font-bold text-foreground">Driver Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={profile.is_available ? "emergency" : "hero"}
              size="sm"
              onClick={toggleAvailability}
              className="gap-1.5"
            >
              {profile.is_available ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {profile.is_available ? "Online" : "Offline"}
            </Button>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Driver Info */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-trust flex items-center justify-center text-trust-foreground font-display font-bold">
            {profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-foreground">{profile.full_name}</h2>
            <p className="text-sm text-muted-foreground">{profile.vehicle_number} · {profile.ambulance_type} · {profile.city}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${profile.is_available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
            <span className={`w-2 h-2 rounded-full ${profile.is_available ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
            {profile.is_available ? "Available" : "Offline"}
          </div>
        </div>

        {/* City Map */}
        <div className="rounded-xl overflow-hidden border border-border">
          <iframe
            title="City Map"
            src={mapSrc}
            style={{ width: "100%", height: "300px", border: 0 }}
            allowFullScreen
            loading="lazy"
          />
          <div className="flex items-center gap-2 px-3 py-2 bg-card text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {profile.city} — {profile.current_lat ? `${profile.current_lat.toFixed(4)}°N, ${profile.current_lng?.toFixed(4)}°E` : "GPS not active"}
          </div>
        </div>

        {/* Active Request */}
        {activeRequest && (
          <div className="bg-accent/5 border-2 border-accent rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h3 className="font-display font-bold text-foreground">Active Emergency</h3>
              <span className="ml-auto px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full capitalize">{activeRequest.status.replace("_", " ")}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{activeRequest.patient_name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {activeRequest.patient_phone ? (
                  <a href={`tel:${activeRequest.patient_phone}`} className="text-accent underline">{activeRequest.patient_phone}</a>
                ) : <span className="text-muted-foreground">No phone</span>}
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{activeRequest.patient_address || `${activeRequest.patient_lat.toFixed(4)}°N, ${activeRequest.patient_lng.toFixed(4)}°E`}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground capitalize">{activeRequest.emergency_type.replace("_", " ")}</span>
              </div>
              {activeRequest.notes && (
                <div className="col-span-2 text-muted-foreground text-xs bg-card rounded-lg p-2">
                  Notes: {activeRequest.notes}
                </div>
              )}
            </div>

            {/* Patient location map */}
            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                title="Patient Location"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeRequest.patient_lng - 0.01}%2C${activeRequest.patient_lat - 0.008}%2C${activeRequest.patient_lng + 0.01}%2C${activeRequest.patient_lat + 0.008}&layer=mapnik&marker=${activeRequest.patient_lat}%2C${activeRequest.patient_lng}`}
                style={{ width: "100%", height: "200px", border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="flex gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeRequest.patient_lat},${activeRequest.patient_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="emergency" className="w-full gap-2">
                  <Navigation className="w-4 h-4" /> Navigate
                </Button>
              </a>
              <Button variant="hero" onClick={completeRequest} className="flex-1 gap-2">
                <CheckCircle2 className="w-4 h-4" /> Complete Trip
              </Button>
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {!activeRequest && profile.is_available && (
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Incoming Requests
              {pendingRequests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full">{pendingRequests.length}</span>
              )}
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No pending requests in {profile.city}</p>
                <p className="text-muted-foreground text-xs mt-1">Stay online — we'll notify you when someone needs help</p>
              </div>
            ) : (
              pendingRequests.map((req) => {
                const dist = getDistance(
                  profile.current_lat || cityData.lat,
                  profile.current_lng || cityData.lng,
                  req.patient_lat,
                  req.patient_lng
                );
                return (
                  <div key={req.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground capitalize flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                        {req.emergency_type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">{dist.toFixed(1)} km away</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {req.patient_name && <p className="flex items-center gap-1"><User className="w-3 h-3" /> {req.patient_name}</p>}
                      {req.patient_phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {req.patient_phone}</p>}
                      <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.patient_address || `${req.patient_lat.toFixed(4)}°N, ${req.patient_lng.toFixed(4)}°E`}</p>
                    </div>
                    <Button
                      variant="emergency"
                      size="sm"
                      className="w-full gap-1.5"
                      disabled={accepting}
                      onClick={() => acceptRequest(req)}
                    >
                      {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Accept Request
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {!profile.is_available && !activeRequest && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <PowerOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">You're currently offline</p>
            <p className="text-muted-foreground text-xs mt-1">Go online to start receiving emergency requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
