// CORS helper for Cloudflare Workers
// Handles CORS headers for all API responses

const ALLOWED_ORIGINS = [
  'https://lasoireedurire.ca',
  'https://stats.lasoireedurire.ca',
  'https://dashboard.lasoireedurire.ca',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

/**
 * Get CORS headers for a response
 */
export const getCorsHeaders = (origin) => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
    'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
    'Access-Control-Max-Age': '86400', // 24 hours
    'Access-Control-Allow-Credentials': 'true',
  };
};

/**
 * Handle OPTIONS preflight request
 */
export const handleOptions = (request) => {
  const origin = request.headers.get('Origin') || '';
  const headers = getCorsHeaders(origin);
  
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      'Content-Length': '0',
    },
  });
};

/**
 * Add CORS headers to a response
 */
export const addCorsHeaders = (response, request) => {
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  // Create new response with CORS headers
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

