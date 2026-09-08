// Static preview headers are configured in _headers; cover rendered resources here.
export async function onRequest(context) {
  const response = await context.next();
  if (!new URL(context.request.url).hostname.endsWith('.pages.dev')) return response;
  const preview = new Response(response.body, response);
  preview.headers.set('X-Robots-Tag', 'noindex');
  return preview;
}
