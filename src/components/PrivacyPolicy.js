import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container">
        <div className="privacy-content">
          <h1>Politique de Confidentialité</h1>
          <p className="last-updated">Dernière mise à jour : {new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section>
            <h2>1. Introduction</h2>
            <p>
              La Soirée du Rire de Granby ("nous", "notre", "nos") s'engage à protéger votre vie privée. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
              vos informations personnelles lorsque vous utilisez notre site web et notre tableau de bord Analytics.
            </p>
          </section>

          <section>
            <h2>2. Informations que nous collectons</h2>
            <h3>2.1 Informations que vous nous fournissez</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone</li>
              <li>Informations de votre entreprise (pour les demandes corporatives)</li>
              <li>Contenu de vos messages et demandes</li>
            </ul>

            <h3>2.2 Informations collectées automatiquement</h3>
            <ul>
              <li>Données de navigation (pages visitées, temps passé)</li>
              <li>Adresse IP</li>
              <li>Type de navigateur et appareil</li>
              <li>Cookies et technologies similaires</li>
            </ul>

            <h3>2.3 Authentification Google</h3>
            <p>
              Pour accéder au tableau de bord Analytics, nous utilisons Google Sign-In. 
              Nous collectons les informations suivantes de votre compte Google :
            </p>
            <ul>
              <li>Adresse e-mail</li>
              <li>Nom</li>
              <li>Photo de profil (optionnelle)</li>
            </ul>
            <p>
              Nous utilisons également l'API Google Analytics pour accéder aux données analytiques 
              avec votre autorisation explicite.
            </p>
          </section>

          <section>
            <h2>3. Utilisation des informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul>
              <li>Répondre à vos demandes et communications</li>
              <li>Gérer les réservations et événements</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Analyser les tendances et l'utilisation du site (via Google Analytics)</li>
              <li>Gérer l'accès au tableau de bord Analytics</li>
              <li>Envoyer des notifications importantes concernant nos services</li>
            </ul>
          </section>

          <section>
            <h2>4. Partage des informations</h2>
            <p>
              Nous ne vendons, ne louons ni ne partageons vos informations personnelles avec des tiers, 
              sauf dans les cas suivants :
            </p>
            <ul>
              <li><strong>Fournisseurs de services</strong> : Nous utilisons EmailJS pour envoyer des emails automatiques</li>
              <li><strong>Google Analytics</strong> : Nous utilisons Google Analytics pour analyser l'utilisation du site</li>
              <li><strong>Obligations légales</strong> : Si requis par la loi ou une procédure judiciaire</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies et technologies similaires</h2>
            <p>
              Nous utilisons des cookies et technologies similaires pour :
            </p>
            <ul>
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation du site via Google Analytics</li>
              <li>Maintenir votre session de connexion au tableau de bord</li>
            </ul>
            <p>
              Vous pouvez gérer les cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2>6. Sécurité des données</h2>
            <p>
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations 
              contre l'accès non autorisé, la modification, la divulgation ou la destruction. 
              Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.
            </p>
          </section>

          <section>
            <h2>7. Vos droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos informations personnelles</li>
              <li>Corriger vos informations personnelles</li>
              <li>Demander la suppression de vos informations</li>
              <li>Vous opposer au traitement de vos informations</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à <a href="mailto:info@lasoireedurire.ca">info@lasoireedurire.ca</a>
            </p>
          </section>

          <section>
            <h2>8. Conservation des données</h2>
            <p>
              Nous conservons vos informations personnelles aussi longtemps que nécessaire pour 
              fournir nos services et respecter nos obligations légales.
            </p>
          </section>

          <section>
            <h2>9. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
              Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page 
              avec une date de mise à jour révisée.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, contactez-nous :
            </p>
            <ul>
              <li><strong>Email</strong> : <a href="mailto:info@lasoireedurire.ca">info@lasoireedurire.ca</a></li>
              <li><strong>Téléphone</strong> : <a href="tel:+14509913336">(450) 991-3336</a></li>
              <li><strong>Site web</strong> : <a href="https://lasoireedurire.ca">lasoireedurire.ca</a></li>
            </ul>
          </section>

          <div className="privacy-footer">
            <a href="/" className="back-link">← Retour à l'accueil</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

