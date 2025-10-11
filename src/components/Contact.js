import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h3>Restons en contact !</h3>
            <p>Pour toute question, suggestion ou pour réserver vos places :</p>
            <div className="contact-methods">
              <a 
                href="https://m.me/182580584934456" 
                className="contact-btn messenger-btn" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon">💬</span>
                Messenger
              </a>
              <a 
                href="mailto:info@lasoireedurire.ca" 
                className="contact-btn email-btn"
              >
                <span className="contact-icon">✉️</span>
                Email
              </a>
              <a 
                href="tel:+14509913336" 
                className="contact-btn phone-btn"
              >
                <span className="contact-icon">📞</span>
                Téléphone
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
