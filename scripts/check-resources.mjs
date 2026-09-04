import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeEnvatoItem, isRelevant } from "../functions/_lib/normalize.js";
import { validItemId, validSearch, validateDestination } from "../functions/_lib/security.js";

const item = normalizeEnvatoItem({ id: 123, name: "Modern Ecommerce HTML Template", url: "https://themeforest.net/item/example/123", price_cents: 2900, number_of_sales: 4 }, "USD");
assert.equal(item.id, "123");
assert.equal(item.price.amount, 29);
assert.equal(isRelevant(item), true);
assert.equal(validItemId("123"), "123");
assert.equal(validSearch("  admin   dashboard "), "admin dashboard");
assert.equal(validateDestination(item.envatoUrl, ["themeforest.net"]), item.envatoUrl);
assert.throws(() => validateDestination("https://example.com/", ["themeforest.net"]));
assert.throws(() => validItemId("https://example.com"));

const html = await readFile(new URL("../resources/index.html", import.meta.url), "utf8");
const script = await readFile(new URL("../resources/assets/resources.js", import.meta.url), "utf8");
assert.match(html, /Some links in Cholbei Resources are affiliate links/);
assert.match(html, /data-resource-search/);
assert.doesNotMatch(html, /<a[^>]+href="\/resources\/go\/\?url=/);
assert.match(script, /sponsored noopener noreferrer/);
console.log("Cholbei Resources checks passed.");
