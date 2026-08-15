// GA4 bootstrap. Must run before analytics.js and consent.js so calls made
// early are queued rather than dropped.
//
// Consent is denied for every storage type up front; consent.js issues the
// config call that actually starts collection, and only after the visitor
// agrees. Lives in a file rather than inline so the Content-Security-Policy
// does not have to allow 'unsafe-inline'.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
