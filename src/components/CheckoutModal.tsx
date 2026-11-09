import React, { useState, useEffect } from "react";
import { whopConfig, WhopPlanConfig } from "../config/whop";
import { businessConfig } from "../config/business";
import { trackDepositStarted } from "../lib/tracking";
import {
  WhopElements,
  Checkout,
  CheckoutElement,
  ExpressCheckoutElement,
  BrandingElement,
  Payments,
  PaymentElement,
} from "@whop/elements-react";
import { loadWhop } from "@whop/elements";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanKey?: "INSPECTION" | "DEPOSIT" | "MAINTENANCE";
}

// Initialize the official Whop Elements loader once
const whopElementsPromise = typeof window !== "undefined" ? loadWhop() : null;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlanKey = "INSPECTION",
}) => {
  const [selectedPlanKey, setSelectedPlanKey] = useState<"INSPECTION" | "DEPOSIT" | "MAINTENANCE">(
    initialPlanKey
  );
  const [savePaymentMethodConsent, setSavePaymentMethodConsent] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [testTransactionId, setTestTransactionId] = useState<string | null>(null);

  const plan = whopConfig.plans[selectedPlanKey];

  // Fire deposit_started custom tracking event when deposit checkout is viewed
  useEffect(() => {
    if (isOpen && selectedPlanKey === "DEPOSIT") {
      const attemptId = `chk_attempt_${Date.now()}`;
      trackDepositStarted(attemptId);
    }
  }, [isOpen, selectedPlanKey]);

  if (!isOpen) return null;

  const handleSimulateSandboxPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txId = `whop_pay_sbx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setTestTransactionId(txId);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setPaymentSuccess(false);
    setTestTransactionId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                Summit Roofing • Whop Checkout
              </h3>
              <p className="text-xs text-slate-300">
                Official Whop Payments & Elements Infrastructure
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus-ring cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {paymentSuccess ? (
            /* Payment Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-heading font-extrabold text-slate-950">
                Payment Authorized Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you! Your transaction for <span className="font-semibold text-slate-900">{plan.name}</span> has been confirmed through Whop Payments.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-xs text-slate-700 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-accent">{testTransactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Plan:</span>
                  <span className="font-semibold">{plan.name} (${plan.price} USD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Billing Type:</span>
                  <span className="capitalize">{plan.billingType.replace("_", " ")}</span>
                </div>
                {plan.depositNotice && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600">
                    <span className="font-semibold text-slate-800">Deposit Recorded:</span> $500.00 credited. A secure payment method token has been registered for off-session final balance invoicing ($4,500) upon completion of your roofing project.
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Plan Switcher Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
                {(["INSPECTION", "DEPOSIT", "MAINTENANCE"] as const).map((key) => {
                  const p = whopConfig.plans[key];
                  const isSelected = selectedPlanKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPlanKey(key)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="truncate max-w-full">{p.name.replace("Roofing ", "").replace("Professional ", "")}</span>
                      <span className="text-accent text-[11px] font-extrabold mt-0.5">${p.price} USD</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Plan Summary Banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-2xl font-extrabold font-heading text-slate-950">
                      ${plan.price}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">USD One-Time</span>
                  </div>
                </div>

                {/* Important Deposit Notice */}
                {plan.depositNotice && (
                  <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Project Deposit Terms:</span> This $500 deposit secures your installation calendar slot and crew dispatch. The remaining project balance ($4,500 on standard $5,000 jobs) will be invoiced separately via the Whop Invoices API after the roofing work is completed.
                    </div>
                  </div>
                )}
              </div>

              {/* Whop Payment Elements Integration Container */}
              <div className="border border-slate-200 rounded-xl p-5 mb-6 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-accent" />
                    Whop Payment Elements (Live SDK)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    256-bit Encrypted
                  </span>
                </div>

                {/* Express Checkout (Apple Pay & Google Pay) */}
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-2">
                    Express One-Touch Checkout:
                  </div>
                  {whopElementsPromise && (
                    <WhopElements elements={whopElementsPromise}>
                      <Checkout plan={plan.planId}>
                        <ExpressCheckoutElement />
                      </Checkout>
                    </WhopElements>
                  )}
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-semibold">Or pay with card</span>
                  </div>
                </div>

                {/* Whop PaymentElement & Mandatory BrandingElement */}
                {whopElementsPromise && (
                  <WhopElements elements={whopElementsPromise}>
                    <Payments
                      accountId={whopConfig.companyId}
                      currency="usd"
                      amount={plan.price * 100}
                    >
                      <PaymentElement />
                      {/* Mandatory BrandingElement (REQUIRED by Whop) */}
                      <div className="pt-3">
                        <BrandingElement />
                      </div>
                    </Payments>
                  </WhopElements>
                )}
              </div>

              {/* Saved Payment Method / Setup Intent Authorization for $500 Deposit */}
              {plan.depositNotice && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={savePaymentMethodConsent}
                      onChange={(e) => setSavePaymentMethodConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800">
                        Authorize Card on File for Final Project Balance:
                      </span>{" "}
                      I authorize Summit Roofing Co. and Whop to securely establish a Setup Intent to save this payment method on file. I understand the final balance ($4,500) will be charged or invoiced only upon completion of the approved roofing project according to my written contract.
                    </div>
                  </label>
                </div>
              )}

              {/* Sandbox Instant Test Trigger Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSimulateSandboxPayment}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-xl bg-accent hover:bg-accent-hover active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 focus-ring cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Authorizing Whop Sandbox Charge...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Complete Sandbox Payment (${plan.price}.00 USD)</span>
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-slate-400">
                  Whop Sandbox Mode Active • No real currency will be charged during testing.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

