/**
 * Server Data Types & Contracts
 */

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  zipCode: string;
  service: string;
  propertyType: string;
  roofCondition: string;
  preferredContact: "phone" | "email" | "text";
  details?: string;
  consent: boolean;
}

export interface LeadRecord extends LeadSubmission {
  id: string;
  whopLeadId?: string;
  createdAt: string;
  status: "new" | "contacted" | "scheduled" | "converted";
}

export type ProjectStatus =
  | "New Lead"
  | "Estimate Scheduled"
  | "Estimate Sent"
  | "Approved"
  | "Deposit Paid"
  | "In Progress"
  | "Completed"
  | "Invoice Sent"
  | "Paid";

export interface ProjectRecord {
  id: string;
  leadId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyAddress: string;
  serviceType: string;
  totalProjectAmount: number; // e.g. 5000
  depositAmount: number;      // e.g. 500
  depositPaymentId?: string;
  savedPaymentMethodId?: string;
  status: ProjectStatus;
  createdAt: string;
  completedAt?: string;
  invoiceId?: string;
  whopInvoiceId?: string;
  invoiceAmount?: number;     // e.g. 4500 (calculated strictly on server: total - deposit)
  invoiceUrl?: string;
  collectionMethod?: "automatic_charge" | "manual_hosted_invoice";
  paidAt?: string;
}

export interface InvoiceCreateRequest {
  projectId: string;
  collectionMethod: "automatic_charge" | "manual_hosted_invoice";
  customerName?: string;
  customerEmail?: string;
  dueDateDays?: number;
}

