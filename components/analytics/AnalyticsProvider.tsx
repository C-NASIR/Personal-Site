'use client';

import { Analytics } from "@vercel/analytics/react";

const isEnabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

export function AnalyticsProvider() {
  if (!isEnabled) {
    return null;
  }

  return <Analytics />;
}

export default AnalyticsProvider;

