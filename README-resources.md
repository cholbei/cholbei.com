# Cholbei Resources

Cholbei Resources is a database-free affiliate discovery page at `/resources/`. It retrieves product data from the official Envato Market API and creates outbound affiliate URLs server-side through Impact. The main Cholbei navigation intentionally does not link to it in v1.

## Current launch scope

- Static, indexable Resources landing page
- Live Envato search with relevance filtering
- Curated featured IDs loaded from `config/featured-resources.js`
- Live item-detail view through `/resources/?item=ITEM_ID`
- Strict `/resources/go/ITEM_ID/` affiliate redirect
- Cloudflare Cache API for short-lived product/search/link caching
- Clear affiliate disclosure and analytics data hooks
- Fail-closed behavior when Impact is unavailable

Deals, promo codes, promotions, ads, and catalog feeds are not rendered yet. Add them only after the discovery script confirms that the approved Envato program exposes valid data.

## Required Cloudflare variables and secrets

Add these as encrypted secrets in Cloudflare Pages > Settings > Variables and Secrets:

```text
ENVATO_TOKEN
IMPACT_ACCOUNT_SID
IMPACT_AUTH_TOKEN
```

Add these non-secret variables:

```text
IMPACT_PROGRAM_ID
IMPACT_MEDIA_PROPERTY_ID
ENVATO_ALLOWED_HOSTS
SITE_BASE_URL=https://cholbei.com
RESOURCES_PATH=/resources
ENVATO_ITEM_CACHE_TTL=1800
ENVATO_SEARCH_CACHE_TTL=900
IMPACT_LINK_CACHE_TTL=21600
AFFILIATE_FAIL_OPEN=false
DEBUG_INTEGRATIONS=false
DEFAULT_CURRENCY=USD
RESOURCES_INDEXING=true
```

`ENVATO_ALLOWED_HOSTS` must be a comma-separated list confirmed against the active Impact Envato program's deep-link rules, for example `themeforest.net,codecanyon.net`. Do not add an unverified marketplace. Keep `AFFILIATE_FAIL_OPEN=false` for launch.

Never commit `.dev.vars`; copy `.dev.vars.example` locally and insert test credentials only in `.dev.vars`.

## Envato setup

1. Create an Envato personal token with only the access required for Market catalogue calls.
2. Save it as the encrypted `ENVATO_TOKEN` Cloudflare secret.
3. Choose at least three complementary template/UI item IDs.
4. Add only their IDs, Cholbei group, and order to `config/featured-resources.js`. Do not copy titles, prices, descriptions, images, or destination URLs into GitHub.
5. Set one verified item as `ENVATO_TEST_ITEM_ID` locally for discovery testing.

## Impact setup

1. Confirm the Envato program and contract are active in the Impact partner account.
2. Record the Program ID and approved Cholbei Media Property ID.
3. Confirm deep linking is enabled and record the exact permitted Envato hostnames.
4. Store the account SID and auth token as encrypted Cloudflare secrets.
5. Run the integration test before publishing affiliate links.

Impact API products can differ by account/program. If tracking-link creation returns a schema or endpoint error, capture only the HTTP status and redacted response shape, then adjust `functions/_lib/impact.js` to the documented endpoint available to this account. Never log authorization headers or tokens.

## Local development

Static servers do not execute Pages Functions. Use Wrangler:

```powershell
Copy-Item .dev.vars.example .dev.vars
npx wrangler pages dev . --port 8788
```

Then visit:

```text
http://localhost:8788/resources/
http://localhost:8788/api/resources/search?q=ecommerce
http://localhost:8788/api/resources/item/ENVATO_ITEM_ID
http://localhost:8788/resources/go/ENVATO_ITEM_ID/
```

Run integration discovery from a terminal whose environment contains the same variables:

```powershell
node scripts/test-integrations.mjs
```

## Deployment

Deploy the repository as a Cloudflare Pages project connected to GitHub. Use no framework preset and the repository root as the output directory. Configure secrets and variables before the production deployment. After deployment, run all four test URLs above with a real approved item ID.

## Known limitations and owner actions

- No real credentials were available during development, so API discovery and an earning click could not be executed locally.
- Featured products remain empty until verified IDs are curated.
- The Impact tracking-link endpoint and returned field must be confirmed with the active account.
- Deals, promotions, promo codes, ads, catalog availability, contract status, and program status remain unverified.
- The owner must confirm `ENVATO_ALLOWED_HOSTS`; the redirect intentionally fails until this allowlist exists.
- Product detail is a query-state view in the v1 page and is not intended for individual search indexing.
