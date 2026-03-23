import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import healthrideLogo from "@/assets/healthride-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import EmergencyRequestModal from "@/components/EmergencyRequestModal";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const links = ["Features", "How It Works", "Safety", "Contact"];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <a href="#" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <img src={healthrideLogo} alt="HealthRide" className="w-8 h-8" />
            HealthRide
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
            <Button variant="emergency" size="sm" onClick={() => setEmergencyOpen(true)}>Request Ambulance</Button>
            <Button variant="hero" size="sm" onClick={() => navigate(user ? "/profile" : "/auth")}>
              <UserCircle className="w-4 h-4" /> {user ? "Profile" : "Sign In"}
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-3">
                {links.map((l) => (
                  <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>
                    {l}
                  </a>
                ))}
                <Button variant="emergency" size="sm" onClick={() => { setOpen(false); setEmergencyOpen(true); }}>Request Ambulance</Button>
                <Button variant="hero" size="sm" onClick={() => { setOpen(false); navigate(user ? "/profile" : "/auth"); }}>
                  <UserCircle className="w-4 h-4" /> {user ? "Profile" : "Sign In"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <EmergencyRequestModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
};

export default Navbar;
