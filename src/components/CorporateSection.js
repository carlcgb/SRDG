import React, { useState, useRef } from 'react';
import CorporateStructuredData from './CorporateStructuredData';
import { sendCorporateFormEmail } from '../services/emailService';

const CorporateSection = () => {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    budget: '',
    guestCount: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [successTimer, setSuccessTimer] = useState(null);

  // Splash cursor effect will be rendered globally

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (e) => {
    e.target.parentElement.classList.add('focused');
    // Force remove any browser default styling
    e.target.style.border = '2px solid transparent';
    e.target.style.outline = 'none';
    e.target.style.boxShadow = 'none';
  };

  const handleBlur = (e) => {
    e.target.parentElement.classList.remove('focused');
    // Reset to default styling
    e.target.style.border = '';
    e.target.style.outline = '';
    e.target.style.boxShadow = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Send email automatically using EmailJS
      const result = await sendCorporateFormEmail(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          company: '',
          contactName: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          budget: '',
          guestCount: '',
          specialRequests: ''
        });
        
        // Set timer to hide success message after 20 seconds
        const timer = setTimeout(() => {
          setSubmitStatus('');
        }, 20000);
        setSuccessTimer(timer);
      } else {
        setSubmitStatus('error');
        console.error('Email sending failed:', result.error);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timer on component unmount
  React.useEffect(() => {
    return () => {
      if (successTimer) {
        clearTimeout(successTimer);
      }
    };
  }, [successTimer]);

  return (
    <>
      <CorporateStructuredData />
      <section 
        ref={sectionRef}
        id="corporate" 
        className="corporate-section"
        itemScope 
        itemType="https://schema.org/Service"
        aria-labelledby="corporate-heading"
        style={{ position: 'relative' }}
      >
      <div className="container">
        <div className="corporate-content">
          <header className="corporate-header">
            <h2 
              id="corporate-heading"
              className="corporate-title"
              itemProp="name"
            >
              🎭 <span className="highlight">Événements Corporatifs</span> 🎭
            </h2>
            <p className="corporate-subtitle" itemProp="description">
              Parce que même les PDG ont besoin de rire ! 
              <br />
              <span className="corporate-tagline">
                Transformez votre événement d'entreprise en soirée mémorable avec nos <a href="#corporate" className="internal-link">services d'animation corporative personnalisés</a>. 
                Découvrez aussi nos <a href="#evenements" className="internal-link">spectacles d'humour mensuels</a> au <a href="#contact" className="internal-link">Social Bar et Cie</a>.
              </span>
            </p>
          </header>

          <div className="corporate-grid">
            <div className="corporate-info">
              <div className="corporate-benefits-card tilted-card-figure">
                <div className="tilted-card-inner">
                  <div className="corporate-benefits">
                    <h3>Pourquoi choisir La Soirée du Rire pour vos événements d'entreprise ?</h3>
                    <ul className="benefits-list" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <li itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                        <span className="benefit-icon" aria-hidden="true">🎯</span>
                        <strong>Contenu personnalisé</strong> - <span itemProp="description">Adapté à votre industrie et votre culture d'entreprise pour un humour corporatif sur mesure</span>
                      </li>
                      <li itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                        <span className="benefit-icon" aria-hidden="true">👥</span>
                        <strong>Groupes de toutes tailles</strong> - <span itemProp="description">Animation d'événements corporatifs de 20 à 500+ personnes</span>
                      </li>
                      <li itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                        <span className="benefit-icon" aria-hidden="true">🏢</span>
                        <strong>Lieux flexibles</strong> - <span itemProp="description">Salles de conférence, restaurants, espaces événementiels, team building</span>
                      </li>
                      <li itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                        <span className="benefit-icon" aria-hidden="true">🎪</span>
                        <strong>Animation complète</strong> - <span itemProp="description">Comédiens professionnels + équipement technique pour soirées corporatives</span>
                      </li>
                      <li itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
                        <span className="benefit-icon" aria-hidden="true">💼</span>
                        <strong>Approche professionnelle</strong> - <span itemProp="description">Respectueuse de votre image de marque et de vos valeurs d'entreprise</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="corporate-testimonial-card tilted-card-figure">
                <div className="tilted-card-inner">
                  <div className="corporate-testimonial" itemScope itemType="https://schema.org/Review">
                    <blockquote itemProp="reviewBody">
                      "Notre équipe n'avait jamais ri autant lors d'un événement corporatif ! 
                      La Soirée du Rire a su adapter son humour à notre contexte professionnel 
                      tout en gardant l'ambiance décontractée qu'on recherchait pour notre team building."
                    </blockquote>
                    <cite itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">Marie Dubois</span>, <span itemProp="jobTitle">Directrice RH</span>, <span itemProp="worksFor">TechCorp</span>
                    </cite>
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" style={{display: 'none'}}>
                      <span itemProp="ratingValue">5</span>
                      <span itemProp="bestRating">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="corporate-form-card tilted-card-figure">
              <div className="tilted-card-inner">
                <div className="corporate-form-container">
                  <div className="form-header">
                    <h3>Demandez votre devis personnalisé pour événement corporatif</h3>
                    <p>Remplissez ce formulaire et nous vous contacterons dans les 24h pour créer votre soirée d'entreprise sur mesure !</p>
                  </div>

              <form 
                className="corporate-form" 
                onSubmit={handleSubmit}
                itemScope 
                itemType="https://schema.org/ContactPage"
                aria-label="Formulaire de contact pour événements corporatifs"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Entreprise *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      placeholder="Nom de votre entreprise"
                      aria-describedby="company-help"
                    />
                    <small id="company-help" className="form-help">Nom de votre organisation</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactName">Nom du contact *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      placeholder="Votre nom complet"
                      aria-describedby="contact-help"
                    />
                    <small id="contact-help" className="form-help">Personne responsable de l'événement</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="(514) 123-4567"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="eventType">Type d'événement corporatif *</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      aria-describedby="event-type-help"
                    >
                      <option value="">Sélectionnez un type d'événement</option>
                      <option value="team-building">Team Building / Renforcement d'équipe</option>
                      <option value="conference">Conférence / Séminaire corporatif</option>
                      <option value="holiday-party">Party de Noël / Fête d'entreprise</option>
                      <option value="client-event">Événement client / Networking</option>
                      <option value="retirement">Retraite / Départ d'employé</option>
                      <option value="launch">Lancement de produit / Service</option>
                      <option value="other">Autre événement corporatif</option>
                    </select>
                    <small id="event-type-help" className="form-help">Type d'événement d'entreprise</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventDate">Date prévue</label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Budget approximatif</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez une fourchette</option>
                      <option value="500-1000">500$ - 1,000$</option>
                      <option value="1000-2500">1,000$ - 2,500$</option>
                      <option value="2500-5000">2,500$ - 5,000$</option>
                      <option value="5000+">5,000$ et plus</option>
                      <option value="discuss">À discuter</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="guestCount">Nombre d'invités</label>
                    <input
                      type="number"
                      id="guestCount"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Nombre approximatif"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Demandes spéciales ou commentaires</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Décrivez vos besoins spécifiques, thème souhaité, contraintes particulières, objectifs de l'événement corporatif..."
                      rows="4"
                      aria-describedby="special-requests-help"
                  />
                  <small id="special-requests-help" className="form-help">Détails sur votre événement d'entreprise et vos attentes</small>
                </div>

                <button 
                  type="submit" 
                  className="corporate-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      Demander un devis gratuit
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    <span className="success-text">
                      Merci ! Votre demande a été envoyée à info@lasoireedurire.ca. Nous vous contacterons dans les 24h pour discuter de votre événement.
                    </span>
                    <button 
                      className="success-close-btn"
                      onClick={() => {
                        setSubmitStatus('');
                        if (successTimer) {
                          clearTimeout(successTimer);
                          setSuccessTimer(null);
                        }
                      }}
                      aria-label="Fermer le message de succès"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="error-message">
                    <span className="error-icon">❌</span>
                    Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                  </div>
                )}
              </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default CorporateSection;
