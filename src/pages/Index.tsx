import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TrackingMapSection from "@/components/TrackingMapSection";
import HospitalFinderSection from "@/components/HospitalFinderSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import EmergencyRequestModal from "@/components/EmergencyRequestModal";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>HealthRide — AI-Powered Emergency Ambulance Dispatch</title>
        <meta name="description" content="HealthRide dispatches the nearest ambulance using AI, provides live tracking, and connects patients to insurance-aware hospitals across 80+ Indian cities." />
        <link rel="canonical" href="https://healthride-oin.lovable.app/" />
        <meta property="og:title" content="HealthRide — AI-Powered Emergency Ambulance Dispatch" />
        <meta property="og:description" content="AI-driven ambulance dispatch with live GPS tracking and insurance pre-authorization across India." />
        <meta property="og:url" content="https://healthride-oin.lovable.app/" />
      </Helmet>
      <Navbar />
      <HeroSection onRequestAmbulance={() => setEmergencyOpen(true)} />
      <FeaturesSection />
      <TrackingMapSection />
      <HospitalFinderSection />
      <HowItWorksSection />
      <CTASection onRequestAmbulance={() => setEmergencyOpen(true)} />
      <Footer />
      <EmergencyRequestModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
};

export default Index;
