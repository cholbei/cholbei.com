const env = process.env;
const required = ["ENVATO_TOKEN", "ENVATO_TEST_ITEM_ID", "IMPACT_ACCOUNT_SID", "IMPACT_AUTH_TOKEN", "IMPACT_PROGRAM_ID", "IMPACT_MEDIA_PROPERTY_ID"];
const missing = required.filter(name => !env[name]);
if (missing.length) {
  console.error(`Configuration: MISSING (${missing.join(", ")})`);
  console.error("No network requests were made. Secrets were not printed.");
  process.exit(1);
}

const impactRoot = `https://api.impact.com/Mediapartners/${encodeURIComponent(env.IMPACT_ACCOUNT_SID)}`;
const impactAuth = `Basic ${Buffer.from(`${env.IMPACT_ACCOUNT_SID}:${env.IMPACT_AUTH_TOKEN}`).toString("base64")}`;
const report = [];

async function api(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch { data = {}; }
    return { ok: response.ok, status: response.status, data };
  } finally { clearTimeout(timeout); }
}

const impactGet = path => api(`${impactRoot}${path}`, { headers: { Authorization: impactAuth, Accept: "application/json" } });
const collectionSize = data => {
  const array = Object.values(data || {}).find(value => Array.isArray(value));
  return array ? array.length : 0;
};

async function inspect(label, task) {
  try {
    const result = await task();
    const availability = result.ok ? (collectionSize(result.data) ? `AVAILABLE (${collectionSize(result.data)} returned)` : "FOUND / EMPTY") : `UNAVAILABLE (HTTP ${result.status})`;
    report.push(`${label}: ${availability}`);
    return result;
  } catch (error) {
    report.push(`${label}: UNAVAILABLE (${error.name === "AbortError" ? "TIMEOUT" : "NETWORK ERROR"})`);
    return { ok: false, data: {}, status: 0 };
  }
}

const item = await inspect("Envato item", () => api(`https://api.envato.com/v3/market/catalog/item?id=${encodeURIComponent(env.ENVATO_TEST_ITEM_ID)}`, { headers: { Authorization: `Bearer ${env.ENVATO_TOKEN}`, Accept: "application/json" } }));
const destination = item.data.url || item.data.item_url || item.data.web_url;
const normalized = item.ok && item.data.id && destination && /^https:\/\//.test(destination);
report.push(`Envato normalization: ${normalized ? "SUCCESS" : "FAILED"}`);

await inspect("Envato program", () => impactGet(`/Programs/${encodeURIComponent(env.IMPACT_PROGRAM_ID)}`));
await inspect("Contract", () => impactGet(`/Contracts?ProgramId=${encodeURIComponent(env.IMPACT_PROGRAM_ID)}&PageSize=10`));
await inspect("Media property", () => impactGet(`/MediaProperties/${encodeURIComponent(env.IMPACT_MEDIA_PROPERTY_ID)}`));
await inspect("Catalogs", () => impactGet("/Catalogs?PageSize=10"));
await inspect("Marketplace products", () => impactGet("/Products?PageSize=10"));
await inspect("Deals", () => impactGet(`/Deals?ProgramId=${encodeURIComponent(env.IMPACT_PROGRAM_ID)}&PageSize=10`));
await inspect("Promo codes", () => impactGet(`/PromoCodes?ProgramId=${encodeURIComponent(env.IMPACT_PROGRAM_ID)}&PageSize=10`));
await inspect("Promotions", () => impactGet(`/Promotions?ProgramId=${encodeURIComponent(env.IMPACT_PROGRAM_ID)}&PageSize=10`));
await inspect("Ads", () => impactGet(`/Ads?ProgramId=${encodeURIComponent(env.IMPACT_PROGRAM_ID)}&PageSize=10`));

if (normalized) {
  await inspect("Tracking-link test", () => {
    const endpoint = new URL(`${impactRoot}/Programs/${encodeURIComponent(env.IMPACT_PROGRAM_ID)}/TrackingLinks`);
    endpoint.search = new URLSearchParams({ MediaPartnerPropertyId: env.IMPACT_MEDIA_PROPERTY_ID, DeepLink: destination, subId1: "cholbei-resources", subId2: "integration-test", subId3: String(env.ENVATO_TEST_ITEM_ID), sharedId: "local-test" }).toString();
    return api(endpoint, { method: "POST", headers: { Authorization: impactAuth, Accept: "application/json" } });
  });
} else report.push("Tracking-link test: SKIPPED (no trusted Envato destination)");

console.log("Cholbei Resources integration discovery (redacted)");
console.log("================================================");
report.forEach(line => console.log(line));
console.log("No credentials or authorization headers were printed.");
