// Cloudflare Workers API for Dashboard Access Requests
// Handles storing and retrieving access requests from D1 database

export async function onRequestPost(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const body = await request.json();
    const { email, name, picture, token, expiresAt } = body;

    if (!email || !token || !expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, token, expiresAt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert or update access request
    const result = await DB.prepare(
      `INSERT INTO access_requests (email, name, picture, status, token, expires_at)
       VALUES (?, ?, ?, 'pending', ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         name = excluded.name,
         picture = excluded.picture,
         token = excluded.token,
         expires_at = excluded.expires_at,
         requested_at = datetime('now'),
         status = 'pending'`
    )
      .bind(email, name || null, picture || null, token, expiresAt)
      .run();

    return new Response(
      JSON.stringify({ success: true, id: result.meta.last_row_id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating access request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const { DB } = env;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const status = url.searchParams.get('status');

  try {
    let query = 'SELECT * FROM access_requests WHERE 1=1';
    const params = [];

    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY requested_at DESC';

    const stmt = DB.prepare(query);
    
    if (params.length > 0) {
      const result = await stmt.bind(...params).all();
      return new Response(
        JSON.stringify({ success: true, data: result.results }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      const result = await stmt.all();
      return new Response(
        JSON.stringify({ success: true, data: result.results }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching access requests:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const body = await request.json();
    const { email, status, reviewedBy } = body;

    if (!email || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['pending', 'approved', 'denied'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be: pending, approved, or denied' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update access request status
    const result = await DB.prepare(
      `UPDATE access_requests
       SET status = ?, reviewed_at = datetime('now'), reviewed_by = ?
       WHERE email = ?`
    )
      .bind(status, reviewedBy || null, email)
      .run();

    if (result.meta.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Access request not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating access request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const { DB } = env;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(
      JSON.stringify({ error: 'Missing email parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const result = await DB.prepare('DELETE FROM access_requests WHERE email = ?')
      .bind(email)
      .run();

    return new Response(
      JSON.stringify({ success: true, deleted: result.meta.changes > 0 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting access request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

