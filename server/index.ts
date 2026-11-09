import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { LeadSubmission, LeadRecord, ProjectRecord, InvoiceCreateRequest, ProjectStatus } from "./types.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const WHOP_API_KEY = process.env.WHOP_API_KEY || "";
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID || "biz_summit_roofing";
const WHOP_ENVIRONMENT = process.env.WHOP_ENVIRONMENT || "sandbox";
const WHOP_API_BASE_URL =
  process.env.WHOP_API_BASE_URL ||
  (WHOP_ENVIRONMENT === "sandbox"
    ? "https://sandbox-api.whop.com/api/v1"
    : "https://api.whop.com/api/v1");

// In-Memory Database Store (Initialized with standard demo records)
let leads: LeadRecord[] = [
  {
    id: "lead_demo_01",
    whopLeadId: "whop_lead_9921",
    fullName: "Arthur Pendelton",
    email: "arthur.p@austinmail.com",
    phone: "(512) 555-0149",
    propertyAddress: "3204 Enfield Rd, Austin, TX 78703",
    zipCode: "78703",
    service: "roof_replacement",
    propertyType: "Single Family (2-story)",
    roofCondition: "Aging (18+ years, hail damage)",
    preferredContact: "phone",
    details: "Severe hail last spring, insurance adjuster assessed multiple penetrations.",
    consent: true,
    status: "converted",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "lead_demo_02",
    whopLeadId: "whop_lead_9922",
    fullName: "Claire Davenport",
    email: "c.davenport@gmail.com",
    phone: "(512) 555-0182",
    propertyAddress: "1412 Falcon Dr, Round Rock, TX 78664",
    zipCode: "78664",
    service: "roof_repair",
    propertyType: "Single Family (1-story)",
    roofCondition: "Active Leak near master bath",
    preferredContact: "email",
    details: "Water spots on ceiling after yesterday's heavy rain.",
    consent: true,
    status: "scheduled",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

let projects: ProjectRecord[] = [
  {
    id: "proj_summit_101",
    leadId: "lead_demo_01",
    customerName: "Arthur Pendelton",
    customerEmail: "arthur.p@austinmail.com",
    customerPhone: "(512) 555-0149",
    propertyAddress: "3204 Enfield Rd, Austin, TX 78703",
    serviceType: "Full Roof Replacement (Class 4 Architectural)",
    totalProjectAmount: 5000,
    depositAmount: 500,
    depositPaymentId: "pay_dep_98412",
    savedPaymentMethodId: "pm_card_visa_saved_9841",
    status: "Deposit Paid",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "proj_summit_102",
    customerName: "Marcus & Diane Vance",
    customerEmail: "marcus.vance@txinvest.com",
    customerPhone: "(512) 555-8831",
    propertyAddress: "8402 Westlake Dr, Austin, TX 78746",
    serviceType: "Standing Seam Metal Roof Installation",
    totalProjectAmount: 8500,
    depositAmount: 500,
    depositPaymentId: "pay_dep_77319",
    savedPaymentMethodId: "pm_card_mc_saved_7731",
    status: "Completed",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// Helper: Sanitize Text
function sanitizeText(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
}

// ----------------------------------------------------
// 1. LEADS API: POST /api/leads
// ----------------------------------------------------
app.post("/api/leads", async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.body as Partial<LeadSubmission>;

    // Field Validation
    const fullName = sanitizeText(raw.fullName);
    const email = sanitizeText(raw.email);
    const phone = sanitizeText(raw.phone);
    const propertyAddress = sanitizeText(raw.propertyAddress);
    const zipCode = sanitizeText(raw.zipCode);
    const service = sanitizeText(raw.service);
    const propertyType = sanitizeText(raw.propertyType) || "Residential";
    const roofCondition = sanitizeText(raw.roofCondition) || "Not Specified";
    const preferredContact = (raw.preferredContact || "phone") as "phone" | "email" | "text";
    const details = sanitizeText(raw.details);
    const consent = Boolean(raw.consent);

    if (!fullName || !email || !phone || !propertyAddress || !zipCode || !service) {
      res.status(400).json({
        success: false,
        error: "Missing required fields (fullName, email, phone, propertyAddress, zipCode, service).",
      });
      return;
    }

    if (!consent) {
      res.status(400).json({
        success: false,
        error: "Consent is required to submit an estimate request.",
      });
      return;
    }

    const newLeadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let whopLeadId: string | undefined = undefined;

    // Send to Whop Leads API if API Key is configured
    if (WHOP_API_KEY) {
      try {
        const whopPayload = {
          account_id: WHOP_COMPANY_ID,
          metadata: {
            full_name: fullName,
            email,
            phone,
            property_address: propertyAddress,
            zip_code: zipCode,
            service,
            property_type: propertyType,
            roof_condition: roofCondition,
            preferred_contact: preferredContact,
            details,
            lead_source: "Summit Roofing Website Form",
          },
        };

        const whopRes = await fetch(`${WHOP_API_BASE_URL}/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${WHOP_API_KEY}`,
          },
          body: JSON.stringify(whopPayload),
        });

        if (whopRes.ok) {
          const whopData = (await whopRes.json()) as { id?: string; lead?: { id?: string } };
          whopLeadId = whopData.id || whopData.lead?.id || `whop_${newLeadId}`;
          console.log(`[Whop Leads API] Successfully created Lead ${whopLeadId}`);
        } else {
          const errText = await whopRes.text();
          console.warn(`[Whop Leads API] HTTP ${whopRes.status} creating lead:`, errText);
        }
      } catch (whopErr) {
        console.error("[Whop Leads API] Network / API error:", whopErr);
      }
    } else {
      console.log(`[Whop Leads API] Simulation mode: WHOP_API_KEY not provided. Stored lead locally.`);
      whopLeadId = `whop_lead_sim_${Date.now()}`;
    }

    const leadRecord: LeadRecord = {
      id: newLeadId,
      whopLeadId,
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
      status: "new",
      createdAt: new Date().toISOString(),
    };

    leads.unshift(leadRecord);

    res.status(201).json({
      success: true,
      leadId: newLeadId,
      whopLeadId,
      message: "Estimate request submitted and recorded successfully.",
      lead: leadRecord,
    });
  } catch (error) {
    console.error("Error in /api/leads:", error);
    res.status(500).json({ success: false, error: "Internal server error processing lead." });
  }
});

