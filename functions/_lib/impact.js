import { cachedJson } from "./cache.js";
import { getConfig, IntegrationError, requireEnv } from "./config.js";

const API = "https://api.impact.com";
const authorization = env => `Basic ${btoa(`${env.IMPACT_ACCOUNT_SID}:${env.IMPACT_AUTH_TOKEN}`)}`;

export function createTrackingUrl(context, destination, metadata = {}) {
  const { env } = context;
  requireEnv(env, ["IMPACT_ACCOUNT_SID", "IMPACT_AUTH_TOKEN", "IMPACT_PROGRAM_ID", "IMPACT_MEDIA_PROPERTY_ID"]);
  const config = getConfig(env);
  const key = [metadata.itemId, metadata.category, metadata.placement].filter(Boolean).join(":");
  return cachedJson(context, "impact-link", key, config.linkTtl, async () => {
    const endpoint = new URL(`${API}/Mediapartners/${encodeURIComponent(env.IMPACT_ACCOUNT_SID)}/Programs/${encodeURIComponent(env.IMPACT_PROGRAM_ID)}/TrackingLinks`);
    endpoint.search = new URLSearchParams({
      MediaPartnerPropertyId: env.IMPACT_MEDIA_PROPERTY_ID,
      DeepLink: destination,
      subId1: "cholbei-resources",
      subId2: metadata.category || "resource",
      subId3: metadata.itemId || "",
      sharedId: metadata.placement || "resource-card"
    }).toString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: authorization(env), Accept: "application/json" },
        signal: controller.signal
      });
    } catch {
      throw new IntegrationError("The affiliate destination is temporarily unavailable.", 503, "IMPACT_UNAVAILABLE");
    } finally { clearTimeout(timeout); }
    if (response.status === 429) throw new IntegrationError("The affiliate destination is busy. Please try again shortly.", 503, "RATE_LIMITED");
    if (!response.ok) throw new IntegrationError("The affiliate destination is temporarily unavailable.", 503, "TRACKING_LINK_ERROR");
    const data = await response.json();
    const trackingUrl = data.TrackingURL || data.TrackingUrl || data.trackingUrl || data.Url || data.url;
    if (!trackingUrl || !/^https:\/\//i.test(trackingUrl)) {
      throw new IntegrationError("The affiliate destination is temporarily unavailable.", 503, "TRACKING_LINK_MISSING");
    }
    return { trackingUrl };
  });
}
