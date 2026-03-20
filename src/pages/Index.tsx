import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TrackingMapSection from "@/components/TrackingMapSection";
import HospitalFinderSection from "@/components/HospitalFinderSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <TrackingMapSection />
    <HospitalFinderSection />
    <HowItWorksSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
