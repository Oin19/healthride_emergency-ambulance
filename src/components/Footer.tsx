import { Phone, Mail, MapPin } from "lucide-react";
import healthrideLogo from "@/assets/healthride-logo.png";

const Footer = () => (
  <footer id="contact" className="py-12 bg-background border-t border-border">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-3">
            <img src={healthrideLogo} alt="" className="w-7 h-7" />
            HealthRide
          </a>
          <p className="text-sm text-muted-foreground">Ambulance requests, live driver tracking and a hospital directory.</p>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Contact & Support</h3>
          <div className="space-y-2.5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Oindrila Banerjee, CEO</p>
            <a href="tel:9330865494" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-4 h-4 text-accent" /> +91 9330865494
            </a>
            <a href="mailto:banerjeeoindrila40@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4 text-accent" /> banerjeeoindrila40@gmail.com
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Kolkata, West Bengal, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 HealthRide. All rights reserved.</p>
        <p className="text-xs text-accent font-medium">
          <a href="tel:112" className="hover:text-accent/80">Emergency: 112</a> | <a href="tel:108" className="hover:text-accent/80">Ambulance: 108</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
