import { getAutomatedTop } from "../../_lib/rank.js";
import { apiError, json } from "../../_lib/http.js";

export async function onRequestGet(context) {
  try {
    return json(await getAutomatedTop(context, 5), 200, {
      "cache-control": "public, max-age=300, s-maxage=900"
    });
  } catch (error) {
    return apiError(error, String(context.env.DEBUG_INTEGRATIONS).toLowerCase() === "true");
  }
}