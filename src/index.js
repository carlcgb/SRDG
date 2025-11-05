import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DashboardApp from './DashboardApp';
import ApproveAccess from './components/ApproveAccess';
import { isDashboardSubdomain } from './utils/subdomainRouter';

// Check if we're on the dashboard subdomain or path
const pathname = window.location.pathname;
const isDashboard = isDashboardSubdomain() || pathname.startsWith('/dashboard');
const isApprovePage = pathname.includes('/dashboard/approve') || pathname.includes('/approve');

// Debug logging
console.log('Current pathname:', pathname);
console.log('Is dashboard?', isDashboard);
console.log('Is approve page?', isApprovePage);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isApprovePage ? <ApproveAccess /> : (isDashboard ? <DashboardApp /> : <App />)}
  </React.StrictMode>
);
