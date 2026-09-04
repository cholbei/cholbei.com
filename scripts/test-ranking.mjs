import assert from "node:assert/strict";
import { rankResources } from "../functions/_lib/rank.js";
import { onRequestGet as categoryPage } from "../functions/resources/[category].js";

const sample = [
  { id: "1", name: "Rated Template One", rating: 4.9, reviews: 120, sales: 900 },
  { id: "2", name: "Rated Template Two", rating: 4.7, reviews: 80, sales: 800 },
  { id: "3", name: "Rated Template Three", rating: 4.6, reviews: 60, sales: 700 },
  { id: "4", name: "Rated Template Four", rating: 4.5, reviews: 40, sales: 600 },
  { id: "5", name: "Rated Template Five", rating: 4.4, reviews: 20, sales: 500 },
  { id: "6", name: "Unrated Bestseller", rating: null, reviews: null, sales: 50000 }
];
const ranked = rankResources(sample, 5);
assert.equal(ranked.length, 5);
assert.deepEqual(ranked.map(item => item.id), ["1", "2", "3", "4", "5"]);
assert.deepEqual(ranked.map(item => item.rank), [1, 2, 3, 4, 5]);

const env = { ENVATO_TOKEN: "test-token" };
const waitUntil = () => {};
globalThis.fetch = async input => {
  const url = new URL(String(input));
  assert.equal(url.hostname, "api.envato.com");
  assert.equal(url.searchParams.get("sort_by"), "sales");
  assert.equal(url.searchParams.get("page_size"), "100");
  assert.equal(url.searchParams.get("site"), "themeforest.net");
  return Response.json({
    total_hits: 6,
    matches: sample.map((item, index) => ({
      id: item.id,
      name: index === 0 ? "Rated Ecommerce Template <script>alert(1)</script>" : item.name + " HTML Template",
      url: "https://themeforest.net/item/example/" + item.id,
      site: "themeforest.net",
      classification: "site-templates/retail",
      rating: item.rating,
      rating_count: item.reviews,
      number_of_sales: item.sales,
      price_cents: 2900,
      thumbnail: "https://example.test/thumb-" + item.id + ".jpg"
    }))
  });
};

const rendered = await categoryPage({
  request: new Request("https://cholbei.test/resources/ecommerce-templates/"),
  params: { category: "ecommerce-templates" },
  env,
  waitUntil
});
assert.equal(rendered.status, 200);
assert.equal(rendered.headers.get("content-type"), "text/html; charset=utf-8");
const html = await rendered.text();
assert.match(html, /<link rel="canonical" href="https:\/\/cholbei\.com\/resources\/ecommerce-templates\/">/);
assert.match(html, /"@type":"ItemList"/);
assert.match(html, /rating, review-confidence and sales signals/);
assert.equal((html.match(/class="resource-card"/g) || []).length, 5);
assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);

const missing = await categoryPage({
  request: new Request("https://cholbei.test/resources/not-a-category/"),
  params: { category: "not-a-category" },
  env,
  waitUntil
});
assert.equal(missing.status, 404);
assert.equal(missing.headers.get("x-robots-tag"), "noindex");

console.log("Automated ranking and category page checks passed.");
