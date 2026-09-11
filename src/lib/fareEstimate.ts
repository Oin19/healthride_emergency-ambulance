import { indianHospitals, getDistance, getHospitalTier, type Hospital, type CityTier } from "@/data/indianHospitals";

export interface FareEstimate {
  hospital: Hospital;
  tier: CityTier;
  distanceKm: number;
  ambulanceType: string;
  baseFare: number;
  perKmRate: number;
  distanceFare: number;
  equipmentFee: number;
  nightSurcharge: number;
  total: number;
  schemes: string[];
  coveredScheme: string | null;
  estimatedOutOfPocket: number;
}

// Government / public schemes that fully cover emergency ambulance transport
const GOVT_SCHEMES = ["Ayushman Bharat", "CGHS", "ECHS", "Swasthya Sathi"];

const ALS_TYPES = ["cardiac", "stroke", "burns", "breathing", "trauma"];

const TIER_RATES: Record<CityTier, { base: number; perKm: number }> = {
  Metro: { base: 1500, perKm: 45 },
  "Semi-Urban": { base: 1100, perKm: 35 },
  Rural: { base: 800, perKm: 28 },
};

export function estimateFare(
  lat: number,
  lng: number,
  emergencyType: string | null,
  at: Date = new Date()
): FareEstimate | null {
  if (!indianHospitals.length) return null;

  let hospital = indianHospitals[0];
  let best = Infinity;
  for (const h of indianHospitals) {
    const d = getDistance(lat, lng, h.lat, h.lng);
    if (d < best) { best = d; hospital = h; }
  }

  const tier = getHospitalTier(hospital);
  const { base, perKm } = TIER_RATES[tier];
  const distanceKm = Math.max(1, Math.round(best * 10) / 10);

  const isALS = !!emergencyType && ALS_TYPES.includes(emergencyType);
  const ambulanceType = isALS ? "Advanced Life Support (ALS)" : "Basic Life Support (BLS)";

  const baseFare = isALS ? Math.round(base * 1.4) : base;
  const distanceFare = Math.round(distanceKm * perKm);
  const equipmentFee = isALS ? 900 : 300;

  const hour = at.getHours();
  const isNight = hour >= 22 || hour < 6;
  const subtotal = baseFare + distanceFare + equipmentFee;
  const nightSurcharge = isNight ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal + nightSurcharge;

  const schemes = hospital.insurance;
  const coveredScheme = schemes.find((s) => GOVT_SCHEMES.includes(s)) ?? null;
  const estimatedOutOfPocket = coveredScheme ? 0 : Math.round(total * 0.3);

  return {
    hospital, tier, distanceKm, ambulanceType,
    baseFare, perKmRate: perKm, distanceFare, equipmentFee,
    nightSurcharge, total, schemes, coveredScheme, estimatedOutOfPocket,
  };
}

export const formatINR = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
