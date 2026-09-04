export class IntegrationError extends Error {
  constructor(message, status = 502, code = "INTEGRATION_ERROR") {
    super(message);
    this.name = "IntegrationError";
    this.status = status;
    this.code = code;
  }
}

const integer = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function getConfig(env) {
  return {
    itemTtl: integer(env.ENVATO_ITEM_CACHE_TTL, 1800),
    searchTtl: integer(env.ENVATO_SEARCH_CACHE_TTL, 900),
    linkTtl: integer(env.IMPACT_LINK_CACHE_TTL, 21600),
    currency: env.DEFAULT_CURRENCY || "USD",
    debug: String(env.DEBUG_INTEGRATIONS).toLowerCase() === "true",
    failOpen: String(env.AFFILIATE_FAIL_OPEN).toLowerCase() === "true",
    allowedHosts: String(env.ENVATO_ALLOWED_HOSTS || "")
      .split(",").map(value => value.trim().toLowerCase()).filter(Boolean)
  };
}

export function requireEnv(env, names) {
  if (names.some(name => !env[name])) {
    throw new IntegrationError("Resources integration is not configured.", 503, "CONFIG_MISSING");
  }
}
