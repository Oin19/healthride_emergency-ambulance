import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, ArrowLeft, Shield, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import healthrideLogo from "@/assets/healthride-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import EmergencyRequestModal from "@/components/EmergencyRequestModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { t } = useTranslation();
  const hash = (anchor: string) => (isHome ? `#${anchor}` : `/#${anchor}`);
  const links = [
    { key: "features", label: t("nav.features"), anchor: "features" },
    { key: "how", label: t("nav.how"), anchor: "how-it-works" },
    { key: "safety", label: t("nav.safety"), anchor: "safety" },
    { key: "contact", label: t("nav.contact"), anchor: "contact" },
  ];

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            {!isHome && (
              <button aria-label="Go back" onClick={() => { if (window.history.length > 1) { navigate(-1); } else { navigate("/"); } }} className="mr-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <a onClick={() => navigate("/")} className="flex items-center gap-2 font-display text-xl font-bold text-foreground cursor-pointer">
              <img src={healthrideLogo} alt="HealthRide" className="w-8 h-8" />
              HealthRide
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.key} href={hash(l.anchor)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
            <LanguageSwitcher />
            <Button variant="emergency" size="sm" onClick={() => setEmergencyOpen(true)}>{t("nav.request")}</Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/driver-auth")}>
              <Truck className="w-4 h-4" /> Driver Portal
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4" /> Admin
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => navigate(user ? "/profile" : "/auth")}>
              <UserCircle className="w-4 h-4" /> {user ? "Profile" : t("nav.signin")}
            </Button>
          </div>

          <button aria-label="Toggle menu" aria-expanded={open} className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
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
                  <a key={l.key} href={hash(l.anchor)} className="text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                ))}
                <div className="py-1"><LanguageSwitcher /></div>
                <Button variant="emergency" size="sm" onClick={() => { setOpen(false); setEmergencyOpen(true); }}>{t("nav.request")}</Button>
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); navigate("/driver-auth"); }}>
                  <Truck className="w-4 h-4" /> Driver Portal
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => { setOpen(false); navigate("/admin"); }}>
                    <Shield className="w-4 h-4" /> Admin
                  </Button>
                )}
                <Button variant="hero" size="sm" onClick={() => { setOpen(false); navigate(user ? "/profile" : "/auth"); }}>
                  <UserCircle className="w-4 h-4" /> {user ? "Profile" : t("nav.signin")}
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
