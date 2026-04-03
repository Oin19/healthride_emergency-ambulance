export interface CityCoords {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const cityCoordinates: Record<string, CityCoords> = {
  Delhi: { name: "Delhi", lat: 28.6139, lng: 77.2090, zoom: 12 },
  Mumbai: { name: "Mumbai", lat: 19.0760, lng: 72.8777, zoom: 12 },
  Bangalore: { name: "Bangalore", lat: 12.9716, lng: 77.5946, zoom: 12 },
  Kolkata: { name: "Kolkata", lat: 22.5726, lng: 88.3639, zoom: 12 },
  Chennai: { name: "Chennai", lat: 13.0827, lng: 80.2707, zoom: 12 },
  Hyderabad: { name: "Hyderabad", lat: 17.3850, lng: 78.4867, zoom: 12 },
  Pune: { name: "Pune", lat: 18.5204, lng: 73.8567, zoom: 12 },
  Ahmedabad: { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, zoom: 12 },
  Jaipur: { name: "Jaipur", lat: 26.9124, lng: 75.7873, zoom: 12 },
  Lucknow: { name: "Lucknow", lat: 26.8467, lng: 80.9462, zoom: 12 },
  Chandigarh: { name: "Chandigarh", lat: 30.7333, lng: 76.7794, zoom: 13 },
  Kochi: { name: "Kochi", lat: 9.9312, lng: 76.2673, zoom: 12 },
  Bhopal: { name: "Bhopal", lat: 23.2599, lng: 77.4126, zoom: 12 },
  Indore: { name: "Indore", lat: 22.7196, lng: 75.8577, zoom: 12 },
  Coimbatore: { name: "Coimbatore", lat: 11.0168, lng: 76.9558, zoom: 12 },
  Patna: { name: "Patna", lat: 25.6093, lng: 85.1376, zoom: 12 },
  Guwahati: { name: "Guwahati", lat: 26.1445, lng: 91.7362, zoom: 12 },
  Thiruvananthapuram: { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, zoom: 12 },
  Visakhapatnam: { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, zoom: 12 },
};

export const getCityList = () => Object.keys(cityCoordinates).sort();

export const findNearestCity = (lat: number, lng: number): string => {
  let nearest = "Delhi";
  let minDist = Infinity;
  for (const [name, c] of Object.entries(cityCoordinates)) {
    const d = Math.sqrt((c.lat - lat) ** 2 + (c.lng - lng) ** 2);
    if (d < minDist) { minDist = d; nearest = name; }
  }
  return nearest;
};
