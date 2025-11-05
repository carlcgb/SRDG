/**
 * Script to create an admin user in Cloudflare D1 database
 * 
 * Usage:
 *   wrangler d1 execute dashboard-access --remote --command="
 *     INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)
 *     VALUES ('admin@example.com', 'hashed_password_here', 'Admin User', 1, 1);
 *   "
 * 
 * To hash a password, use the hashPassword function from functions/api/auth.js
 * or use this Node.js script:
 */

// Simple password hashing using SHA-256 (for development)
// In production, use bcrypt or similar
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Example usage
if (require.main === module) {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || email.split('@')[0];

  if (!email || !password) {
    console.error('Usage: node create-admin-user.js <email> <password> [name]');
    process.exit(1);
  }

  const hashedPassword = hashPassword(password);
  
  console.log('\n=== Admin User SQL ===\n');
  console.log(`INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)`);
  console.log(`VALUES ('${email.toLowerCase()}', '${hashedPassword}', '${name}', 1, 1);`);
  console.log('\n=== Execute this with ===\n');
  console.log(`wrangler d1 execute dashboard-access --remote --command="`);
  console.log(`INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)`);
  console.log(`VALUES ('${email.toLowerCase()}', '${hashedPassword}', '${name}', 1, 1);`);
  console.log(`"`);
  console.log('\n');
}

module.exports = { hashPassword };

