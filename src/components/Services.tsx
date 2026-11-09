import React from "react";
import { businessConfig, ServiceItem } from "../config/business";
import { trackServiceViewed } from "../lib/tracking";
import { Shield, Wrench, Home, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onRequestEstimate: (preselectedService?: string) => void;
  onOpenCheckout: (planKey: "INSPECTION" | "DEPOSIT" | "MAINTENANCE") => void;
}

export const Services: React.FC<ServicesProps> = ({
  onSelectService,
  onRequestEstimate,
  onOpenCheckout,
}) => {
  const handleServiceClick = (service: ServiceItem) => {
    // Fire Whop custom tracking event: service_viewed
    trackServiceViewed(service.id);
    onSelectService(service);
  };

  return (
    <section id="services" className="py-24 bg-white text-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>Comprehensive Roofing Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight mb-4">
            Built for Texas Weather. Crafted to Last.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Whether repairing acute hail impact or installing a lifetime standing seam roof, our licensed crews deliver manufacturer-certified installations backed by full warranties.
          </p>
        </div>

        {/* 3 Primary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {businessConfig.services.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="group flex flex-col bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-contractor-lg transition-all duration-300"
              onMouseEnter={() => handleServiceClick(service)}
            >
              {/* Card Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                {service.badge && (
                  <span className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {service.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-accent-light tracking-wide uppercase">
                    Austin, TX Service
                  </span>
                  <h3 className="text-xl font-heading font-bold">{service.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Key Deliverables:
                  </h4>
                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 mb-4 font-medium italic">
                    {service.priceNote}
                  </div>

                  {service.whopPlanKey ? (
                    <button
                      onClick={() => onOpenCheckout(service.whopPlanKey as "INSPECTION")}
                      className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-md hover:shadow-accent/30 transition-all flex items-center justify-center gap-2 focus-ring cursor-pointer"
                    >
                      <span>Book Online (${service.priceAmount})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onRequestEstimate(service.id)}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 focus-ring cursor-pointer"
                    >
                      <span>Request Free Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flat-rate Maintenance & Project Deposit Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-accent/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Whop Payment Plans</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold mb-3">
                Seamless Digital Payments on Whop
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Take advantage of instant one-click booking for certified inspections, annual maintenance checkups, and secure project deposit payments with Apple Pay, Google Pay, and saved cards.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onOpenCheckout("DEPOSIT")}
                  className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-md flex items-center gap-2 focus-ring cursor-pointer"
                >
                  <span>Pay $500 Project Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenCheckout("MAINTENANCE")}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold border border-slate-700 flex items-center gap-2 focus-ring cursor-pointer"
                >
                  <span>$299 Annual Maintenance Visit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-850/80 p-5 rounded-xl border border-slate-700">
                <div className="text-accent font-extrabold text-2xl font-heading mb-1">$500 Deposit</div>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-2">Project Deposit Plan</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Locks your installation date and supplies. Card saved via setup intent for the remaining final balance.
                </p>
              </div>

              <div className="bg-slate-850/80 p-5 rounded-xl border border-slate-700">
                <div className="text-accent font-extrabold text-2xl font-heading mb-1">$299 Fixed</div>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-2">Maintenance Plan</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete preventive check, pipe boot reseal, and gutter junction tuning before storm season.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

