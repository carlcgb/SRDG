# 🎭 Modèle de Site Web d'Événement - React.js

Un modèle de site web d'événement moderne et réactif construit avec React.js, parfait pour les spectacles d'humour, concerts, conférences et tout type d'événement. Ce modèle est conçu pour être facilement personnalisable et prêt pour le déploiement en production.

## ✨ Fonctionnalités

- **🎨 Design Moderne**: Mise en page propre et professionnelle avec animations personnalisées
- **📱 Entièrement Réactif**: Fonctionne parfaitement sur ordinateur, tablette et mobile
- **🎪 Éléments Interactifs**: Effets d'inclinaison 3D, animations fluides et interface engageante
- **📝 Formulaires de Contact**: Formulaire de soumission de blagues intégré avec intégration Google Sheets
- **📅 Gestion d'Événements**: Cartes d'événements et informations facilement personnalisables
- **🔗 Intégration Sociale**: Liens de médias sociaux et options de contact prêts à utiliser
- **⚡ Performance Rapide**: Composants React optimisés et rendu efficace
- **🚀 Déploiement Facile**: Prêt pour Cloudflare Pages, Netlify, Vercel et plus

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Git

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/yourusername/event-website-template.git

# Naviguer vers le répertoire du projet
cd event-website-template

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le site web sera accessible à l'adresse `http://localhost:3000`

### Build de Production
```bash
# Créer un build de production optimisé
npm run build

# Les fichiers de build seront dans le répertoire 'build'
```

## 🎯 Parfait Pour

- **Spectacles d'Humour** & Stand-up
- **Concerts** & Événements Musicaux  
- **Conférences** & Événements d'Affaires
- **Mariages** & Événements Privés
- **Festivals** & Événements Communautaires
- **Ateliers** & Événements Éducatifs

## 📁 Structure du Projet

```
src/
├── components/              # Composants React
│   ├── Navigation.js        # Barre de navigation
│   ├── Hero.js             # Section hero avec mascotte
│   ├── Events.js           # Section événements
│   ├── Platforms.js        # Plateformes de médias sociaux
│   ├── JokeSection.js      # Section soumission de blagues
│   ├── Contact.js          # Informations de contact
│   ├── Footer.js           # Composant pied de page
│   └── JokeModal.js        # Modal de soumission de blagues
├── hooks/                  # Hooks React Personnalisés
│   ├── useScrollEffects.js # Animations de défilement
│   ├── useMascotTilt.js    # Animation d'inclinaison de la mascotte
│   ├── useJokeModal.js     # Gestion du modal
│   ├── useEventCards.js    # Animations des cartes d'événements
│   ├── useButtonAnimations.js # Animations des boutons
│   └── useParallax.js      # Effets de parallaxe
├── services/               # Services Externes
│   └── googleSheetsService.js # Intégration Google Sheets
├── App.js                  # Composant App principal
└── index.js                # Point d'entrée

public/
├── style/                  # Fichiers CSS
│   ├── main.css           # Styles principaux
│   ├── tilted.css         # Effets d'inclinaison 3D
│   └── PillNav.css        # Styles de navigation
├── assets/                 # Images et ressources
└── index.html              # Template HTML

google-apps-script-*.js     # Fichiers Google Apps Script pour la gestion des formulaires
```

## 🎨 Système de Design

Le modèle utilise un système de design moderne avec :
- **Couleurs**: Palette de couleurs personnalisable (facilement modifiable en CSS)
- **Typographie**: Polices modernes avec excellente lisibilité
- **Animations**: Transitions fluides et effets 3D
- **Mise en Page**: Système de grille réactif avec espacement cohérent

## 🔧 Guide de Personnalisation

### 1. Informations de Base
Mettez à jour les fichiers suivants avec les informations de votre événement :

**Section Hero** (`src/components/Hero.js`):
```javascript
// Mettre à jour le nom, la date et la description de l'événement
const eventName = "Nom de Votre Événement";
const eventDate = "25 décembre 2024";
const eventDescription = "Description de votre événement...";
```

**Informations de Contact** (`src/components/Contact.js`):
```javascript
// Mettre à jour les détails de contact
const contactInfo = {
  phone: "+1-234-567-8900",
  email: "contact@votre-evenement.com",
  messenger: "https://m.me/votrepage"
};
```

### 2. Gestion des Événements
**Section Événements** (`src/components/Events.js`):
```javascript
// Ajouter/supprimer/modifier les événements
const events = [
  {
    id: 1,
    title: "Titre de l'Événement",
    date: "2024-12-25",
    time: "20h00",
    location: "Nom du Lieu",
    price: "25$",
    description: "Description de l'événement..."
  }
  // Ajouter plus d'événements...
];
```

