# 📊 Guide de Configuration du Tableau de Bord

## Vue d'ensemble

Ce guide vous aide à configurer le tableau de bord Analytics pour La Soirée du Rire de Granby. Le dashboard utilise votre palette de couleurs principale et peut se connecter à Google Analytics 4.

## 🎨 Palette de Couleurs

Le dashboard utilise la même palette de couleurs que le site principal :
- **Couleur principale** : `#F64A3E` (Rouge)
- **Couleur de fond** : `#FFE1AF` (Jaune/Crème)
- **Couleur secondaire** : `#333333` (Gris foncé)
- **Couleur accent** : `#FFFFFF` (Blanc)

## 🌐 Configuration du Sous-domaine

### Option 1 : Sous-domaine Cloudflare Pages (Recommandé)

1. **Dans Cloudflare Pages** :
   - Allez dans votre projet
   - Cliquez sur "Custom domains"
   - Ajoutez `dashboard.lasoireedurire.ca`
   - Cloudflare configurera automatiquement le DNS

2. **Dans votre DNS** :
   - Ajoutez un enregistrement CNAME :
     ```
     dashboard.lasoireedurire.ca → [votre-projet].pages.dev
     ```

### Option 2 : Route via path (Développement)

Pour le développement local, vous pouvez accéder au dashboard via :
```
http://localhost:3000/dashboard
```

## 🔌 Connexion à Google Analytics 4

### 1. Obtenir les identifiants Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Créez un compte ou utilisez un compte existant
3. Créez une propriété GA4 si vous n'en avez pas
4. Notez votre **Property ID** (format : `123456789`)

### 2. Configurer l'API Google Analytics

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API **Google Analytics Data API**
4. Créez des identifiants (Service Account ou OAuth 2.0)

#### Option A : Service Account (Recommandé pour serveur)

1. Créez un Service Account
2. Téléchargez la clé JSON
3. Partagez le compte de service avec votre propriété GA4
4. Ajoutez les variables d'environnement (voir ci-dessous)

#### Option B : OAuth 2.0 (Pour développement)

1. Créez un client OAuth 2.0
2. Configurez les URI de redirection autorisés
3. Obtenez le Client ID et Client Secret

### 3. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Google Analytics 4 Configuration
REACT_APP_GA4_PROPERTY_ID=123456789
REACT_APP_GA4_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json

# Ou pour OAuth 2.0
REACT_APP_GA4_CLIENT_ID=your-client-id
REACT_APP_GA4_CLIENT_SECRET=your-client-secret
```

⚠️ **Important** : Ne commitez jamais les fichiers `.env` avec des clés réelles !

### 4. Mettre à jour le service Analytics

Modifiez `src/services/analyticsService.js` pour utiliser vos identifiants :

```javascript
import { initializeGA4, fetchAnalyticsData } from './analyticsService';

// Dans votre composant Dashboard
const loadDashboardData = async () => {
  const propertyId = process.env.REACT_APP_GA4_PROPERTY_ID;
  const { startDate, endDate } = getDateRange(dateRange);
  
  const usersData = await getUsers(propertyId, startDate, endDate);
  const sessionsData = await getSessions(propertyId, startDate, endDate);
  // ... etc
};
```

## 🗄️ Alternative : Connexion à une Base de Données

Si vous préférez connecter à une base de données autre que Google Analytics :

### Option 1 : PostgreSQL / MySQL

1. Créez une API backend (Node.js, Python, etc.)
2. Exposez des endpoints REST pour vos données
3. Mettez à jour `analyticsService.js` pour appeler votre API

```javascript
// Exemple avec votre propre API
export const fetchDashboardData = async (dateRange) => {
  const response = await fetch(`https://api.lasoireedurire.ca/dashboard?range=${dateRange}`);
  return response.json();
};
```

### Option 2 : Google Sheets (Déjà configuré)

Vous pouvez utiliser Google Sheets comme source de données :

1. Créez un Google Sheet avec vos données analytiques
2. Utilisez `googleSheetsService.js` existant
3. Adaptez-le pour récupérer les données du dashboard

## 📦 Déploiement

### Build avec Dashboard

Le dashboard est inclus automatiquement dans le build. Pour tester :

```bash
# Build de production
npm run build

# Le dashboard sera accessible via :
# - Sous-domaine : https://dashboard.lasoireedurire.ca
# - Path : https://lasoireedurire.ca/dashboard
```

### Déploiement Cloudflare Pages

1. Poussez vos changements vers GitHub
2. Cloudflare Pages détectera automatiquement les changements
3. Le dashboard sera disponible après le déploiement

## 🔒 Sécurité

### Protection du Dashboard

Considérez ajouter une authentification pour le dashboard :

1. **Cloudflare Access** (Recommandé)
   - Configurez une politique d'accès dans Cloudflare
   - Ajoutez une authentification SSO

2. **Authentification dans l'application**
   - Ajoutez un système de login
   - Utilisez des tokens JWT
   - Stockez les tokens de manière sécurisée

### Exemple de protection basique :

```javascript
// Dans DashboardApp.js
const DashboardApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('dashboard_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={setIsAuthenticated} />;
  }
  
  return <Dashboard />;
};
```

## 🎛️ Personnalisation

### Ajouter de nouvelles métriques

1. Ajoutez une nouvelle fonction dans `analyticsService.js` :

```javascript
export const getCustomMetric = async (propertyId, startDate, endDate) => {
  return fetchAnalyticsData({
    propertyId,
    startDate,
    endDate,
    metrics: ['yourCustomMetric'],
  });
};
```

2. Utilisez-la dans `Dashboard.js` :

```javascript
const customData = await getCustomMetric(propertyId, startDate, endDate);
```

### Modifier les couleurs

Les couleurs sont définies dans `src/components/Dashboard.css` et utilisent les variables CSS du site principal. Modifiez-les si nécessaire :

```css
.stat-card {
  border-color: var(--primary-color, #F64A3E);
  background: var(--accent-light, #FFFFFF);
}
```

## 📊 Métriques Disponibles

Le dashboard affiche actuellement :
- ✅ Utilisateurs
- ✅ Sessions
- ✅ Pages vues
- ✅ Durée moyenne de session
- ✅ Taux de rebond
- ✅ Pages les plus visitées
- ✅ Sources de trafic
- ✅ Répartition par appareil

## 🔧 Dépannage

### Le dashboard n'apparaît pas

1. Vérifiez que vous êtes sur le bon sous-domaine
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que le build inclut le dashboard

### Erreurs de connexion à GA4

1. Vérifiez que votre Property ID est correct
2. Vérifiez que les identifiants sont valides
3. Vérifiez que l'API est activée dans Google Cloud Console
4. Vérifiez que le Service Account a les bonnes permissions

### Les données ne se chargent pas

1. Vérifiez la console du navigateur
2. Vérifiez les variables d'environnement
3. Vérifiez que l'API GA4 retourne des données
4. Vérifiez les dates sélectionnées (certaines métriques peuvent ne pas avoir de données)

## 📚 Ressources

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [React Documentation](https://react.dev/)

## 🆘 Support

Pour toute question ou problème :
- Email : info@lasoireedurire.ca
- Consultez la documentation principale du projet

