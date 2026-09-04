export async function cachedJson(context, namespace, key, ttl, loader) {
  if (!globalThis.caches?.default) return loader();
  const url = new URL(context.request.url);
  url.pathname = `/__resources-cache/${namespace}`;
  url.search = new URLSearchParams({ key }).toString();
  const cacheKey = new Request(url.toString());
  const hit = await caches.default.match(cacheKey);
  if (hit) return hit.json();
  const data = await loader();
  const response = new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json", "cache-control": `public, max-age=${ttl}` }
  });
  context.waitUntil(caches.default.put(cacheKey, response));
  return data;
}
