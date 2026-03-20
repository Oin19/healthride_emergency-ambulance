import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ["Features", "How It Works", "Safety", "Contact"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <div className="w-8 h-8 rounded-lg bg-gradient-emergency flex items-center justify-center">
            <Heart className="w-4 h-4 text-emergency-foreground" />
          </div>
          HealthRide
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
          <Button variant="emergency" size="sm">Request Ambulance</Button>
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
              <Button variant="emergency" size="sm">Request Ambulance</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
