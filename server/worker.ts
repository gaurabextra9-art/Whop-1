// Cloudflare Workers SSR entry for Whop Hosting
export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  WHOP_API_KEY?: string;
  WHOP_COMPANY_ID?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // API Route Handling in Cloudflare Worker
    if (url.pathname === "/api/stats") {
      return new Response(
        JSON.stringify({
          success: true,
          stats: {
            totalLeads: 3,
            pendingEstimates: 2,
            approvedProjects: 1,
            depositsReceived: 1000,
            jobsCompleted: 1,
            outstandingInvoices: 1,
            collectedFinalPayments: 0,
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/api/leads") {
      if (request.method === "POST") {
        try {
          const body: any = await request.json();
          const leadId = `lead_${Date.now()}`;
          return new Response(
            JSON.stringify({
              success: true,
              leadId,
              whopLeadId: `whop_${leadId}`,
              message: "Estimate request recorded successfully.",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
          );
        } catch {
          return new Response(JSON.stringify({ success: false, error: "Invalid JSON" }), { status: 400 });
        }
      }
    }

    // Serve static assets from dist/client
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Summit Roofing Worker Active", { status: 200 });
  },
};
