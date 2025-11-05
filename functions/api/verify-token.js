// Cloudflare Workers API for Token Verification
// Verifies tokens for approval/denial links

import { handleOptions, addCorsHeaders } from './cors.js';

// Handle OPTIONS preflight request
export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const { DB } = env;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    const response = new Response(
      JSON.stringify({ error: 'Missing required parameters: email, token' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }

  try {
    // Find access request with matching email and token
    const result = await DB.prepare(
      `SELECT * FROM access_requests
       WHERE email = ? AND token = ? AND expires_at > datetime('now')`
    )
      .bind(email, token)
      .first();

    if (!result) {
      const response = new Response(
        JSON.stringify({ valid: false, error: 'Token not found or expired' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    const response = new Response(
      JSON.stringify({ valid: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('Error verifying token:', error);
    const response = new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}

