import { IntegrationError } from "./config.js";

const baseHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { ...baseHeaders, ...headers } });

export function apiError(error, debug = false) {
  const known = error instanceof IntegrationError;
  const payload = {
    error: known ? error.message : "Resources are temporarily unavailable. Please try again later.",
    code: known ? error.code : "UNAVAILABLE"
  };
  if (debug && !known) payload.debug = String(error?.message || error).slice(0, 160);
  return json(payload, known ? error.status : 500);
}
