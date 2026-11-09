import React from "react";
import { businessConfig } from "../config/business";
import { CreditCard, CheckCircle, ShieldAlert, ArrowRight, DollarSign } from "lucide-react";

interface FinancingProps {
  onExploreCheckout: () => void;
  onRequestEstimate: () => void;
}

export const Financing: React.FC<FinancingProps> = ({ onExploreCheckout, onRequestEstimate }) => {
  return (
    <section id="financing" className="py-24 bg-slate-50 text-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-accent/20">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Accessible Payment Flexibility</span>
          </div>

          {/* Mandatory Headline */}
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight mb-4">
            {businessConfig.financing.headline}
          </h2>

          {/* Mandatory Supporting Copy */}
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {businessConfig.financing.subheadline}
          </p>
        </div>

        {/* 3 Pillars of Financing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {businessConfig.financing.highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-contractor hover:shadow-contractor-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-accent mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">{h.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>

        {/* Action Callout Box */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h4 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Want to see available payment & deposit options?
            </h4>
            <p className="text-sm text-slate-600">
              Review project deposit and inspection checkout options powered securely by Whop Payment Elements.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button
              onClick={onExploreCheckout}
              className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 focus-ring cursor-pointer"
            >
              <span>View Payment Options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRequestEstimate}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all focus-ring cursor-pointer"
            >
              <span>Get Estimate First</span>
            </button>
          </div>
        </div>

        {/* Mandatory Explicit Regulatory Disclosure */}
        <div className="p-5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-500 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {businessConfig.financing.disclosure}
          </p>
        </div>
      </div>
    </section>
  );
};

