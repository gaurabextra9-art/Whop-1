/**
 * Business Configuration for Summit Roofing Co.
 * Centralized, reusable configuration architecture for roofing contractors.
 */

export interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceNote: string;
  priceAmount?: number;
  whopPlanKey?: string;
  features: string[];
  image: string;
  badge?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  content: string;
  service: string;
  verified: boolean;
}

export const businessConfig = {
  company: {
    name: "Summit Roofing Co.",
    legalName: "Summit Roofing Company LLC",
    tagline: "Built to Protect. Designed to Last.",
    shortBio: "Austin's premier residential roofing contractor specializing in architectural shingle replacement, storm damage restoration, precision leak repairs, and certified roof inspections.",
    establishedYear: 2014,
    phone: "(512) 843-7663",
    displayPhone: "(512) 843-ROOF",
    email: "service@summitroofingtx.com",
    address: {
      street: "1104 S Congress Ave, Suite 300",
      city: "Austin",
      state: "TX",
      zip: "78704",
      country: "USA",
    },
    hours: "Mon - Fri: 7:00 AM - 6:30 PM | Sat: 8:00 AM - 4:00 PM | 24/7 Emergency Line",
    license: "TX-R-482910-DEMO (Configurable demonstration credential)",
    insurance: "$2,000,000 General Liability & Full Worker's Compensation",
  },

  trustMetrics: [
    { label: "Completed Roofs", value: "3,200+" },
    { label: "Austin Communities", value: "8 Key Areas" },
    { label: "Avg Customer Rating", value: "4.9 / 5.0" },
    { label: "Workmanship Warranty", value: "10-Year Guarantee" },
  ],

  services: [
    {
      id: "roof_repair",
      name: "Roof Repair & Leak Detection",
      tagline: "Precision diagnosis, emergency storm fixes & long-lasting repairs",
      description: "Fast, reliable solutions for missing shingles, persistent leaks, flashing degradation, and acute Texas hail or wind damage.",
      priceNote: "Free inspection with repair, or transparent flat-rate diagnostic",
      features: [
        "Digital thermal & moisture leak detection",
        "Matching architectural shingle replacement",
        "Chimney, vent pipe & valley flashing resealing",
        "24-48 hour rapid dispatch for storm emergencies",
      ],
      image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80",
      badge: "Popular for Storm Damage",
    },
    {
      id: "roof_replacement",
      name: "Complete Roof Replacement",
      tagline: "High-performance architectural shingles & standing seam metal",
      description: "Full tear-off, deck inspection, synthetic underlayment, and premium class-4 impact resistant roof installations designed for extreme Texas heat and storms.",
      priceNote: "Custom estimate based on square footage & pitch • $500 Project Deposit to lock schedule",
      features: [
        "Class 4 impact-resistant shingles & metal options",
        "Ridge-vent & intake ventilation optimization",
        "10-Year comprehensive workmanship warranty",
        "Seamless insurance claim assistance & documentation",
      ],
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
      badge: "Lifetime Protection",
    },
    {
      id: "roof_inspection",
      name: "Professional Roof Inspection",
      tagline: "Certified condition assessment & photographic report",
      description: "Thorough multi-point inspection examining shingle granule loss, flashing integrity, ventilation health, gutter transitions, and storm vulnerability.",
      priceNote: "$149 USD one-time inspection fee (Credited toward any approved repair or replacement)",
      priceAmount: 149,
      whopPlanKey: "INSPECTION",
      features: [
        "Comprehensive 25-point visual & drone scan",
        "Full photographic documentation & condition rating",
        "Insurance-ready condition assessment report",
        "$149 fee credited 100% to future roof work",
      ],
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      badge: "Instant Online Booking",
    },
    {
      id: "roof_maintenance",
      name: "Annual Roof Maintenance Visit",
      tagline: "Proactive care to extend your roof's lifespan by 5-10 years",
      description: "Scheduled preventive maintenance visit covering minor sealant touch-ups, debris clearing from valleys, gutter downspout check, and pipe collar tightening.",
      priceNote: "$299 USD flat-rate visit",
      priceAmount: 299,
      whopPlanKey: "MAINTENANCE",
      features: [
        "Valley and gutter debris clearing",
        "Sealant refresh on all pipe boots and flashings",
        "Resecuring loose ridge caps and perimeter edge metal",
        "Preventive diagnostic checkup before storm season",
      ],
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
      badge: "Preventive Care",
    },
  ] as ServiceItem[],

  serviceAreas: [
    { city: "Austin", zipSample: "78701 - 78759", note: "Central Austin, South Congress, Westlake & Tarrytown" },
    { city: "Round Rock", zipSample: "78664 - 78681", note: "Brushy Creek, Forest Creek & Teravista" },
    { city: "Cedar Park", zipSample: "78613", note: "Twin Creeks, Ranch at Cypress Creek" },
    { city: "Pflugerville", zipSample: "78660", note: "Falcon Pointe, Blackhawk & Highland Park" },
    { city: "Georgetown", zipSample: "78626 - 78633", note: "Historic Square, Sun City & Berry Creek" },
    { city: "Lakeway", zipSample: "78734 - 78738", note: "Lake Travis, The Hills & Rough Hollow" },
    { city: "Buda", zipSample: "78610", note: "Sunfield, Garlic Creek & Cullen Country" },
    { city: "Kyle", zipSample: "78640", note: "Plum Creek, Meadow Woods & Amberwood" },
  ],

  financing: {
    headline: "Roofing Made More Affordable.",
    subheadline: "Your roof is an important investment. Explore available payment options and financing solutions to make your roofing project more manageable.",
    highlights: [
      {
        title: "Flexible Monthly Options",
        description: "Spread your roof replacement or major restoration over manageable monthly installments through supported payment providers at Whop checkout.",
      },
      {
        title: "Zero Hidden Penalties",
        description: "Review exact terms, interest details, and payment schedules directly during checkout prior to confirming.",
      },
      {
        title: "Immediate Coverage",
        description: "Protect your family and property immediately without delaying critical structural repairs due to cash flow.",
      },
    ],
    disclosure: "Notice: Financing eligibility, available payment methods (including Buy Now Pay Later options such as Klarna or Affirm), rates, and terms depend on merchant approval, customer credit/eligibility, provider regional availability, and transaction conditions. Financing is facilitated via Whop's integrated payment options where available and is not guaranteed for every transaction.",
  },

  reviews: [
    {
      id: "rev-1",
      author: "Marcus Vance",
      location: "Austin (Westlake), TX",
      rating: 5,
      date: "October 2026",
      service: "Roof Replacement - Standing Seam Metal",
      content: "After a severe hailstorm damaged our composite roof, Summit Roofing came out the same afternoon. Their inspection report made our insurance claim effortless, and the new metal roof looks stunning. Finished on time and on budget.",
      verified: true,
    },
    {
      id: "rev-2",
      author: "Elena Rodriguez",
      location: "Round Rock, TX",
      rating: 5,
      date: "September 2026",
      service: "Roof Repair & Flashing",
      content: "We had a persistent leak near our chimney that two other roofers failed to solve. Summit diagnosed the failing step-flashing within 20 minutes, repaired it the next day, and we had zero leaks through the tropical storms.",
      verified: true,
    },
    {
      id: "rev-3",
      author: "David & Sarah Chen",
      location: "Lakeway, TX",
      rating: 5,
      date: "August 2026",
      service: "Complete Roof Replacement",
      content: "The online booking for the inspection was seamless with Whop checkout. The crew was respectful of our landscaping, did an exhaustive magnetic nail sweep, and our new architectural shingles look unbelievable.",
      verified: true,
    },
  ] as ReviewItem[],
};
