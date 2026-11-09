import React from "react";
import { businessConfig } from "../config/business";
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface ContactProps {
  onRequestEstimate: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onRequestEstimate }) => {
  return (
    <section id="contact" className="py-24 bg-slate-950 text-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Company Details & Dispatch Info */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-slate-700">
              <Phone className="w-3.5 h-3.5" />
              <span>Contact & Rapid Dispatch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4 text-white">
              Speak with an Austin Roofing Specialist
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Need immediate storm restoration, an honest assessment of an active leak, or a comprehensive roof replacement proposal? Contact our local dispatch desk or request your free estimate online.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center text-accent shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Direct Phone</div>
                  <a
                    href={`tel:${businessConfig.company.phone.replace(/[^0-9]/g, "")}`}
                    className="text-lg font-bold text-white hover:text-accent transition-colors"
                  >
                    {businessConfig.company.displayPhone}
                  </a>
                  <div className="text-xs text-slate-400">24/7 Emergency Storm Tarping Available</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center text-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Email Inquiries</div>
                  <a
                    href={`mailto:${businessConfig.company.email}`}
                    className="text-base font-semibold text-white hover:text-accent transition-colors"
                  >
                    {businessConfig.company.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center text-accent shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Austin Headquarters</div>
                  <div className="text-sm font-medium text-slate-200">
                    {businessConfig.company.address.street}
                  </div>
                  <div className="text-xs text-slate-400">
                    {businessConfig.company.address.city}, {businessConfig.company.address.state} {businessConfig.company.address.zip}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center text-accent shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Operating Hours</div>
                  <div className="text-sm text-slate-200">{businessConfig.company.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Estimate Request Quick Box */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
              <h3 className="text-2xl font-heading font-extrabold text-white mb-2">
                Fast-Track Your Free Estimate
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Our team provides free on-site inspections and honest itemized quotes across Austin and surrounding counties. Fill out our rapid estimate form to get started.
              </p>

              <div className="p-5 rounded-xl bg-slate-850 border border-slate-700 mb-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  What Happens Next:
                </div>
                <ol className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent text-white font-bold flex items-center justify-center text-[10px]">1</span>
                    <span>Your estimate details are immediately logged to our project queue via Whop Leads.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent text-white font-bold flex items-center justify-center text-[10px]">2</span>
                    <span>An Austin estimator reaches out via your preferred method within 2 business hours.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent text-white font-bold flex items-center justify-center text-[10px]">3</span>
                    <span>You receive an itemized proposal with clear material choices and zero high-pressure sales.</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={onRequestEstimate}
                className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 focus-ring cursor-pointer"
              >
                <span>Open Estimate Request Form</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
