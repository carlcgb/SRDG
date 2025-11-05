# 🎭 La Soirée du Rire de Granby

Site web moderne et réactif pour La Soirée du Rire de Granby, construit avec React.js. Spectacles d'humour mensuels et services d'animation corporative professionnels.

## ✨ Fonctionnalités

- **🎨 Design Moderne**: Interface propre avec animations personnalisées et liens internes stylisés
- **📱 Entièrement Réactif**: Optimisé pour tous les appareils avec navigation mobile adaptée
- **📧 Emails Automatiques**: Formulaire corporatif avec envoi automatique via EmailJS
- **🏢 Section Corporative**: Services d'animation pour événements d'entreprise
- **🔗 Navigation Intelligente**: Liens internes avec défilement fluide et design cohérent
- **📝 Formulaires Intégrés**: Soumission de blagues avec Google Sheets
- **🔍 SEO Optimisé**: Référencement complet et données structurées
- **⚡ Performance**: Chargement rapide et optimisé
- **🔐 Sécurisé**: Configuration avec GitHub Secrets uniquement (pas de .env)
- **📊 Dashboard Analytics**: Tableau de bord avec authentification Google et données GA4
- **🗄️ Cloudflare D1**: Base de données pour gestion des permissions d'accès
- **🌐 Sous-domaines**: Support pour `stats.lasoireedurire.ca` et `dashboard.lasoireedurire.ca`
- **📁 Organisation Avancée**: Structure de dossiers professionnelle et scalable
- **🎨 Assets Organisés**: Images, styles et polices catégorisés
- **📚 Documentation Complète**: Guides détaillés pour maintenance et développement

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/yourusername/srdg.git
cd srdg

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Démarrer le serveur
npm start
```

### Configuration

**⚠️ Important**: Ce projet utilise uniquement GitHub Secrets pour les informations sensibles. Aucun fichier `.env` n'est nécessaire.

1. **Configurer GitHub Secrets** (voir [docs/GITHUB_SECRETS_ONLY.md](docs/GITHUB_SECRETS_ONLY.md))
2. **Configurer EmailJS** (voir [docs/FULL_SETUP_GUIDE.md](docs/FULL_SETUP_GUIDE.md))
3. **Configurer le Dashboard** (voir [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md))
4. **Configurer Cloudflare D1** (voir [docs/CLOUDFLARE_D1_SETUP.md](docs/CLOUDFLARE_D1_SETUP.md))

### Déploiement
```bash
# Build de production
npm run build

