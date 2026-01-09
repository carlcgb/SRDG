// Test component to verify admin button functionality
// This can be added temporarily to test if the button works

import React from 'react';

export const testAdminNavigation = () => {
  const hostname = window.location.hostname;
  const isSubdomain = hostname.startsWith('stats.') || hostname.startsWith('dashboard.');
  const adminPath = isSubdomain ? '/admin' : '/dashboard/admin';
  
  console.log('🧪 TEST: Admin navigation test');
  console.log('🧪 Hostname:', hostname);
  console.log('🧪 Is subdomain:', isSubdomain);
  console.log('🧪 Admin path:', adminPath);
  console.log('🧪 Full URL:', window.location.origin + adminPath);
  
  // Try navigation
  window.location.href = adminPath;
  
  return adminPath;
};

// Add this to window for easy testing in console
if (typeof window !== 'undefined') {
  window.testAdminNav = testAdminNavigation;
  console.log('🧪 Test function available: window.testAdminNav()');
}
