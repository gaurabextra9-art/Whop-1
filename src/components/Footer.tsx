import React from "react";
import { businessConfig } from "../config/business";
import { Shield, Phone, Mail, MapPin, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                SUMMIT <span className="text-accent">ROOFING</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              {businessConfig.company.tagline} Austin's premier residential roofing contractor dedicated to superior craftsmanship, storm resilience, and honest pricing.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>License: {businessConfig.company.license}</div>
              <div>Insurance: {businessConfig.company.insurance}</div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors">Roof Repair & Leaks</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Roof Replacement</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Roof Inspection ($149)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Maintenance Visit ($299)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Storm Hail Restoration</a></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Austin Metro
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#service-areas" className="hover:text-white transition-colors">Austin, TX</a></li>
              <li><a href="#service-areas" className="hover:text-white transition-colors">Round Rock, TX</a></li>
              <li><a href="#service-areas" className="hover:text-white transition-colors">Cedar Park, TX</a></li>
              <li><a href="#service-areas" className="hover:text-white transition-colors">Lakeway & Westlake</a></li>
              <li><a href="#service-areas" className="hover:text-white transition-colors">Pflugerville & Georgetown</a></li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href={`tel:${businessConfig.company.phone.replace(/[^0-9]/g, "")}`} className="hover:text-white transition-colors">
                  {businessConfig.company.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href={`mailto:${businessConfig.company.email}`} className="hover:text-white transition-colors text-xs truncate">
                  {businessConfig.company.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Austin, Texas, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice & Whop Technology Integration */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {businessConfig.company.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="text-slate-400 flex items-center gap-1">
              Payments & Commerce Powered by <span className="font-semibold text-white">Whop</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
