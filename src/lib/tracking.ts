/**
 * Whop Pixel & Conversion Tracking
 * Provides safe, deduplicated client-side event tracking for:
 * 1. estimate_requested
 * 2. service_viewed
 * 3. deposit_started
 */

declare global {
  interface Window {
    whop?: {
      track: (eventName: string, params?: Record<string, unknown>) => void;
      setScope?: (scope: string) => void;
      [key: string]: unknown;
    };
  }
}

// Memory cache to prevent duplicate events fired by React Strict Mode, fast re-renders, or double-clicks
const trackedEventIds = new Set<string>();

/**
 * Dispatches an event through whop.track with strict deduplication.
 */
export function trackWhopEvent(
  eventName: "estimate_requested" | "service_viewed" | "deposit_started" | string,
  eventId: string,
  payload: Record<string, unknown> = {}
): boolean {
  if (!eventId) {
    console.warn("[Whop Tracking] Event omitted: missing unique event_id");
    return false;
  }

  const dedupKey = `${eventName}:${eventId}`;
  if (trackedEventIds.has(dedupKey)) {
    // Avoid double-firing
    return false;
  }

  trackedEventIds.add(dedupKey);

  const eventData = {
    event_id: eventId,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window !== "undefined" && window.whop && typeof window.whop.track === "function") {
    try {
      window.whop.track(eventName, eventData);
      console.log(`[Whop Tracked] ✓ ${eventName}`, eventData);
      return true;
    } catch (err) {
      console.error(`[Whop Tracking Error] Failed to track ${eventName}:`, err);
      return false;
    }
  } else {
    // Fallback: log to console in development / mock environment
    console.log(`[Whop Tracked (Local/Simulated)] ✓ ${eventName}`, eventData);
    return true;
  }
}

/**
 * Event 1: estimate_requested
 * Fired only AFTER confirmed successful lead creation on the server.
 */
export function trackEstimateRequested(submissionId: string, metadata: { service: string; zip: string }): boolean {
  return trackWhopEvent("estimate_requested", submissionId, {
    service: metadata.service,
    zip_code: metadata.zip,
  });
}

/**
 * Event 2: service_viewed
 * Fired when a customer intentionally inspects a roofing service card/details.
 */
export function trackServiceViewed(serviceId: string): boolean {
  const viewId = `view_${serviceId}_${Date.now()}`;
  return trackWhopEvent("service_viewed", viewId, {
    service: serviceId,
  });
}

/**
 * Event 3: deposit_started
 * Fired when a customer intentionally opens the $500 project deposit checkout modal.
 */
export function trackDepositStarted(checkoutAttemptId: string): boolean {
  return trackWhopEvent("deposit_started", checkoutAttemptId, {
    value: 500,
    currency: "USD",
  });
}
