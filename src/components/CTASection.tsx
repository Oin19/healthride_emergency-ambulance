import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onRequestAmbulance?: () => void;
}

const CTASection = (_props: CTASectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Save patient details before you need them</h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
          Create an account and add your own or a family member's details, so the request form needs less typing in an emergency.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="emergency" size="lg" className="text-base px-8" onClick={() => navigate("/auth")}>Create an account</Button>
          <Button
            variant="hero"
            size="lg"
            className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
