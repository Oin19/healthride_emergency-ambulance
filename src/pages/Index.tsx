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

const Index = () => {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen">
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
