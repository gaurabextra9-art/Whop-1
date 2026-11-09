import React from "react";
import { businessConfig } from "../config/business";
import { Star, ShieldCheck, Quote, AlertCircle } from "lucide-react";

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-24 bg-white text-slate-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reputation & Homeowner Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight mb-4">
            Trusted by Homeowners Across Austin
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From emergency repairs in Round Rock to full architectural replacements in Westlake, read how Summit Roofing delivers enduring quality and transparent pricing.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {businessConfig.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-contractor transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">5.0</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.content}"
                </p>
              </div>

              {/* Author & Project Details */}
              <div className="pt-4 border-t border-slate-200/80">
                <div className="font-heading font-bold text-slate-900 text-sm">
                  {rev.author}
                </div>
                <div className="text-xs text-slate-500">{rev.location}</div>
                <div className="text-[11px] font-medium text-accent mt-1 flex items-center gap-1">
                  <span>Project:</span> {rev.service}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5 max-w-4xl mx-auto">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Demonstration Notice: The testimonials above are illustrative sample records designed for website demonstration. Real roofing contractors can populate genuine customer feedback and verified Google/Angi reviews directly in <code>src/config/business.ts</code>.
          </span>
        </div>
      </div>
    </section>
  );
};
