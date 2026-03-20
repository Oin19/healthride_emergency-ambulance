import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-12 bg-background border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <div className="w-7 h-7 rounded-lg bg-gradient-emergency flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-emergency-foreground" />
          </div>
          HealthRide
        </a>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Careers</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 HealthRide. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
