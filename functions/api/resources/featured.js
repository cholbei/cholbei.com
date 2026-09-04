import { featuredResources } from "../../../config/featured-resources.js";
import { getEnvatoItem } from "../../_lib/envato.js";
import { apiError, json } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    const settled = await Promise.allSettled(featuredResources.map(entry => getEnvatoItem(context, String(entry.id))));
    const items = settled.flatMap((result, index) => result.status === "fulfilled"
      ? [{ ...result.value, cholbeiGroup: featuredResources[index].group || null }]
      : []);
    return json({ items });
  } catch (error) {
    return apiError(error, String(context.env.DEBUG_INTEGRATIONS).toLowerCase() === "true");
  }
}
