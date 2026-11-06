import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
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
        <title>HealthRide | Ambulance requests and live tracking</title>
        <meta name="description" content="Request an ambulance in India, share your location, and follow the driver on a live map. Includes a hospital directory filtered by insurance and specialty." />
        <link rel="canonical" href="https://healthride-oin.lovable.app/" />
        <meta property="og:title" content="HealthRide | Ambulance requests and live tracking" />
        <meta property="og:description" content="Request an ambulance in India, share your location, and follow the driver on a live map. Includes a hospital directory filtered by insurance and specialty." />
        <meta property="og:url" content="https://healthride-oin.lovable.app/" />
      </Helmet>
      <Navbar />
      <HeroSection onRequestAmbulance={() => setEmergencyOpen(true)} />
      <FeaturesSection />
      <HospitalFinderSection />
      <HowItWorksSection />
      <CTASection onRequestAmbulance={() => setEmergencyOpen(true)} />
      <Footer />
      <EmergencyRequestModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
};

export default Index;
