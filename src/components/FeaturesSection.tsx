import { MapPin, Navigation, Mic, Hospital, Users, Languages } from "lucide-react";

const features = [
  { icon: MapPin, title: "Location sharing", description: "Your browser's location is sent with the request so drivers know where to go." },
  { icon: Navigation, title: "Live driver tracking", description: "Once a driver accepts, you see their name, vehicle number and position on a map." },
  { icon: Mic, title: "Voice input", description: "Hold the button and describe the emergency in English, Hindi, Bengali, Tamil or Telugu. The form is filled from what you say, and you can edit it before sending." },
  { icon: Hospital, title: "Hospital directory", description: "Browse hospitals by city, specialty and accepted insurance. Listings are for reference, so confirm with the hospital before you travel." },
  { icon: Users, title: "Saved patient profiles", description: "Keep patient details for yourself and family members so requests need less typing." },
  { icon: Languages, title: "Five languages", description: "The interface is available in English, Hindi, Bengali, Tamil and Telugu." },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-16">What HealthRide does</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-md bg-secondary text-primary flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
