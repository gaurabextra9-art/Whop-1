import React, { useState } from "react";
import { businessConfig } from "../config/business";
import { MapPin, Check, Search, AlertCircle, Building2 } from "lucide-react";

export const ServiceAreas: React.FC = () => {
  const [searchZip, setSearchZip] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchZip.trim();
    if (!query) return;

    const matchedArea = businessConfig.serviceAreas.find(
      (a) => a.zipSample.includes(query) || a.city.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedArea) {
      setSearchResult(`✓ Yes! Summit Roofing actively services ${matchedArea.city} (${matchedArea.note}).`);
    } else {
      setSearchResult(`We service all of Greater Austin & Central Texas! Call us at ${businessConfig.company.displayPhone} to confirm immediate crew availability for ${query}.`);
    }
  };

  return (
    <section id="service-areas" className="py-20 bg-slate-900 text-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Coverage Summary */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-slate-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>Austin & Central Texas Service Area</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4 text-white">
              Local Crews. Rapid Storm Response Across Central Texas.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              Headquartered off South Congress in Austin, our mobile inspection and repair crews are stationed across the greater metroplex to reach your property quickly following storm, wind, or hail events.
            </p>

            {/* Quick Zip Code Check Form */}
            <form onSubmit={handleZipCheck} className="space-y-3 mb-6">
              <label htmlFor="zipInput" className="block text-xs font-bold uppercase text-slate-400 tracking-wider">
                Check Your City or ZIP Code:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="zipInput"
                    type="text"
                    value={searchZip}
                    onChange={(e) => setSearchZip(e.target.value)}
                    placeholder="Enter Austin ZIP (e.g. 78704, 78664)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Check Area
                </button>
              </div>
              {searchResult && (
                <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-accent-light flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{searchResult}</span>
                </div>
              )}
            </form>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Demonstration Notice: Service locations represent demonstration coverage. Business owners can customize coverage boundaries, dispatch radiuses, and travel policies in <code>src/config/business.ts</code>.
              </span>
            </div>
          </div>

          {/* Right Column: 8 Key Service Cities */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {businessConfig.serviceAreas.map((area) => (
                <div
                  key={area.city}
                  className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-accent/60 transition-colors shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-lg text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-accent" />
                      {area.city}, TX
                    </span>
                    <span className="text-[11px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      Active Dispatch
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">ZIPs:</span> {area.zipSample}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Neighborhoods:</span> {area.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
