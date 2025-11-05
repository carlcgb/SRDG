// Cloudflare Workers API for Email/Password Authentication
// Handles login and session management
// This file handles all routes under /api/auth/*

import { handleOptions, addCorsHeaders } from '../cors.js';
import { verifyPassword } from '../password.js';

// Handle OPTIONS preflight request
export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

// Handle GET request (not used, but required for Cloudflare Workers)
export async function onRequestGet() {
  const response = new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
  return response;
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

    // Verify password (using SHA-256 for now)
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
    
    // Ensure error response is always JSON
    let errorMessage = error.message || 'Une erreur inattendue s\'est produite';
    
    // Handle specific error types
    if (error.message && error.message.includes('JSON')) {
      errorMessage = 'Erreur de format de données';
    } else if (error.message && error.message.includes('database')) {
      errorMessage = 'Erreur de base de données';
    }
    
    const response = new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
    return addCorsHeaders(response, request);
  }
}


