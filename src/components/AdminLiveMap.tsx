import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Truck, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cityCoordinates } from "@/data/cityCoordinates";

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
  created_at: string;
}

const AdminLiveMap = () => {
  const [drivers, setDrivers] = useState<ActiveDriver[]>([]);
  const [requests, setRequests] = useState<ActiveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const fetchLiveData = async () => {
    setLoading(true);
    const [dRes, rRes] = await Promise.all([
      supabase.from("driver_profiles").select("*"),
      supabase
        .from("ambulance_requests")
        .select("*")
        .in("status", ["pending", "accepted", "en_route"]),
    ]);
    if (dRes.data) setDrivers(dRes.data as ActiveDriver[]);
    if (rRes.data) setRequests(rRes.data as ActiveRequest[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveData();

    // Driver profiles (name, mobile, live GPS) are intentionally NOT published
    // over Realtime — we poll them instead so PII is only ever delivered
    // through the table's SELECT policies.
    const driverPoll = setInterval(fetchLiveData, 15000);

    const requestChannel = supabase
      .channel("admin-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "ambulance_requests" }, () => fetchLiveData())
      .subscribe();

    return () => {
      clearInterval(driverPoll);
      supabase.removeChannel(requestChannel);
    };
  }, []);


  const onlineDrivers = drivers.filter((d) => d.is_available && d.current_lat);
  const filteredDrivers = selectedCity === "all" ? onlineDrivers : onlineDrivers.filter((d) => d.city === selectedCity);
  const filteredRequests = selectedCity === "all" ? requests : requests.filter((r) => r.city === selectedCity);

  // Build map centered on selected city or India center
  const mapCenter = selectedCity !== "all" && cityCoordinates[selectedCity]
    ? cityCoordinates[selectedCity]
    : { lat: 22.5, lng: 78.5, zoom: 5 };

  const zoom = selectedCity === "all" ? 5 : 12;
  const bbox = selectedCity === "all"
    ? "68.0%2C6.0%2C97.0%2C37.0"
    : `${mapCenter.lng - 0.08}%2C${mapCenter.lat - 0.06}%2C${mapCenter.lng + 0.08}%2C${mapCenter.lat + 0.06}`;

  // Build markers string for all online drivers in selected city
  const markerDriver = filteredDrivers.length > 0
    ? filteredDrivers[0]
    : null;

  const mapSrc = markerDriver
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${markerDriver.current_lat}%2C${markerDriver.current_lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  const cities = Object.keys(cityCoordinates).sort();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="all">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={fetchLiveData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            {onlineDrivers.length} Online
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

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-t-lg overflow-hidden">
            <iframe
              title="Admin Live Map"
              src={mapSrc}
              style={{ width: "100%", height: "400px", border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="px-4 py-2 bg-card text-xs text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            {selectedCity === "all" ? "India — All Cities" : `${selectedCity} — ${mapCenter.lat.toFixed(2)}°N, ${mapCenter.lng.toFixed(2)}°E`}
          </div>
        </CardContent>
      </Card>

      {/* Driver + Request panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Online Drivers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              Online Drivers ({filteredDrivers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : filteredDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No online drivers{selectedCity !== "all" ? ` in ${selectedCity}` : ""}</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredDrivers.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{d.full_name}</p>
                      <p className="text-xs text-muted-foreground">{d.vehicle_number} · {d.ambulance_type} · {d.city}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{d.current_lat?.toFixed(4)}°N</p>
                      <p>{d.current_lng?.toFixed(4)}°E</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              Active Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : filteredRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No active requests{selectedCity !== "all" ? ` in ${selectedCity}` : ""}</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredRequests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.status === "pending" ? "bg-yellow-100" : "bg-accent/10"}`}>
                      <AlertTriangle className={`w-4 h-4 ${r.status === "pending" ? "text-yellow-700" : "text-accent"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.patient_name || "Unknown Patient"}</p>
                      <p className="text-xs text-muted-foreground">{r.emergency_type} · {r.city}</p>
                    </div>
                    <Badge variant="outline" className={r.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-accent/10 text-accent border-accent/30"}>
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLiveMap;
