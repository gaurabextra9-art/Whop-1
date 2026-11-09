# Summit Roofing Co. — Production Whop Website & Payments Template

> **"Built to Protect. Designed to Last."**  
> A complete, production-ready website template and commercial payment infrastructure built for US residential roofing contractors using **Whop Websites, Whop Payments, Whop Payment Elements, and the Whop API**.
>
> 🌐 **Live Website**: [https://summit-roofing-app.whop.site](https://summit-roofing-app.whop.site)  
> ⚡ **Whop App ID**: `app_yELvblKjXh4KQW`  
> 🏢 **Whop Business ID**: `biz_qScvAn5mHB28cK`

---

## 1. Project Overview

Summit Roofing Co. is an Austin, Texas-based residential roofing contractor specializing in architectural shingle replacements, storm damage hail restoration, emergency leak repairs, and certified roof inspections.

This repository demonstrates the entire customer acquisition and commercial payment lifecycle:
```
Lead Generation → Estimate Request → Inspection Booking ($149) → Project Deposit ($500) → Roofing Job Execution → Final Invoicing ($4,500) → Payment Collection
```

The template is fully functional, responsive, and completely customizable for any US contractor through centralized configuration files.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS, Lucide React, Framer Motion
- **Whop Payments & Checkout**:
  - `@whop/elements` (v1.9.0)
  - `@whop/elements-react` (v1.9.0)
  - `CheckoutElement` / `PaymentElement`
  - `ExpressCheckoutElement` (Apple Pay & Google Pay)
  - `BrandingElement` (Mandatory compliance & terms)
- **Backend & APIs**:
  - Node.js (v24+), TypeScript, Express
  - Whop Official TypeScript SDK (`@whop/sdk`)
  - Whop Leads API (`POST /api/v1/leads`)
  - Whop Invoices API (`POST /api/v1/invoices`)
  - Whop Setup Intents API (`POST /api/v1/setup_intents`)
- **Hosting & Platform**:
  - Whop Websites & Whop CLI (`@whop/cli`)
  - Cloudflare Workers runtime via `@whop/cli/vite`
- **Analytics & Tracking**:
  - Official Whop Pixel with 3 custom events (`estimate_requested`, `service_viewed`, `deposit_started`)

---

## 3. Mandatory Whop Commercial Products & Plans

All prices are in USD.

| Plan Name | Product Name | Price | Billing | Description | Workflow |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Professional Roof Inspection** | Roof Inspection Service | **$149** | One-time | 25-point visual & drone condition assessment with photographic report | Instant booking via Whop Payment Elements; fee credited toward future roof work |
| **Roofing Project Deposit** | Roofing Project Deposit | **$500** | One-time | Initial deposit securing schedule and materials. Saves payment method via Setup Intent | Customer pays $500 deposit; remaining project balance ($4,500) invoiced upon job completion |
| **Standard Roof Maintenance Visit** | Roofing Maintenance Service | **$299** | One-time | Annual preventive visit, valley clearing, and flashing/pipe boot resealing | One-click flat-rate service visit booking |

---

## 4. Architecture & Key Modules

```
whop1/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive sticky navigation, call CTA, admin trigger
│   │   ├── Hero.tsx               # Austin TX contractor hero, dual CTAs, trust badges
│   │   ├── Services.tsx           # 3 primary services + Whop plans banner, fires service_viewed
│   │   ├── ServiceAreas.tsx       # Austin, Round Rock, Cedar Park, etc. with ZIP checker
│   │   ├── Financing.tsx          # Transparent payment terms & merchant financing disclosure
│   │   ├── Reviews.tsx            # Testimonials with owner customization note
│   │   ├── Contact.tsx            # Contact details, hours, dispatch info
│   │   ├── Footer.tsx             # Legal links, licensing, Whop technology notice
│   │   ├── EstimateModal.tsx      # Comprehensive lead capture sending to Whop Leads API
│   │   ├── CheckoutModal.tsx      # Payment Elements, ExpressCheckout, BrandingElement, Setup Intent
│   │   └── AdminDashboard.tsx     # Operations portal: leads queue, project table, final invoice generator
│   ├── config/
│   │   ├── business.ts            # Centralized business data (name, phone, services, cities, reviews)
│   │   └── whop.ts                # Whop company, plan keys, theme, and tracking events
│   ├── lib/
│   │   ├── tracking.ts            # Deduplicated Whop pixel event dispatcher
│   │   └── whop-api.ts            # Whop API client definitions
│   ├── App.tsx                    # Main layout coordinator
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Tailwind styles & theme variables
├── server/
│   ├── index.ts                   # Express server with Leads, Invoices, Setup Intent, and Stats routes
│   └── types.ts                   # Strongly-typed data contracts
├── test/
│   └── api-test.ts                # Automated test suite for backend & Whop workflows
├── vite.config.ts                 # Vite config with @whop/cli/vite plugin & dev API middleware
├── wrangler.jsonc                 # Cloudflare Workers configuration for Whop hosting
├── whop.app.json                  # Whop app link descriptor
└── package.json                   # Dependencies and scripts
```

---

## 5. Local Development Instructions

### Prerequisites
- Node.js v22 or higher (v24 recommended)
- Whop CLI: `npm install -g @whop/cli`

### Installation
```bash
# Clone the repository
git clone https://github.com/gaurabextra9-art/Whop-1.git
cd Whop-1

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Whop credentials:
```env
WHOP_API_KEY=whop_api_key_xxxxxxxxxxxxxxxxxxxxxxxxxx
WHOP_COMPANY_ID=biz_xxxxxxxxxxxxxx
WHOP_ENVIRONMENT=sandbox
```

### Running Locally
```bash
# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. All API endpoints under `/api/*` are automatically handled via Vite middleware.

To run the standalone automated backend test suite:
```bash
npx tsx test/api-test.ts
```

---

## 6. Whop CLI & Deployment Workflow

### 1. Authenticate with Whop
```bash
# Interactive OAuth login
whop login --method oauth

# Or non-interactive API key login
whop login --method api-key --api-key <WHOP_API_KEY>
```

### 2. Scaffold / Link Whop Website
```bash
whop apps init --name "Summit Roofing" --domain summit-roofing --app_type website
```

### 3. Run with Whop Dev Server
```bash
whop apps dev
```

### 4. Deploy Live to Whop Hosting
```bash
# Production deployment (builds, uploads archive, and promotes to live whop.site)
whop apps deploy
```

Whop will package `dist/client` and serve the application live at:
`https://summit-roofing.whop.site`

---

## 7. Whop Payment Elements Integration

The checkout experience in [`src/components/CheckoutModal.tsx`](src/components/CheckoutModal.tsx) implements official Whop Payment Elements:

```tsx
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

const whopElements = loadWhop();

// 1. Express Checkout (Apple Pay & Google Pay)
<WhopElements elements={whopElements}>
  <Checkout plan={planId}>
    <ExpressCheckoutElement />
  </Checkout>
</WhopElements>

// 2. Custom Card Checkout with Mandatory BrandingElement
<WhopElements elements={whopElements}>
  <Payments accountId={companyId} currency="usd" amount={amountInCents}>
    <PaymentElement />
    <BrandingElement />
  </Payments>
</WhopElements>
```

- **BrandingElement**: Renders Whop's required merchant-of-record disclosure and buyer terms agreement.
- **ExpressCheckoutElement**: Renders device-native wallets (Apple Pay on Safari/iOS, Google Pay on Chrome/Android).

---

## 8. Estimate Request Form & Whop Leads API

The form in [`src/components/EstimateModal.tsx`](src/components/EstimateModal.tsx) collects:
- Full Name, Email, Phone Number
- Property Street Address, Austin ZIP Code
- Service Type, Property Type, Approximate Roof Condition
- Preferred Contact Method (Phone / Email / Text)
- Additional Project Details
- Explicit Consent Authorization

Submissions are sanitized and forwarded to:
`POST https://api.whop.com/api/v1/leads` (or sandbox URL)

Upon confirmed lead creation, the custom pixel event is fired:
```javascript
whop.track("estimate_requested", {
  event_id: uniqueSubmissionId,
  service: "roof_replacement",
  zip_code: "78704"
});
```

---

## 9. Project Deposit & Saved Payment Method Workflow

For the **$500 Project Deposit**:
1. Customer receives approved estimate and initiates checkout.
2. The custom event `whop.track("deposit_started", { event_id: attemptId, value: 500, currency: "USD" })` fires.
3. Customer provides explicit authorization to save their card on file for future project completion billing.
4. Server creates a Setup Intent via `POST /api/setup-intent` (`POST https://api.whop.com/api/v1/setup_intents`).
5. Whop Payment Elements securely collects and tokens the payment method without raw card exposure.
6. The resulting `payment_method_id` is linked to the project in the contractor database.

---

## 10. Final Balance Invoicing Workflow

On project completion (e.g. Standard $5,000 project):
```
Total Project Amount:  $5,000
Less Initial Deposit:  -$500
==============================
Final Invoiced Balance: $4,500
```

- **Strict Server Calculation**: `final_balance` is calculated exclusively on the server (`total - deposit`).
- **Idempotency Protection**: Duplicate invoice creation attempts on the same project are rejected with HTTP 400.
- **Collection Options**:
  - **Option A (Automatic Charge)**: Uses `collection_method: "charge_automatically"` with `payment_method_id` from the deposit setup intent.
  - **Option B (Manual Payment)**: Uses `collection_method: "send_invoice"` to generate a Whop hosted invoice URL emailed to the homeowner.

---

## 11. Pixel Tracking Verification Guide

Open developer tools console when interacting with the site:
1. **`estimate_requested`**: Submit the estimate form → verify console outputs `[Whop Tracked] ✓ estimate_requested`.
2. **`service_viewed`**: Hover/click any service card → verify console outputs `[Whop Tracked] ✓ service_viewed`.
3. **`deposit_started`**: Click "Pay $500 Project Deposit" → verify console outputs `[Whop Tracked] ✓ deposit_started`.

All events use deduplication sets to prevent redundant firing in React Strict Mode.

---

## 12. Reusable Template Customization Guide

To adapt this template for another roofing contractor:
1. Open [`src/config/business.ts`](src/config/business.ts) and edit:
   - `company.name`, `tagline`, `phone`, `email`, `address`
   - `services` (descriptions, pricing notes, photos)
   - `serviceAreas` (local target cities and ZIP ranges)
   - `reviews` (authentic homeowner testimonials)
2. Open [`src/config/whop.ts`](src/config/whop.ts) and update:
   - `companyId` (your Whop `biz_...` ID)
   - `plans` (your Whop `plan_...` and `prod_...` IDs)
3. Run `whop apps deploy` to push live.

---

## 13. License

Commercial website template developed for Whop. All rights reserved.

