import assert from "node:assert/strict";
import { onRequestGet as search } from "../functions/api/resources/search.js";
import { onRequestGet as redirect } from "../functions/resources/go/[id].js";

const env = {
  ENVATO_TOKEN: "test-envato-token",
  IMPACT_ACCOUNT_SID: "test-sid",
  IMPACT_AUTH_TOKEN: "test-impact-token",
  IMPACT_PROGRAM_ID: "test-program",
  IMPACT_MEDIA_PROPERTY_ID: "test-property",
  ENVATO_ALLOWED_HOSTS: "themeforest.net",
  AFFILIATE_FAIL_OPEN: "false"
};
const waitUntil = () => {};

globalThis.fetch = async url => {
  assert.match(String(url), /api\.envato\.com/);
  return Response.json({ matches: [{ id: 321, name: "Fashion Ecommerce HTML Template", url: "https://themeforest.net/item/example/321", price_cents: 1900 }] });
};
const found = await search({ request: new Request("https://cholbei.test/api/resources/search?q=fashion"), env, waitUntil });
assert.equal(found.status, 200);
assert.equal((await found.json()).items[0].id, "321");

let calls = 0;
globalThis.fetch = async url => {
  calls += 1;
  if (calls === 1) return Response.json({ id: 321, name: "Fashion Ecommerce HTML Template", url: "https://themeforest.net/item/example/321" });
  assert.match(String(url), /api\.impact\.com/);
  return Response.json({ TrackingURL: "https://example.sjv.io/tracked-item" });
};
const tracked = await redirect({ request: new Request("https://cholbei.test/resources/go/321/"), params: { id: "321" }, env, waitUntil });
assert.equal(tracked.status, 302);
assert.equal(tracked.headers.get("location"), "https://example.sjv.io/tracked-item");

calls = 0;
const rejected = await redirect({ request: new Request("https://cholbei.test/resources/go/no/"), params: { id: "https://evil.test" }, env, waitUntil });
assert.equal(rejected.status, 404);
assert.equal(calls, 0);

globalThis.fetch = async () => Response.json({ id: 999, name: "Test", url: "https://evil.test/item/999" });
const blocked = await redirect({ request: new Request("https://cholbei.test/resources/go/999/"), params: { id: "999" }, env, waitUntil });
assert.equal(blocked.status, 502);

console.log("Cloudflare handler and redirect security checks passed.");
