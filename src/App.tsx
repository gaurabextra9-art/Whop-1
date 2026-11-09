import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { ServiceAreas } from "./components/ServiceAreas";
import { Financing } from "./components/Financing";
import { Reviews } from "./components/Reviews";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { EstimateModal } from "./components/EstimateModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminDashboard } from "./components/AdminDashboard";
import type { ServiceItem } from "./config/business";

export function App() {
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPlanKey, setCheckoutPlanKey] = useState<"INSPECTION" | "DEPOSIT" | "MAINTENANCE">("INSPECTION");

  const [adminOpen, setAdminOpen] = useState(false);

  const handleOpenEstimate = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setEstimateModalOpen(true);
  };

  const handleOpenCheckout = (planKey: "INSPECTION" | "DEPOSIT" | "MAINTENANCE") => {
    setCheckoutPlanKey(planKey);
    setCheckoutModalOpen(true);
  };

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-accent selection:text-white">
      {/* Sticky Responsive Header */}
      <Navbar
        onRequestEstimate={() => handleOpenEstimate()}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        <Hero
          onRequestEstimate={() => handleOpenEstimate()}
          onExploreServices={scrollToServices}
          onBookInspection={() => handleOpenCheckout("INSPECTION")}
        />

        <Services
          onSelectService={() => {}}
          onRequestEstimate={handleOpenEstimate}
          onOpenCheckout={handleOpenCheckout}
        />

        <ServiceAreas />

        <Financing
          onExploreCheckout={() => handleOpenCheckout("DEPOSIT")}
          onRequestEstimate={() => handleOpenEstimate()}
        />

        <Reviews />

        <Contact
          onRequestEstimate={() => handleOpenEstimate()}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Estimate Request Form Modal (Whop Leads API) */}
      <EstimateModal
        isOpen={estimateModalOpen}
        onClose={() => setEstimateModalOpen(false)}
        preselectedService={preselectedService}
      />

      {/* Whop Payment Elements Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        initialPlanKey={checkoutPlanKey}
      />

      {/* Internal Contractor Portal & Invoices Management Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}

export default App;

