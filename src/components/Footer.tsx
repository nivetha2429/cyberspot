import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/data/products";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-background border-t border-border mt-2 md:mt-8 pb-24 md:pb-10">
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-12 text-center lg:text-left">
        <div>
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
            <img src={logo} alt="AARO Logo" className="h-14 sm:h-12 w-auto" />
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Your one-stop shop for premium phones and laptops at unbeatable prices. Experience the power of AARO Systems.</p>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-2 sm:mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
          <div className="grid grid-cols-2 gap-x-0 gap-y-1 text-xs sm:text-sm font-medium">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/offers" className="text-muted-foreground hover:text-primary transition-colors">Offers</Link>
            <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">Cart</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Contact Us</h4>
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-muted-foreground font-medium">
            <span className="flex items-center justify-center lg:justify-start gap-2"><Phone className="w-4 h-4 text-primary" /> +91 XXXXXXXXXX</span>
            <span className="flex items-center justify-center lg:justify-start gap-2"><Mail className="w-4 h-4 text-primary" /> support@aarosystems.com</span>
            <span className="flex items-center justify-center lg:justify-start gap-2"><MapPin className="w-4 h-4 text-primary" /> Karur, India</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-widest">Connect</h4>
          <div className="flex flex-col gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-all group">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110" /> @aarosystems
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-all group">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-10 pt-8 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
        © 2024 AARO SYSTEMS. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
