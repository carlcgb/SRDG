# 🔧 Dépannage Google Sign-In - Erreur 400

## Problème : Erreur 400 Bad Request lors de la validation

L'erreur 400 de Google Identity Services (`accounts.google.com/gis_transform`) indique généralement un problème de configuration ou de format de requête.

## 🔍 Causes Possibles

### 1. Client ID non configuré ou incorrect

**Symptôme :** Erreur 400 lors de la connexion

**Solution :**
1. Vérifiez que `REACT_APP_GOOGLE_CLIENT_ID` est dans GitHub Secrets
2. Vérifiez que le Client ID est correct (commence par un nombre)
3. Vérifiez que le Client ID correspond au bon projet Google Cloud

### 2. Origines JavaScript non configurées

**Symptôme :** Erreur 400 lors de la connexion

**Solution :**
1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Ouvrez votre OAuth 2.0 Client ID
4. Dans **Authorized JavaScript origins**, ajoutez :
   - `http://localhost:3000`
   - `https://stats.lasoireedurire.ca`
   - `https://lasoireedurire.ca`
   - `https://dashboard.lasoireedurire.ca` (si utilisé)

### 3. URI de redirection non configurées

**Solution :**
1. Dans **Authorized redirect URIs**, ajoutez :
   - `http://localhost:3000`
   - `https://stats.lasoireedurire.ca`
   - `https://lasoireedurire.ca`

### 4. Format de réponse invalide

**Symptôme :** Erreur lors du décodage du JWT

**Solution :** Le code a été mis à jour pour mieux gérer le décodage du JWT token.

## ✅ Vérifications

### 1. Vérifier le Client ID dans la console

```javascript
// Dans la console du navigateur (F12)
console.log('Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
```

### 2. Vérifier les logs de connexion

```javascript
// Regardez la console pour les erreurs
// Cherchez les messages commençant par "Login error:" ou "Error decoding JWT:"
```

### 3. Vérifier la configuration Google Cloud

1. Client ID existe et est actif
2. Origines JavaScript configurées
3. URI de redirection configurées
4. Type OAuth 2.0 : Application Web

## 🔧 Solutions

### Solution 1 : Reconfigurer Google Cloud Console

1. Créez un nouveau Client ID OAuth 2.0 si nécessaire
2. Configurez toutes les origines et URI de redirection
3. Attendez quelques minutes pour la propagation
4. Redémarrez le serveur de développement

### Solution 2 : Vérifier le format de la réponse

Le code a été mis à jour pour mieux gérer :
- Le décodage Base64 URL-safe du JWT
- La validation des champs requis
- Les valeurs par défaut pour name et picture

### Solution 3 : Nettoyer le cache

1. Videz le cache du navigateur
2. Supprimez les cookies Google
3. Réessayez la connexion

## 📝 Checklist de Configuration

- [ ] Client ID configuré dans GitHub Secrets
- [ ] Client ID actif dans Google Cloud Console
- [ ] Origines JavaScript ajoutées dans Google Cloud Console
- [ ] URI de redirection ajoutées dans Google Cloud Console
- [ ] Type OAuth 2.0 : Application Web
- [ ] Serveur redémarré après configuration

## 🐛 Messages d'Erreur Courants

### "Réponse invalide de Google Sign-In"
- **Cause :** Le callback n'a pas reçu de credential
- **Solution :** Vérifiez la configuration Google Cloud Console

### "Format de token invalide"
- **Cause :** Le JWT n'a pas 3 parties séparées par des points
- **Solution :** Vérifiez que vous utilisez la bonne version de Google Identity Services

### "Email manquant dans la réponse"
- **Cause :** Le scope email n'est pas demandé
- **Solution :** Le scope est automatique avec Google Identity Services

### "Impossible de décoder le token"
- **Cause :** Problème de format Base64 URL-safe
- **Solution :** Le code a été mis à jour pour mieux gérer cela

## 📚 Ressources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Setup Guide](docs/GOOGLE_SIGNIN_SETUP.md)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Les erreurs 400 sont généralement des problèmes de configuration, pas de code !** 🔧

