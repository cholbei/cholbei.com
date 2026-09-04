import { resourceCategories } from "../../../config/featured-resources.js";
import { searchEnvato } from "../../_lib/envato.js";
import { apiError, json } from "../../_lib/http.js";
import { safePage, validSearch } from "../../_lib/security.js";

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get("category") || "";
    const requested = validSearch(url.searchParams.get("q"));
    const definition = resourceCategories[category];
    const query = definition ? `${requested} ${definition.query}` : requested;
    const result = await searchEnvato(context, query, safePage(url.searchParams.get("page")), definition ? { site: definition.site } : {});
    return json({ ...result, query: requested, category: resourceCategories[category] ? category : null });
  } catch (error) {
    return apiError(error, String(context.env.DEBUG_INTEGRATIONS).toLowerCase() === "true");
  }
}
