# 🚀 Guide de Configuration Complet - La Soirée du Rire

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration Locale](#configuration-locale)
4. [Configuration EmailJS](#configuration-emailjs)
5. [Configuration GitHub Secrets](#configuration-github-secrets)
6. [Déploiement Production](#déploiement-production)
7. [Optimisation SEO](#optimisation-seo)
8. [Fonctionnalités Avancées](#fonctionnalités-avancées)
9. [Dépannage](#dépannage)
10. [Maintenance](#maintenance)

---

## Vue d'ensemble

Ce guide complet vous accompagne dans la configuration du site web La Soirée du Rire, incluant l'envoi automatique d'emails corporatifs, l'optimisation SEO, et le déploiement sécurisé.

### Fonctionnalités Principales
- **Site web moderne** avec React.js
- **Envoi automatique d'emails** via EmailJS
- **Formulaire corporatif** professionnel
- **Optimisation SEO** complète
- **Déploiement automatique** via GitHub Actions
- **Configuration sécurisée** avec variables d'environnement

---

## Prérequis

### Logiciels Requis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Git**
- **Compte EmailJS** (gratuit)
- **Compte GitHub**
- **Compte Cloudflare** (pour le déploiement)

### Connaissances Recommandées
- Bases de React.js
- Concepts de variables d'environnement
- Utilisation de Git
- Notions de SEO

---

## Configuration Locale

### 1. Installation du Projet

```bash
# Cloner le dépôt
git clone https://github.com/yourusername/srdg.git
cd srdg

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 2. Structure du Projet

```
src/
├── components/              # Composants React
│   ├── Navigation.js        # Barre de navigation
│   ├── Hero.js             # Section hero avec mascotte
│   ├── Events.js           # Section événements
│   ├── CorporateSection.js # Section événements corporatifs
│   ├── Contact.js          # Informations de contact
│   └── ...
├── services/               # Services Externes
│   ├── googleSheetsService.js # Intégration Google Sheets
│   └── emailService.js     # Service d'envoi d'emails EmailJS
├── hooks/                  # Hooks React Personnalisés
└── App.js                  # Composant App principal

public/
├── assets/                 # Assets organisés
│   ├── images/            # Images
│   ├── styles/            # Fichiers CSS
│   └── fonts/             # Polices
├── index.html              # Template HTML
├── sitemap.xml            # Sitemap SEO
└── robots.txt             # Configuration robots

.github/workflows/          # GitHub Actions
└── deploy.yml             # Workflow de déploiement
```

### 3. Test Local

```bash
# Démarrer le serveur de développement
npm start

# Ouvrir http://localhost:3000
# Tester toutes les fonctionnalités
```

---

## Configuration EmailJS

### Étape 1: Créer un compte EmailJS

1. Aller sur [emailjs.com](https://www.emailjs.com/)
2. S'inscrire avec un compte gratuit
3. Vérifier l'adresse email

### Étape 2: Créer un service email

1. Dans le dashboard EmailJS, aller à **"Email Services"**
2. Cliquer sur **"Add New Service"**
3. Choisir votre fournisseur email (Gmail, Outlook, etc.)
4. Suivre les instructions de configuration
5. Noter l'**ID du service** (commence par "service_")

### Étape 3: Créer un template email

1. Aller à **"Email Templates"** dans le dashboard
2. Cliquer sur **"Create New Template"**
3. Utiliser ce contenu :

**Sujet :**
```
Demande de devis corporatif - {{company}}
```

**Corps de l'email :**
```
Nouvelle demande de devis pour événement corporatif

Informations de l'entreprise:
- Entreprise: {{company}}
- Contact: {{contact_name}}
- Email: {{email}}
- Téléphone: {{phone}}

Détails de l'événement:
- Type d'événement: {{event_type}}
- Date prévue: {{event_date}}
- Budget: {{budget}}
- Nombre d'invités: {{guest_count}}

Demandes spéciales:
{{special_requests}}

Date de soumission: {{submission_date}}

---
Envoyé depuis le site web La Soirée du Rire
```

4. Définir l'email de destination : `info@lasoireedurire.ca`
5. Sauvegarder et noter l'**ID du template** (commence par "template_")

### Étape 4: Obtenir la clé publique

1. Aller à **"Account"** dans le dashboard EmailJS
2. Trouver la **Clé publique** (lettres/chiffres)

### Étape 5: Configurer les variables d'environnement

Éditer le fichier `.env` :

```env
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### Étape 6: Test EmailJS

```bash
# Démarrer le serveur
npm start

# Tester le formulaire corporatif
# Vérifier que l'email est envoyé automatiquement
# Aucune fenêtre ne doit s'ouvrir
```

---

## Configuration GitHub Secrets

### 1. Accéder aux Secrets GitHub

1. Aller dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer sur **"New repository secret"**

### 2. Ajouter les Secrets Requis

| Nom du Secret | Valeur | Description |
|---------------|--------|-------------|
| `EMAILJS_SERVICE_ID` | `service_xxxxxxxxx` | Votre ID de service EmailJS |
| `EMAILJS_TEMPLATE_ID` | `template_xxxxxxxxx` | Votre ID de template EmailJS |
| `EMAILJS_PUBLIC_KEY` | `your_actual_public_key` | Votre clé publique EmailJS |
| `CLOUDFLARE_API_TOKEN` | `your_token` | Token API Cloudflare (optionnel) |
| `CLOUDFLARE_ACCOUNT_ID` | `your_account_id` | ID compte Cloudflare (optionnel) |

### 3. Vérification des Secrets

```bash
# Vérifier que les secrets sont bien configurés
# Les secrets ne sont visibles que dans GitHub
# Ils sont injectés automatiquement lors du build
```

---

## Déploiement Production

### 1. Déploiement Automatique (Recommandé)

```bash
# Pousser vers la branche main
git add .
git commit -m "Deploy with EmailJS integration"
git push origin main

# GitHub Actions va automatiquement :
# - Construire le projet
# - Injecter les secrets
# - Déployer sur Cloudflare Pages
```

### 2. Déploiement Manuel

```bash
# Construire avec variables d'environnement
npm run build:prod

# Déployer sur Cloudflare Pages
npx wrangler pages deploy build --project-name=srdg
```

### 3. Autres Options de Déploiement

#### Netlify
```bash
# Construire le projet
npm run build

# Déployer sur Netlify (glisser-déposer le dossier build)
# Ou connecter votre dépôt GitHub pour des déploiements automatiques
```

#### Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

---

## Optimisation SEO

### 1. Balises Meta Optimisées

Le site inclut des balises meta complètes :
- **Title** : Optimisé avec mots-clés principaux
- **Description** : Description enrichie et engageante
- **Keywords** : 30+ mots-clés stratégiques
- **Open Graph** : Optimisé pour Facebook
- **Twitter Cards** : Configuration complète

### 2. Données Structurées (Schema.org)

```json
{
  "@type": "Organization",
  "name": "La Soirée du Rire de Granby",
  "description": "Organisateur de spectacles d'humour mensuels...",
  "url": "https://lasoireedurire.ca",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Granby",
    "addressRegion": "QC",
    "addressCountry": "CA"
  }
}
```

### 3. Sitemap XML

Le sitemap inclut toutes les sections importantes :
- Page d'accueil (priorité 1.0)
- Section événements (priorité 0.9)
- Section corporative (priorité 0.9)
- Section contact (priorité 0.8)
- Section blagues (priorité 0.6)

### 4. Mots-clés Ciblés

#### Mots-clés Principaux
- La Soirée du Rire
- Spectacles d'humour Granby
- Comédie stand-up Granby
- Humour Québec
- Événements Granby

#### Mots-clés Corporatifs
- Animation corporative
- Événements d'entreprise
- Team building
- Soirée corporative
- Humour d'entreprise

---

## Fonctionnalités Avancées

### 1. Navigation Intelligente

#### Fonctionnalités
- **Liens internes stylisés** avec défilement fluide
- **Design cohérent** avec le thème glorious
- **Navigation mobile optimisée** avec boutons adaptés
- **Liens dans le contenu** pour améliorer l'expérience utilisateur

#### Composants de Navigation
- **Navigation principale** (`Navigation.js`) - Barre de navigation fixe
- **Footer** (`Footer.js`) - Liens secondaires
- **Liens internes** dans le contenu des sections

#### Styles des Liens Internes
- **Gradient glorious** : `var(--primary-color)`, `#ff6b9d`, `#c44569`, `#f8b500`
- **Animation au survol** avec `gradientShift`
- **Transitions fluides** pour une expérience premium
- **Responsive design** adapté à tous les écrans

### 2. Formulaire Corporatif Automatique

#### Fonctionnalités
- **Envoi automatique d'emails** vers `info@lasoireedurire.ca`
- **Aucune fenêtre popup** - envoi en arrière-plan
- **Message de succès** avec auto-hide après 20 secondes
- **Bouton de fermeture manuel** pour l'utilisateur
- **Template email professionnel** avec toutes les informations

#### Types d'Événements Supportés
- Team Building / Renforcement d'équipe
- Conférences / Séminaires corporatifs
- Parties de Noël / Fêtes d'entreprise
- Événements clients / Networking
- Retraites / Départs d'employés
- Lancements de produits / Services

#### Données Collectées
- Informations de l'entreprise
- Contact responsable
- Type d'événement
- Date prévue
- Budget approximatif
- Nombre d'invités
- Demandes spéciales

### 2. Configuration Sécurisée

#### Variables d'Environnement
- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

#### GitHub Secrets
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`

#### Sécurité
- Aucun credential hardcodé
- Variables d'environnement pour le développement
- GitHub Secrets pour la production
- Fallback mailto si EmailJS n'est pas configuré

### 3. Performance et Optimisation

#### Optimisations Implémentées
- **Preload CSS** : Chargement prioritaire des styles
- **Preload Images** : Chargement prioritaire de l'image de marque
- **Fonts** : Optimisation des polices Google Fonts
- **GTM** : Google Tag Manager pour analytics
- **Code splitting** : Chargement optimisé des composants

#### Métriques de Performance
- **Build size** : ~58KB gzipped
- **Load time** : Optimisé pour < 3 secondes
- **Mobile-friendly** : Design responsive complet

---

## Dépannage

### Problèmes Courants

#### 1. EmailJS non configuré
**Symptômes** : Message d'erreur lors de l'envoi d'email
**Solutions** :
- Vérifier les variables d'environnement
- Confirmer les IDs dans EmailJS
- Vérifier la configuration du template

#### 2. Secrets GitHub non injectés
**Symptômes** : Build échoue ou emails ne s'envoient pas
**Solutions** :
- Vérifier les noms exacts des secrets (sensibles à la casse)
- Confirmer que les secrets sont bien définis
- Vérifier les permissions du workflow

#### 3. Build échoue
**Symptômes** : Erreur lors du build
**Solutions** :
- Vérifier la configuration EmailJS
- Consulter les logs GitHub Actions
- Tester localement avec `npm run build`

### Logs Utiles

```bash
# Vérifier les variables d'environnement
echo $REACT_APP_EMAILJS_SERVICE_ID

# Consulter les logs de build
npm run build 2>&1 | grep -i email

# Tester EmailJS localement
node -e "console.log(process.env.REACT_APP_EMAILJS_SERVICE_ID)"
```

### Outils de Debug

1. **Browser Console** : F12 → Console pour les erreurs JavaScript
2. **Network Tab** : Vérifier les requêtes EmailJS
3. **GitHub Actions** : Logs de déploiement
4. **EmailJS Dashboard** : Logs d'envoi d'emails

---

## Maintenance

### Mises à Jour Recommandées

#### Mensuelles
- Mettre à jour la date `lastmod` dans sitemap.xml
- Vérifier les liens internes
- Analyser les performances

#### Trimestrielles
- Réviser les mots-clés SEO
- Optimiser le contenu
- Analyser la concurrence

#### Annuelles
- Audit SEO complet
- Mise à jour des données structurées
- Révision de la stratégie

### Monitoring

#### Outils Recommandés
1. **Google Search Console**
   - Suivi des performances
   - Erreurs d'indexation
   - Mots-clés performants

2. **Google Analytics**
   - Trafic organique
   - Comportement des utilisateurs
   - Conversions

3. **EmailJS Dashboard**
   - Logs d'envoi d'emails
   - Statistiques d'utilisation
   - Gestion des templates

### Sauvegarde

#### Fichiers Importants à Sauvegarder
- Configuration EmailJS
- Secrets GitHub
- Code source (Git)
- Images et assets
- Configuration de déploiement

---

## Support et Contact

### Pour des Questions Techniques
- **Email** : info@lasoireedurire.ca
- **Développement** : Carl GB sur Facebook/Instagram

### Ressources Utiles
- [Documentation EmailJS](https://www.emailjs.com/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [React Documentation](https://reactjs.org/docs/)

---

## Conclusion

Ce guide complet vous permet de configurer et déployer le site web La Soirée du Rire avec toutes ses fonctionnalités avancées. Le site est maintenant prêt pour :

- ✅ **Envoi automatique d'emails** corporatifs
- ✅ **Optimisation SEO** complète
- ✅ **Déploiement sécurisé** en production
- ✅ **Performance optimisée**
- ✅ **Maintenance facile**

**Félicitations ! Votre site web est maintenant prêt pour la production !** 🎉

---

*Dernière mise à jour : Octobre 2025*
