# ✅ Vérification du Scope OAuth - analytics.readonly

## 🔍 Vérification dans le Code

### 1. Vérifier le scope dans Login.js

Le scope doit être présent dans la fonction `getOAuthAccessToken()` :

```javascript
const tokenClient = window.google.accounts.oauth2.initTokenClient({
  client_id: clientId,
  scope: 'https://www.googleapis.com/auth/analytics.readonly',
  callback: (tokenResponse) => {
    // ...
  },
});
```

**Scope requis** : `https://www.googleapis.com/auth/analytics.readonly`

### 2. Vérifier dans la Console du Navigateur

Après la connexion, ouvrez la console (F12) et vérifiez :

```javascript
// Vérifier le token stocké
const authData = JSON.parse(localStorage.getItem('dashboard_auth'));
console.log('Has access token:', !!authData.accessToken);
console.log('Access token:', authData.accessToken ? 'Present' : 'Missing');
```

Vous devriez voir :
```
✅ OAuth access token obtained for GA4 API
```

## 🔧 Vérification dans Google Cloud Console

### 1. Vérifier les Scopes dans OAuth Consent Screen

1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **OAuth consent screen**
3. Vérifiez la section **"Scopes"**
4. Vous devriez voir :
   - ✅ `https://www.googleapis.com/auth/analytics.readonly`
   - ✅ Description : "See and download your Google Analytics data"
   - ⚠️ Si vous voyez une icône d'avertissement orange, cela signifie que le scope est sensible et nécessite une vérification

### 2. Ajouter le Scope si Absent

Si le scope `analytics.readonly` n'est pas présent :

1. Dans **OAuth consent screen**, cliquez sur **"Add or Remove Scopes"**
2. Recherchez "Google Analytics API" ou "analytics.readonly"
3. Cochez la case pour `https://www.googleapis.com/auth/analytics.readonly`
4. Cliquez sur **"Update"**
5. Cliquez sur **"Save and Continue"**

### 3. Vérifier les Scopes Sensibles (Avertissement Orange)

Si vous voyez une icône d'avertissement orange ⚠️ à côté du scope :

**C'est normal !** Le scope `analytics.readonly` est considéré comme sensible par Google.

Pour résoudre l'avertissement :

1. **Vérifiez que vous avez ajouté la politique de confidentialité** :
   - Dans **OAuth consent screen**, section **"Application privacy policy link"**
   - URL doit être : `https://lasoireedurire.ca/privacy`

2. **Vérifiez que tous les champs requis sont remplis** :
   - App name
   - User support email
   - Developer contact information
   - Application home page
   - Application privacy policy link

3. **Si votre app est en mode "Testing"** :
   - L'avertissement est normal
   - Vous pouvez publier l'app pour production (si vous êtes prêt)
   - Ou continuer en mode Testing avec des utilisateurs de test

### 4. Vérifier l'API Activée

1. **APIs & Services** → **Enabled APIs & services**
2. Vérifiez que **"Google Analytics Data API"** est activée
3. Si ce n'est pas le cas :
   - Cliquez sur **"+ Enable APIs and Services"**
   - Recherchez "Google Analytics Data API"
   - Cliquez sur **"Enable"**

## 🧪 Test du Scope

### Test 1 : Vérifier que le Token Contient le Scope

1. Connectez-vous au dashboard
2. Ouvrez la console du navigateur (F12)
3. Exécutez :

```javascript
// Obtenir le token
const authData = JSON.parse(localStorage.getItem('dashboard_auth'));
if (authData && authData.accessToken) {
  console.log('✅ Access token present');
  
  // Vérifier le scope dans le token (décoder le JWT si nécessaire)
  // Note: Le scope est dans le token OAuth, pas directement décodable côté client
  // Mais si le token fonctionne pour les requêtes GA4, le scope est correct
} else {
  console.error('❌ Access token missing');
}
```

### Test 2 : Tester une Requête GA4

1. Connectez-vous au dashboard
2. Vérifiez dans la console si les requêtes GA4 réussissent
3. Si vous voyez des erreurs 401/403, le scope n'est pas correctement configuré

### Test 3 : Vérifier le Popup de Consentement

1. Déconnectez-vous du dashboard
2. Supprimez les données de localStorage (ou utilisez une fenêtre privée)
3. Reconnectez-vous avec Google Sign-In
4. **Vous devriez voir un popup de consentement** demandant :
   - Accès à votre compte Google (identification)
   - Accès à Google Analytics (permissions)
5. Autorisez les deux
6. Vérifiez dans la console : `✅ OAuth access token obtained for GA4 API`

## 📋 Checklist de Vérification

### Code
- [ ] Scope `analytics.readonly` présent dans `Login.js`
- [ ] Fonction `getOAuthAccessToken()` correctement implémentée
- [ ] Access token stocké dans `localStorage` après connexion
- [ ] Logs dans la console montrent "✅ OAuth access token obtained"

### Google Cloud Console
- [ ] Scope `analytics.readonly` ajouté dans OAuth consent screen
- [ ] Google Analytics Data API activée
- [ ] Politique de confidentialité ajoutée
- [ ] Tous les champs requis remplis dans OAuth consent screen

### Google Analytics
- [ ] Votre compte Google a accès à la propriété GA4 (Property ID configuré)
- [ ] Permissions au minimum "Viewer" ou "Analyst"

### Test
- [ ] Popup de consentement apparaît lors de la connexion
- [ ] Access token obtenu après autorisation
- [ ] Requêtes GA4 réussissent (pas d'erreurs 401/403)
- [ ] Données GA4 s'affichent dans le dashboard

## ⚠️ Erreurs Courantes

### Erreur : "Access token missing"
**Cause** : Le popup de consentement n'a pas été autorisé ou a été annulé
**Solution** : Reconnectez-vous et autorisez l'accès à Google Analytics

### Erreur : "Scope not found"
**Cause** : Le scope n'est pas ajouté dans OAuth consent screen
**Solution** : Ajoutez le scope dans Google Cloud Console

### Erreur : "API not enabled"
**Cause** : Google Analytics Data API n'est pas activée
**Solution** : Activez l'API dans Google Cloud Console

### Avertissement Orange dans OAuth Consent Screen
**Cause** : Scope sensible sans politique de confidentialité
**Solution** : Ajoutez le lien de politique de confidentialité dans OAuth consent screen

## 🔗 Scope Complet

Le scope complet que vous devez utiliser est :
```
https://www.googleapis.com/auth/analytics.readonly
```

**Description** : "See and download your Google Analytics data"

**Permissions** : Lecture seule (pas de modification des données)

---

**Si tous les points de la checklist sont cochés, votre scope est correctement configuré !** ✅

