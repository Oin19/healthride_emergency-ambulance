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

export const indianHospitals: Hospital[] = [
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
];

export const cities = [
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { name: "Patna", lat: 25.6093, lng: 85.1376 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
];

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
