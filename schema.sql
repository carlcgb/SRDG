-- Cloudflare D1 Database Schema for Dashboard Access Requests
-- This schema stores access requests and authorized users

CREATE TABLE IF NOT EXISTS access_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'denied'
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewed_by TEXT,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_token ON access_requests(token);

