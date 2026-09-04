// Cholbei-owned editorial definitions. Product data and rankings are calculated
// from live Envato API responses; no third-party item records are stored here.
export const resourceCategories = Object.freeze({
  "ecommerce-templates": {
    label: "Ecommerce Templates",
    query: "ecommerce HTML template",
    site: "themeforest.net",
    description: "Sales-ready storefront interfaces for fashion, retail, grocery and specialist online shops.",
    guide: "A useful ecommerce template should make product discovery, trust and checkout intent clear before visual effects. We favour frontend templates that can be adapted to an independent store, connect cleanly to a custom backend and remain understandable to the next developer. The ranking combines marketplace demand with rating evidence; it is a shortlist for evaluation, not a claim that one design fits every business.",
    checks: ["Confirm the framework matches your delivery stack.", "Test product, cart and mobile navigation demos.", "Review the license and update history before purchase."]
  },
  "admin-dashboards": {
    label: "Admin Dashboards",
    query: "admin dashboard HTML template",
    site: "themeforest.net",
    description: "Proven admin interfaces for orders, inventory, analytics and operational workflows.",
    guide: "Admin templates can shorten interface work, but component coverage matters more than a dramatic demo. We prioritise adaptable frontend kits with tables, forms, charts, authentication screens and responsive navigation. A highly sold dashboard can still be wrong for a small workflow, so compare bundle size, accessibility, build tooling and the quality of components you will actually use.",
    checks: ["List the tables, forms and dashboards your system needs.", "Check build dependencies and framework versions.", "Verify mobile, keyboard and dark-mode behaviour."]
  },
  "saas-crm-ui": {
    label: "SaaS & CRM UI",
    query: "SaaS CRM dashboard UI template",
    site: "themeforest.net",
    description: "Business-focused interfaces for SaaS products, customer portals and CRM experiences.",
    guide: "SaaS and CRM interfaces must help people understand status, next actions and exceptions quickly. Our automated list looks for established UI resources with marketplace evidence, while this guide keeps the decision focused on information architecture. Evaluate whether the template supports your real roles, permissions, empty states and data density instead of choosing solely by the number of demo pages.",
    checks: ["Map user roles before evaluating screens.", "Inspect empty, loading and validation states.", "Choose components that remain clear with real data."]
  },
  "developer-templates": {
    label: "Developer Templates",
    query: "developer agency HTML template",
    site: "themeforest.net",
    description: "Flexible website foundations for developers, freelancers and digital agencies.",
    guide: "A developer or agency website should communicate expertise without making visitors decode the design. We look for flexible templates with strong case-study, service and contact patterns, then rank candidates using current Envato marketplace signals. Before licensing one, confirm that its visual language suits your positioning and that you can replace every demo section with specific proof of your own work.",
    checks: ["Prioritise case studies and service clarity.", "Check performance before adding demo effects.", "Replace all sample claims with verifiable proof."]
  }
});