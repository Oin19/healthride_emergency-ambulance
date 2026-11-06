import { MapPin, ClipboardList, UserCheck, Navigation } from "lucide-react";

const steps = [
  { icon: MapPin, title: "Share your location", desc: "Allow location access so the request carries your exact position." },
  { icon: ClipboardList, title: "Describe the emergency", desc: "Pick the emergency type or use voice input. Patient name and phone are optional." },
  { icon: UserCheck, title: "A driver accepts", desc: "Registered drivers in your city see the request. You see who accepted." },
  { icon: Navigation, title: "Track arrival", desc: "Follow the driver's position and estimated arrival until they reach you." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-16">From request to arrival</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={s.title} className="text-center">
            <div className="w-16 h-16 mx-auto rounded-md bg-primary flex items-center justify-center mb-5">
              <s.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-emergency mb-1 block">Step {i + 1}</span>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
