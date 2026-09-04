import { cachedJson } from "./cache.js";
import { getConfig, IntegrationError, requireEnv } from "./config.js";
import { isRelevant, normalizeEnvatoItem } from "./normalize.js";

const API = "https://api.envato.com";

async function envatoRequest(env, path, parameters = {}) {
  requireEnv(env, ["ENVATO_TOKEN"]);
  const url = new URL(path, API);
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  let response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${env.ENVATO_TOKEN}`, Accept: "application/json" },
      signal: controller.signal
    });
  } catch {
    throw new IntegrationError("Envato is temporarily unavailable.", 503, "ENVATO_UNAVAILABLE");
  } finally { clearTimeout(timeout); }
  if (response.status === 404) throw new IntegrationError("Resource not found.", 404, "ITEM_NOT_FOUND");
  if (response.status === 429) throw new IntegrationError("Resources are busy. Please try again shortly.", 503, "RATE_LIMITED");
  if (!response.ok) throw new IntegrationError("Envato is temporarily unavailable.", 503, "ENVATO_ERROR");
  return response.json();
}

export function getEnvatoItem(context, id) {
  const config = getConfig(context.env);
  return cachedJson(context, "envato-item", id, config.itemTtl, async () => {
    const raw = await envatoRequest(context.env, "/v3/market/catalog/item", { id });
    const item = normalizeEnvatoItem(raw, config.currency);
    if (!item.id || !item.envatoUrl) throw new IntegrationError("Resource not found.", 404, "ITEM_NOT_FOUND");
    return item;
  });
}

export function searchEnvato(context, query, page = 1) {
  const config = getConfig(context.env);
  return cachedJson(context, "envato-search", `${query}:${page}`, config.searchTtl, async () => {
    const raw = await envatoRequest(context.env, "/v1/discovery/search/search/item", { term: query, page, page_size: 24 });
    const matches = raw.matches || raw.items || raw.results || [];
    const items = matches.map(entry => normalizeEnvatoItem(entry, config.currency))
      .filter(item => item.id && item.envatoUrl && isRelevant(item));
    return { items, page, total: Number(raw.total_hits || raw.total || items.length) };
  });
}
