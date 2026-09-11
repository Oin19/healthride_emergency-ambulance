import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Truck, AlertTriangle, RefreshCw, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cityCoordinates } from "@/data/cityCoordinates";
import { toast } from "sonner";

interface ActiveDriver {
  id: string;
  full_name: string;
  mobile: string;
  vehicle_number: string;
  ambulance_type: string;
  city: string;
  is_available: boolean;
  current_lat: number | null;
  current_lng: number | null;
  updated_at?: string;
}

interface ActiveRequest {
  id: string;
  emergency_type: string;
  patient_name: string | null;
  patient_phone: string | null;
  patient_lat: number;
  patient_lng: number;
  city: string;
  status: string;
  driver_id: string | null;
  eta_minutes: number | null;
  driver_lat: number | null;
  driver_lng: number | null;
  created_at: string;
}

/** ETA in minutes for a trip of `km`, assuming ~30 km/h city driving. */
const etaFromKm = (km: number) => Math.max(3, Math.round(km / 0.5));

/** Clock time the ambulance is expected to arrive, e.g. "9:47 PM". */
const arrivalClock = (minutes: number) =>
  new Date(Date.now() + minutes * 60_000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const REFRESH_MS = 5000;

const distanceKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const AdminLiveMap = () => {
  const [drivers, setDrivers] = useState<ActiveDriver[]>([]);
  const [requests, setRequests] = useState<ActiveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiveData = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    const [dRes, rRes] = await Promise.all([
      supabase.from("driver_profiles").select("*"),
      supabase
        .from("ambulance_requests")
        .select("*")
        .in("status", ["pending", "accepted", "en_route", "arrived"]),
    ]);
    if (dRes.data) setDrivers(dRes.data as ActiveDriver[]);
    if (rRes.data) setRequests(rRes.data as ActiveRequest[]);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData(true);

    // Driver profiles (name, mobile, live GPS) are intentionally NOT published
    // over Realtime — we poll them instead so PII is only ever delivered
    // through the table's SELECT policies.
    const driverPoll = setInterval(() => fetchLiveData(false), REFRESH_MS);

    const requestChannel = supabase
      .channel("admin-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "ambulance_requests" }, () =>
        fetchLiveData(false),
      )
      .subscribe();

    return () => {
      clearInterval(driverPoll);
      supabase.removeChannel(requestChannel);
    };
  }, []);

  const locatedDrivers = drivers.filter(
    (d) => d.current_lat !== null && d.current_lng !== null,
  );
  const filteredDrivers =
    selectedCity === "all" ? locatedDrivers : locatedDrivers.filter((d) => d.city === selectedCity);
  const filteredRequests =
    selectedCity === "all" ? requests : requests.filter((r) => r.city === selectedCity);
  const onlineCount = locatedDrivers.filter((d) => d.is_available).length;

  const center =
    selectedCity !== "all" && cityCoordinates[selectedCity]
      ? cityCoordinates[selectedCity]
      : { lat: 22.5, lng: 78.5 };

  // Map viewport: focused marker wins, then selected city, then all-India
  const focused =
    filteredDrivers.find((d) => d.id === focusId) ||
    (focusId ? filteredRequests.find((r) => r.id === focusId) : undefined);

  const view = useMemo(() => {
    if (focused) {
      const lat = "current_lat" in focused ? (focused.current_lat as number) : focused.patient_lat;
      const lng = "current_lng" in focused ? (focused.current_lng as number) : focused.patient_lng;
      return { minLat: lat - 0.02, maxLat: lat + 0.02, minLng: lng - 0.03, maxLng: lng + 0.03 };
    }
    if (selectedCity === "all") {
      return { minLat: 6, maxLat: 37, minLng: 68, maxLng: 97 };
    }
    return {
      minLat: center.lat - 0.06,
      maxLat: center.lat + 0.06,
      minLng: center.lng - 0.08,
      maxLng: center.lng + 0.08,
    };
  }, [focused, selectedCity, center.lat, center.lng]);

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${view.minLng}%2C${view.minLat}%2C${view.maxLng}%2C${view.maxLat}&layer=mapnik`;

  const toPct = (lat: number, lng: number) => ({
    left: ((lng - view.minLng) / (view.maxLng - view.minLng)) * 100,
    top: ((view.maxLat - lat) / (view.maxLat - view.minLat)) * 100,
  });

  const inView = (p: { left: number; top: number }) =>
    p.left >= 0 && p.left <= 100 && p.top >= 0 && p.top <= 100;

  const assignDriver = async (request: ActiveRequest, driverId: string) => {
    setAssigningId(request.id);
    const driver = drivers.find((d) => d.id === driverId);
    const eta =
      driver?.current_lat != null && driver?.current_lng != null
        ? etaFromKm(
            distanceKm(request.patient_lat, request.patient_lng, driver.current_lat, driver.current_lng),
          )
        : null;
    const { error } = await supabase
      .from("ambulance_requests")
      .update({
        driver_id: driverId || null,
        status: driverId ? "accepted" : "pending",
        driver_lat: driver?.current_lat ?? null,
        driver_lng: driver?.current_lng ?? null,
        eta_minutes: driverId ? eta : null,
      })
      .eq("id", request.id);
    setAssigningId(null);
    if (error) {
      toast.error("Could not assign driver: " + error.message);
      return;
    }
    toast.success(
      driverId
        ? `Assigned to ${driver?.full_name ?? "driver"}${eta ? ` · ETA ${eta} min (by ${arrivalClock(eta)})` : ""}`
        : "Driver unassigned",
    );
    fetchLiveData(false);
  };

  const cities = Object.keys(cityCoordinates).sort();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={selectedCity}
          aria-label="Filter by city"
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setFocusId(null);
          }}
        >
          <option value="all">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => fetchLiveData(true)} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        {focusId && (
          <Button variant="ghost" size="sm" onClick={() => setFocusId(null)}>
            Reset view
          </Button>
        )}
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            {onlineCount} Online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            {requests.filter((r) => r.status === "pending").length} Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            {requests.filter((r) => r.status !== "pending").length} Active
          </span>
        </div>
      </div>

      {/* Map with live overlay markers */}
      <Card>
        <CardContent className="p-0">
          <div className="relative rounded-t-lg overflow-hidden" style={{ height: 420 }}>
            <iframe
              title="Admin Live Map"
              src={mapSrc}
              style={{ width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            {/* Overlay markers (pointer-events only on the pins themselves) */}
            <div className="absolute inset-0 pointer-events-none">
              {filteredDrivers.map((d) => {
                const p = toPct(d.current_lat as number, d.current_lng as number);
                if (!inView(p)) return null;
                return (
                  <button
                    key={`d-${d.id}`}
                    type="button"
                    aria-label={`Driver ${d.full_name} at ${d.city}`}
                    onClick={() => setFocusId(d.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full border-2 border-background shadow-lg ${
                        d.is_available ? "bg-green-600" : "bg-muted-foreground"
                      } ${focusId === d.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <Truck className="w-3.5 h-3.5 text-primary-foreground" />
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-8 hidden group-hover:block whitespace-nowrap rounded bg-card text-card-foreground text-[11px] px-2 py-1 shadow-md border border-border">
                      {d.full_name} · {d.vehicle_number}
                    </span>
                  </button>
                );
              })}
              {filteredRequests.map((r) => {
                const p = toPct(r.patient_lat, r.patient_lng);
                if (!inView(p)) return null;
                return (
                  <button
                    key={`r-${r.id}`}
                    type="button"
                    aria-label={`Request ${r.emergency_type} in ${r.city}`}
                    onClick={() => setFocusId(r.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full border-2 border-background shadow-lg ${
                        r.status === "pending" ? "bg-destructive animate-pulse" : "bg-accent"
                      } ${focusId === r.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-primary-foreground" />
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-8 hidden group-hover:block whitespace-nowrap rounded bg-card text-card-foreground text-[11px] px-2 py-1 shadow-md border border-border">
                      {r.emergency_type} · {r.status}
                      {r.eta_minutes ? ` · ETA ${r.eta_minutes} min` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-4 py-2 bg-card text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            <MapPin className="w-3 h-3" />
            {selectedCity === "all" ? "India — All Cities" : selectedCity}
            <span className="mx-1">·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600" /> available driver
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" /> busy driver
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-destructive" /> pending request
            </span>
            {lastUpdated && (
              <span className="ml-auto">Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Driver + Request panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Drivers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              Drivers on Map ({filteredDrivers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : filteredDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No driver locations{selectedCity !== "all" ? ` in ${selectedCity}` : ""}
              </p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {filteredDrivers.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setFocusId(d.id)}
                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border transition-colors hover:bg-muted ${
                      focusId === d.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        d.is_available ? "bg-green-100" : "bg-muted"
                      }`}
                    >
                      <Truck
                        className={`w-4 h-4 ${d.is_available ? "text-green-700" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{d.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {d.vehicle_number} · {d.ambulance_type} · {d.city}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{d.current_lat?.toFixed(4)}°N</p>
                      <p>{d.current_lng?.toFixed(4)}°E</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requests with manual assignment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              Active Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No active requests{selectedCity !== "all" ? ` in ${selectedCity}` : ""}
              </p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {filteredRequests.map((r) => {
                  const options = [...locatedDrivers]
                    .map((d) => ({
                      driver: d,
                      km: distanceKm(
                        r.patient_lat,
                        r.patient_lng,
                        d.current_lat as number,
                        d.current_lng as number,
                      ),
                    }))
                    .sort((a, b) => a.km - b.km);
                  const assigned = drivers.find((d) => d.id === r.driver_id);
                  return (
                    <div
                      key={r.id}
                      className={`p-2.5 rounded-lg bg-muted/50 border ${
                        focusId === r.id ? "border-primary" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Focus request from ${r.patient_name || "unknown patient"}`}
                          onClick={() => setFocusId(r.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            r.status === "pending" ? "bg-yellow-100" : "bg-accent/10"
                          }`}
                        >
                          <AlertTriangle
                            className={`w-4 h-4 ${r.status === "pending" ? "text-yellow-700" : "text-accent"}`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {r.patient_name || "Unknown Patient"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {r.emergency_type} · {r.city}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className={
                              r.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-accent/10 text-accent border-accent/30"
                            }
                          >
                            {r.status}
                          </Badge>
                          {r.eta_minutes ? (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-accent">
                              <Clock className="w-3 h-3" />
                              {r.eta_minutes} min
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <select
                          className="flex-1 min-w-0 px-2 py-1.5 rounded-md border border-input bg-background text-xs"
                          aria-label={`Assign a driver to the request from ${r.patient_name || "unknown patient"}`}
                          value={r.driver_id ?? ""}
                          disabled={assigningId === r.id}
                          onChange={(e) => assignDriver(r, e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {options.map(({ driver, km }) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.full_name} · {driver.vehicle_number} · {km.toFixed(1)} km · ~
                              {etaFromKm(km)} min{driver.is_available ? "" : " (busy)"}
                            </option>
                          ))}
                        </select>
                        {assigningId === r.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      </div>
                      {assigned && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Driver {assigned.full_name} · {assigned.mobile}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLiveMap;
