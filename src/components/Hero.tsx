import React from "react";
import { businessConfig } from "../config/business";
import { ShieldCheck, Award, Wrench, ArrowRight, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onRequestEstimate: () => void;
  onExploreServices: () => void;
  onBookInspection: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRequestEstimate,
  onExploreServices,
  onBookInspection,
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 bg-slate-950 overflow-hidden">
      {/* Background Architectural Roofing Image with Contrast Protection */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=2000&q=85"
          alt="Modern American Residential Roof in Austin TX"
          className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
        />
        {/* Gradients to guarantee 4.5:1 WCAG contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-850/90 border border-slate-700/80 text-accent text-xs sm:text-sm font-semibold mb-6 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-slate-200">Austin's Trusted Residential Roofing Specialists</span>
            <span className="text-accent">•</span>
            <span className="text-slate-400 font-normal">Est. {businessConfig.company.establishedYear}</span>
          </div>

          {/* Mandatory Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Protect Your Home. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-accent">
              Upgrade Your Roof.
            </span>
          </h1>

          {/* Mandatory Supporting Copy */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Reliable roofing solutions, expert craftsmanship, and honest pricing. From minor repairs to complete roof replacements, Summit Roofing keeps your home protected.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={onRequestEstimate}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-base font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 active:scale-[0.98] transition-all duration-150 focus-ring cursor-pointer"
            >
              <span>Request a Free Estimate</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreServices}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-base font-semibold active:scale-[0.98] transition-all duration-150 focus-ring cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-accent" />
              <span>Explore Our Services</span>
            </button>

            <button
              onClick={onBookInspection}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-4 text-sm font-semibold text-slate-300 hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              <span>Or Book $149 Inspection</span>
              <span className="text-xs bg-slate-800 text-accent px-2 py-0.5 rounded border border-slate-700">Online</span>
            </button>
          </div>

          {/* Key Value Prop Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>10-Year Workmanship Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Fully Insured ($2M Liability)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Central Texas Hail & Storm Experts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Metrics Band on Desktop */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-6">
          {businessConfig.trustMetrics.map((metric) => (
            <div key={metric.label} className="border-l border-slate-800 pl-4 first:border-0">
              <div className="text-2xl font-extrabold text-white font-heading">{metric.value}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
