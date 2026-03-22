import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Clock, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Clock, label: "Avg Response", value: "< 8 min" },
  { icon: MapPin, label: "Cities Covered", value: "120+" },
  { icon: Shield, label: "Lives Saved", value: "50K+" },
];

interface HeroSectionProps {
  onRequestAmbulance?: () => void;
}

const HeroSection = ({ onRequestAmbulance }: HeroSectionProps) => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero opacity-85" />
    </div>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="w-64 h-64 rounded-full border-2 border-emergency/30 animate-pulse-ring" />
      <div className="w-64 h-64 rounded-full border-2 border-emergency/20 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
    </div>

    <div className="container mx-auto px-4 relative z-10 pt-24">
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emergency/15 text-emergency-foreground text-sm font-medium mb-6 border border-emergency/20">
            <span className="w-2 h-2 rounded-full bg-emergency animate-pulse" />
            AI-Powered Emergency Response
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Every Second <br />
            <span className="text-gradient-emergency">Counts.</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-foreground/70 max-w-xl mb-8 font-body">
            HealthRide dispatches the nearest ambulance using AI, tracks it live, and connects you to the right hospital — with insurance handled before you arrive.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Button variant="emergency" size="lg" className="text-base px-8" onClick={onRequestAmbulance}>
              Request Ambulance Now
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              See How It Works
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 max-w-md"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <Icon className="w-5 h-5 text-emergency mx-auto mb-1" />
              <p className="font-display text-xl font-bold text-primary-foreground">{value}</p>
              <p className="text-xs text-primary-foreground/50">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
