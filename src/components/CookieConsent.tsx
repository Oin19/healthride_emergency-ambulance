import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { setAnalyticsConsent } from "@/lib/analytics";

const STORAGE_KEY = "healthride_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    setAnalyticsConsent(stored === "accepted");
  }, []);

  const decide = (choice: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setAnalyticsConsent(choice === "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="container mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 backdrop-blur-lg shadow-elevated p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center">
                <Cookie className="w-4.5 h-4.5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                We use essential cookies to keep you signed in and optional ones to understand how HealthRide is used so we
                can dispatch faster. Read our{" "}
                <a href="/privacy" className="text-accent underline hover:text-accent/80">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => decide("rejected")}>
                Essential only
              </Button>
              <Button variant="emergency" size="sm" className="flex-1 sm:flex-none" onClick={() => decide("accepted")}>
                Accept all
              </Button>
              <button
                aria-label="Dismiss cookie banner"
                onClick={() => decide("rejected")}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
