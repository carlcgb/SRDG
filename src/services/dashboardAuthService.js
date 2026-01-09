// Dashboard Authorization Service
// Manages user access and sends email notifications for access requests
// Uses Cloudflare D1 database for storing access requests

import emailjs from '@emailjs/browser';
import {
  createAccessRequest,
  getAccessRequest,
  updateAccessRequestStatus,
  verifyToken as verifyTokenApi,
} from './cloudflareApiService';

// EmailJS configuration - these are injected at build time from GitHub Secrets
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID || process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Primary admin email for admin panel access (specific to carl.g.bisaillon@gmail.com)
export const PRIMARY_ADMIN_PANEL_EMAIL = 'carl.g.bisaillon@gmail.com';

// Admin emails - multiple admins allowed
const ADMIN_EMAILS = [
  PRIMARY_ADMIN_PANEL_EMAIL,
  'info@lasoireedurire.ca',
  process.env.REACT_APP_DASHBOARD_ADMIN_EMAIL, // From GitHub Secrets (if set)
].filter(Boolean); // Remove undefined values

// Primary admin email for notifications (used in emails)
const PRIMARY_ADMIN_EMAIL = process.env.REACT_APP_DASHBOARD_ADMIN_EMAIL || 'info@lasoireedurire.ca';

// Initialize EmailJS if configured
if (EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized with public key');
  } catch (initError) {
    console.error('❌ Error initializing EmailJS:', initError);
  }
} else {
  console.warn('⚠️ EmailJS Public Key not configured');
}

/**
 * Check if an email is authorized to access the dashboard
 * Uses Cloudflare D1 database to check authorization status
 */
export const isEmailAuthorized = async (email) => {
  if (!email) return false;

  // Check if email is an admin (always authorized)
  const isAdmin = ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
  
  if (isAdmin) {
    return true;
  }

  // Check if user exists in dashboard_users table (email/password login)
  // IMPORTANT: Even admin users in dashboard_users must be explicitly approved
  // Only users in ADMIN_EMAILS list or with approved access_requests can access
  // This ensures that even if someone has an account, they need explicit approval
  try {
    const apiUrl = `${window.location.origin}/api/users`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.users) {
        const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.is_active);
        // Even if user is admin in dashboard_users, they still need to be in ADMIN_EMAILS
        // or have an approved access_request to access the dashboard
        // This prevents unauthorized access even with valid credentials
        if (user && user.is_admin) {
          // Check if this admin email is also in the ADMIN_EMAILS list
          const isAdminInList = ADMIN_EMAILS.some(adminEmail => 
            email.toLowerCase() === adminEmail.toLowerCase()
          );
          if (isAdminInList) {
            return true; // Admin user in both dashboard_users AND ADMIN_EMAILS
          }
          // If admin in dashboard_users but not in ADMIN_EMAILS, still need approval
        }
      }
    }
  } catch (error) {
    // Ignore errors checking dashboard_users
    console.warn('Could not check dashboard_users:', error);
  }

  try {
    // Check access request status from Cloudflare D1
    const accessRequest = await getAccessRequest(email);
    
    if (!accessRequest) {
      return false;
    }

    // User is authorized if status is 'approved'
    return accessRequest.status === 'approved';
  } catch (error) {
    console.error('Error checking authorization:', error);
    // Fallback: if API fails, deny access for security
    return false;
  }
};

/**
 * Send access request email to admin and store in Cloudflare D1
 */
