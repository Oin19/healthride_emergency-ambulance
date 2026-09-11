import { useMemo } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Route, ShieldCheck, Truck, MoonStar, Building2 } from "lucide-react";
import { estimateFare, formatINR } from "@/lib/fareEstimate";

interface Props {
  coords: { lat: number; lng: number };
  emergencyType: string | null;
}

const CostEstimator = ({ coords, emergencyType }: Props) => {
  const est = useMemo(
    () => estimateFare(coords.lat, coords.lng, emergencyType),
    [coords.lat, coords.lng, emergencyType]
  );

  if (!est) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-trust/30 bg-trust/5 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-trust" />
          <h3 className="text-sm font-semibold text-foreground">Estimated Cost</h3>
        </div>
        <span className="font-display text-xl font-bold text-foreground">{formatINR(est.total)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-2.5 py-2">
          <Route className="w-3.5 h-3.5 text-trust flex-shrink-0" />
          <span className="text-muted-foreground">{est.distanceKm} km trip</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-2.5 py-2">
          <Truck className="w-3.5 h-3.5 text-trust flex-shrink-0" />
          <span className="text-muted-foreground truncate">{est.ambulanceType.split(" (")[1]?.replace(")", "") || est.ambulanceType}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 rounded-lg bg-card border border-border px-2.5 py-2">
          <Building2 className="w-3.5 h-3.5 text-trust flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            Nearest: {est.hospital.name}, {est.hospital.area} · {est.tier}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base fare ({est.ambulanceType.includes("ALS") ? "ALS" : "BLS"})</span>
          <span className="text-foreground">{formatINR(est.baseFare)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distance ({est.distanceKm} km × {formatINR(est.perKmRate)})</span>
          <span className="text-foreground">{formatINR(est.distanceFare)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Equipment & paramedic</span>
          <span className="text-foreground">{formatINR(est.equipmentFee)}</span>
        </div>
        {est.nightSurcharge > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <MoonStar className="w-3 h-3" /> Night surcharge (15%)
            </span>
            <span className="text-foreground">{formatINR(est.nightSurcharge)}</span>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${est.coveredScheme ? "text-success" : "text-muted-foreground"}`} />
          <span className="text-xs font-medium text-foreground">
            {est.coveredScheme
              ? `Covered under ${est.coveredScheme}`
              : "No government scheme at nearest hospital"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Accepted here: {est.schemes.join(", ")}
        </p>
        <p className="text-[11px] text-muted-foreground">
          Estimated you pay:{" "}
          <span className="font-semibold text-foreground">
            {est.estimatedOutOfPocket === 0 ? "₹0 (cashless)" : formatINR(est.estimatedOutOfPocket)}
          </span>
        </p>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Indicative estimate only. Final billing depends on the assigned unit, route and hospital.
      </p>
    </motion.div>
  );
};

export default CostEstimator;
