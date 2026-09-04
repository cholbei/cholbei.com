import { resourceCategories } from "../../config/featured-resources.js";
import { searchEnvato } from "./envato.js";
import { IntegrationError } from "./config.js";

const scoreItem = item => {
  const sales = Math.max(Number(item.sales) || 0, 0);
  const rating = Math.max(Math.min(Number(item.rating) || 0, 5), 0);
  const reviews = Math.max(Number(item.reviews) || 0, 0);
  const popularity = Math.log10(sales + 10) * 2.2;
  const confidence = reviews ? Math.min(Math.log10(reviews + 1) / 2, 1) : Math.min(Math.log10(sales + 1) / 4, .7);
  const quality = rating ? rating * (1.2 + confidence) : 0;
  return Number((popularity + quality).toFixed(4));
};

export function rankResources(items, limit = 5) {
  const unique = new Map();
  items.forEach(item => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });
  const scored = [...unique.values()]
    .filter(item => Number(item.sales) >= 5 || Number(item.reviews) >= 2)
    .map(item => ({ ...item, rankScore: scoreItem(item) }));
  const trusted = scored.filter(item =>
    Number(item.rating) >= 4 &&
    (Number(item.reviews) >= 3 || Number(item.sales) >= 50)
  );
  const trustedIds = new Set(trusted.map(item => item.id));
  const fallback = scored.filter(item =>
    !trustedIds.has(item.id) &&
    (Number(item.rating) >= 4 || Number(item.sales) >= 100)
  );
  const sort = list => list.sort((a, b) =>
    b.rankScore - a.rankScore || (b.sales || 0) - (a.sales || 0)
  );
  return [...sort(trusted), ...sort(fallback)]
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export async function getCategoryTop(context, slug, limit = 5) {
  const category = resourceCategories[slug];
  if (!category) throw new IntegrationError("Resource category not found.", 404, "CATEGORY_NOT_FOUND");
  const result = await searchEnvato(context, category.query, 1, {
    site: category.site,
    sortBy: "sales",
    pageSize: 100
  });
  return {
    slug,
    label: category.label,
    description: category.description,
    guide: category.guide,
    checks: category.checks,
    items: rankResources(result.items, limit).map(item => ({ ...item, cholbeiGroup: slug }))
  };
}

export async function getAutomatedTop(context, limit = 5) {
  const settled = await Promise.allSettled(Object.keys(resourceCategories).map(slug => getCategoryTop(context, slug, limit)));
  const groups = settled.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
  if (!groups.length) throw new IntegrationError("Ranked resources are temporarily unavailable.", 503, "RANKING_UNAVAILABLE");
  return { groups, items: groups.flatMap(group => group.items) };
}
