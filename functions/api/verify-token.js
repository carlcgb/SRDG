// Cloudflare Workers API for Token Verification
// Verifies tokens for approval/denial links

export async function onRequestGet(context) {
  const { request, env } = context;
  const { DB } = env;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: email, token' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
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
      return new Response(
        JSON.stringify({ valid: false, error: 'Token not found or expired' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ valid: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

