-- Cloudflare D1 Database Schema

-- Access requests table
DROP TABLE IF EXISTS access_requests;
CREATE TABLE access_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    picture TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'denied'
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    reviewed_by TEXT
);

CREATE INDEX idx_email ON access_requests (email);
CREATE INDEX idx_status ON access_requests (status);
CREATE INDEX idx_expires_at ON access_requests (expires_at);

-- Dashboard users table for email/password authentication
DROP TABLE IF EXISTS dashboard_users;
CREATE TABLE dashboard_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Hashed password (bcrypt)
    name TEXT,
    is_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX idx_dashboard_users_email ON dashboard_users (email);
CREATE INDEX idx_dashboard_users_active ON dashboard_users (is_active);
