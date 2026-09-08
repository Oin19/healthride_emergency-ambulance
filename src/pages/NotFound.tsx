import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Ambulance, Home, Phone, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Page Not Found — HealthRide</title>
        <meta name="description" content="The HealthRide page you are looking for could not be found. Return home or call the ambulance helpline for urgent help." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />

      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-emergency flex items-center justify-center mb-6">
            <Ambulance className="w-8 h-8 text-emergency-foreground" />
          </div>
          <p className="font-display text-6xl font-bold text-foreground mb-3">404</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            This page took a wrong turn
          </h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find <span className="font-medium text-foreground break-all">{location.pathname}</span>. If this is
            an emergency, don't wait — call the national ambulance helpline right now.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Button variant="emergency" size="lg" asChild>
              <a href="tel:102"><Phone className="w-4 h-4 mr-2" /> Call 102 Helpline</a>
            </Button>
            <Button variant="hero" size="lg" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { label: "Features", to: "/#features" },
              { label: "How It Works", to: "/#how-it-works" },
              { label: "Billing Guide", to: "/billing-guide" },
              { label: "Privacy Policy", to: "/privacy" },
            ].map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="rounded-xl border border-border bg-card px-3 py-3 text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" /> Still stuck? Email banerjeeoindrila40@gmail.com
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