export const sendAccessRequestEmail = async (userEmail, userName, userPicture) => {
  try {
    // Generate token for approval/denial links
    const token = generateToken(userEmail);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Store access request in Cloudflare D1
    try {
      await createAccessRequest(userEmail, userName, userPicture, token, expiresAt);
      console.log('✅ Access request stored in Cloudflare D1');
    } catch (dbError) {
      console.error('Error storing access request in database:', dbError);
      // Continue with email sending even if DB fails
    }

    // Send email notification
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('❌ EmailJS not configured for dashboard access requests');
      console.error('EmailJS_SERVICE_ID:', EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
      console.error('EMAILJS_TEMPLATE_ID:', EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
      console.error('EMAILJS_PUBLIC_KEY:', EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
      // Fallback to mailto if EmailJS not configured
      return await sendAccessRequestEmailFallback(userEmail, userName);
    }

    // Get the base URL (handle both development and production)
    const baseUrl = window.location.origin || 'https://lasoireedurire.ca';
    
    // Check if we're on a dashboard subdomain (stats or dashboard)
    const hostname = window.location.hostname;
    const isDashboardSubdomain = hostname.startsWith('stats.') || hostname.startsWith('dashboard.');
    
    // Create approval/denial links
    // If on subdomain, use /approve, if on main domain, use /dashboard/approve
    const approvePath = isDashboardSubdomain ? '/approve' : '/dashboard/approve';
    const encodedEmail = encodeURIComponent(userEmail);
    const encodedToken = encodeURIComponent(token);
    const approvalLink = `${baseUrl}${approvePath}?email=${encodedEmail}&token=${encodedToken}&action=approve`;
    const denialLink = `${baseUrl}${approvePath}?email=${encodedEmail}&token=${encodedToken}&action=deny`;

    // Prepare email data with all required fields
    const emailData = {
      to_email: PRIMARY_ADMIN_EMAIL,
      user_email: userEmail,
      user_name: userName || userEmail,
      user_picture: userPicture || '',
      approval_link: approvalLink,
      denial_link: denialLink,
      approval_link_html: `<a href="${approvalLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">✅ Approuver l'accès</a>`,
      denial_link_html: `<a href="${denialLink}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">❌ Refuser l'accès</a>`,
      request_date: new Date().toLocaleString('fr-CA', {
        timeZone: 'America/Montreal',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      // Dashboard URL: if on subdomain, use base URL, if on main domain, use /dashboard
      dashboard_url: isDashboardSubdomain ? baseUrl : `${baseUrl}/dashboard`,
    };

    // Debug: Log the full data being sent
    console.log('📧 Sending dashboard access request email:');
    console.log('EmailJS Service ID:', EMAILJS_SERVICE_ID);
    console.log('EmailJS Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('EmailJS Public Key:', EMAILJS_PUBLIC_KEY ? 'Set (length: ' + EMAILJS_PUBLIC_KEY.length + ')' : 'Missing');
    console.log('To:', PRIMARY_ADMIN_EMAIL);
    console.log('User:', userEmail, userName);
    console.log('Approval Link:', approvalLink);
    console.log('Denial Link:', denialLink);
    console.log('Email Data:', emailData);

    // Verify EmailJS is initialized
    if (!EMAILJS_PUBLIC_KEY) {
      console.error('❌ EmailJS Public Key not configured - cannot send email');
      throw new Error('EmailJS Public Key not configured');
    }

    try {
      console.log('📤 Attempting to send email via EmailJS...');
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailData
      );

      console.log('✅ Email sent successfully:', response);
      console.log('Response status:', response.status);
      console.log('Response text:', response.text);
      console.log('Response statusText:', response.statusText);

      return {
        success: true,
        message: 'Access request email sent to admin',
        response
      };
    } catch (emailError) {
      console.error('❌ EmailJS send error:', emailError);
      console.error('Error details:', {
        code: emailError.code,
        text: emailError.text,
        status: emailError.status,
        message: emailError.message
      });
      throw emailError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('❌ Error sending access request email:', error);
    console.error('Error stack:', error.stack);
    // Fallback to mailto if EmailJS fails
    return await sendAccessRequestEmailFallback(userEmail, userName);
  }
};

/**
 * Fallback method using mailto link
 */
const sendAccessRequestEmailFallback = (userEmail, userName) => {
  try {
    const subject = `Demande d'accès au Dashboard - ${userName || userEmail}`;
    const body = `
Nouvelle demande d'accès au tableau de bord Analytics

Informations de l'utilisateur:
- Nom: ${userName || 'Non fourni'}
- Email: ${userEmail}
- Date de la demande: ${new Date().toLocaleString('fr-CA', {
      timeZone: 'America/Montreal',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

Pour approuver l'accès, veuillez répondre à cet email avec "APPROUVER".
Pour refuser l'accès, veuillez répondre avec "REFUSER".

URL du Dashboard: ${window.location.origin}${window.location.hostname.startsWith('stats.') || window.location.hostname.startsWith('dashboard.') ? '' : '/dashboard'}

---
Dashboard La Soirée du Rire de Granby
    `.trim();

    const mailtoUrl = `mailto:${PRIMARY_ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');

    return {
      success: true,
      message: 'Email client opened',
      method: 'mailto'
    };
  } catch (error) {
    console.error('Error creating mailto fallback:', error);
    return {
      success: false,
      error: 'Failed to send access request email'
    };
  }
};

/**
 * Generate a simple token for approval/denial links
 * Token is verified against Cloudflare D1 database
 */
const generateToken = (email) => {
  try {
    // Generate a unique token
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const tokenString = `${email}:${timestamp}:${random}`;
    const encoded = btoa(tokenString).replace(/[+/=]/g, '');
    
    console.log('Generated token for:', email, 'Token length:', encoded.length);
    
    return encoded;
  } catch (error) {
    console.error('Error generating token:', error);
    // Fallback token
    return btoa(`${email}:${Date.now()}:${Math.random()}`).replace(/[+/=]/g, '');
  }
};

/**
 * Verify token (for approval/denial links)
 * Uses Cloudflare API to verify token from database
 */
export const verifyToken = async (email, token) => {
  try {
    // Verify token against Cloudflare D1 database
    const isValid = await verifyTokenApi(email, token);
    return isValid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

/**
 * Approve user access
 * Updates status in Cloudflare D1 database
 */
export const addAuthorizedUser = async (email, reviewedBy = null) => {
  try {
    await updateAccessRequestStatus(email, 'approved', reviewedBy || PRIMARY_ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('Error approving user access:', error);
    throw error;
  }
};

/**
 * Deny user access
 * Updates status in Cloudflare D1 database
 */
export const removeAuthorizedUser = async (email, reviewedBy = null) => {
  try {
    await updateAccessRequestStatus(email, 'denied', reviewedBy || PRIMARY_ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('Error denying user access:', error);
    throw error;
  }
};

/**
 * Check if user is pending approval
 */
export const isPendingApproval = async (email) => {
  try {
    const accessRequest = await getAccessRequest(email);
    return accessRequest && accessRequest.status === 'pending';
  } catch (error) {
    console.error('Error checking pending approval:', error);
    return false;
  }
};

/**
 * Mark user as pending
 * This is handled automatically when sendAccessRequestEmail is called
 */
export const markAsPending = async (email, name) => {
  try {
    // This is now handled by createAccessRequest in sendAccessRequestEmail
    // But we can still call it directly if needed
    const token = generateToken(email);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await createAccessRequest(email, name, null, token, expiresAt);
  } catch (error) {
    console.error('Error marking user as pending:', error);
    throw error;
  }
};
