# La Soirée du Rire de Granby - Site Web React

Site web officiel pour La Soirée du Rire de Granby, développé en React.js.

## 🎭 Fonctionnalités

- **Design responsive** basé sur le design system fourni
- **Navigation fluide** entre les sections
- **Animations interactives** pour la mascotte et les cartes d'événements
- **Modal de partage de blagues** avec formulaire complet
- **Section événements** avec 6 cartes d'événements à venir
- **Liens de contact** vers Messenger, email et téléphone
- **Plateformes sociales** avec liens vers les réseaux

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le site sera accessible à l'adresse `http://localhost:3000`

### Build de production
```bash
# Créer un build optimisé pour la production
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Navigation.js    # Barre de navigation
│   ├── Hero.js         # Section hero avec mascotte
│   ├── Events.js       # Section événements
│   ├── Platforms.js    # Section plateformes sociales
│   ├── JokeSection.js  # Section partage de blagues
│   ├── Contact.js      # Section contact
│   ├── Footer.js       # Pied de page
│   └── JokeModal.js    # Modal de partage de blagues
├── hooks/              # Hooks personnalisés
│   ├── useScrollEffects.js    # Effets de scroll
│   ├── useMascotTilt.js       # Animation de la mascotte
│   ├── useJokeModal.js        # Gestion du modal
│   ├── useEventCards.js       # Animations des cartes
│   ├── useButtonAnimations.js # Animations des boutons
│   └── useParallax.js         # Effet parallaxe
├── App.js              # Composant principal
└── index.js            # Point d'entrée

public/
├── style/              # Fichiers CSS
│   ├── main.css        # Styles principaux
│   ├── tilted.css      # Styles pour effets 3D
│   └── PillNav.css     # Styles de navigation
├── assets/             # Images et ressources
└── index.html          # Template HTML
```

## 🎨 Design System

Le site utilise le design system fourni avec :
- **Couleurs** : Rouge principal (#F64A3E), fond beige (#FFE1AF)
- **Typographie** : Teko pour le texte général, Bebas Neue pour "CARL GB"
- **Animations** : Transitions fluides et effets 3D
- **Layout** : Grille responsive avec espacement cohérent

## 🔧 Personnalisation

### Modifier les événements
Éditez le fichier `src/components/Events.js` pour modifier la liste des événements.

### Modifier les informations de contact
Éditez le fichier `src/components/Contact.js` pour mettre à jour les liens de contact.

### Modifier les plateformes sociales
Éditez le fichier `src/components/Platforms.js` pour ajouter ou modifier les liens sociaux.

## 📱 Responsive Design

Le site s'adapte automatiquement à toutes les tailles d'écran :
- **Desktop** : Layout en grille avec effets 3D complets
- **Tablet** : Adaptation des tailles de police et espacement
- **Mobile** : Layout vertical avec navigation simplifiée

## 🎪 Animations

- **Mascotte** : Animation d'entrée du bas vers le haut + effet tilt au survol
- **Cartes d'événements** : Effet de tilt 3D au survol
- **Boutons** : Animation de lift au survol
- **Scroll** : Animations d'apparition des éléments

## 👨‍💻 Développé par

**CARL GB** - La Soirée du Rire de Granby

## 📄 Licence

MIT License
