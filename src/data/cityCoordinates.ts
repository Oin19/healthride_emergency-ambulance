export interface CityCoords {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const cityCoordinates: Record<string, CityCoords> = {
  // === METRO CITIES ===
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

  // === TIER-2 / SEMI-URBAN CITIES ===
  Nagpur: { name: "Nagpur", lat: 21.1458, lng: 79.0882, zoom: 12 },
  Varanasi: { name: "Varanasi", lat: 25.3176, lng: 82.9739, zoom: 12 },
  Agra: { name: "Agra", lat: 27.1767, lng: 78.0081, zoom: 12 },
  Madurai: { name: "Madurai", lat: 9.9252, lng: 78.1198, zoom: 12 },
  Ranchi: { name: "Ranchi", lat: 23.3441, lng: 85.3096, zoom: 12 },
  Raipur: { name: "Raipur", lat: 21.2514, lng: 81.6296, zoom: 12 },
  Dehradun: { name: "Dehradun", lat: 30.3165, lng: 78.0322, zoom: 12 },
  Mysore: { name: "Mysore", lat: 12.2958, lng: 76.6394, zoom: 12 },
  Jodhpur: { name: "Jodhpur", lat: 26.2389, lng: 73.0243, zoom: 12 },
  Udaipur: { name: "Udaipur", lat: 24.5854, lng: 73.7125, zoom: 12 },
  Allahabad: { name: "Allahabad", lat: 25.4358, lng: 81.8463, zoom: 12 },
  Tiruchirappalli: { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, zoom: 12 },
  Jalandhar: { name: "Jalandhar", lat: 31.3260, lng: 75.5762, zoom: 12 },
  Mangalore: { name: "Mangalore", lat: 12.9141, lng: 74.8560, zoom: 12 },
  Siliguri: { name: "Siliguri", lat: 26.7271, lng: 88.3953, zoom: 12 },
  Hubli: { name: "Hubli", lat: 15.3647, lng: 75.1240, zoom: 12 },
  Gorakhpur: { name: "Gorakhpur", lat: 26.7606, lng: 83.3732, zoom: 12 },
  Cuttack: { name: "Cuttack", lat: 20.4625, lng: 85.8830, zoom: 12 },
  Jammu: { name: "Jammu", lat: 32.7266, lng: 74.8570, zoom: 12 },
  Aurangabad: { name: "Aurangabad", lat: 19.8762, lng: 75.3433, zoom: 12 },
  Amritsar: { name: "Amritsar", lat: 31.6340, lng: 74.8723, zoom: 12 },
  Vijayawada: { name: "Vijayawada", lat: 16.5062, lng: 80.6480, zoom: 12 },
  Nashik: { name: "Nashik", lat: 19.9975, lng: 73.7898, zoom: 12 },
  Nellore: { name: "Nellore", lat: 14.4426, lng: 79.9865, zoom: 12 },
  Shimla: { name: "Shimla", lat: 31.1048, lng: 77.1734, zoom: 13 },
  Shillong: { name: "Shillong", lat: 25.5788, lng: 91.8933, zoom: 13 },
  Gangtok: { name: "Gangtok", lat: 27.3389, lng: 88.6065, zoom: 13 },
  Imphal: { name: "Imphal", lat: 24.8170, lng: 93.9368, zoom: 13 },
  Dibrugarh: { name: "Dibrugarh", lat: 27.4728, lng: 94.9120, zoom: 13 },
  Agartala: { name: "Agartala", lat: 23.8315, lng: 91.2868, zoom: 13 },
  Aizawl: { name: "Aizawl", lat: 23.7271, lng: 92.7176, zoom: 13 },

  // === SMALL TOWNS / RURAL ===
  Vellore: { name: "Vellore", lat: 12.9165, lng: 79.1325, zoom: 13 },
  Kalyani: { name: "Kalyani", lat: 22.9751, lng: 88.4345, zoom: 13 },
  Wardha: { name: "Wardha", lat: 20.7453, lng: 78.6022, zoom: 13 },
  Manipal: { name: "Manipal", lat: 13.3525, lng: 74.7928, zoom: 13 },
  Rishikesh: { name: "Rishikesh", lat: 30.0869, lng: 78.2676, zoom: 13 },
  Raebareli: { name: "Raebareli", lat: 26.2314, lng: 81.2331, zoom: 13 },
  Bhagalpur: { name: "Bhagalpur", lat: 25.2425, lng: 86.9842, zoom: 13 },
  Darbhanga: { name: "Darbhanga", lat: 26.1542, lng: 85.8918, zoom: 13 },
  Siwan: { name: "Siwan", lat: 26.2218, lng: 84.3592, zoom: 13 },
  Tezpur: { name: "Tezpur", lat: 26.6338, lng: 92.7926, zoom: 13 },
  Jorhat: { name: "Jorhat", lat: 26.7509, lng: 94.2037, zoom: 13 },
  Muzaffarpur: { name: "Muzaffarpur", lat: 26.1209, lng: 85.3647, zoom: 13 },
  Jhansi: { name: "Jhansi", lat: 25.4484, lng: 78.5685, zoom: 13 },
  Dharwad: { name: "Dharwad", lat: 15.4589, lng: 75.0078, zoom: 13 },
  Raichur: { name: "Raichur", lat: 16.2076, lng: 77.3463, zoom: 13 },
  Karimnagar: { name: "Karimnagar", lat: 18.4386, lng: 79.1288, zoom: 13 },
  Warangal: { name: "Warangal", lat: 17.9784, lng: 79.5941, zoom: 13 },
  Tirunelveli: { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, zoom: 13 },
  Salem: { name: "Salem", lat: 11.6643, lng: 78.1460, zoom: 12 },
  Thanjavur: { name: "Thanjavur", lat: 10.7870, lng: 79.1378, zoom: 13 },
  Bareilly: { name: "Bareilly", lat: 28.3670, lng: 79.4304, zoom: 12 },
  Aligarh: { name: "Aligarh", lat: 27.8974, lng: 78.0880, zoom: 12 },
  Bilaspur: { name: "Bilaspur", lat: 22.0797, lng: 82.1409, zoom: 13 },
  Korba: { name: "Korba", lat: 22.3595, lng: 82.7501, zoom: 13 },
  Hazaribagh: { name: "Hazaribagh", lat: 23.9921, lng: 85.3637, zoom: 13 },
  Dhanbad: { name: "Dhanbad", lat: 23.7957, lng: 86.4304, zoom: 12 },
  Purulia: { name: "Purulia", lat: 23.3321, lng: 86.3652, zoom: 13 },
  Bankura: { name: "Bankura", lat: 23.2324, lng: 87.0649, zoom: 13 },
  Medinipur: { name: "Medinipur", lat: 22.4249, lng: 87.3199, zoom: 13 },
  Burdwan: { name: "Burdwan", lat: 23.2324, lng: 87.8615, zoom: 13 },
  Malda: { name: "Malda", lat: 25.0108, lng: 88.1411, zoom: 13 },
  Asansol: { name: "Asansol", lat: 23.6889, lng: 86.9661, zoom: 12 },
  Durgapur: { name: "Durgapur", lat: 23.5204, lng: 87.3119, zoom: 12 },
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
