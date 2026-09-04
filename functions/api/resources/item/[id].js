import { getEnvatoItem } from "../../../_lib/envato.js";
import { apiError, json } from "../../../_lib/http.js";
import { validItemId } from "../../../_lib/security.js";

export async function onRequestGet(context) {
  try {
    return json({ item: await getEnvatoItem(context, validItemId(context.params.id)) });
  } catch (error) {
    return apiError(error, String(context.env.DEBUG_INTEGRATIONS).toLowerCase() === "true");
  }
}
