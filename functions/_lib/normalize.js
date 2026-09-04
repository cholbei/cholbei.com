const first = (...values) => values.find(value => value !== undefined && value !== null && value !== "");
const number = value => Number.isFinite(Number(value)) ? Number(value) : null;
const image = value => typeof value === "string" ? value : first(value?.url, value?.href, value?.image_url, value?.icon_url, value?.landscape_url);

export function normalizeEnvatoItem(raw = {}, currency = "USD") {
  const name = first(raw.name, raw.title, "Untitled resource");
  const previewValues = Array.isArray(raw.previews) ? raw.previews : Object.values(raw.previews || {});
  const previews = previewValues.map(image).filter(Boolean);
  const cents = raw.price_cents === undefined ? null : number(raw.price_cents) / 100;
  const amount = number(first(raw.price, cents));
  return {
    id: String(first(raw.id, raw.item_id, raw.itemId, "")),
    name,
    slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90),
    author: first(raw.author_username, raw.author, raw.author_name, null),
    market: first(raw.site, raw.market, null),
    category: first(raw.classification, raw.category, null),
    price: amount === null ? null : { amount, currency: first(raw.currency, currency) },
    rating: number(first(raw.rating, raw.rating_decimal)),
    sales: number(first(raw.number_of_sales, raw.sales)),
    thumbnail: image(first(raw.thumbnail, raw.thumbnail_url, raw.image, raw.previews?.icon_preview, raw.previews?.icon_with_landscape_preview)) || previews[0] || null,
    images: previews,
    livePreviewUrl: first(raw.live_preview_url, raw.preview_url, raw.previews?.live_site?.url, null),
    envatoUrl: first(raw.url, raw.item_url, raw.web_url, null),
    updatedAt: first(raw.updated_at, raw.last_update, null)
  };
}

const replacement = /\b(multivendor|multi-vendor|erp|complete crm|inventory management system|e-?commerce application)\b/i;
const relevant = /\b(template|theme|ui|dashboard|admin|bootstrap|html|frontend|landing|saas|crm)\b/i;

export function isRelevant(item) {
  const text = [item.name, item.category, item.market].filter(Boolean).join(" ");
  return relevant.test(text) && !replacement.test(text);
}
