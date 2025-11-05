# 🔐 Configuration Google Sign-In pour le Dashboard

## Vue d'ensemble

Le dashboard est maintenant protégé par une authentification Google Sign-In. Seuls les utilisateurs autorisés peuvent accéder aux données analytiques.

## 🚀 Configuration Rapide

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le **Project ID**

### 2. Activer Google Sign-In API

1. Dans Google Cloud Console, allez dans **APIs & Services** > **Library**
2. Recherchez "Google Identity Services API"
3. Cliquez sur **Enable**

### 3. Configurer l'écran de consentement OAuth

1. Allez dans **APIs & Services** > **OAuth consent screen**
2. Choisissez **External** (ou Internal si vous avez Google Workspace)
3. Remplissez les informations :
   - **App name** : La Soirée du Rire Dashboard
   - **User support email** : votre email
   - **Developer contact information** : votre email
4. Cliquez sur **Save and Continue**
5. Pour les scopes, ajoutez :
   - `email`
   - `profile`
   - `openid`
6. Continuez jusqu'à la fin

### 4. Créer les identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Choisissez **Web application**
4. Configurez :
   - **Name** : Dashboard La Soirée du Rire
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (pour développement)
     - `https://dashboard.lasoireedurire.ca` (pour production)
     - `https://lasoireedurire.ca` (pour production)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/dashboard`
     - `https://dashboard.lasoireedurire.ca/dashboard`
     - `https://lasoireedurire.ca/dashboard`
5. Cliquez sur **Create**
6. **Copiez le Client ID** (vous en aurez besoin)

### 5. Configurer les variables d'environnement

Créez ou mettez à jour votre fichier `.env` :

```env
# Google Sign-In Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

⚠️ **Important** : Ne commitez jamais le fichier `.env` avec vos vraies clés !

### 6. Restreindre l'accès (Optionnel mais recommandé)

Pour limiter l'accès à certains utilisateurs Google :

1. Dans Google Cloud Console, allez dans **OAuth consent screen**
2. Dans la section **Test users** (si en mode Testing), ajoutez les emails autorisés
3. Ou configurez **Publishing status** pour restreindre l'accès

## 🔒 Sécurité Avancée

### Vérification du token côté serveur (Recommandé)

Pour une sécurité maximale, vous devriez vérifier le token JWT côté serveur :

1. Créez une API backend qui vérifie le token
2. Modifiez `src/components/Login.js` pour envoyer le token à votre API
3. Votre API vérifie le token avec Google

### Exemple de vérification (Backend Node.js)

```javascript
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

## 🧪 Test

1. Démarrez le serveur de développement :
   ```bash
   npm start
   ```

2. Allez sur `http://localhost:3000/dashboard`

3. Vous devriez voir la page de connexion

4. Cliquez sur "Se connecter avec Google"

5. Sélectionnez votre compte Google

6. Vous devriez être redirigé vers le dashboard

## 🐛 Dépannage

### Le bouton Google Sign-In n'apparaît pas

- Vérifiez que `REACT_APP_GOOGLE_CLIENT_ID` est défini dans `.env`
- Vérifiez que le script Google est chargé (console du navigateur)
- Vérifiez que les origines JavaScript sont correctement configurées

### Erreur "redirect_uri_mismatch"

- Vérifiez que l'URL actuelle est dans les **Authorized JavaScript origins**
- Vérifiez que l'URL de redirection est dans les **Authorized redirect URIs**

### Erreur "access_denied"

- Vérifiez que l'utilisateur est dans la liste des test users (si en mode Testing)
- Vérifiez que l'écran de consentement est correctement configuré

### Le token expire trop rapidement

- Par défaut, le token est valide 24 heures
- Vous pouvez modifier cette durée dans `DashboardApp.js` :
  ```javascript
  const tokenMaxAge = 24 * 60 * 60 * 1000; // Changez cette valeur
  ```

## 📚 Ressources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 for Client-side Web Applications](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Google Cloud Console](https://console.cloud.google.com/)

## ✅ Checklist de Déploiement

- [ ] Client ID créé dans Google Cloud Console
- [ ] Origines JavaScript autorisées configurées
- [ ] URIs de redirection configurées
- [ ] Variable d'environnement `REACT_APP_GOOGLE_CLIENT_ID` définie
- [ ] Testé en développement local
- [ ] Testé en production
- [ ] Utilisateurs autorisés configurés (si applicable)
- [ ] Vérification côté serveur configurée (optionnel mais recommandé)

