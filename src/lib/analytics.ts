/**
 * Lightweight analytics layer.
 *
 * Lovable's built-in visitor analytics works on the published site with no code.
 * This module adds optional Google Analytics (GA4) support: it only loads and
 * only sends anything once the visitor has accepted optional cookies.
 */

const MEASUREMENT_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let consentGranted = false;
let scriptLoaded = false;

const gtag = (...args: unknown[]) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

const loadScript = () => {
  if (scriptLoaded || !MEASUREMENT_ID) return;
  scriptLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
};

export const setAnalyticsConsent = (granted: boolean) => {
  consentGranted = granted;
  if (granted) loadScript();
};

export const trackPageView = (path: string) => {
  if (!consentGranted || !MEASUREMENT_ID) return;
  gtag("event", "page_view", { page_path: path });
};

export const trackEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (!consentGranted || !MEASUREMENT_ID) return;
  gtag("event", name, params);
};
