import { getConfig, IntegrationError } from "../../_lib/config.js";
import { getEnvatoItem } from "../../_lib/envato.js";
import { createTrackingUrl } from "../../_lib/impact.js";
import { escapeHtml, validItemId, validateDestination } from "../../_lib/security.js";

function errorPage(message, status = 503) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Link unavailable | Cholbei Resources</title><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/resources/assets/resources.css"></head><body class="resource-error-page"><main><a class="resource-brand" href="/resources/">cholbei / resources</a><section><p class="resource-kicker">External link</p><h1>That link is temporarily unavailable.</h1><p>${escapeHtml(message)}</p><a class="button button-primary" href="/resources/">Back to Resources</a></section></main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}

export async function onRequestGet(context) {
  try {
    const id = validItemId(context.params.id);
    const config = getConfig(context.env);
    if (!config.allowedHosts.length) {
      throw new IntegrationError("Affiliate destinations have not been approved yet.", 503, "ALLOWLIST_MISSING");
    }
    const item = await getEnvatoItem(context, id);
    const destination = validateDestination(item.envatoUrl, config.allowedHosts);
    try {
      const { trackingUrl } = await createTrackingUrl(context, destination, {
        itemId: id, category: "resource", placement: "resource-card"
      });
      return Response.redirect(trackingUrl, 302);
    } catch (error) {
      if (config.failOpen) return Response.redirect(destination, 302);
      throw error;
    }
  } catch (error) {
    return errorPage(error instanceof IntegrationError ? error.message : "Please try again later.", error instanceof IntegrationError ? error.status : 503);
  }
}
