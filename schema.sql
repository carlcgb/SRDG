-- Cloudflare D1 Database Schema for Dashboard Access Requests and Users

-- Access requests table (for Google Sign-In users)
CREATE TABLE IF NOT EXISTS access_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    picture TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'denied'
    token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    requested_at TEXT DEFAULT (datetime('now')),
    approved_at TEXT,
    reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_expires_at ON access_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_requests_token ON access_requests(token);

-- Dashboard users table for email/password authentication
CREATE TABLE IF NOT EXISTS dashboard_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Hashed password (SHA-256 for now, use bcrypt in production)
    name TEXT,
    is_admin INTEGER DEFAULT 0, -- 0 = false, 1 = true (SQLite doesn't have BOOLEAN)
    created_at TEXT DEFAULT (datetime('now')),
    last_login TEXT,
    is_active INTEGER DEFAULT 1 -- 0 = false, 1 = true
);

CREATE INDEX IF NOT EXISTS idx_dashboard_users_email ON dashboard_users(email);
CREATE INDEX IF NOT EXISTS idx_dashboard_users_active ON dashboard_users(is_active);
