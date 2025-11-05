import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DashboardApp from './components/DashboardApp';
import ApproveAccess from './components/ApproveAccess';
import { isDashboardSubdomain } from './utils/subdomainRouter';

import PrivacyPolicy from './components/PrivacyPolicy';

// Check if we're on the dashboard subdomain or path
const pathname = window.location.pathname;
const isDashboardSubdomainCheck = isDashboardSubdomain();
const isDashboardPath = pathname.startsWith('/dashboard');
const isDashboard = isDashboardSubdomainCheck || isDashboardPath;
// For approve page: if on subdomain, use /approve, if on main domain, use /dashboard/approve
const isApprovePage = isDashboardSubdomainCheck 
  ? pathname.includes('/approve') 
  : pathname.includes('/dashboard/approve');
// Check if privacy policy page
const isPrivacyPage = pathname === '/privacy' || pathname === '/privacy-policy';

// Debug logging
console.log('Current pathname:', pathname);
console.log('Is dashboard?', isDashboard);
console.log('Is approve page?', isApprovePage);
console.log('Is privacy page?', isPrivacyPage);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isPrivacyPage ? <PrivacyPolicy /> : (isApprovePage ? <ApproveAccess /> : (isDashboard ? <DashboardApp /> : <App />))}
  </React.StrictMode>
);