// ----------------------------------------------------
// 2. GET /api/leads
// ----------------------------------------------------
app.get("/api/leads", (_req: Request, res: Response) => {
  res.json({ success: true, count: leads.length, leads });
});

// ----------------------------------------------------
// 3. GET /api/projects
// ----------------------------------------------------
app.get("/api/projects", (_req: Request, res: Response) => {
  res.json({ success: true, count: projects.length, projects });
});

// ----------------------------------------------------
// 4. POST /api/projects/:id/status
// ----------------------------------------------------
app.post("/api/projects/:id/status", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body as { status: ProjectStatus };

  const project = projects.find((p) => p.id === id);
  if (!project) {
    res.status(404).json({ success: false, error: "Project not found." });
    return;
  }

  project.status = status;
  if (status === "Completed") {
    project.completedAt = new Date().toISOString();
  } else if (status === "Paid") {
    project.paidAt = new Date().toISOString();
  }

  res.json({ success: true, project });
});

// ----------------------------------------------------
// 5. INVOICES API: POST /api/invoices
// ----------------------------------------------------
app.post("/api/invoices", async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, collectionMethod = "manual_hosted_invoice" } = req.body as InvoiceCreateRequest;

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found." });
      return;
    }

    // Idempotency: Protect against duplicate invoice creation
    if (project.invoiceId || project.status === "Invoice Sent" || project.status === "Paid") {
      res.status(400).json({
        success: false,
        error: `Project ${projectId} already has an existing invoice (${project.invoiceId}). Duplicate invoicing is prevented.`,
        existingInvoiceId: project.invoiceId,
        invoiceUrl: project.invoiceUrl,
      });
      return;
    }

    // Strict Server-Side Balance Calculation
    // final_balance = total_project_amount - deposit_amount
    const total = Number(project.totalProjectAmount) || 5000;
    const deposit = Number(project.depositAmount) || 500;
    const finalBalance = Math.max(0, total - deposit);

    const generatedInvoiceId = `inv_summit_${Date.now()}`;
    let whopInvoiceId: string | undefined = undefined;
    let paymentUrl = `https://whop.com/checkout/invoice/${generatedInvoiceId}`;

    if (WHOP_API_KEY) {
      try {
        const whopCollectionMethod =
          collectionMethod === "automatic_charge" ? "charge_automatically" : "send_invoice";

        const invoicePayload: Record<string, unknown> = {
          account_id: WHOP_COMPANY_ID,
          customer_name: project.customerName,
          email_address: project.customerEmail,
          collection_method: whopCollectionMethod,
          due_date: new Date(Date.now() + 14 * 86400000).toISOString(),
          line_items: [
            {
              label: `Roofing Project Final Balance (${project.serviceType}) — Total $${total.toLocaleString()} less $${deposit.toLocaleString()} Initial Deposit`,
              unit_price: finalBalance,
              quantity: 1,
            },
          ],
          metadata: {
            project_id: project.id,
            deposit_payment_id: project.depositPaymentId || "",
            property_address: project.propertyAddress,
          },
        };

        if (whopCollectionMethod === "charge_automatically" && project.savedPaymentMethodId) {
          invoicePayload.payment_method_id = project.savedPaymentMethodId;
        }

        const whopRes = await fetch(`${WHOP_API_BASE_URL}/invoices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${WHOP_API_KEY}`,
          },
          body: JSON.stringify(invoicePayload),
        });

        if (whopRes.ok) {
          const invData = (await whopRes.json()) as { id?: string; hosted_url?: string };
          whopInvoiceId = invData.id;
          if (invData.hosted_url) {
            paymentUrl = invData.hosted_url;
          }
          console.log(`[Whop Invoices API] Created Whop Invoice: ${whopInvoiceId}`);
        } else {
          const errBody = await whopRes.text();
          console.warn(`[Whop Invoices API] HTTP ${whopRes.status}:`, errBody);
        }
      } catch (invErr) {
        console.error("[Whop Invoices API] Error sending invoice:", invErr);
      }
    }

    // Update project state
    project.invoiceId = generatedInvoiceId;
    project.whopInvoiceId = whopInvoiceId || `whop_${generatedInvoiceId}`;
    project.invoiceAmount = finalBalance;
    project.invoiceUrl = paymentUrl;
    project.collectionMethod = collectionMethod;

    if (collectionMethod === "automatic_charge") {
      project.status = "Paid";
      project.paidAt = new Date().toISOString();
    } else {
      project.status = "Invoice Sent";
    }

    res.status(201).json({
      success: true,
      invoice: {
        invoiceId: project.invoiceId,
        whopInvoiceId: project.whopInvoiceId,
        totalProjectAmount: total,
        depositPaid: deposit,
        finalBalance,
        status: project.status,
        collectionMethod,
        paymentUrl,
        customerName: project.customerName,
        customerEmail: project.customerEmail,
        issuedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error in /api/invoices:", err);
    res.status(500).json({ success: false, error: "Internal server error creating invoice." });
  }
});

