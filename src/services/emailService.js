// Email service for sending corporate form submissions
// Using EmailJS for automatic email sending

import emailjs from '@emailjs/browser';

// EmailJS configuration - Using environment variables for security
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID; //Set EMAILJS_SERVICE_ID value in you secrets
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID; //Set EMAILJS_SERVICE_ID value in you secrets
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY; //Set EMAILJS_PUBLIC_KEY value in you secrets

// Check if EmailJS is properly configured
const isEmailJSConfigured = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

// Initialize EmailJS only if configured
if (isEmailJSConfigured) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Main EmailJS method for automatic email sending
export const sendCorporateFormEmail = async (formData) => {
  try {
    console.log('📧 Sending corporate form email automatically...');

    // Check if EmailJS is configured
    if (!isEmailJSConfigured) {
      console.warn('⚠️ EmailJS not configured, using fallback method');
      return await sendCorporateFormEmailFallback(formData);
    }

    // Format the form data for email
    const emailData = {
      to_email: 'info@lasoireedurire.ca',
      from_name: formData.contactName,
      from_email: formData.email,
      company: formData.company,
      contact_name: formData.contactName,
      email: formData.email,
      phone: formData.phone || 'Non fourni',
      event_type: formData.eventType || 'Non spécifié',
      event_date: formData.eventDate || 'Non spécifié',
      budget: formData.budget || 'Non spécifié',
      guest_count: formData.guestCount || 'Non spécifié',
      special_requests: formData.specialRequests || 'Aucune demande spéciale',
      submission_date: new Date().toLocaleString('fr-CA', {
        timeZone: 'America/Montreal',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData
    );

    console.log('✅ Email sent successfully:', response);
    return { 
      success: true, 
      message: 'Email envoyé automatiquement avec succès',
      response: response 
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Fallback to mailto if EmailJS fails
    console.log('🔄 Falling back to mailto method...');
    return await sendCorporateFormEmailFallback(formData);
  }
};

// Fallback method using mailto link
export const sendCorporateFormEmailFallback = (formData) => {
  try {
    console.log('📧 Creating mailto fallback...');
    
    const subject = `Demande de devis corporatif - ${formData.company}`;
    
    const body = `
Nouvelle demande de devis pour événement corporatif

Informations de l'entreprise:
- Entreprise: ${formData.company}
- Contact: ${formData.contactName}
- Email: ${formData.email}
- Téléphone: ${formData.phone || 'Non fourni'}

Détails de l'événement:
- Type d'événement: ${formData.eventType || 'Non spécifié'}
- Date prévue: ${formData.eventDate || 'Non spécifié'}
- Budget: ${formData.budget || 'Non spécifié'}
- Nombre d'invités: ${formData.guestCount || 'Non spécifié'}

Demandes spéciales:
${formData.specialRequests || 'Aucune demande spéciale'}

Date de soumission: ${new Date().toLocaleString('fr-CA', {
      timeZone: 'America/Montreal',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
    `.trim();

    const mailtoUrl = `mailto:info@lasoireedurire.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mailto link
    window.open(mailtoUrl, '_blank');
    
    return { 
      success: true, 
      message: 'Client email ouvert',
      method: 'mailto'
    };

  } catch (error) {
    console.error('❌ Error creating mailto fallback:', error);
    return { 
      success: false, 
      error: 'Erreur lors de l\'ouverture du client email',
      details: error.message 
    };
  }
};