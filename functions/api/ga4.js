// GA4 Data API proxy - avoids CORS by calling Google from the server
// Client sends: { accessToken, propertyId, endpoint, body }

import { handleOptions, addCorsHeaders } from './cors.js';

const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestPost(context) {
  const { request } = context;

  try {
    const payload = await request.json();
    const { accessToken, propertyId, endpoint, body } = payload;

    if (!accessToken || !propertyId || !endpoint) {
      const response = new Response(
        JSON.stringify({ error: 'Missing accessToken, propertyId, or endpoint' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    const url = `${GA4_API_BASE}/properties/${String(propertyId).replace(/^properties\/?/i, '').trim()}${endpoint}`;
    const ga4Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });

    const responseText = await ga4Response.text();
    const response = new Response(responseText, {
      status: ga4Response.status,
      statusText: ga4Response.statusText,
      headers: { 'Content-Type': 'application/json' },
    });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('GA4 proxy error:', error);
    const response = new Response(
      JSON.stringify({ error: error.message || 'GA4 proxy failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}