### 3. Liens de Médias Sociaux
**Section Plateformes** (`src/components/Platforms.js`):
```javascript
// Mettre à jour les liens de médias sociaux
const platforms = [
  { name: "Facebook", url: "https://facebook.com/votrepage", icon: "facebook" },
  { name: "Instagram", url: "https://instagram.com/votrepage", icon: "instagram" }
  // Ajouter plus de plateformes...
];
```

### 4. Couleurs et Styles
**Styles Principaux** (`public/style/main.css`):
```css
:root {
  --primary-color: #F64A3E;    /* Couleur principale de la marque */
  --secondary-color: #FFE1AF;  /* Couleur de fond */
  --accent-color: #2C3E50;     /* Couleur du texte */
  /* Ajouter plus de couleurs personnalisées... */
}
```

### 5. Images et Ressources
Remplacer les images dans `public/assets/` :
- `mascot.png` - Votre mascotte/logo
- `background.jpg` - Arrière-plan hero
- `event-placeholder.jpg` - Image d'événement par défaut

## 🚀 Options de Déploiement

### Cloudflare Pages (Recommandé)
```bash
# Construire le projet
npm run build

# Déployer sur Cloudflare Pages
npx wrangler pages deploy build --project-name=votre-site-evenement
```

### Netlify
```bash
# Construire le projet
npm run build

# Déployer sur Netlify (glisser-déposer le dossier build)
# Ou connecter votre dépôt GitHub pour des déploiements automatiques
```

### Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### GitHub Pages
```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter aux scripts package.json :
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# Déployer
npm run deploy
```

## 📱 Design Réactif

Le modèle s'adapte automatiquement à toutes les tailles d'écran :
- **Ordinateur**: Mise en page en grille complète avec effets 3D complets
- **Tablette**: Tailles de police et espacement optimisés
- **Mobile**: Mise en page verticale avec navigation simplifiée

## 🎪 Animations et Effets

- **Mascotte**: Animation d'entrée du bas + effet d'inclinaison au survol
- **Cartes d'Événements**: Effet d'inclinaison 3D au survol
- **Boutons**: Animation de soulèvement au survol
- **Défilement**: Animations d'apparition fluides
- **Parallaxe**: Effets de mouvement d'arrière-plan subtils

## 📊 Intégration Google Sheets

Le modèle inclut un système complet de soumission de formulaires :

1. **Configuration Google Apps Script** :
   - Copier le code de `google-apps-script-form.js`
   - Créer un nouveau projet Google Apps Script
   - Déployer comme application web avec accès "Tout le monde"
   - Mettre à jour l'URL du script dans `src/services/googleSheetsService.js`

2. **Configuration Google Sheets** :
   - Créer une nouvelle feuille Google
   - Mettre à jour l'ID de la feuille dans le Google Apps Script
   - Les soumissions de formulaires peupleront automatiquement la feuille

## 💼 Modèle d'Affaires

Ce modèle est parfait pour :
- **Agences de Design Web**: Offrir comme service premium aux clients
- **Organisateurs d'Événements**: Créer des sites web d'événements professionnels rapidement
- **Freelances**: Fournir des sites web de haute qualité aux clients
- **Marchés de Modèles**: Vendre sur des plateformes comme ThemeForest, Creative Market

### Suggestions de Tarification
- **Configuration de Base**: 200-500$ (inclut la personnalisation)
- **Forfait Premium**: 500-1000$ (inclut l'hébergement, domaine, maintenance)
- **Licence White-label**: 50-100$ par utilisation

## 🛠️ Fonctionnalités Techniques

- **React 18**: Dernières fonctionnalités React et optimisations
- **JavaScript Moderne**: Fonctionnalités ES6+ et async/await
- **Animations CSS3**: Animations accélérées par le matériel
- **Mobile-First**: Design réactif dès le départ
- **Prêt pour le SEO**: HTML sémantique et balises meta
- **Performance Optimisée**: Chargement paresseux et rendu efficace

## 📞 Support et Personnalisation

Pour des modifications personnalisées ou du support :
- **Courriel**: info@lasoireedurire.com
- **Développement Personnalisé**: Écris-moi sur facebook ou Instagram 👉🏻 Carl GB

## 📄 Licence

Licence MIT - Libre d'utilisation pour des projets personnels et commerciaux.

---

**Prêt à créer des sites web d'événements incroyables ?** Clonez ce modèle et commencez à construire ! 🚀
