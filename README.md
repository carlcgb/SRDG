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
- **🔐 Sécurisé**: Configuration avec variables d'environnement

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

### Configuration EmailJS
1. Créer un compte sur [emailjs.com](https://www.emailjs.com/)
2. Configurer les variables dans `.env`
3. Voir le [Guide Complet](FULL_SETUP_GUIDE.md) pour les détails

### Déploiement
```bash
# Build de production
npm run build

# Déploiement automatique via GitHub Actions
git push origin main
```

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
src/
├── components/          # Composants React
├── services/           # Services (EmailJS, Google Sheets)
├── hooks/              # Hooks personnalisés
└── App.js              # Composant principal

public/
├── style/              # CSS et styles
├── index.html          # Template HTML
├── sitemap.xml         # Sitemap SEO
└── robots.txt          # Configuration robots

.github/workflows/      # GitHub Actions
└── deploy.yml         # Déploiement automatique
```

## 🎨 Personnalisation

### Couleurs et Styles
Modifier `public/style/main.css` pour personnaliser :
- Couleurs de marque
- Typographie
- Animations
- Mise en page

### Contenu
- **Événements** : `src/components/Events.js`
- **Contact** : `src/components/Contact.js`
- **Navigation** : `src/components/Navigation.js` - Liens internes avec défilement fluide
- **Footer** : `src/components/Footer.js` - Navigation secondaire
- **Médias sociaux** : `src/components/Platforms.js`
- **Images** : `public/assets/`

### Configuration Avancée
Voir le [Guide Complet](FULL_SETUP_GUIDE.md) pour :
- Configuration EmailJS
- Déploiement GitHub
- Optimisation SEO
- Dépannage

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
- **GitHub Actions** - Déploiement automatique
- **CSS3** - Animations et effets visuels
- **SEO** - Optimisation complète
- **Responsive** - Design adaptatif

## 📚 Documentation

- **[Guide Complet](FULL_SETUP_GUIDE.md)** - Configuration détaillée et complète

## 📞 Support

- **Email**: info@lasoireedurire.ca
- **Développement**: Carl GB sur Facebook/Instagram

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux.

---

**Site web professionnel prêt pour la production !** 🚀
