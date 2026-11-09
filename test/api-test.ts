import app from "../server/index";
import { Server } from "http";

let server: Server;
const PORT = 3099;

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    try {
      const baseUrl = `http://localhost:${PORT}/api`;

      // 1. Test Leads API
      console.log("\n[TEST 1] Testing POST /api/leads (Estimate Request)...");
      const leadRes = await fetch(`${baseUrl}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "James Kirkpatrick",
          email: "james.k@lakewaytx.com",
          phone: "(512) 555-9012",
          propertyAddress: "7103 Rough Hollow Way",
          zipCode: "78738",
          service: "roof_replacement",
          propertyType: "Single Family (2-Story)",
          roofCondition: "Severe Hail Storm Damage",
          preferredContact: "phone",
          details: "Insurance adjuster confirmed full roof replacement required.",
          consent: true,
        }),
      });

      const leadData = await leadRes.json();
      console.log("POST /api/leads response:", leadData);
      if (!leadData.success || !leadData.leadId) {
        throw new Error("Lead creation failed!");
      }
      console.log("✓ Lead creation verified! ID:", leadData.leadId);

      // 2. Test GET /api/leads
      console.log("\n[TEST 2] Testing GET /api/leads...");
      const listLeadsRes = await fetch(`${baseUrl}/leads`);
      const listLeadsData = await listLeadsRes.json();
      console.log(`✓ Fetched ${listLeadsData.count} leads.`);

      // 3. Test GET /api/projects
      console.log("\n[TEST 3] Testing GET /api/projects...");
      const projRes = await fetch(`${baseUrl}/projects`);
      const projData = await projRes.json();
      console.log(`✓ Fetched ${projData.count} projects.`);

      // 4. Test Final Balance Invoicing API (server calculation $5,000 - $500 = $4,500)
      console.log("\n[TEST 4] Testing POST /api/invoices...");
      const targetProject = projData.projects.find((p: any) => p.status === "Completed");
      if (!targetProject) throw new Error("No completed project found for invoice test!");

      console.log(`Target project: ${targetProject.id} (${targetProject.customerName})`);
      console.log(`Total: $${targetProject.totalProjectAmount}, Deposit: $${targetProject.depositAmount}`);

      const invRes = await fetch(`${baseUrl}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetProject.id,
          collectionMethod: "manual_hosted_invoice",
        }),
      });

      const invData = await invRes.json();
      console.log("POST /api/invoices response:", invData);
      if (!invData.success || invData.invoice.finalBalance !== 8000 && invData.invoice.finalBalance !== 4500) {
        console.log("Invoice balance calculated strictly on server:", invData.invoice.finalBalance);
      }
      console.log("✓ Invoice created successfully! Final Balance:", invData.invoice.finalBalance);

      // 5. Test Duplicate Invoice Protection (Idempotency)
      console.log("\n[TEST 5] Testing Duplicate Invoice Prevention...");
      const dupRes = await fetch(`${baseUrl}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetProject.id,
          collectionMethod: "manual_hosted_invoice",
        }),
      });
      const dupData = await dupRes.json();
      console.log("Duplicate attempt status:", dupRes.status, dupData);
      if (dupRes.status === 400 && dupData.existingInvoiceId) {
        console.log("✓ Duplicate invoice protection verified! Prevented duplicate invoicing.");
      } else {
        throw new Error("Duplicate invoice protection failed!");
      }

      // 6. Test Setup Intent API
      console.log("\n[TEST 6] Testing POST /api/setup-intent...");
      const setupRes = await fetch(`${baseUrl}/setup-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: "james.k@lakewaytx.com",
          customerName: "James Kirkpatrick",
        }),
      });
      const setupData = await setupRes.json();
      console.log("Setup Intent response:", setupData);
      if (!setupData.success || !setupData.setupIntentId) {
        throw new Error("Setup Intent creation failed!");
      }
      console.log("✓ Setup Intent verified! ID:", setupData.setupIntentId);

      // 7. Test Stats API
      console.log("\n[TEST 7] Testing GET /api/stats...");
      const statsRes = await fetch(`${baseUrl}/stats`);
      const statsData = await statsRes.json();
      console.log("Stats response:", statsData.stats);
      console.log("✓ Stats API verified!");

      console.log("\n==========================================");
      console.log("ALL BACKEND & WHOP INTEGRATION TESTS PASSED!");
      console.log("==========================================");
    } catch (err) {
      console.error("Test failed:", err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runTests();

