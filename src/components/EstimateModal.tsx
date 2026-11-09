import React, { useState } from "react";
import { businessConfig } from "../config/business";
import { trackEstimateRequested } from "../lib/tracking";
import { X, CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck } from "lucide-react";

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const EstimateModal: React.FC<EstimateModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [service, setService] = useState(preselectedService || "roof_replacement");
  const [propertyType, setPropertyType] = useState("Single Family (1-Story)");
  const [roofCondition, setRoofCondition] = useState("Storm / Hail Damage");
  const [preferredContact, setPreferredContact] = useState<"phone" | "email" | "text">("phone");
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !propertyAddress.trim() || !zipCode.trim()) {
      setErrorMsg("Please fill out all required fields to submit your estimate request.");
      return;
    }

    if (!consent) {
      setErrorMsg("Please authorize Summit Roofing to contact you regarding your roof estimate.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          propertyAddress,
          zipCode,
          service,
          propertyType,
          roofCondition,
          preferredContact,
          details,
          consent,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit estimate request.");
      }

      const returnedId = data.whopLeadId || data.leadId || `lead_${Date.now()}`;
      setSuccessLeadId(returnedId);

      // Trigger custom Whop pixel event AFTER verified lead creation
      trackEstimateRequested(returnedId, {
        service,
        zip: zipCode,
      });
    } catch (err: any) {
      console.error("Estimate submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessLeadId(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white">
              Request Your Free Roof Estimate
            </h3>
            <p className="text-xs text-slate-300">
              Austin & Central Texas Service Desk • Zero Obligation
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus-ring cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {successLeadId ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-heading font-extrabold text-slate-950">
                Estimate Request Confirmed!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your project inquiry has been securely registered in our system and synced to our Whop Lead queue.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-xs text-slate-600 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Lead Reference ID:</span>
                  <span className="font-mono text-accent font-bold">{successLeadId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Property:</span>
                  <span>{propertyAddress}, {zipCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Preferred Contact:</span>
                  <span className="capitalize">{preferredContact} ({phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Whop Event Fired:</span>
                  <span className="font-mono text-emerald-600 font-semibold">estimate_requested</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Done & Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(512) 555-0123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 78704"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus-ring"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Property Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="e.g. 1204 South Congress Ave"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus-ring"
                />
              </div>

              {/* Roofing Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Service Required *
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus-ring"
                  >
                    <option value="roof_repair">Roof Repair & Leaks</option>
                    <option value="roof_replacement">Full Roof Replacement</option>
                    <option value="roof_inspection">Certified Roof Inspection ($149)</option>
                    <option value="storm_damage">Storm & Hail Damage Restoration</option>
                    <option value="general_consultation">General Roofing Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus-ring"
                  >
                    <option value="Single Family (1-Story)">Single Family (1-Story)</option>
                    <option value="Single Family (2-Story)">Single Family (2-Story)</option>
                    <option value="Townhome / Condo">Townhome / Condo</option>
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Commercial / Office">Light Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Approximate Condition
                  </label>
                  <select
                    value={roofCondition}
                    onChange={(e) => setRoofCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus-ring"
                  >
                    <option value="Storm / Hail Damage">Storm / Hail Damage</option>
                    <option value="Active Water Leak">Active Water Leak</option>
                    <option value="Aging Shingles (15+ Years)">Aging Shingles (15+ Years)</option>
                    <option value="Granule Loss / Missing Shingles">Granule Loss / Missing Shingles</option>
                    <option value="Good Condition (Pre-sale Inspection)">Good Condition (Pre-sale)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Preferred Contact
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["phone", "email", "text"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPreferredContact(method)}
                        className={`py-2 text-xs font-semibold rounded-lg capitalize border ${
                          preferredContact === method
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Additional Project Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe damage location, ceiling stains, insurance adjuster status, or special access notes..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus-ring"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to allow Summit Roofing Co. to contact me via phone, email, or text regarding my roof estimate inquiry. My information is securely handled and never sold.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 focus-ring cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Lead to Whop API...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Free Estimate Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
