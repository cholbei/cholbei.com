import { resourceCategories } from "../../config/featured-resources.js";
import { getCategoryTop } from "../_lib/rank.js";
import { escapeHtml } from "../_lib/security.js";

const siteUrl = "https://cholbei.com";

function money(price) {
  if (!price || !Number.isFinite(Number(price.amount))) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency || "USD",
      maximumFractionDigits: 0
    }).format(price.amount);
  } catch {
    return escapeHtml((price.currency || "USD") + " " + price.amount);
  }
}

function card(item) {
  const name = escapeHtml(item.name || "Untitled resource");
  const author = item.author ? "<p class=\"author\">By " + escapeHtml(item.author) + "</p>" : "";
  const thumbnail = /^https:\/\//i.test(item.thumbnail || "")
    ? escapeHtml(item.thumbnail)
    : "/resources/assets/resource-placeholder.svg";
  const facts = [
    money(item.price),
    item.rating ? escapeHtml(item.rating + " rating") : "",
    Number(item.reviews) > 0 ? escapeHtml(Number(item.reviews).toLocaleString("en-US") + " reviews") : "",
    Number.isFinite(Number(item.sales)) ? escapeHtml(Number(item.sales).toLocaleString("en-US") + " sales") : ""
  ].filter(Boolean).map(value => "<span>" + value + "</span>").join("");
  const id = encodeURIComponent(item.id);
  return [
    "<article class=\"resource-card\">",
      "<div class=\"resource-image\">",
        "<img src=\"" + thumbnail + "\" alt=\"" + name + " preview\" width=\"800\" height=\"500\" loading=\"lazy\">",
        "<span class=\"resource-source\">" + escapeHtml(item.market || "Envato") + "</span>",
        "<span class=\"resource-rank\">#" + Number(item.rank) + " in this category</span>",
      "</div>",
      "<div class=\"resource-card-body\">",
        "<div class=\"resource-meta\">" + escapeHtml(item.category || "Digital resource") + "</div>",
        "<h2>" + name + "</h2>",
        author,
        facts ? "<div class=\"resource-facts\">" + facts + "</div>" : "",
        "<div class=\"resource-actions\">",
          "<a href=\"/resources/?item=" + id + "\">View details</a>",
          "<a class=\"affiliate-link\" href=\"/resources/go/" + id + "/\" target=\"_blank\" rel=\"sponsored noopener noreferrer\">View on Envato -&gt;</a>",
        "</div>",
      "</div>",
    "</article>"
  ].join("");
}

function page(group) {
  const title = "Top 5 " + group.label + " | Cholbei Resources";
  const canonical = siteUrl + "/resources/" + group.slug + "/";
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 5 " + group.label,
    description: group.description,
    numberOfItems: group.items.length,
    itemListElement: group.items.map(item => ({
      "@type": "ListItem",
      position: item.rank,
      name: item.name,
      url: siteUrl + "/resources/?item=" + encodeURIComponent(item.id)
    }))
  };
  const schema = JSON.stringify(list).replace(/</g, "\\u003c");
  const checks = group.checks.map(check => "<li>" + escapeHtml(check) + "</li>").join("");
  const cards = group.items.map(card).join("");

  return [
    "<!doctype html><html lang=\"en\"><head>",
    "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>" + escapeHtml(title) + "</title>",
    "<meta name=\"description\" content=\"" + escapeHtml(group.description) + "\">",
    "<link rel=\"canonical\" href=\"" + canonical + "\">",
    "<meta property=\"og:type\" content=\"website\"><meta property=\"og:title\" content=\"" + escapeHtml(title) + "\"><meta property=\"og:description\" content=\"" + escapeHtml(group.description) + "\"><meta property=\"og:url\" content=\"" + canonical + "\">",
    "<link rel=\"icon\" href=\"/assets/img/favicon.svg\" type=\"image/svg+xml\"><link rel=\"stylesheet\" href=\"/assets/css/style.css\"><link rel=\"stylesheet\" href=\"/resources/assets/resources.css\"><link rel=\"stylesheet\" href=\"/resources/assets/category.css\">",
    "<script type=\"application/ld+json\">" + schema + "</script>",
    "</head><body class=\"resources-page\">",
    "<a class=\"skip-link\" href=\"#resources-main\">Skip to resources</a>",
    "<header class=\"resources-header\"><div class=\"resources-container resources-nav\"><a class=\"resource-brand\" href=\"/resources/\"><span>cholbei</span><i>/ resources</i></a><a class=\"back-link\" href=\"/resources/\">All resources -&gt;</a></div></header>",
    "<main id=\"resources-main\">",
    "<section class=\"category-hero\"><div class=\"resources-container\"><p class=\"resource-breadcrumb\"><a href=\"/resources/\">Resources</a> / " + escapeHtml(group.label) + "</p><p class=\"resource-kicker\">Automated live ranking</p><h1>Top 5 " + escapeHtml(group.label) + "</h1><p class=\"resource-lead\">" + escapeHtml(group.description) + "</p></div></section>",
    "<section class=\"category-ranking\"><div class=\"resources-container\"><div class=\"results-heading\"><div><p class=\"resource-kicker\">Current shortlist</p><h2>Popular, well-rated choices</h2></div><p>Live Envato data</p></div><div class=\"resource-group-grid\">" + cards + "</div></div></section>",
    "<section class=\"category-method\"><div class=\"resources-container category-method-grid\"><article><p class=\"resource-kicker\">Selection guide</p><h2>How to choose</h2><p>" + escapeHtml(group.guide) + "</p></article><aside><h2>Before you buy</h2><ul class=\"buyer-checks\">" + checks + "</ul></aside></div></section>",
    "<aside class=\"affiliate-disclosure\"><div class=\"resources-container\"><span>How this list works</span><p>Rankings are calculated from current rating, review-confidence and sales signals returned by Envato. They are not paid placements or personal hands-on reviews. Affiliate links may earn Cholbei a commission at no additional cost to you.</p></div></aside>",
    "</main><footer class=\"resources-footer\"><div class=\"resources-container\"><div><a class=\"resource-brand\" href=\"/resources/\"><span>cholbei</span><i>/ resources</i></a><p>Useful tools for better web work.</p></div><div><a href=\"/resources/\">Browse all resources -&gt;</a><a href=\"/\">About Cholbei -&gt;</a></div></div><p class=\"resources-container copyright\">&copy; Cholbei. Third-party product names and trademarks belong to their respective owners.</p></footer>",
    "</body></html>"
  ].join("");
}

export async function onRequestGet(context) {
  const category = String(context.params.category || "").toLowerCase();
  if (!resourceCategories[category]) {
    return new Response("Resource category not found.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" }
    });
  }
  try {
    const group = await getCategoryTop(context, category, 5);
    return new Response(page(group), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600"
      }
    });
  } catch (error) {
    const status = Number(error.status) || 503;
    return new Response("Resource rankings are temporarily unavailable.", {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "300", "X-Robots-Tag": "noindex" }
    });
  }
}
