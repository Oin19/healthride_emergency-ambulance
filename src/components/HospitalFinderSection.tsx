import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Shield, BedDouble, MapPin, Star, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const hospitals = [
  {
    name: "St. Mary's Medical Center",
    distance: "1.2 mi",
    eta: "4 min",
    rating: 4.8,
    beds: 12,
    specialties: ["Trauma", "Cardiology", "Neurology"],
    insurance: ["Blue Cross", "Aetna", "UnitedHealth"],
    verified: true,
    level: "Level I Trauma",
  },
  {
    name: "Metro General Hospital",
    distance: "2.8 mi",
    eta: "8 min",
    rating: 4.5,
    beds: 24,
    specialties: ["Emergency", "Orthopedics", "Pediatrics"],
    insurance: ["Cigna", "Blue Cross", "Humana"],
    verified: true,
    level: "Level II Trauma",
  },
  {
    name: "Riverside Community Health",
    distance: "3.5 mi",
    eta: "11 min",
    rating: 4.7,
    beds: 8,
    specialties: ["Emergency", "Internal Medicine"],
    insurance: ["Aetna", "Medicare", "Medicaid"],
    verified: true,
    level: "Community ER",
  },
  {
    name: "University Medical Center",
    distance: "5.1 mi",
    eta: "15 min",
    rating: 4.9,
    beds: 31,
    specialties: ["Trauma", "Burns", "Transplant", "Oncology"],
    insurance: ["All Major Providers"],
    verified: true,
    level: "Level I Trauma",
  },
];

const HospitalFinderSection = () => {
  const [search, setSearch] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);

  const insuranceProviders = ["All", "Blue Cross", "Aetna", "UnitedHealth", "Cigna", "Humana", "Medicare"];

  const filtered = hospitals.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesInsurance = !selectedInsurance || selectedInsurance === "All" ||
      h.insurance.some((i) => i.includes(selectedInsurance)) ||
      h.insurance.includes("All Major Providers");
    return matchesSearch && matchesInsurance;
  });

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
            <Building2 className="w-3 h-3 mr-1" /> Hospital Network
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Insurance-Compatible Hospitals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Instantly locate the nearest hospitals that accept your insurance, with real-time bed availability and specialty matching.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hospital name or specialty..."
              className="pl-10 h-12 bg-card border-border"
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
        </div>

        {/* Hospital Cards */}
        <div className="max-w-4xl mx-auto grid gap-4">
          {filtered.map((hospital, i) => (
            <motion.div
              key={hospital.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-elevated transition-shadow group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-display font-semibold text-foreground text-lg truncate">
                      {hospital.name}
                    </h3>
                    {hospital.verified && (
                      <Badge className="bg-success/10 text-success border-success/30 text-[10px] px-1.5 py-0">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {hospital.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {hospital.eta} ETA
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" /> {hospital.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5" />
                      <span className="text-success font-medium">{hospital.beds}</span> beds available
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {hospital.specialties.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium">
                      {hospital.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Shield className="w-3.5 h-3.5 text-trust" />
                    {hospital.insurance.map((ins) => (
                      <span key={ins} className="text-[11px] text-trust font-medium">
                        {ins}
                        {hospital.insurance.indexOf(ins) < hospital.insurance.length - 1 && " · "}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex sm:flex-col items-center gap-2 sm:items-end shrink-0">
                  <Button variant="emergency" size="sm" className="gap-1">
                    Route Here <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground">{hospital.eta} away</span>
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
      </div>
    </section>
  );
};

export default HospitalFinderSection;