# Déploiement automatique via GitHub Actions
git push origin main
```

## 🏗️ Organisation Professionnelle

### Structure Optimisée
- **📁 Assets Centralisés**: Tous les fichiers statiques organisés dans `public/assets/`
- **🎨 Catégorisation Logique**: Images séparées par type (logos, événements, corporatif)
- **📚 Documentation Intégrée**: Guides complets pour chaque aspect du projet
- **🔧 Maintenance Facile**: Structure claire pour les développeurs et designers
- **📈 Évolutif**: Prêt pour la croissance et l'ajout de nouvelles fonctionnalités

### Avantages
- **Développement Plus Rapide**: Trouvez facilement les fichiers dont vous avez besoin
- **Collaboration Améliorée**: Structure claire pour les équipes
- **Maintenance Simplifiée**: Organisation logique des assets
- **Performance Optimisée**: Chargement efficace des ressources
- **Documentation Complète**: Guides détaillés pour chaque aspect

## 🎯 Parfait Pour

- **Spectacles d'Humour** & Stand-up
- **Concerts** & Événements Musicaux  
- **Conférences** & Événements d'Affaires
- **Événements Corporatifs** & Team Building
- **Mariages** & Événements Privés
- **Festivals** & Événements Communautaires
- **Ateliers** & Événements Éducatifs

## 📧 Fonctionnalités Email

- **Envoi automatique** vers `info@lasoireedurire.ca`
- **Aucune fenêtre popup** - envoi en arrière-plan
- **Message de succès** avec auto-hide (20s)
- **Template professionnel** avec toutes les informations
- **Configuration sécurisée** avec variables d'environnement

## 📁 Structure du Projet

```
SRDG/
├── 📁 docs/                          # Documentation complète
│   ├── FULL_SETUP_GUIDE.md
│   ├── INTERNAL_LINKS_OPTIMIZATION.md
│   ├── SEO_OPTIMIZATION_COMPLETE.md
│   └── SEO_OPTIMIZATION_REPORT.md
├── 📁 public/                        # Assets publics (servis directement)
│   ├── 📁 assets/                    # Assets organisés
│   │   ├── 📁 images/
│   │   │   ├── logos/               # Logos d'entreprise
│   │   │   ├── icons/               # Icônes et favicons
│   │   │   ├── heroes/              # Images de section héro
│   │   │   ├── events/              # Photos d'événements
│   │   │   └── corporate/           # Images corporatives
│   │   ├── 📁 styles/
│   │   │   ├── css/                 # CSS compilé
│   │   │   └── scss/                # Fichiers SCSS source
│   │   ├── 📁 fonts/                # Polices personnalisées
│   │   └── README.md                # Guide d'organisation des assets
│   ├── index.html                   # Template HTML principal
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _redirects
│   └── sw.js                        # Service worker
├── 📁 src/                          # Code source
│   ├── 📁 components/               # Composants React
│   │   ├── Dashboard.js            # Tableau de bord Analytics
│   │   ├── DashboardApp.js         # App dashboard avec auth
│   │   ├── Login.js                # Authentification Google
│   │   └── ...                     # Autres composants
│   ├── 📁 hooks/                    # Hooks personnalisés
│   ├── 📁 services/                 # Services externes
│   │   ├── ga4Service.js           # Service Google Analytics 4
│   │   ├── dashboardAuthService.js # Gestion permissions
│   │   ├── cloudflareApiService.js # API Cloudflare D1
│   │   └── ...                     # Autres services
│   ├── 📁 utils/                    # Utilitaires
│   │   └── subdomainRouter.js      # Routage sous-domaines
│   ├── App.js                       # Composant principal
│   └── index.js                     # Point d'entrée
├── 📁 scripts/                      # Scripts Google Apps
│   ├── google-apps-script-clean.js
│   ├── google-apps-script-form.js
│   └── google-apps-script-simple.js
├── 📁 functions/                    # Cloudflare Workers
│   └── 📁 api/                     # API Workers
│       ├── access-requests.js      # CRUD demandes d'accès
│       └── verify-token.js         # Vérification tokens
├── 📄 Configuration
│   ├── package.json                 # Dépendances et scripts
│   ├── wrangler.toml               # Configuration Cloudflare + D1
│   ├── schema.sql                  # Schéma base de données D1
│   ├── .gitignore                  # Règles Git
│   └── PROJECT_STRUCTURE.md        # Vue d'ensemble du projet
└── 📁 node_modules/                # Dépendances (auto-généré)
```

## 🎨 Personnalisation

### Couleurs et Styles
Modifier `public/assets/styles/css/main.css` pour personnaliser :
- Couleurs de marque
- Typographie
- Animations
- Mise en page

### Assets et Images
- **Logos** : `public/assets/images/logos/` - Logos d'entreprise
- **Icônes** : `public/assets/images/icons/` - Favicons et icônes UI
- **Images héro** : `public/assets/images/heroes/` - Bannières et images principales
- **Photos d'événements** : `public/assets/images/events/` - Galerie d'événements
- **Images corporatives** : `public/assets/images/corporate/` - Contenu corporatif
- **Polices** : `public/assets/fonts/` - Polices personnalisées
- **Styles** : `public/assets/styles/` - CSS et SCSS

### Contenu
- **Événements** : `src/components/Events.js`
- **Contact** : `src/components/Contact.js`
- **Navigation** : `src/components/Navigation.js` - Liens internes avec défilement fluide
- **Footer** : `src/components/Footer.js` - Navigation secondaire
- **Médias sociaux** : `src/components/Platforms.js`

### Configuration Avancée
Voir la documentation dans `docs/` pour :
- **[Guide Complet](docs/FULL_SETUP_GUIDE.md)** - Configuration EmailJS et déploiement
- **[Optimisation SEO](docs/SEO_OPTIMIZATION_COMPLETE.md)** - Guide SEO complet
- **[Liens Internes](docs/INTERNAL_LINKS_OPTIMIZATION.md)** - Optimisation navigation
- **[Rapport SEO](docs/SEO_OPTIMIZATION_REPORT.md)** - Analyse détaillée

## 🚀 Déploiement

### Automatique (Recommandé)
```bash
# Configurer GitHub Secrets
# Pousser vers main
git push origin main
# Déploiement automatique via GitHub Actions
```

### Manuel
```bash
npm run build
# Déployer le dossier 'build' sur votre plateforme
```

**Plateformes supportées** : Cloudflare Pages, Netlify, Vercel

## 🛠️ Technologies

- **React 18** - Interface utilisateur moderne
- **EmailJS** - Envoi d'emails automatique
- **Google Sheets API** - Intégration de formulaires
- **Google Analytics 4** - Analytics et données de performance
- **Google Sign-In** - Authentification OAuth 2.0
- **Cloudflare D1** - Base de données SQLite serverless
- **Cloudflare Workers** - API serverless pour gestion des permissions
- **Cloudflare Pages** - Hébergement et CDN
- **GitHub Actions** - Déploiement automatique
- **CSS3** - Animations et effets visuels
- **Service Worker** - Mise en cache et performance
- **SEO Avancé** - Optimisation complète et données structurées
- **Responsive Design** - Design adaptatif et mobile-first
- **Organisation Modulaire** - Structure professionnelle et scalable

## 📚 Documentation

### Guides Principaux
- **[Guide Complet](docs/FULL_SETUP_GUIDE.md)** - Configuration détaillée et complète
- **[Structure du Projet](PROJECT_STRUCTURE.md)** - Vue d'ensemble de l'organisation
- **[Guide des Assets](public/assets/README.md)** - Organisation des images et styles

### Dashboard & Analytics
- **[Configuration Dashboard](docs/DASHBOARD_SETUP.md)** - Configuration du tableau de bord
- **[Configuration D1](docs/CLOUDFLARE_D1_SETUP.md)** - Base de données Cloudflare D1
- **[GitHub Secrets](docs/GITHUB_SECRETS_ONLY.md)** - Configuration des secrets
- **[Sous-domaines](docs/SUBDOMAIN_SETUP.md)** - Configuration stats.lasoireedurire.ca

### SEO & Optimisation
- **[Optimisation SEO](docs/SEO_OPTIMIZATION_COMPLETE.md)** - Guide SEO complet
- **[Liens Internes](docs/INTERNAL_LINKS_OPTIMIZATION.md)** - Optimisation navigation

### Configuration Email
- **[EmailJS Template](docs/EMAILJS_TEMPLATE_SETUP.md)** - Configuration des templates
- **[Dépannage EmailJS](docs/EMAILJS_TROUBLESHOOTING.md)** - Résolution de problèmes

## 📞 Support

- **Email**: info@lasoireedurire.ca
- **Développement**: Carl GB sur Facebook/Instagram

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux.

---

**Site web professionnel prêt pour la production !** 🚀

---

## ✅ Statut du Projet

- **✅ Build Testé** - Compilation réussie sans erreurs
- **✅ Assets Vérifiés** - Tous les chemins d'images et styles fonctionnels
- **✅ Structure Organisée** - Architecture professionnelle et scalable
- **✅ Documentation Complète** - Guides détaillés pour maintenance
- **✅ Prêt pour Production** - Déploiement immédiat possible
