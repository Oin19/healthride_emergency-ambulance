import { motion } from "framer-motion";
import { Brain, MapPin, Hospital, CreditCard, Radio, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Dispatch",
    description: "Our AI engine analyzes traffic, distance, and hospital capacity to dispatch the optimal ambulance in seconds.",
    color: "emergency" as const,
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Real-time GPS tracking lets you and your family see exactly where the ambulance is and the estimated arrival.",
    color: "trust" as const,
  },
  {
    icon: Hospital,
    title: "Smart Hospital Match",
    description: "We match you to hospitals based on specialty needed, bed availability, and proximity — not just the closest one.",
    color: "success" as const,
  },
  {
    icon: CreditCard,
    title: "Insurance Pre-Auth",
    description: "Your insurance is verified and pre-authorized en route, so billing is transparent before you even arrive.",
    color: "emergency" as const,
  },
  {
    icon: Radio,
    title: "Paramedic Link",
    description: "Vital signs and patient data are transmitted live to the receiving ER team for instant preparation.",
    color: "trust" as const,
  },
  {
    icon: ShieldCheck,
    title: "Safety Assurance",
    description: "All vehicles, drivers, and medical staff are verified, insured, and meet our rigorous safety standards.",
    color: "success" as const,
  },
];

const colorMap = {
  emergency: "bg-emergency/10 text-emergency",
  trust: "bg-trust/10 text-trust",
  success: "bg-success/10 text-success",
};

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-emergency tracking-wider uppercase">Features</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Built for Emergencies
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Every feature is designed to save time, reduce confusion, and improve outcomes when it matters most.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-elevated transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${colorMap[f.color]} flex items-center justify-center mb-4`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
