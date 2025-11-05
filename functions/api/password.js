// Password hashing utilities for Cloudflare Workers
// Shared functions for password hashing and verification

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

/**
 * Simple password verification
 * Note: In production, use proper bcrypt hashing
 */
export async function verifyPassword(password, hash) {
  try {
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

