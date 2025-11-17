import { httpRequest } from 'http-request';

const HARPER_BASE_URL = 'https://YOUR-HARPER-HOST/checkredirect';

/**
 * Main entrypoint for client requests.
 * Calls Harper Redirect API and issues redirect if one is defined.
 */
export async function onClientRequest(request) {
  const pathWithQuery = request.path + (request.query ? `?${request.query}` : '');
  const host = request.host;

  try {
    const url = `${HARPER_BASE_URL}?path=${encodeURIComponent(pathWithQuery)}&h=${encodeURIComponent(host)}&ho=1`;

    const response = await httpRequest(url);
    if (!response.ok) return; // No redirect defined by API; request proceeds as normal.

    const data = await response.json();
    const redirectUrl = data.redirect_url;

    if (redirectUrl) {
      request.respondWith(
        301,
        { Location: redirectUrl },
        ''
      );
    }

  } catch (err) {
    console.log('Redirect check failed:', err.message || err);
  }
}
