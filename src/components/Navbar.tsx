import React, { useState, useEffect } from "react";
import { businessConfig } from "../config/business";
import { Shield, Phone, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  onRequestEstimate: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestEstimate, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Service Areas", href: "#service-areas" },
    { label: "Financing", href: "#financing" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-3"
          : "bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group focus-ring rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-copper-700 flex items-center justify-center shadow-md shadow-accent/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                SUMMIT <span className="text-accent font-semibold text-base">ROOFING</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Austin, Texas • Est. 2014
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150 relative py-1 focus-ring rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Phone Quick Call */}
            <a
              href={`tel:${businessConfig.company.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-200 hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/50 focus-ring"
            >
              <Phone className="w-4 h-4 text-accent animate-pulse" />
              <span>{businessConfig.company.displayPhone}</span>
            </a>

            {/* Admin Link */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-ring"
              title="Open Contractor Admin / Project Portal"
              aria-label="Admin Portal"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={onRequestEstimate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-md shadow-accent/25 hover:shadow-accent/40 active:scale-95 transition-all duration-150 focus-ring cursor-pointer"
            >
              <span>Get Free Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-400 hover:text-white focus-ring rounded-lg"
              aria-label="Admin Portal"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus-ring cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <a
              href={`tel:${businessConfig.company.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 text-white rounded-lg font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>Call {businessConfig.company.displayPhone}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestEstimate();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-sm shadow-md"
            >
              <span>Request a Free Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
