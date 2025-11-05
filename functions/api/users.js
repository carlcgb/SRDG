// Cloudflare Workers API for Managing Dashboard Users
// Handles creating and managing email/password users

import { handleOptions, addCorsHeaders } from './cors.js';
import { hashPassword } from './auth.js';

// Handle OPTIONS preflight request
export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

// Handle PUT request (for updating users)
export async function onRequestPut(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const body = await request.json();
    const { id, email, name, isAdmin, isActive } = body;

    if (!id) {
      const response = new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    // Build update query dynamically
    const updates = [];
    const binds = [];

    if (email !== undefined) {
      updates.push('email = ?');
      binds.push(email.toLowerCase());
    }
    if (name !== undefined) {
      updates.push('name = ?');
      binds.push(name);
    }
    if (isAdmin !== undefined) {
      updates.push('is_admin = ?');
      binds.push(isAdmin ? 1 : 0);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      binds.push(isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      const response = new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    binds.push(id);

    const query = `UPDATE dashboard_users SET ${updates.join(', ')} WHERE id = ?`;
    await DB.prepare(query).bind(...binds).run();

    const response = new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('Error updating user:', error);
    const response = new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}

/**
 * POST /api/users - Create a new dashboard user
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const body = await request.json();
    const { email, password, name, isAdmin } = body;

    if (!email || !password) {
      const response = new Response(
        JSON.stringify({ error: 'Missing email or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    try {
      const result = await DB.prepare(
        `INSERT INTO dashboard_users (email, password_hash, name, is_admin)
         VALUES (?, ?, ?, ?)`
      )
        .bind(email.toLowerCase(), passwordHash, name || null, isAdmin ? 1 : 0)
        .run();

      const response = new Response(
        JSON.stringify({ success: true, id: result.meta.last_row_id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    } catch (dbError) {
      if (dbError.message && dbError.message.includes('UNIQUE constraint')) {
        const response = new Response(
          JSON.stringify({ error: 'User with this email already exists' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
        return addCorsHeaders(response, request);
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    const response = new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}

/**
 * GET /api/users - Get all dashboard users (admin only)
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const result = await DB.prepare(
      'SELECT id, email, name, is_admin, created_at, last_login, is_active FROM dashboard_users ORDER BY created_at DESC'
    )
      .all();

    const response = new Response(
      JSON.stringify({ success: true, users: result.results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('Error fetching users:', error);
    const response = new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}

