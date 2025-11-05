// Cloudflare Workers API for Email/Password Authentication
// Handles login and session management

import { handleOptions, addCorsHeaders } from './cors.js';

// Handle OPTIONS preflight request
export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

// Handle GET request (not used, but required for Cloudflare Workers)
export async function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}

/**
 * POST /api/auth/login - Authenticate user with email and password
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  const { DB } = env;

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const response = new Response(
        JSON.stringify({ error: 'Missing email or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    // Find user by email
    const user = await DB.prepare(
      'SELECT * FROM dashboard_users WHERE email = ? AND is_active = 1'
    )
      .bind(email.toLowerCase())
      .first();

    if (!user) {
      const response = new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    // Verify password (using bcrypt - you'll need to implement this)
    // For now, we'll use a simple hash comparison
    // In production, use bcrypt or similar
    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      const response = new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }

    // Update last login
    await DB.prepare(
      'UPDATE dashboard_users SET last_login = datetime(\'now\') WHERE email = ?'
    )
      .bind(email.toLowerCase())
      .run();

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      isAdmin: user.is_admin === 1,
      lastLogin: user.last_login,
    };

    const response = new Response(
      JSON.stringify({ success: true, user: userData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('Error during login:', error);
    const response = new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(response, request);
  }
}

/**
 * Simple password verification
 * Note: In production, use proper bcrypt hashing
 */
async function verifyPassword(password, hash) {
  // For now, we'll use a simple comparison
  // In production, implement proper bcrypt verification
  // This is a placeholder - you should use a proper password hashing library
  try {
    // Simple hash comparison (replace with bcrypt in production)
    const crypto = globalThis.crypto || globalThis.webcrypto;
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare with stored hash
    return hashHex === hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Hash password for storage
 * Note: In production, use proper bcrypt hashing
 */
export async function hashPassword(password) {
  try {
    const crypto = globalThis.crypto || globalThis.webcrypto;
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

