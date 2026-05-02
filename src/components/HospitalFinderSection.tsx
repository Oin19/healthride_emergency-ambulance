import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Shield, BedDouble, MapPin, Star, Clock, ChevronRight, Search, Filter, Navigation, Phone, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { indianHospitals, cities, getDistance, getHospitalTier, type Hospital, type CityTier } from "@/data/indianHospitals";

const insuranceProviders = ["All", "Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz", "Ayushman Bharat", "CGHS", "New India Assurance"];
const tierOptions: { label: string; value: CityTier | "All" }[] = [
  { label: "All Tiers", value: "All" },
  { label: "Metro", value: "Metro" },
  { label: "Semi-Urban", value: "Semi-Urban" },
  { label: "Rural", value: "Rural" },
];

const tierBadgeStyle: Record<CityTier, string> = {
  Metro: "bg-primary/10 text-primary border-primary/30",
  "Semi-Urban": "bg-accent/10 text-accent border-accent/30",
  Rural: "bg-success/10 text-success border-success/30",
};

const HospitalFinderSection = () => {
  const [locationInput, setLocationInput] = useState("");
  const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<CityTier | "All">("All");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const citySuggestions = useMemo(() => {
    if (!locationInput.trim()) return [];
    return cities.filter((c) => c.name.toLowerCase().includes(locationInput.toLowerCase()));
  }, [locationInput]);

  const handleCitySelect = (city: typeof cities[0]) => {
    setSelectedCity(city);
    setLocationInput(city.name);
    setShowCitySuggestions(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      // Find nearest city
      let nearest = cities[0];
      let minDist = Infinity;
      for (const c of cities) {
        const d = getDistance(latitude, longitude, c.lat, c.lng);
        if (d < minDist) { minDist = d; nearest = c; }
      }
      setSelectedCity({ name: `Near ${nearest.name}`, lat: latitude, lng: longitude });
      setLocationInput(`Near ${nearest.name}`);
    });
  };

  const enrichedHospitals = useMemo(() => {
    if (!selectedCity) return [];
    return indianHospitals
      .map((h) => {
        const distKm = getDistance(selectedCity.lat, selectedCity.lng, h.lat, h.lng);
        const etaMin = Math.round(distKm * 2.5 + 3); // rough ETA estimate
        return { ...h, distKm: Math.round(distKm * 10) / 10, etaMin, tier: getHospitalTier(h) };
      })
      .filter((h) => h.distKm < 80) // within 80km
      .sort((a, b) => a.distKm - b.distKm);
  }, [selectedCity]);

  const filtered = useMemo(() => {
    return enrichedHospitals.filter((h) => {
      const matchesSpecialty = !specialtySearch.trim() ||
        h.name.toLowerCase().includes(specialtySearch.toLowerCase()) ||
        h.specialties.some((s) => s.toLowerCase().includes(specialtySearch.toLowerCase()));
      const matchesInsurance = !selectedInsurance || selectedInsurance === "All" ||
        h.insurance.some((i) => i.includes(selectedInsurance!));
      const matchesTier = selectedTier === "All" || h.tier === selectedTier;
      return matchesSpecialty && matchesInsurance && matchesTier;
    });
  }, [enrichedHospitals, specialtySearch, selectedInsurance, selectedTier]);

  return (
    <section id="hospitals" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-trust text-trust bg-trust/10 px-3 py-1">
            <Building2 className="w-3 h-3 mr-1" /> Hospital Network — India
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Insurance-Compatible Hospitals Near You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your location to discover nearest hospitals with real-time bed availability, insurance compatibility, and specialty matching across major Indian cities.
          </p>
        </motion.div>

        {/* Location Input */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowCitySuggestions(true);
                  if (!e.target.value.trim()) setSelectedCity(null);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                placeholder="Enter your city — Delhi, Mumbai, Bangalore, Chennai..."
                className="pl-10 h-12 bg-card border-border"
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute z-20 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-elevated overflow-hidden">
                  {citySuggestions.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleCitySelect(c)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
                    >
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="hero" size="sm" className="h-12 gap-1.5 shrink-0" onClick={handleUseMyLocation}>
              <Navigation className="w-4 h-4" /> Use My Location
            </Button>
          </div>
        </div>

        {/* Specialty Search & Insurance Filters */}
        {selectedCity && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                placeholder="Filter by hospital name or specialty (Cardiology, Trauma, Oncology...)"
                className="pl-10 h-11 bg-card border-border"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-1">Insurance:</span>
              {insuranceProviders.map((ins) => (
                <button
                  key={ins}
                  onClick={() => setSelectedInsurance(ins === "All" ? null : ins)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    (ins === "All" && !selectedInsurance) || selectedInsurance === ins
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {ins}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hospital Cards */}
        {selectedCity && (
          <div className="max-w-4xl mx-auto grid gap-4">
            <p className="text-sm text-muted-foreground mb-1">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> hospitals near <span className="font-semibold text-foreground">{selectedCity.name}</span>
            </p>
            {filtered.map((hospital, i) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-elevated transition-shadow group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-display font-semibold text-foreground text-lg truncate">{hospital.name}</h3>
                      {hospital.verified && (
                        <Badge className="bg-success/10 text-success border-success/30 text-[10px] px-1.5 py-0">Verified</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {hospital.distKm} km — {hospital.area}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{hospital.etaMin} min</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> {hospital.rating}</span>
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /><span className="text-success font-medium">{hospital.beds}</span> beds</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {hospital.specialties.map((s) => (
                        <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{s}</span>
                      ))}
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium">{hospital.level}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Shield className="w-3.5 h-3.5 text-trust" />
                      {hospital.insurance.map((ins, idx) => (
                        <span key={ins} className="text-[11px] text-trust font-medium">
                          {ins}{idx < hospital.insurance.length - 1 && " · "}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 sm:items-end shrink-0">
                    <Button variant="emergency" size="sm" className="gap-1">
                      Route Here <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                    <a href={`tel:${hospital.phone}`} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                      <Phone className="w-3 h-3" /> {hospital.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p>No hospitals match your criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!selectedCity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto text-center py-16">
            <MapPin className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Enter your city above to find nearby hospitals</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {cities.map((c) => (
                <button key={c.name} onClick={() => handleCitySelect(c)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-foreground/30 transition-colors">
                  {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HospitalFinderSection;
