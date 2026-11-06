import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onRequestAmbulance?: () => void;
}

const HeroSection = ({ onRequestAmbulance }: HeroSectionProps) => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center bg-primary">
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            <span aria-hidden="true">{t("hero.title")}</span>
            <span className="sr-only">HealthRide: request an ambulance and follow it on the map</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl mb-8 font-body">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="emergency" size="lg" className="text-base px-8" onClick={onRequestAmbulance}>
              {t("hero.cta")}
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("hero.learn")}
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70 max-w-xl">{t("hero.warning")}</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
