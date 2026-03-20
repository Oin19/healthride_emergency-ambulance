import { motion } from "framer-motion";
import { Smartphone, Navigation, Stethoscope, FileCheck } from "lucide-react";

const steps = [
  { icon: Smartphone, title: "Request Help", desc: "Tap the emergency button. Your location and profile are sent instantly." },
  { icon: Navigation, title: "AI Dispatch", desc: "Our algorithm finds the nearest, fastest ambulance and routes it to you." },
  { icon: Stethoscope, title: "Live Care", desc: "Paramedics treat you en route while the ER team prepares for your arrival." },
  { icon: FileCheck, title: "Seamless Billing", desc: "Insurance is pre-verified. You see transparent costs — no surprises." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-secondary">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-emergency tracking-wider uppercase">How It Works</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Help in 4 Simple Steps
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
            )}
            <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-gradient-emergency flex items-center justify-center mb-5 shadow-emergency">
              <s.icon className="w-8 h-8 text-emergency-foreground" />
            </div>
            <span className="text-xs font-semibold text-emergency mb-1 block">Step {i + 1}</span>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
