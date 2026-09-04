# cholbei.com

The public website for Cholbei: complete, modern, client-owned websites and lightweight web systems.

## Positioning

Cholbei designs, develops, deploys, documents, and hands over websites and web systems built in the client's own GitHub, Cloudflare, domain, and Google accounts. The client owns the code, infrastructure, credentials, and data.

## Service packs

- Basic Website Pack
- Business Website Pack
- Advanced Web System Pack

The source of truth for the business and architecture is `Cholbei — New Business & Technical Model.md`.

## Local preview

The marketing homepage can be served through XAMPP at `http://localhost/cholbei.com/`. The API-driven Resources section requires Cloudflare Pages Functions; see `README-resources.md` for Wrangler setup.

## Resources

`/resources/` is an isolated Envato/Impact affiliate discovery section. It is intentionally absent from the main navigation in v1. Product data remains live through Envato, affiliate links are generated server-side through Impact, and no product database is used.

## Deployment

Deploy the repository from GitHub through Cloudflare Pages so the static site and Pages Functions ship together. Keep the custom domain declared in `CNAME` until DNS/deployment migration is complete.
