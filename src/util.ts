import config from './config';

export function addDefaultHeaders(response: Response, delete_headers: string[] = []) {
  let to_delete = [
    'x-served-by',
    'x-cache',
    'x-cache-hits',
    'x-cache-lab',
    'x-timer',
    'via',
    'x-fastly-request-id',
    'x-github-request-id',
    'x-pages-group',
    'x-proxy-cache',
  ];

  if (delete_headers.length) {
    to_delete.push(...delete_headers);
  }

  for (let idx in to_delete) {
    response.headers.delete(to_delete[idx]);
  }
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-xss-protection', '1; mode=block');
  response.headers.set('referrer-policy', 'no-referrer-when-downgrade');
  response.headers.set(
    'content-security-policy',
    "default-src 'self';" +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdnjs.cloudflare.com cdn.segment.com cdn.ampproject.org ajax.cloudflare.com static.cloudflareinsights.com boards.greenhouse.io *.algolia.net *.algolianet.com buttons.github.io yastatic.net www.googletagmanager.com www.googleadservices.com googleads.g.doubleclick.net bam.nr-data.net js-agent.newrelic.com discover.clickhouse.com munchkin.marketo.net player.vimeo.com connect.facebook.net cdn-prod.securiti.ai cookie-cdn.cookiepro.com www.youtube.com https://js.driftt.com https://widget.drift.com https://snap.licdn.com https://tag.clearbitscripts.com https://x.clearbitjs.com https://app.clearbit.io https://cdn-prod.securiti.ai marketo.clearbit.com;" +
    "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com discover.clickhouse.com https://cdn-prod.securiti.ai;" +
    "img-src * 'self' data: https:;" +
    "object-src 'self' blog-images.clickhouse.com;" +
    "connect-src 'self' https://boards-api.greenhouse.io/ https://apim.workato.com/ https://api.segment.io/v1/ https://api.segment.io/ https://cdn.segment.com/v1/projects/dZuEnmCPmWqDuSEzCvLUSBBRt8Xrh2el/settings https://cdn.segment.com/v1/projects/pYKX60InlEzX6aI1NeyVhSF3pAIRj4Xo/settings https://cdn.segment.com/analytics-next/bundles/* https://cdn.segment.com/next-integrations/integrations/* http://clickhouse.com *.google-analytics.com api.github.com cdn.ampproject.org *.algolia.net *.algolianet.com *.ingest.sentry.io hn.algolia.com www.reddit.com bam.nr-data.net *.mktoresp.com yoast.com cdn.segment.com api.vimeo.com cdn-prod.securiti.ai app.securiti.ai cookie-cdn.cookiepro.com geolocation.onetrust.com privacyportal.cookiepro.com *.clickhouse.com https://cdn.plyr.io https://noembed.com https://cdn.linkedin.oribi.io https://app.clearbit.io https://app.clearbit.com;" +
    "frame-src blob: https://www.youtube-nocookie.com www.youtube.com player.vimeo.com blog-images.clickhouse.com boards.greenhouse.io discover.clickhouse.com webto.salesforce.com bid.g.doubleclick.net app.hex.tech *.clickhouse.com https://js.driftt.com https://widget.drift.com;" +
    "font-src 'self' fonts.gstatic.com data:;" +
    "form-action 'self' webto.salesforce.com;" +
    "frame-ancestors https://*.clickhouse.com;" +
    "prefetch-src 'self';"
  );
  const location = response.headers.get('location');
  for (let key of Object.keys(config.redirects)) {
    let origin = config.origins[key as keyof typeof config.origins];
    let destination = config.redirects[key as keyof typeof config.redirects];

    if (location && location.indexOf(origin) >= 0) {
      response.headers.set(
        'location',
        location.replace(origin, destination),
      );
    }
  }
}

export function changeUrl(req: Request, new_url: URL): Request {
  const { headers, method, redirect, referrer, referrerPolicy, body } = req;

  return new Request(new_url.toString(), {
    headers,
    method,
    redirect,
    referrer,
    referrerPolicy,
    body,
  });
}