// ----------------------------------------------------
// 6. SETUP INTENTS API: POST /api/setup-intent
// ----------------------------------------------------
app.post("/api/setup-intent", async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerEmail, customerName } = req.body as { customerEmail?: string; customerName?: string };
    const setupIntentId = `sint_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let clientSecret = `${setupIntentId}_secret_${Math.random().toString(36).substring(2, 9)}`;

    if (WHOP_API_KEY) {
      try {
        const whopRes = await fetch(`${WHOP_API_BASE_URL}/setup_intents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${WHOP_API_KEY}`,
          },
          body: JSON.stringify({
            account_id: WHOP_COMPANY_ID,
            metadata: {
              customer_email: customerEmail || "",
              customer_name: customerName || "",
              purpose: "Summit Roofing Project Deposit Card-on-File",
            },
          }),
        });

        if (whopRes.ok) {
          const data = (await whopRes.json()) as { id?: string; client_secret?: string };
          if (data.id) {
            clientSecret = data.client_secret || clientSecret;
          }
        }
      } catch (err) {
        console.warn("[Whop Setup Intents API] Offline / test mode fallback:", err);
      }
    }

    res.json({
      success: true,
      setupIntentId,
      clientSecret,
      currency: "usd",
      companyId: WHOP_COMPANY_ID,
    });
  } catch (error) {
    console.error("Error in /api/setup-intent:", error);
    res.status(500).json({ success: false, error: "Failed to create setup intent." });
  }
});

// ----------------------------------------------------
// 7. STATS API: GET /api/stats
// ----------------------------------------------------
app.get("/api/stats", (_req: Request, res: Response) => {
  const totalLeads = leads.length;
  const pendingEstimates = leads.filter((l) => l.status === "new" || l.status === "scheduled").length;
  const approvedProjects = projects.filter((p) => p.status === "Approved" || p.status === "Deposit Paid").length;
  const depositsReceived = projects.filter((p) => Boolean(p.depositPaymentId)).length * 500;
  const jobsCompleted = projects.filter((p) => p.status === "Completed" || p.status === "Invoice Sent" || p.status === "Paid").length;
  const outstandingInvoices = projects.filter((p) => p.status === "Invoice Sent").length;
  const collectedFinalPayments = projects.filter((p) => p.status === "Paid").reduce((sum, p) => sum + (p.invoiceAmount || 4500), 0);

  res.json({
    success: true,
    stats: {
      totalLeads,
      pendingEstimates,
      approvedProjects,
      depositsReceived,
      jobsCompleted,
      outstandingInvoices,
      collectedFinalPayments,
    },
  });
});

export default app;

// Standalone server startup when executed directly via npm run server
const PORT = Number(process.env.PORT) || 3001;
if (process.env.RUN_STANDALONE_SERVER === "true") {
  app.listen(PORT, () => {
    console.log(`[Summit Roofing API] Server running on http://localhost:${PORT}`);
  });
}
