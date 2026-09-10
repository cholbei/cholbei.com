// GA4 is configured inside GTM, not loaded separately on the website.
(() => {
  if (location.protocol !== 'https:' || !['cholbei.com', 'www.cholbei.com'].includes(location.hostname)) return;
  if (window.cholbeiTrackingLoaded) return;
  window.cholbeiTrackingLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5JG9GTJQ';
  document.head.appendChild(script);
})();
