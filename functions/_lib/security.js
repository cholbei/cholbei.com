import { IntegrationError } from "./config.js";

export function validItemId(value) {
  const id = String(value || "");
  if (!/^[1-9]\d{0,11}$/.test(id)) {
    throw new IntegrationError("Resource not found.", 404, "INVALID_ITEM");
  }
  return id;
}

export function validSearch(value) {
  const query = String(value || "").replace(/\s+/g, " ").trim();
  if (query.length < 2 || query.length > 80) {
    throw new IntegrationError("Search must be between 2 and 80 characters.", 400, "INVALID_QUERY");
  }
  return query;
}

export function safePage(value) {
  const page = Number.parseInt(value || "1", 10);
  return Number.isInteger(page) && page >= 1 && page <= 50 ? page : 1;
}

export function validateDestination(value, allowedHosts) {
  let url;
  try { url = new URL(value); } catch {
    throw new IntegrationError("The product destination is unavailable.", 502, "INVALID_DESTINATION");
  }
  if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname.toLowerCase())) {
    throw new IntegrationError("The product destination is not approved.", 502, "DESTINATION_REJECTED");
  }
  return url.toString();
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}
