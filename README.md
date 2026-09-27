# HealthRide 🚑

### AI-Enabled Smart Ambulance Dispatch Platform

HealthRide is a smart emergency healthcare platform designed to reduce ambulance response time and improve coordination between patients, ambulance teams, and hospitals.

The platform brings emergency ambulance dispatch, live tracking, patient information, hospital discovery, and healthcare coordination into a single web application.

> **Project:** HealthRide  
> **Team:** VisionWiz  
> **Repository:** Oin19/healthride_emergency-ambulance

---

## 🚨 Problem

During medical emergencies, delays in ambulance dispatch, traffic congestion, limited visibility into ambulance location, and difficulty identifying suitable hospitals can critically affect response time.

HealthRide addresses these challenges through a centralized digital platform that connects patients, ambulance drivers, and hospitals.

---

## 💡 Solution

HealthRide provides a streamlined emergency workflow:

1. A patient initiates an emergency request.
2. The system identifies an appropriate nearby ambulance.
3. Ambulance and driver information is made available to the patient.
4. The patient can track the ambulance in real time.
5. Hospital options can be explored based on the patient's requirements.
6. Patient medical information can be made available to support emergency care.

The platform also supports non-emergency ambulance transportation and hospital selection.

---

## ✨ Key Features

### 🚑 Emergency Ambulance Dispatch
- One-tap emergency request workflow
- Ambulance request management
- Rapid dispatch from available ambulance resources
- Emergency status tracking

### 📍 Live Ambulance Tracking
- Real-time ambulance location
- Pickup and destination information
- Driver details and contact options
- Trip status visibility

### 🏥 Hospital Discovery
- Search and browse hospitals
- Hospital information and availability-oriented workflows
- Support for selecting preferred hospitals
- Insurance-aware hospital selection concept

### 👤 Patient Profiles
- Patient account management
- Multiple patient/family profiles
- Medical information and emergency notes
- Information such as blood group, allergies, and other relevant medical details

### 🤖 Emergency Triage
A conversational emergency-assistance workflow can collect basic information about an incident and help classify the urgency before an ambulance request is processed.

> The triage component is intended as an assistance layer and is not a replacement for professional medical diagnosis or emergency services.

### 🚗 Traffic-Aware Routing
The platform is designed around route optimization and real-time location information to help reduce avoidable delays during ambulance trips.

### 🏨 Hospital Administration
A hospital-side workflow supports management of incoming ambulance requests and coordination with emergency cases.

### 📊 Healthcare Coordination
HealthRide is designed to connect the three major participants in an emergency journey:

**Patient → Ambulance → Hospital**

---

## 🛠️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Recharts
- Framer Motion
- Lucide React

### Backend & Data
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

### Development & Testing
- ESLint
- Vitest
- Playwright
- Testing Library

---

## 🏗️ Architecture

High-level system flow:

```text
┌───────────────┐
│    Patient    │
└───────┬───────┘
        │
        ▼
┌──────────────────────┐
│ HealthRide Platform  │
│                      │
│ • Emergency Request  │
│ • Patient Profiles   │
│ • Hospital Search    │
│ • Live Tracking      │
│ • Triage Workflow    │
└───────┬──────────────┘
        │
   ┌────┴─────┐
   ▼          ▼
┌────────┐  ┌───────────┐
│Ambulance│  │ Hospitals │
│ Driver  │  │ / Admin   │
└────────┘  └───────────┘
```

---

## 📁 Project Structure

```text
healthride_emergency-ambulance/
├── public/
├── src/
│   ├── components/
│   ├── integrations/
│   │   └── supabase/
│   ├── pages/
│   ├── hooks/
│   └── ...
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Oin19/healthride_emergency-ambulance.git
cd healthride_emergency-ambulance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and provide the Supabase configuration required by the application:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown by Vite.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Create a development-mode build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Preview the production build |

---

## 🎯 Project Goals

HealthRide aims to explore how software, location-aware systems, and intelligent assistance can improve emergency transportation workflows.

The long-term vision includes:

- Faster ambulance dispatch
- Better emergency coordination
- Improved patient visibility
- Smarter hospital selection
- More efficient ambulance utilization
- Better communication between patients, drivers, and hospitals

---

## 🔮 Future Enhancements

Potential future development areas include:

- Advanced traffic-aware route optimization
- Predictive ambulance positioning
- Integration with additional hospital networks
- More comprehensive emergency triage
- IoT-enabled ambulance monitoring
- Advanced analytics dashboards
- Automated hospital capacity coordination
- Mobile applications for patients and drivers

---

## ⚠️ Disclaimer

HealthRide is a software project and prototype intended to demonstrate emergency healthcare coordination workflows.

It is **not a substitute for emergency medical services, professional medical advice, diagnosis, or treatment**. In a real emergency, users should contact their local emergency services.

---

## 👥 Team

**VisionWiz**

HealthRide is developed as a technology project focused on improving emergency ambulance coordination through software and intelligent systems.

---

## 📄 License

This project is currently intended for educational, research, and demonstration purposes.
