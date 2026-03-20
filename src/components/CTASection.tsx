import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const CTASection = () => (
  <section className="py-24 bg-gradient-hero relative overflow-hidden">
    {/* Decorative circles */}
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emergency/5" />
    <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emergency/5" />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-primary-foreground mb-4">
          Don't Wait for an Emergency <br /> to Be Prepared
        </h2>
        <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8 text-lg">
          Download HealthRide now. Set up your profile, add your insurance, and be ready when seconds matter.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="emergency" size="lg" className="text-base px-8">
            <Phone className="w-4 h-4 mr-2" /> Get the App
          </Button>
          <Button variant="hero" size="lg" className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
            Contact Sales
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
