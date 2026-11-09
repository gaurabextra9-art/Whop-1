import React, { useState, useEffect } from "react";
import { businessConfig } from "../config/business";
import { whopConfig } from "../config/whop";
import type { LeadRecord, ProjectRecord, ProjectStatus } from "../../server/types";
import {
  X,
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"projects" | "leads" | "invoices">("projects");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    pendingEstimates: 0,
    approvedProjects: 0,
    depositsReceived: 0,
    jobsCompleted: 0,
    outstandingInvoices: 0,
    collectedFinalPayments: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Invoice creation form modal inside admin
  const [selectedProjectForInvoice, setSelectedProjectForInvoice] = useState<ProjectRecord | null>(null);
  const [collectionMethod, setCollectionMethod] = useState<"automatic_charge" | "manual_hosted_invoice">("manual_hosted_invoice");
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
      const [leadsRes, projRes, statsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/projects"),
        fetch("/api/stats"),
      ]);

      const leadsData = await leadsRes.json();
      const projData = await projRes.json();
      const statsData = await statsRes.json();

      if (leadsData.success) setLeads(leadsData.leads);
      if (projData.success) setProjects(projData.projects);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`✓ Project ${projectId} updated to "${newStatus}"`);
        loadData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedProjectForInvoice) return;
    setIsGeneratingInvoice(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectForInvoice.id,
          collectionMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate invoice via Whop Invoices API.");
      }

      setActionMessage(
        `✓ Final Invoice created successfully! Whop ID: ${data.invoice.whopInvoiceId || data.invoice.invoiceId}. Outstanding balance: $${data.invoice.finalBalance.toLocaleString()} USD.`
      );
      setSelectedProjectForInvoice(null);
      loadData();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                Contractor Operations Portal
                <span className="text-[10px] font-mono uppercase bg-accent/20 text-accent px-2 py-0.5 rounded border border-accent/30">
                  Whop Commercial Demo
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                End-to-End Lifecycle: Leads → Deposit ($500) → Job Execution → Final Invoice ($4,500)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus-ring cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus-ring cursor-pointer"
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Pipeline Metrics Cards */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Leads</div>
            <div className="text-xl font-extrabold text-slate-900 font-heading mt-1">{stats.totalLeads}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Pending Quotes</div>
            <div className="text-xl font-extrabold text-amber-600 font-heading mt-1">{stats.pendingEstimates}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Approved</div>
            <div className="text-xl font-extrabold text-slate-900 font-heading mt-1">{stats.approvedProjects}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Deposits Recv</div>
            <div className="text-xl font-extrabold text-emerald-600 font-heading mt-1">${stats.depositsReceived.toLocaleString()}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Jobs Done</div>
            <div className="text-xl font-extrabold text-slate-900 font-heading mt-1">{stats.jobsCompleted}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase">Open Invoices</div>
            <div className="text-xl font-extrabold text-accent font-heading mt-1">{stats.outstandingInvoices}</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500 font-semibold uppercase">Collected Final</div>
            <div className="text-xl font-extrabold text-emerald-600 font-heading mt-1">${stats.collectedFinalPayments.toLocaleString()}</div>
          </div>
        </div>

        {/* Action Notice Bar */}
        {actionMessage && (
          <div className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
            actionMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-800 border-b border-emerald-200" : "bg-red-50 text-red-800 border-b border-red-200"
          }`}>
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-slate-500 hover:text-slate-800">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "border-accent text-accent"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Projects & Invoicing ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "leads"
                ? "border-accent text-accent"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Whop Leads Queue ({leads.length})
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === "projects" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Showing all projects with deposit tracking & server-calculated final balance:
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Example Scenario: $5,000 Total - $500 Deposit = $4,500 Final Invoice
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Project / Customer</th>
                      <th className="py-3 px-4">Service & Address</th>
                      <th className="py-3 px-4">Total / Deposit</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Saved Card / Token</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {projects.map((proj) => {
                      const finalBalance = Math.max(0, proj.totalProjectAmount - proj.depositAmount);
                      return (
                        <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{proj.customerName}</div>
                            <div className="text-[11px] text-slate-500">{proj.customerPhone}</div>
                            <div className="text-[11px] font-mono text-slate-400">{proj.id}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{proj.serviceType}</div>
                            <div className="text-[11px] text-slate-500">{proj.propertyAddress}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">
                              Total: ${proj.totalProjectAmount.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-emerald-600 font-medium">
                              Deposit: ${proj.depositAmount.toLocaleString()} Paid
                            </div>
                            <div className="text-[11px] font-bold text-accent">
                              Balance: ${finalBalance.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              proj.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : proj.status === "Invoice Sent"
                                ? "bg-amber-100 text-amber-800"
                                : proj.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}>
                              {proj.status}
                            </span>
                            {proj.invoiceId && (
                              <div className="text-[10px] font-mono text-slate-400 mt-1">
                                Inv: {proj.invoiceId}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {proj.savedPaymentMethodId ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CreditCard className="w-3 h-3" />
                                {proj.savedPaymentMethodId}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No card saved</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {proj.status === "Deposit Paid" && (
                                <button
                                  onClick={() => handleUpdateStatus(proj.id, "Completed")}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  Mark Job Done
                                </button>
                              )}

                              {proj.status === "Completed" && (
                                <button
                                  onClick={() => setSelectedProjectForInvoice(proj)}
                                  className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>Generate Final Invoice</span>
                                </button>
                              )}

                              {proj.status === "Invoice Sent" && (
                                <button
                                  onClick={() => handleUpdateStatus(proj.id, "Paid")}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  Confirm Payment Recv
                                </button>
                              )}

                              {proj.invoiceUrl && (
                                <a
                                  href={proj.invoiceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-accent hover:underline font-semibold"
                                >
                                  View Link
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Leads Queue Tab */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Showing all leads captured from the "Request an Estimate" form via Whop Leads API:
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Property & Service</th>
                      <th className="py-3 px-4">Condition / Details</th>
                      <th className="py-3 px-4">Whop Lead ID</th>
                      <th className="py-3 px-4">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{l.fullName}</div>
                          <div className="text-slate-500">{l.email}</div>
                          <div className="text-slate-500">{l.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 capitalize">{l.service.replace("_", " ")}</div>
                          <div className="text-slate-500">{l.propertyAddress}, {l.zipCode}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-700 font-medium">{l.roofCondition}</div>
                          <div className="text-slate-500 italic truncate max-w-xs">{l.details || "None specified"}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-accent">
                            {l.whopLeadId || l.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Generate Final Invoice via Whop Invoices API */}
        {selectedProjectForInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-heading font-extrabold text-lg text-slate-900">
                  Generate Final Balance Invoice
                </h4>
                <button
                  onClick={() => setSelectedProjectForInvoice(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Calculation Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{selectedProjectForInvoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Project Total:</span>
                  <span className="font-bold text-slate-900">${selectedProjectForInvoice.totalProjectAmount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Initial Deposit Paid:</span>
                  <span className="font-bold">-${selectedProjectForInvoice.depositAmount.toLocaleString()} USD</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-950">
                  <span>Final Invoice Balance:</span>
                  <span className="text-accent">
                    ${(selectedProjectForInvoice.totalProjectAmount - selectedProjectForInvoice.depositAmount).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Collection Method Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-700">
                  Collection Method (Whop Supported Workflow):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCollectionMethod("manual_hosted_invoice")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      collectionMethod === "manual_hosted_invoice"
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Collection Option B</div>
                    <div className="text-[11px] text-slate-500 mt-1">Manual Hosted Invoice URL (Send via Email)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionMethod("automatic_charge")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      collectionMethod === "automatic_charge"
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Collection Option A</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Automatic Charge via Saved Card Token
                    </div>
                  </button>
                </div>
              </div>

              {collectionMethod === "automatic_charge" && !selectedProjectForInvoice.savedPaymentMethodId && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Notice: This project does not have a saved payment method token. Whop will fall back to sending a hosted payment link.
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForInvoice(null)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isGeneratingInvoice}
                  onClick={handleGenerateInvoice}
                  className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingInvoice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Invoice on Whop...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Create Whop Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

