# 🔐 Configuration OAuth pour Google Analytics 4

## ⚠️ Important : Authentification requise

Pour que le dashboard puisse accéder aux données Google Analytics 4, il faut configurer les scopes OAuth corrects.

## 🎯 Solution recommandée : Backend pour échanger le token

Le JWT du Google Sign-In ne peut pas être utilisé directement pour l'API GA4. Il faut un backend qui :
1. Reçoit le JWT du frontend
2. Le vérifie
3. L'échange contre un access token OAuth avec les scopes `analytics.readonly`

## 🚀 Solution temporaire : Modifier les scopes du Google Sign-In

### Option 1 : Modifier le composant Login pour demander les scopes GA4

Modifiez `src/components/Login.js` pour ajouter les scopes Analytics :

```javascript
window.google.accounts.id.initialize({
  client_id: clientId,
  callback: handleCredentialResponse,
  // Ajouter les scopes pour Analytics
  auto_select: false,
});
```

### Option 2 : Créer un endpoint backend (Recommandé)

Créez un endpoint backend (ex: Node.js/Express) qui :

1. **Reçoit le JWT** du frontend
2. **Vérifie le JWT** avec Google
3. **Échange le JWT** contre un access token OAuth avec les scopes Analytics
4. **Retourne l'access token** au frontend

### Exemple de backend Node.js :

```javascript
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const app = express();

app.post('/api/auth/exchange-token', async (req, res) => {
  const { jwtToken } = req.body;
  
  try {
    // Vérifier le JWT
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: jwtToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Échanger pour un access token avec scopes Analytics
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );
    
    // Utiliser le refresh token si disponible, sinon demander une nouvelle autorisation
    const { tokens } = await oauth2Client.getAccessToken();
    
    res.json({ accessToken: tokens.access_token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Option 3 : Utiliser Google Identity Services avec scopes multiples

Modifiez le Google Sign-In pour demander plusieurs scopes :

```javascript
// Dans Login.js, après l'initialisation
window.google.accounts.oauth2.initTokenClient({
  client_id: clientId,
  scope: 'https://www.googleapis.com/auth/analytics.readonly',
  callback: (tokenResponse) => {
    // Utiliser tokenResponse.access_token pour les requêtes GA4
  },
});
```

## 📋 Checklist de configuration

1. **Dans Google Cloud Console** :
   - [ ] API "Google Analytics Data API" activée
   - [ ] OAuth consent screen configuré avec scopes Analytics
   - [ ] Scopes ajoutés : `https://www.googleapis.com/auth/analytics.readonly`

2. **Dans Google Analytics** :
   - [ ] L'utilisateur qui se connecte a accès à la propriété GA4
   - [ ] Permissions "Viewer" ou "Analyst" accordées

3. **Dans votre code** :
   - [ ] Property ID ajouté dans `.env` ✅ (fait)
   - [ ] Service GA4 configuré ✅ (fait)
   - [ ] Backend pour échange de token (à implémenter)

## 🔧 Action immédiate

Pour tester rapidement, vous pouvez :

1. **Donner accès à votre compte Google** dans GA4 :
   - Admin → Property Access Management
   - Ajoutez votre email Google
   - Donnez les permissions "Viewer"

2. **Vérifier les scopes** dans Google Cloud Console :
   - APIs & Services → OAuth consent screen
   - Vérifiez que les scopes Analytics sont ajoutés

3. **Tester la connexion** :
   - Le dashboard devrait maintenant charger les données réelles !

## 🐛 Si vous obtenez des erreurs d'authentification

1. **Erreur 401/403** : Vérifiez que :
   - Votre compte a accès à la propriété GA4
   - Les scopes Analytics sont configurés
   - Le token a les bonnes permissions

2. **Erreur "Missing required parameter"** : Vérifiez que :
   - Le Property ID est correct dans `.env`
   - Le serveur a été redémarré après l'ajout de la variable

3. **Pas de données** : Vérifiez que :
   - Votre propriété GA4 a des données
   - La période sélectionnée contient des données

---

**Note** : Pour une solution de production robuste, implémentez un backend qui échange le JWT contre un access token OAuth avec les bons scopes.

