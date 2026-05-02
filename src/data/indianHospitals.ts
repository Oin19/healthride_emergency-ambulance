export interface Hospital {
  name: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  beds: number;
  specialties: string[];
  insurance: string[];
  verified: boolean;
  level: string;
  phone: string;
}

export type CityTier = "Metro" | "Semi-Urban" | "Rural";
export interface CityEntry {
  name: string;
  lat: number;
  lng: number;
  tier: CityTier;
}

export const indianHospitals: Hospital[] = [
  // ========== METRO CITIES ==========

  // Delhi NCR
  { name: "AIIMS New Delhi", city: "Delhi", area: "Ansari Nagar", lat: 28.5672, lng: 77.2100, rating: 4.9, beds: 45, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat", "Star Health"], verified: true, level: "Level I Trauma", phone: "+91-11-26588500" },
  { name: "Safdarjung Hospital", city: "Delhi", area: "Ring Road", lat: 28.5685, lng: 77.2065, rating: 4.5, beds: 38, specialties: ["Emergency", "Orthopedics", "Burns", "Pediatrics"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-11-26707437" },
  { name: "Max Super Speciality Hospital", city: "Delhi", area: "Saket", lat: 28.5274, lng: 77.2150, rating: 4.7, beds: 22, specialties: ["Cardiology", "Oncology", "Neurosciences", "Orthopedics"], insurance: ["Star Health", "ICICI Lombard", "HDFC Ergo", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-11-26515050" },
  { name: "Fortis Hospital", city: "Delhi", area: "Vasant Kunj", lat: 28.5181, lng: 77.1560, rating: 4.6, beds: 18, specialties: ["Cardiology", "Orthopedics", "Renal Sciences"], insurance: ["Star Health", "Bajaj Allianz", "HDFC Ergo", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-11-42776222" },
  { name: "Sir Ganga Ram Hospital", city: "Delhi", area: "Rajinder Nagar", lat: 28.6380, lng: 77.1870, rating: 4.8, beds: 28, specialties: ["Gastroenterology", "Cardiology", "Nephrology", "Urology"], insurance: ["CGHS", "Star Health", "New India Assurance", "United India"], verified: true, level: "Multi Speciality", phone: "+91-11-25861662" },

  // Mumbai
  { name: "Tata Memorial Hospital", city: "Mumbai", area: "Parel", lat: 19.0048, lng: 72.8435, rating: 4.9, beds: 35, specialties: ["Oncology", "Radiation Therapy", "Surgical Oncology"], insurance: ["Ayushman Bharat", "CGHS", "Star Health"], verified: true, level: "Cancer Centre", phone: "+91-22-24177000" },
  { name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai", area: "Andheri West", lat: 19.1310, lng: 72.8254, rating: 4.8, beds: 26, specialties: ["Cardiology", "Neurology", "Orthopedics", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-22-30999999" },
  { name: "Lilavati Hospital", city: "Mumbai", area: "Bandra West", lat: 19.0509, lng: 72.8294, rating: 4.7, beds: 20, specialties: ["Emergency", "Cardiology", "Neurosurgery", "Orthopedics"], insurance: ["Star Health", "New India Assurance", "United India", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-22-26751000" },
  { name: "KEM Hospital", city: "Mumbai", area: "Parel", lat: 19.0002, lng: 72.8411, rating: 4.5, beds: 42, specialties: ["Trauma", "Emergency", "Internal Medicine", "Pediatrics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-22-24136051" },
  { name: "Nanavati Max Super Speciality Hospital", city: "Mumbai", area: "Vile Parle", lat: 19.0990, lng: 72.8430, rating: 4.6, beds: 19, specialties: ["Cardiology", "Oncology", "Nephrology", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "Max Bupa"], verified: true, level: "Multi Speciality", phone: "+91-22-26267500" },

  // Bangalore
  { name: "NIMHANS", city: "Bangalore", area: "Hosur Road", lat: 12.9416, lng: 77.5947, rating: 4.9, beds: 30, specialties: ["Neurology", "Psychiatry", "Neurosurgery"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Neuro Centre", phone: "+91-80-26995000" },
  { name: "Manipal Hospital", city: "Bangalore", area: "HAL Airport Road", lat: 12.9592, lng: 77.6470, rating: 4.7, beds: 24, specialties: ["Cardiology", "Oncology", "Organ Transplant", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-80-25024444" },
  { name: "Narayana Health City", city: "Bangalore", area: "Bommasandra", lat: 12.8166, lng: 77.6950, rating: 4.8, beds: 40, specialties: ["Cardiology", "Cardiac Surgery", "Oncology", "Nephrology"], insurance: ["Ayushman Bharat", "Star Health", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-80-71222222" },
  { name: "Apollo Hospital", city: "Bangalore", area: "Bannerghatta Road", lat: 12.8898, lng: 77.5968, rating: 4.6, beds: 18, specialties: ["Emergency", "Cardiology", "Orthopedics", "Neurosciences"], insurance: ["Star Health", "HDFC Ergo", "Max Bupa", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-80-26304050" },

  // Chennai
  { name: "Apollo Hospitals Greams Road", city: "Chennai", area: "Greams Road", lat: 13.0604, lng: 80.2496, rating: 4.8, beds: 32, specialties: ["Cardiology", "Orthopedics", "Oncology", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-44-28293333" },
  { name: "CMC Vellore", city: "Chennai", area: "Vellore", lat: 12.9249, lng: 79.1325, rating: 4.9, beds: 50, specialties: ["Cardiology", "Neurology", "Oncology", "Nephrology", "Pediatrics"], insurance: ["CGHS", "Ayushman Bharat", "Star Health", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-416-2281000" },
  { name: "MIOT International", city: "Chennai", area: "Manapakkam", lat: 13.0120, lng: 80.1720, rating: 4.7, beds: 22, specialties: ["Orthopedics", "Spine Surgery", "Joint Replacement", "Trauma"], insurance: ["Star Health", "ICICI Lombard", "United India", "New India Assurance"], verified: true, level: "Ortho Centre", phone: "+91-44-42002288" },
  { name: "Rajiv Gandhi Government Hospital", city: "Chennai", area: "Park Town", lat: 13.0878, lng: 80.2785, rating: 4.4, beds: 55, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-44-25305000" },

  // Hyderabad
  { name: "NIMS Hyderabad", city: "Hyderabad", area: "Punjagutta", lat: 17.4239, lng: 78.4738, rating: 4.7, beds: 38, specialties: ["Cardiology", "Nephrology", "Gastroenterology", "Neurology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat", "Aarogyasri"], verified: true, level: "Multi Speciality", phone: "+91-40-23390999" },
  { name: "Yashoda Hospitals", city: "Hyderabad", area: "Somajiguda", lat: 17.4340, lng: 78.4578, rating: 4.6, beds: 20, specialties: ["Cardiology", "Oncology", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Aarogyasri", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-40-45674567" },
  { name: "AIG Hospitals", city: "Hyderabad", area: "Gachibowli", lat: 17.4400, lng: 78.3489, rating: 4.8, beds: 25, specialties: ["Gastroenterology", "Hepatology", "Liver Transplant"], insurance: ["Star Health", "Bajaj Allianz", "Aarogyasri", "ICICI Lombard"], verified: true, level: "GI Centre", phone: "+91-40-42444222" },
  { name: "Apollo Hospitals Jubilee Hills", city: "Hyderabad", area: "Jubilee Hills", lat: 17.4260, lng: 78.4072, rating: 4.7, beds: 28, specialties: ["Cardiology", "Orthopedics", "Oncology", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "Max Bupa", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-40-23607777" },

  // Kolkata
  { name: "SSKM Hospital", city: "Kolkata", area: "Bhowanipore", lat: 22.5375, lng: 88.3444, rating: 4.5, beds: 44, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "Level I Trauma", phone: "+91-33-22041101" },
  { name: "Apollo Gleneagles Hospital", city: "Kolkata", area: "Canal Circular Road", lat: 22.5626, lng: 88.3971, rating: 4.7, beds: 22, specialties: ["Cardiology", "Oncology", "Neurosciences", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-33-23203040" },
  { name: "Fortis Hospital Anandapur", city: "Kolkata", area: "Anandapur", lat: 22.5130, lng: 88.4050, rating: 4.6, beds: 18, specialties: ["Cardiology", "Renal Sciences", "Orthopedics", "Neurosciences"], insurance: ["Star Health", "Bajaj Allianz", "ICICI Lombard", "Max Bupa"], verified: true, level: "Multi Speciality", phone: "+91-33-66284444" },
  { name: "AMRI Hospital Salt Lake", city: "Kolkata", area: "Salt Lake", lat: 22.5800, lng: 88.4100, rating: 4.5, beds: 20, specialties: ["Cardiology", "Orthopedics", "Gastroenterology", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Swasthya Sathi", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-33-66800000" },
  { name: "Woodlands Multispeciality Hospital", city: "Kolkata", area: "Alipore", lat: 22.5330, lng: 88.3370, rating: 4.4, beds: 16, specialties: ["Emergency", "Internal Medicine", "Cardiology", "Nephrology"], insurance: ["Star Health", "ICICI Lombard", "Swasthya Sathi"], verified: true, level: "Multi Speciality", phone: "+91-33-24567075" },

  // Pune
  { name: "Ruby Hall Clinic", city: "Pune", area: "Sassoon Road", lat: 18.5285, lng: 73.8806, rating: 4.7, beds: 20, specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "New India Assurance", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-20-66455100" },
  { name: "Sahyadri Hospital", city: "Pune", area: "Deccan", lat: 18.5140, lng: 73.8414, rating: 4.6, beds: 16, specialties: ["Cardiology", "Neurosurgery", "Orthopedics", "Trauma"], insurance: ["Star Health", "Bajaj Allianz", "HDFC Ergo", "United India"], verified: true, level: "Multi Speciality", phone: "+91-20-67210100" },
  { name: "Jehangir Hospital", city: "Pune", area: "Sassoon Road", lat: 18.5300, lng: 73.8790, rating: 4.5, beds: 14, specialties: ["Emergency", "Internal Medicine", "Cardiology", "Gastroenterology"], insurance: ["Star Health", "New India Assurance", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-20-66810000" },
  { name: "Deenanath Mangeshkar Hospital", city: "Pune", area: "Erandwane", lat: 18.5060, lng: 73.8320, rating: 4.6, beds: 18, specialties: ["Cardiology", "Oncology", "Nephrology", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-20-66023000" },

  // Jaipur
  { name: "SMS Hospital", city: "Jaipur", area: "JLN Marg", lat: 26.8932, lng: 75.8069, rating: 4.4, beds: 48, specialties: ["Trauma", "Emergency", "General Surgery", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS", "Bhamashah"], verified: true, level: "Level I Trauma", phone: "+91-141-2518900" },
  { name: "Fortis Escorts Hospital", city: "Jaipur", area: "JLN Marg", lat: 26.8870, lng: 75.8100, rating: 4.7, beds: 20, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-141-2547000" },
  { name: "Narayana Multispeciality Hospital", city: "Jaipur", area: "Sector 28, Kumbha Marg", lat: 26.8500, lng: 75.7900, rating: 4.6, beds: 18, specialties: ["Cardiology", "Cardiac Surgery", "Nephrology", "Gastroenterology"], insurance: ["Ayushman Bharat", "Star Health", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-141-7130000" },

  // Ahmedabad
  { name: "Civil Hospital Ahmedabad", city: "Ahmedabad", area: "Asarwa", lat: 23.0504, lng: 72.6069, rating: 4.3, beds: 60, specialties: ["Trauma", "Emergency", "Burns", "General Surgery"], insurance: ["CGHS", "Ayushman Bharat", "MA Amrutam"], verified: true, level: "Level I Trauma", phone: "+91-79-22683721" },
  { name: "Sterling Hospital", city: "Ahmedabad", area: "Gurukul Road", lat: 23.0399, lng: 72.5336, rating: 4.6, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-79-40011111" },
  { name: "Apollo Hospitals Ahmedabad", city: "Ahmedabad", area: "Gandhinagar Highway", lat: 23.0700, lng: 72.5300, rating: 4.7, beds: 22, specialties: ["Cardiology", "Transplant", "Oncology", "Neurosciences"], insurance: ["Star Health", "Max Bupa", "HDFC Ergo", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-79-66701800" },

  // Lucknow
  { name: "KGMU Lucknow", city: "Lucknow", area: "Chowk", lat: 26.8570, lng: 80.9360, rating: 4.6, beds: 50, specialties: ["Trauma", "Cardiology", "Nephrology", "Neurology"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-522-2257540" },
  { name: "Medanta Hospital Lucknow", city: "Lucknow", area: "Shaheed Path", lat: 26.8020, lng: 81.0200, rating: 4.8, beds: 24, specialties: ["Cardiology", "Oncology", "Neurosciences", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-522-4505050" },

  // Chandigarh
  { name: "PGIMER Chandigarh", city: "Chandigarh", area: "Sector 12", lat: 30.7649, lng: 76.7756, rating: 4.9, beds: 55, specialties: ["Trauma", "Cardiology", "Neurology", "Nephrology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-172-2746018" },
  { name: "Fortis Hospital Mohali", city: "Chandigarh", area: "Mohali", lat: 30.7130, lng: 76.6960, rating: 4.7, beds: 22, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-172-4692222" },
  { name: "Max Super Speciality Hospital Mohali", city: "Chandigarh", area: "Mohali", lat: 30.7050, lng: 76.7210, rating: 4.6, beds: 18, specialties: ["Cardiology", "Oncology", "Gastroenterology", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "Max Bupa", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-172-6652000" },

  // Bhopal
  { name: "AIIMS Bhopal", city: "Bhopal", area: "Saket Nagar", lat: 23.2063, lng: 77.4480, rating: 4.8, beds: 40, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-755-2672317" },
  { name: "Bansal Hospital", city: "Bhopal", area: "Shahpura", lat: 23.1940, lng: 77.4370, rating: 4.5, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-755-4086000" },
  { name: "Chirayu Medical College", city: "Bhopal", area: "Bhainsakhedi", lat: 23.1750, lng: 77.4800, rating: 4.4, beds: 20, specialties: ["Emergency", "Internal Medicine", "Pediatrics", "Orthopedics"], insurance: ["Ayushman Bharat", "Star Health", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-755-4040404" },

  // Kochi
  { name: "Amrita Hospital Kochi", city: "Kochi", area: "Edappally", lat: 10.0322, lng: 76.2890, rating: 4.8, beds: 30, specialties: ["Cardiology", "Oncology", "Neurosciences", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-484-2801234" },
  { name: "Aster Medcity", city: "Kochi", area: "Cheranalloor", lat: 10.0070, lng: 76.3110, rating: 4.7, beds: 24, specialties: ["Cardiology", "Oncology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "Bajaj Allianz", "HDFC Ergo", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-484-6699999" },
  { name: "Medical Trust Hospital", city: "Kochi", area: "MG Road", lat: 9.9710, lng: 76.2850, rating: 4.5, beds: 16, specialties: ["Emergency", "Internal Medicine", "Cardiology", "Nephrology"], insurance: ["Star Health", "New India Assurance", "United India"], verified: true, level: "Multi Speciality", phone: "+91-484-2358001" },

  // Guwahati
  { name: "GMCH Guwahati", city: "Guwahati", area: "Bhangagarh", lat: 26.1700, lng: 91.7660, rating: 4.4, beds: 42, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-361-2529457" },
  { name: "Nemcare Hospital", city: "Guwahati", area: "Bhangagarh", lat: 26.1680, lng: 91.7700, rating: 4.5, beds: 16, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-361-2343000" },
  { name: "Excelcare Hospital", city: "Guwahati", area: "Six Mile", lat: 26.1520, lng: 91.8020, rating: 4.3, beds: 14, specialties: ["Emergency", "Internal Medicine", "Cardiology", "Gastroenterology"], insurance: ["Star Health", "Bajaj Allianz", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-361-2301300" },

  // Thiruvananthapuram
  { name: "Sree Chitra Tirunal Institute", city: "Thiruvananthapuram", area: "Medical College", lat: 8.5140, lng: 76.9460, rating: 4.9, beds: 28, specialties: ["Cardiology", "Cardiac Surgery", "Neurology", "Neurosurgery"], insurance: ["CGHS", "ECHS", "Ayushman Bharat", "KASP"], verified: true, level: "Super Speciality", phone: "+91-471-2524282" },
  { name: "KIMS Hospital", city: "Thiruvananthapuram", area: "Anayara", lat: 8.4780, lng: 76.9560, rating: 4.6, beds: 20, specialties: ["Cardiology", "Oncology", "Orthopedics", "Neurosciences"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "KASP"], verified: true, level: "Multi Speciality", phone: "+91-471-3041000" },

  // Patna
  { name: "AIIMS Patna", city: "Patna", area: "Phulwarisharif", lat: 25.5770, lng: 85.0700, rating: 4.7, beds: 35, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-612-2451070" },
  { name: "Paras HMRI Hospital", city: "Patna", area: "Raja Bazar", lat: 25.6180, lng: 85.1340, rating: 4.5, beds: 18, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-612-7107107" },
  { name: "Indira Gandhi Institute of Medical Sciences", city: "Patna", area: "Sheikhpura", lat: 25.6100, lng: 85.1700, rating: 4.4, beds: 30, specialties: ["Trauma", "Cardiology", "Nephrology", "General Surgery"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Multi Speciality", phone: "+91-612-2297631" },

  // Indore
  { name: "Choithram Hospital", city: "Indore", area: "Manik Bagh Road", lat: 22.6950, lng: 75.8540, rating: 4.5, beds: 20, specialties: ["Cardiology", "Nephrology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Ayushman Bharat", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-731-2362491" },
  { name: "Bombay Hospital Indore", city: "Indore", area: "Ring Road", lat: 22.7240, lng: 75.8680, rating: 4.6, beds: 22, specialties: ["Cardiology", "Oncology", "Neurosciences", "Transplant"], insurance: ["Star Health", "Bajaj Allianz", "ICICI Lombard", "HDFC Ergo"], verified: true, level: "Multi Speciality", phone: "+91-731-2558866" },

  // Coimbatore
  { name: "PSG Hospitals", city: "Coimbatore", area: "Peelamedu", lat: 11.0240, lng: 77.0250, rating: 4.7, beds: 24, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "New India Assurance", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-422-2570170" },
  { name: "GKNM Hospital", city: "Coimbatore", area: "Pappanaickenpalayam", lat: 11.0170, lng: 76.9600, rating: 4.6, beds: 18, specialties: ["Cardiology", "Nephrology", "Gastroenterology", "Oncology"], insurance: ["Star Health", "Bajaj Allianz", "Ayushman Bharat", "United India"], verified: true, level: "Multi Speciality", phone: "+91-422-2215555" },
  { name: "Kovai Medical Center", city: "Coimbatore", area: "Avinashi Road", lat: 11.0290, lng: 77.0040, rating: 4.5, beds: 20, specialties: ["Cardiology", "Orthopedics", "Neurology", "Transplant"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Max Bupa"], verified: true, level: "Multi Speciality", phone: "+91-422-4323800" },

  // Visakhapatnam
  { name: "King George Hospital", city: "Visakhapatnam", area: "Maharanipeta", lat: 17.7150, lng: 83.3060, rating: 4.3, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Aarogyasri"], verified: true, level: "Level I Trauma", phone: "+91-891-2564891" },
  { name: "CARE Hospitals Vizag", city: "Visakhapatnam", area: "Ramnagar", lat: 17.7270, lng: 83.3190, rating: 4.6, beds: 18, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Aarogyasri", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-891-3041444" },

  // ========== TIER-2 / SEMI-URBAN CITIES ==========

  // Nagpur
  { name: "Government Medical College Nagpur", city: "Nagpur", area: "Hanuman Nagar", lat: 21.1485, lng: 79.0842, rating: 4.3, beds: 45, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Mahatma Phule Jan Arogya"], verified: true, level: "Level I Trauma", phone: "+91-712-2722367" },
  { name: "KIMS Kingsway Hospital", city: "Nagpur", area: "Kingsway", lat: 21.1574, lng: 79.0728, rating: 4.5, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-712-2460000" },
  { name: "Wockhardt Hospital Nagpur", city: "Nagpur", area: "Shankar Nagar", lat: 21.1390, lng: 79.0635, rating: 4.4, beds: 14, specialties: ["Cardiology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-712-6613000" },

  // Varanasi
  { name: "BHU - Sir Sunderlal Hospital", city: "Varanasi", area: "Lanka", lat: 25.2677, lng: 83.0166, rating: 4.6, beds: 50, specialties: ["Trauma", "Cardiology", "Neurology", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-542-2307002" },
  { name: "Heritage Hospital", city: "Varanasi", area: "Lanka", lat: 25.2730, lng: 83.0000, rating: 4.4, beds: 14, specialties: ["Cardiology", "Nephrology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-542-2220222" },

  // Agra
  { name: "S.N. Medical College", city: "Agra", area: "Hospital Road", lat: 27.1882, lng: 78.0068, rating: 4.2, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Pediatrics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-562-2260362" },
  { name: "Pushpanjali Hospital", city: "Agra", area: "Delhi Gate", lat: 27.1950, lng: 78.0230, rating: 4.4, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurology", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-562-2530277" },

  // Madurai
  { name: "Government Rajaji Hospital", city: "Madurai", area: "Panagal Road", lat: 9.9195, lng: 78.1193, rating: 4.3, beds: 50, specialties: ["Trauma", "Emergency", "General Surgery", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "CMCHIS"], verified: true, level: "Level I Trauma", phone: "+91-452-2532535" },
  { name: "Meenakshi Mission Hospital", city: "Madurai", area: "Lake Area", lat: 9.9060, lng: 78.1300, rating: 4.6, beds: 20, specialties: ["Cardiology", "Oncology", "Neurosciences", "Orthopedics"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-452-4288888" },
  { name: "Apollo Hospitals Madurai", city: "Madurai", area: "KK Nagar", lat: 9.9300, lng: 78.0900, rating: 4.5, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "Bajaj Allianz", "CMCHIS"], verified: true, level: "Multi Speciality", phone: "+91-452-4244444" },

  // Ranchi
  { name: "RIMS Ranchi", city: "Ranchi", area: "Bariatu", lat: 23.3690, lng: 85.3300, rating: 4.4, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-651-2540629" },
  { name: "Medica Superspecialty Hospital Ranchi", city: "Ranchi", area: "Harmu", lat: 23.3600, lng: 85.3000, rating: 4.5, beds: 16, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-651-7106100" },

  // Raipur
  { name: "AIIMS Raipur", city: "Raipur", area: "Tatibandh", lat: 21.2840, lng: 81.6040, rating: 4.7, beds: 35, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-771-2572249" },
  { name: "Ramkrishna CARE Hospital", city: "Raipur", area: "Aurobindo Enclave", lat: 21.2400, lng: 81.6350, rating: 4.5, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Ayushman Bharat", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-771-4020000" },

  // Dehradun
  { name: "AIIMS Rishikesh", city: "Dehradun", area: "Rishikesh", lat: 30.0869, lng: 78.2676, rating: 4.8, beds: 40, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-135-2462930" },
  { name: "Max Super Speciality Hospital Dehradun", city: "Dehradun", area: "Mussoorie Road", lat: 30.3400, lng: 78.0600, rating: 4.6, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Max Bupa", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-135-6673000" },

  // Mysore
  { name: "K.R. Hospital", city: "Mysore", area: "Irwin Road", lat: 12.3050, lng: 76.6550, rating: 4.3, beds: 35, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Arogya Karnataka"], verified: true, level: "Level I Trauma", phone: "+91-821-2520043" },
  { name: "Apollo BGS Hospitals", city: "Mysore", area: "Adichunchanagiri Road", lat: 12.2800, lng: 76.6250, rating: 4.6, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-821-2568888" },
  { name: "JSS Hospital", city: "Mysore", area: "MG Road", lat: 12.3100, lng: 76.6400, rating: 4.5, beds: 22, specialties: ["Cardiology", "Nephrology", "Orthopedics", "Oncology"], insurance: ["Ayushman Bharat", "Star Health", "Arogya Karnataka"], verified: true, level: "Multi Speciality", phone: "+91-821-2548400" },

  // Jodhpur
  { name: "AIIMS Jodhpur", city: "Jodhpur", area: "Basni Phase II", lat: 26.2500, lng: 72.9950, rating: 4.7, beds: 35, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-291-2740741" },
  { name: "MDM Hospital", city: "Jodhpur", area: "Shastri Nagar", lat: 26.2780, lng: 73.0190, rating: 4.3, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "Bhamashah"], verified: true, level: "Level I Trauma", phone: "+91-291-2636041" },

  // Udaipur
  { name: "MB Hospital", city: "Udaipur", area: "Chetak Circle", lat: 24.5820, lng: 73.6930, rating: 4.2, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Bhamashah"], verified: true, level: "District Hospital", phone: "+91-294-2528811" },
  { name: "GBH American Hospital", city: "Udaipur", area: "Hiran Magri", lat: 24.5700, lng: 73.7300, rating: 4.5, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-294-2451500" },

  // Allahabad (Prayagraj)
  { name: "Swaroop Rani Nehru Hospital", city: "Allahabad", area: "Lowther Road", lat: 25.4400, lng: 81.8430, rating: 4.2, beds: 35, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-532-2256720" },
  { name: "Kamla Nehru Hospital", city: "Allahabad", area: "Tagore Town", lat: 25.4500, lng: 81.8500, rating: 4.3, beds: 20, specialties: ["Gynecology", "Pediatrics", "Emergency", "Internal Medicine"], insurance: ["Ayushman Bharat", "Star Health"], verified: true, level: "District Hospital", phone: "+91-532-2407021" },

  // Tiruchirappalli (Trichy)
  { name: "Mahatma Gandhi Memorial Government Hospital", city: "Tiruchirappalli", area: "Puthur", lat: 10.8100, lng: 78.6900, rating: 4.3, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "CMCHIS"], verified: true, level: "Level I Trauma", phone: "+91-431-2407576" },
  { name: "Kaveri Medical Center", city: "Tiruchirappalli", area: "Cantonment", lat: 10.8000, lng: 78.7050, rating: 4.5, beds: 16, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-431-4077777" },

  // Jalandhar
  { name: "Civil Hospital Jalandhar", city: "Jalandhar", area: "Grand Trunk Road", lat: 31.3200, lng: 75.5700, rating: 4.2, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Pediatrics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "District Hospital", phone: "+91-181-2222054" },
  { name: "Ivy Hospital", city: "Jalandhar", area: "Pathankot Road", lat: 31.3400, lng: 75.5550, rating: 4.5, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-181-5077777" },

  // Mangalore
  { name: "KMC Hospital Mangalore", city: "Mangalore", area: "Attavar", lat: 12.8700, lng: 74.8420, rating: 4.7, beds: 30, specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "Star Health", "Arogya Karnataka"], verified: true, level: "Multi Speciality", phone: "+91-824-2445858" },
  { name: "AJ Hospital", city: "Mangalore", area: "Kuntikana", lat: 12.9000, lng: 74.8500, rating: 4.5, beds: 18, specialties: ["Cardiology", "Orthopedics", "Gastroenterology", "Nephrology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-824-2225533" },

  // Siliguri
  { name: "North Bengal Medical College", city: "Siliguri", area: "Sushruta Nagar", lat: 26.7100, lng: 88.4200, rating: 4.3, beds: 35, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "Level I Trauma", phone: "+91-353-2585266" },
  { name: "Desun Hospital Siliguri", city: "Siliguri", area: "Matigara", lat: 26.6900, lng: 88.3800, rating: 4.4, beds: 14, specialties: ["Cardiology", "Neurosciences", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Swasthya Sathi"], verified: true, level: "Multi Speciality", phone: "+91-353-2544544" },

  // Hubli-Dharwad
  { name: "KIMS Hubli", city: "Hubli", area: "Vidyanagar", lat: 15.3700, lng: 75.1200, rating: 4.5, beds: 30, specialties: ["Trauma", "Cardiology", "Neurology", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "Arogya Karnataka"], verified: true, level: "Level I Trauma", phone: "+91-836-2378888" },
  { name: "SDM College of Medical Sciences", city: "Dharwad", area: "Sattur", lat: 15.4600, lng: 75.0150, rating: 4.4, beds: 22, specialties: ["Cardiology", "Orthopedics", "Pediatrics", "General Surgery"], insurance: ["Ayushman Bharat", "Arogya Karnataka", "Star Health"], verified: true, level: "Multi Speciality", phone: "+91-836-2462692" },

  // Gorakhpur
  { name: "BRD Medical College", city: "Gorakhpur", area: "Medical College Road", lat: 26.7500, lng: 83.3700, rating: 4.2, beds: 40, specialties: ["Trauma", "Pediatrics", "Emergency", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-551-2505091" },
  { name: "Provident Hospital", city: "Gorakhpur", area: "Golghar", lat: 26.7650, lng: 83.3800, rating: 4.3, beds: 12, specialties: ["Cardiology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-551-2334455" },

  // Cuttack
  { name: "SCB Medical College", city: "Cuttack", area: "Mangalabag", lat: 20.4700, lng: 85.8800, rating: 4.4, beds: 45, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Biju Swasthya Kalyan Yojana"], verified: true, level: "Level I Trauma", phone: "+91-671-2414080" },
  { name: "Ashwini Hospital", city: "Cuttack", area: "Sector 1", lat: 20.4600, lng: 85.8900, rating: 4.3, beds: 14, specialties: ["Cardiology", "Orthopedics", "Nephrology", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Biju Swasthya Kalyan Yojana"], verified: true, level: "Multi Speciality", phone: "+91-671-2365095" },

  // Jammu
  { name: "Government Medical College Jammu", city: "Jammu", area: "Bakshi Nagar", lat: 32.7300, lng: 74.8600, rating: 4.3, beds: 35, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS", "AB-PMJAY SEHAT"], verified: true, level: "Level I Trauma", phone: "+91-191-2584235" },
  { name: "Acharya Shri Chander College of Medical Sciences", city: "Jammu", area: "Sidhra", lat: 32.7500, lng: 74.9000, rating: 4.4, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences"], insurance: ["Star Health", "HDFC Ergo", "AB-PMJAY SEHAT"], verified: true, level: "Multi Speciality", phone: "+91-191-2584800" },

  // Aurangabad
  { name: "Government Medical College Aurangabad", city: "Aurangabad", area: "Panchakki Road", lat: 19.8800, lng: 75.3300, rating: 4.2, beds: 38, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Mahatma Phule Jan Arogya"], verified: true, level: "Level I Trauma", phone: "+91-240-2400400" },
  { name: "MGM Hospital Aurangabad", city: "Aurangabad", area: "N-6, Cidco", lat: 19.8900, lng: 75.3600, rating: 4.5, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Mahatma Phule Jan Arogya"], verified: true, level: "Multi Speciality", phone: "+91-240-2482682" },

  // Amritsar
  { name: "Government Medical College Amritsar", city: "Amritsar", area: "Circular Road", lat: 31.6300, lng: 74.8700, rating: 4.3, beds: 35, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-183-2221095" },
  { name: "Fortis Escorts Hospital Amritsar", city: "Amritsar", area: "Majitha Road", lat: 31.6500, lng: 74.8600, rating: 4.6, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz", "ICICI Lombard"], verified: true, level: "Multi Speciality", phone: "+91-183-5011222" },

  // Vijayawada
  { name: "Government General Hospital Vijayawada", city: "Vijayawada", area: "Eluru Road", lat: 16.5100, lng: 80.6300, rating: 4.2, beds: 40, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Aarogyasri", "NTR Vaidya Seva"], verified: true, level: "Level I Trauma", phone: "+91-866-2577244" },
  { name: "Manipal Hospital Vijayawada", city: "Vijayawada", area: "Tadepalli", lat: 16.4800, lng: 80.6400, rating: 4.5, beds: 16, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Oncology"], insurance: ["Star Health", "HDFC Ergo", "Aarogyasri", "NTR Vaidya Seva"], verified: true, level: "Multi Speciality", phone: "+91-866-2455555" },

  // Nashik
  { name: "Civil Hospital Nashik", city: "Nashik", area: "Old Agra Road", lat: 20.0000, lng: 73.7900, rating: 4.2, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Mahatma Phule Jan Arogya"], verified: true, level: "District Hospital", phone: "+91-253-2308805" },
  { name: "Wockhardt Hospital Nashik", city: "Nashik", area: "Bytco Point", lat: 19.9900, lng: 73.7800, rating: 4.4, beds: 14, specialties: ["Cardiology", "Orthopedics", "Neurosciences"], insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"], verified: true, level: "Multi Speciality", phone: "+91-253-6606060" },

  // Nellore
  { name: "Government General Hospital Nellore", city: "Nellore", area: "Dargamitta", lat: 14.4400, lng: 79.9800, rating: 4.1, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["Ayushman Bharat", "Aarogyasri", "NTR Vaidya Seva"], verified: true, level: "District Hospital", phone: "+91-861-2314457" },
  { name: "Narayana Medical College Hospital", city: "Nellore", area: "Chinthareddypalem", lat: 14.4300, lng: 79.9700, rating: 4.4, beds: 18, specialties: ["Cardiology", "Orthopedics", "Nephrology", "Gastroenterology"], insurance: ["Star Health", "Aarogyasri", "HDFC Ergo"], verified: true, level: "Multi Speciality", phone: "+91-861-2317963" },

  // Shimla
  { name: "IGMC Shimla", city: "Shimla", area: "Ridge", lat: 31.1070, lng: 77.1700, rating: 4.5, beds: 30, specialties: ["Trauma", "Emergency", "Cardiology", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS", "HIMCARE"], verified: true, level: "Level I Trauma", phone: "+91-177-2804251" },
  { name: "Kamla Nehru Hospital Shimla", city: "Shimla", area: "Ridge", lat: 31.1050, lng: 77.1750, rating: 4.3, beds: 16, specialties: ["Gynecology", "Pediatrics", "Emergency", "Internal Medicine"], insurance: ["Ayushman Bharat", "HIMCARE"], verified: true, level: "District Hospital", phone: "+91-177-2651149" },

  // Shillong
  { name: "NEIGRIHMS", city: "Shillong", area: "Mawdiangdiang", lat: 25.5700, lng: 91.8800, rating: 4.6, beds: 25, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Super Speciality", phone: "+91-364-2538013" },
  { name: "Civil Hospital Shillong", city: "Shillong", area: "Laitumkhrah", lat: 25.5750, lng: 91.8900, rating: 4.2, beds: 18, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Pediatrics"], insurance: ["Ayushman Bharat", "Megha Health Insurance Scheme"], verified: true, level: "District Hospital", phone: "+91-364-2224216" },

  // Gangtok
  { name: "STNM Hospital", city: "Gangtok", area: "Socheygang", lat: 27.3400, lng: 88.6100, rating: 4.3, beds: 18, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "District Hospital", phone: "+91-3592-202053" },
  { name: "CRH Hospital Manipal", city: "Gangtok", area: "Tadong", lat: 27.3300, lng: 88.6000, rating: 4.4, beds: 14, specialties: ["Cardiology", "Orthopedics", "Nephrology", "Emergency"], insurance: ["Star Health", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-3592-270425" },

  // Imphal
  { name: "RIMS Imphal", city: "Imphal", area: "Lamphelpat", lat: 24.8100, lng: 93.9400, rating: 4.4, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS", "CMHT"], verified: true, level: "Level I Trauma", phone: "+91-385-2414615" },
  { name: "JNIMS Imphal", city: "Imphal", area: "Porompat", lat: 24.8200, lng: 93.9500, rating: 4.3, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurology", "Pediatrics"], insurance: ["Ayushman Bharat", "CMHT"], verified: true, level: "Multi Speciality", phone: "+91-385-2445812" },

  // Dibrugarh
  { name: "Assam Medical College Hospital", city: "Dibrugarh", area: "Barbari", lat: 27.4700, lng: 94.9100, rating: 4.3, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-373-2300080" },
  { name: "Sanjeevani Hospital", city: "Dibrugarh", area: "Mohanbari", lat: 27.4800, lng: 94.9200, rating: 4.2, beds: 12, specialties: ["Cardiology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-373-2310567" },

  // Agartala
  { name: "GBP Hospital", city: "Agartala", area: "Old Motorstand", lat: 23.8300, lng: 91.2800, rating: 4.2, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-381-2326262" },
  { name: "Agartala Government Medical College", city: "Agartala", area: "Kunjaban", lat: 23.8400, lng: 91.2900, rating: 4.3, beds: 20, specialties: ["Cardiology", "Orthopedics", "Pediatrics", "General Surgery"], insurance: ["Ayushman Bharat", "ECHS"], verified: true, level: "Multi Speciality", phone: "+91-381-2341003" },

  // Aizawl
  { name: "Civil Hospital Aizawl", city: "Aizawl", area: "Dawrpui", lat: 23.7300, lng: 92.7200, rating: 4.2, beds: 20, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Pediatrics"], insurance: ["Ayushman Bharat", "MHIS"], verified: true, level: "District Hospital", phone: "+91-389-2322230" },
  { name: "Zoram Medical College", city: "Aizawl", area: "Falkawn", lat: 23.7100, lng: 92.7100, rating: 4.3, beds: 16, specialties: ["Trauma", "Cardiology", "Orthopedics", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "MHIS"], verified: true, level: "Multi Speciality", phone: "+91-389-2348210" },

  // ========== SMALL TOWNS / RURAL ==========

  // Vellore
  { name: "Christian Medical College Vellore", city: "Vellore", area: "Ida Scudder Road", lat: 12.9249, lng: 79.1325, rating: 4.9, beds: 50, specialties: ["Cardiology", "Neurology", "Oncology", "Nephrology", "Transplant"], insurance: ["CGHS", "Ayushman Bharat", "Star Health", "New India Assurance"], verified: true, level: "Multi Speciality", phone: "+91-416-2281000" },
  { name: "Government Vellore Medical College Hospital", city: "Vellore", area: "Adukamparai", lat: 12.9300, lng: 79.1400, rating: 4.2, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Orthopedics"], insurance: ["Ayushman Bharat", "CMCHIS"], verified: true, level: "District Hospital", phone: "+91-416-2263311" },

  // Kalyani
  { name: "ICARE Institute of Medical Sciences", city: "Kalyani", area: "Kalyani Township", lat: 22.9750, lng: 88.4350, rating: 4.3, beds: 18, specialties: ["Cardiology", "Orthopedics", "Gastroenterology", "Nephrology"], insurance: ["Star Health", "Swasthya Sathi", "HDFC Ergo"], verified: true, level: "Multi Speciality", phone: "+91-33-25820200" },
  { name: "Kalyani JNM Hospital", city: "Kalyani", area: "JNM Campus", lat: 22.9800, lng: 88.4300, rating: 4.1, beds: 14, specialties: ["Emergency", "General Surgery", "Internal Medicine"], insurance: ["Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "District Hospital", phone: "+91-33-25828282" },

  // Wardha
  { name: "Mahatma Gandhi Institute of Medical Sciences", city: "Wardha", area: "Sevagram", lat: 20.7500, lng: 78.6400, rating: 4.5, beds: 20, specialties: ["Emergency", "Internal Medicine", "Orthopedics", "Pediatrics"], insurance: ["Ayushman Bharat", "Mahatma Phule Jan Arogya"], verified: true, level: "Multi Speciality", phone: "+91-7152-284341" },
  { name: "Datta Meghe Institute of Medical Sciences", city: "Wardha", area: "Sawangi", lat: 20.7400, lng: 78.5900, rating: 4.4, beds: 18, specialties: ["Cardiology", "Orthopedics", "Nephrology", "Gastroenterology"], insurance: ["Star Health", "Ayushman Bharat", "HDFC Ergo"], verified: true, level: "Multi Speciality", phone: "+91-7152-287701" },

  // Manipal (Karnataka)
  { name: "Kasturba Medical College Hospital", city: "Manipal", area: "Madhav Nagar", lat: 13.3520, lng: 74.7920, rating: 4.8, beds: 35, specialties: ["Cardiology", "Neurosciences", "Oncology", "Transplant", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "Star Health", "Arogya Karnataka"], verified: true, level: "Multi Speciality", phone: "+91-820-2922424" },

  // Rishikesh
  { name: "AIIMS Rishikesh", city: "Rishikesh", area: "Virbhadra Road", lat: 30.0869, lng: 78.2676, rating: 4.8, beds: 40, specialties: ["Trauma", "Cardiology", "Neurology", "Oncology", "Orthopedics"], insurance: ["CGHS", "ECHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-135-2462930" },

  // Raebareli
  { name: "District Hospital Raebareli", city: "Raebareli", area: "Civil Lines", lat: 26.2300, lng: 81.2300, rating: 3.9, beds: 15, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Pediatrics"], insurance: ["Ayushman Bharat"], verified: true, level: "District Hospital", phone: "+91-535-2210248" },

  // Bhagalpur
  { name: "JLNMCH Bhagalpur", city: "Bhagalpur", area: "Mayaganj", lat: 25.2400, lng: 86.9800, rating: 4.1, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-641-2400580" },

  // Darbhanga
  { name: "DMCH Darbhanga", city: "Darbhanga", area: "Laheriasarai", lat: 26.1500, lng: 85.8900, rating: 4.1, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-6272-222251" },

  // Siwan
  { name: "Sadar Hospital Siwan", city: "Siwan", area: "Mahatma Gandhi Road", lat: 26.2200, lng: 84.3600, rating: 3.8, beds: 12, specialties: ["Emergency", "General Surgery", "Internal Medicine"], insurance: ["Ayushman Bharat"], verified: true, level: "District Hospital", phone: "+91-6154-222345" },

  // Tezpur
  { name: "Kanaklata Civil Hospital", city: "Tezpur", area: "Mission Chariali", lat: 26.6300, lng: 92.7900, rating: 4.0, beds: 18, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Orthopedics"], insurance: ["Ayushman Bharat", "Atal Amrit Abhiyan"], verified: true, level: "District Hospital", phone: "+91-3712-255100" },

  // Jorhat
  { name: "Jorhat Medical College Hospital", city: "Jorhat", area: "Kushal Konwar Path", lat: 26.7500, lng: 94.2000, rating: 4.2, beds: 22, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Atal Amrit Abhiyan"], verified: true, level: "Level I Trauma", phone: "+91-376-2321178" },

  // Muzaffarpur
  { name: "SKMCH Muzaffarpur", city: "Muzaffarpur", area: "Kazi Muhammadpur", lat: 26.1200, lng: 85.3600, rating: 4.1, beds: 30, specialties: ["Trauma", "Emergency", "Pediatrics", "General Surgery"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-621-2240250" },

  // Jhansi
  { name: "MLB Medical College", city: "Jhansi", area: "Jhansi Fort Road", lat: 25.4500, lng: 78.5700, rating: 4.2, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-510-2320202" },

  // Dharwad
  { name: "SDM College of Medical Sciences", city: "Dharwad", area: "Sattur", lat: 15.4600, lng: 75.0100, rating: 4.4, beds: 22, specialties: ["Cardiology", "Orthopedics", "Pediatrics", "General Surgery"], insurance: ["Ayushman Bharat", "Arogya Karnataka", "Star Health"], verified: true, level: "Multi Speciality", phone: "+91-836-2462692" },

  // Raichur
  { name: "RIMS Raichur", city: "Raichur", area: "Hyderabad Road", lat: 16.2100, lng: 77.3500, rating: 4.1, beds: 20, specialties: ["Trauma", "Emergency", "General Surgery", "Pediatrics"], insurance: ["CGHS", "Ayushman Bharat", "Arogya Karnataka"], verified: true, level: "District Hospital", phone: "+91-8532-226422" },

  // Karimnagar
  { name: "Government General Hospital Karimnagar", city: "Karimnagar", area: "Jagtial Road", lat: 18.4400, lng: 79.1300, rating: 4.1, beds: 20, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["Ayushman Bharat", "Aarogyasri"], verified: true, level: "District Hospital", phone: "+91-878-2228755" },

  // Warangal
  { name: "MGM Hospital Warangal", city: "Warangal", area: "Chintal Basthi", lat: 17.9800, lng: 79.5900, rating: 4.3, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Aarogyasri"], verified: true, level: "Level I Trauma", phone: "+91-870-2461700" },

  // Tirunelveli
  { name: "Tirunelveli Medical College Hospital", city: "Tirunelveli", area: "High Ground", lat: 8.7100, lng: 77.7500, rating: 4.3, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "CMCHIS"], verified: true, level: "Level I Trauma", phone: "+91-462-2572736" },

  // Salem
  { name: "Government Mohan Kumaramangalam Medical College", city: "Salem", area: "Meyanur", lat: 11.6700, lng: 78.1500, rating: 4.2, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "CMCHIS"], verified: true, level: "Level I Trauma", phone: "+91-427-2311574" },
  { name: "SKS Hospital", city: "Salem", area: "Fairlands", lat: 11.6600, lng: 78.1400, rating: 4.4, beds: 14, specialties: ["Cardiology", "Orthopedics", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "CMCHIS"], verified: true, level: "Multi Speciality", phone: "+91-427-2444444" },

  // Thanjavur
  { name: "Thanjavur Medical College Hospital", city: "Thanjavur", area: "Medical College Road", lat: 10.7900, lng: 79.1400, rating: 4.3, beds: 30, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "CMCHIS"], verified: true, level: "Level I Trauma", phone: "+91-4362-231791" },

  // Bareilly
  { name: "Government Medical College Bareilly", city: "Bareilly", area: "Civil Lines", lat: 28.3700, lng: 79.4300, rating: 4.1, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Level I Trauma", phone: "+91-581-2510390" },

  // Aligarh
  { name: "JNMC - AMU Aligarh", city: "Aligarh", area: "AMU Campus", lat: 27.9100, lng: 78.0800, rating: 4.5, beds: 35, specialties: ["Trauma", "Cardiology", "Neurology", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-571-2720382" },

  // Bilaspur
  { name: "CIMS Bilaspur", city: "Bilaspur", area: "Koni", lat: 22.0800, lng: 82.1400, rating: 4.2, beds: 20, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "Multi Speciality", phone: "+91-7752-260230" },

  // Korba
  { name: "District Hospital Korba", city: "Korba", area: "Medical College Road", lat: 22.3600, lng: 82.7500, rating: 3.9, beds: 12, specialties: ["Emergency", "General Surgery", "Internal Medicine"], insurance: ["Ayushman Bharat"], verified: true, level: "District Hospital", phone: "+91-7759-243033" },

  // Hazaribagh
  { name: "Hazaribagh Medical College Hospital", city: "Hazaribagh", area: "Dariyabad", lat: 23.9900, lng: 85.3600, rating: 4.0, beds: 18, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Orthopedics"], insurance: ["CGHS", "Ayushman Bharat"], verified: true, level: "District Hospital", phone: "+91-6546-262250" },

  // Dhanbad
  { name: "PMCH Dhanbad", city: "Dhanbad", area: "Hirapur", lat: 23.7900, lng: 86.4300, rating: 4.2, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "ECHS"], verified: true, level: "Level I Trauma", phone: "+91-326-2203900" },

  // Purulia
  { name: "Purulia Government Medical College Hospital", city: "Purulia", area: "Court Compound", lat: 23.3300, lng: 86.3650, rating: 4.0, beds: 15, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Pediatrics"], insurance: ["Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "District Hospital", phone: "+91-3252-222221" },

  // Bankura
  { name: "Bankura Sammilani Medical College", city: "Bankura", area: "Lokepur", lat: 23.2400, lng: 87.0700, rating: 4.1, beds: 20, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "Level I Trauma", phone: "+91-3242-251076" },

  // Medinipur
  { name: "Midnapore Medical College", city: "Medinipur", area: "Vidyasagar Road", lat: 22.4200, lng: 87.3200, rating: 4.2, beds: 22, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "Level I Trauma", phone: "+91-3222-275368" },

  // Burdwan
  { name: "Burdwan Medical College", city: "Burdwan", area: "Baburbag", lat: 23.2300, lng: 87.8600, rating: 4.2, beds: 25, specialties: ["Trauma", "Emergency", "General Surgery", "Internal Medicine"], insurance: ["CGHS", "Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "Level I Trauma", phone: "+91-342-2564453" },

  // Malda
  { name: "Malda Medical College Hospital", city: "Malda", area: "English Bazar", lat: 25.0100, lng: 88.1400, rating: 4.0, beds: 18, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Pediatrics"], insurance: ["Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "District Hospital", phone: "+91-3512-253160" },

  // Asansol
  { name: "Asansol District Hospital", city: "Asansol", area: "GT Road", lat: 23.6900, lng: 86.9700, rating: 4.1, beds: 20, specialties: ["Emergency", "General Surgery", "Internal Medicine", "Orthopedics"], insurance: ["Ayushman Bharat", "Swasthya Sathi"], verified: true, level: "District Hospital", phone: "+91-341-2253600" },
  { name: "The Mission Hospital Durgapur", city: "Durgapur", area: "Bidhannagar", lat: 23.5200, lng: 87.3100, rating: 4.4, beds: 18, specialties: ["Cardiology", "Orthopedics", "Neurosciences", "Gastroenterology"], insurance: ["Star Health", "HDFC Ergo", "Swasthya Sathi"], verified: true, level: "Multi Speciality", phone: "+91-343-2564222" },
];

export const cities: CityEntry[] = [
  // Metro
  { name: "Delhi", lat: 28.6139, lng: 77.2090, tier: "Metro" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, tier: "Metro" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, tier: "Metro" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, tier: "Metro" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, tier: "Metro" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, tier: "Metro" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, tier: "Metro" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, tier: "Metro" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, tier: "Metro" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, tier: "Metro" },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, tier: "Metro" },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, tier: "Metro" },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, tier: "Metro" },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, tier: "Metro" },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, tier: "Metro" },
  { name: "Patna", lat: 25.6093, lng: 85.1376, tier: "Metro" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, tier: "Metro" },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, tier: "Metro" },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, tier: "Metro" },
  // Semi-Urban (Tier-2)
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, tier: "Semi-Urban" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, tier: "Semi-Urban" },
  { name: "Agra", lat: 27.1767, lng: 78.0081, tier: "Semi-Urban" },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, tier: "Semi-Urban" },
  { name: "Ranchi", lat: 23.3441, lng: 85.3096, tier: "Semi-Urban" },
  { name: "Raipur", lat: 21.2514, lng: 81.6296, tier: "Semi-Urban" },
  { name: "Dehradun", lat: 30.3165, lng: 78.0322, tier: "Semi-Urban" },
  { name: "Mysore", lat: 12.2958, lng: 76.6394, tier: "Semi-Urban" },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243, tier: "Semi-Urban" },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, tier: "Semi-Urban" },
  { name: "Allahabad", lat: 25.4358, lng: 81.8463, tier: "Semi-Urban" },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, tier: "Semi-Urban" },
  { name: "Jalandhar", lat: 31.3260, lng: 75.5762, tier: "Semi-Urban" },
  { name: "Mangalore", lat: 12.9141, lng: 74.8560, tier: "Semi-Urban" },
  { name: "Siliguri", lat: 26.7271, lng: 88.3953, tier: "Semi-Urban" },
  { name: "Hubli", lat: 15.3647, lng: 75.1240, tier: "Semi-Urban" },
  { name: "Gorakhpur", lat: 26.7606, lng: 83.3732, tier: "Semi-Urban" },
  { name: "Cuttack", lat: 20.4625, lng: 85.8830, tier: "Semi-Urban" },
  { name: "Jammu", lat: 32.7266, lng: 74.8570, tier: "Semi-Urban" },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433, tier: "Semi-Urban" },
  { name: "Amritsar", lat: 31.6340, lng: 74.8723, tier: "Semi-Urban" },
  { name: "Vijayawada", lat: 16.5062, lng: 80.6480, tier: "Semi-Urban" },
  { name: "Nashik", lat: 19.9975, lng: 73.7898, tier: "Semi-Urban" },
  { name: "Nellore", lat: 14.4426, lng: 79.9865, tier: "Semi-Urban" },
  { name: "Shimla", lat: 31.1048, lng: 77.1734, tier: "Semi-Urban" },
  { name: "Shillong", lat: 25.5788, lng: 91.8933, tier: "Semi-Urban" },
  { name: "Gangtok", lat: 27.3389, lng: 88.6065, tier: "Semi-Urban" },
  { name: "Imphal", lat: 24.8170, lng: 93.9368, tier: "Semi-Urban" },
  { name: "Dibrugarh", lat: 27.4728, lng: 94.9120, tier: "Semi-Urban" },
  { name: "Agartala", lat: 23.8315, lng: 91.2868, tier: "Semi-Urban" },
  { name: "Aizawl", lat: 23.7271, lng: 92.7176, tier: "Semi-Urban" },
  // Rural / Small towns
  { name: "Vellore", lat: 12.9165, lng: 79.1325, tier: "Rural" },
  { name: "Kalyani", lat: 22.9751, lng: 88.4345, tier: "Rural" },
  { name: "Wardha", lat: 20.7453, lng: 78.6022, tier: "Rural" },
  { name: "Manipal", lat: 13.3525, lng: 74.7928, tier: "Rural" },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, tier: "Rural" },
  { name: "Raebareli", lat: 26.2314, lng: 81.2331, tier: "Rural" },
  { name: "Bhagalpur", lat: 25.2425, lng: 86.9842, tier: "Rural" },
  { name: "Darbhanga", lat: 26.1542, lng: 85.8918, tier: "Rural" },
  { name: "Siwan", lat: 26.2218, lng: 84.3592, tier: "Rural" },
  { name: "Tezpur", lat: 26.6338, lng: 92.7926, tier: "Rural" },
  { name: "Jorhat", lat: 26.7509, lng: 94.2037, tier: "Rural" },
  { name: "Muzaffarpur", lat: 26.1209, lng: 85.3647, tier: "Rural" },
  { name: "Jhansi", lat: 25.4484, lng: 78.5685, tier: "Rural" },
  { name: "Dharwad", lat: 15.4589, lng: 75.0078, tier: "Rural" },
  { name: "Raichur", lat: 16.2076, lng: 77.3463, tier: "Rural" },
  { name: "Karimnagar", lat: 18.4386, lng: 79.1288, tier: "Rural" },
  { name: "Warangal", lat: 17.9784, lng: 79.5941, tier: "Rural" },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, tier: "Rural" },
  { name: "Salem", lat: 11.6643, lng: 78.1460, tier: "Rural" },
  { name: "Thanjavur", lat: 10.7870, lng: 79.1378, tier: "Rural" },
  { name: "Bareilly", lat: 28.3670, lng: 79.4304, tier: "Rural" },
  { name: "Aligarh", lat: 27.8974, lng: 78.0880, tier: "Rural" },
  { name: "Bilaspur", lat: 22.0797, lng: 82.1409, tier: "Rural" },
  { name: "Korba", lat: 22.3595, lng: 82.7501, tier: "Rural" },
  { name: "Hazaribagh", lat: 23.9921, lng: 85.3637, tier: "Rural" },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304, tier: "Rural" },
  { name: "Purulia", lat: 23.3321, lng: 86.3652, tier: "Rural" },
  { name: "Bankura", lat: 23.2324, lng: 87.0649, tier: "Rural" },
  { name: "Medinipur", lat: 22.4249, lng: 87.3199, tier: "Rural" },
  { name: "Burdwan", lat: 23.2324, lng: 87.8615, tier: "Rural" },
  { name: "Malda", lat: 25.0108, lng: 88.1411, tier: "Rural" },
  { name: "Asansol", lat: 23.6889, lng: 86.9661, tier: "Rural" },
  { name: "Durgapur", lat: 23.5204, lng: 87.3119, tier: "Rural" },
];

export const cityTierMap: Record<string, CityTier> = cities.reduce(
  (acc, c) => { acc[c.name] = c.tier; return acc; },
  {} as Record<string, CityTier>,
);

export const getHospitalTier = (h: Hospital): CityTier => cityTierMap[h.city] ?? "Semi-Urban";

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
