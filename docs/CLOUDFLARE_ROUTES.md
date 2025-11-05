# 🛣️ Configuration des Routes Cloudflare Pages

## Vue d'ensemble

Ce document explique comment les routes sont configurées pour Cloudflare Pages, incluant les API Workers et les routes du dashboard.

## 📁 Structure des Fichiers

### Fichier `_redirects`

Le fichier `public/_redirects` définit les règles de redirection pour Cloudflare Pages. L'ordre est important :

1. **Routes API** (en premier) - Doivent être traitées avant les catch-all
2. **Routes spécifiques** (dashboard, etc.)
3. **Catch-all** (en dernier) - Redirige tout vers `/index.html`

### Structure des Workers

Les Cloudflare Workers Functions sont dans `functions/api/` :

```
functions/
  api/
    access-requests.js  → /api/access-requests
    verify-token.js     → /api/verify-token
```

Cloudflare Pages mappe automatiquement les fichiers dans `functions/api/` aux routes `/api/*`.

## 🔧 Configuration Actuelle

### Fichier `_redirects`

```
# API routes - Must be handled by Cloudflare Workers BEFORE any catch-all redirects
/api/*   200

# Dashboard routing
/dashboard    /index.html   200
/dashboard/*    /index.html   200
/dashboard/approve    /index.html   200

# Catch-all redirect - must be last to avoid catching API routes
/*    /index.html   200
```

### Explication

1. **`/api/* 200`** : 
   - Permet aux Workers Functions de gérer toutes les routes `/api/*`
   - Le code 200 indique que la route est valide (pas de redirection)
   - Doit être en premier pour éviter d'être capturé par le catch-all

2. **`/dashboard /index.html 200`** :
   - Route spécifique pour le dashboard
   - Redirige vers `/index.html` pour que React Router gère le routage

3. **`/dashboard/* /index.html 200`** :
   - Toutes les sous-routes du dashboard (comme `/dashboard/approve`)
   - Redirige vers `/index.html` pour que React Router gère le routage

4. **`/* /index.html 200`** :
   - Catch-all pour toutes les autres routes
   - Doit être en dernier pour ne pas capturer les routes API

## 🚀 Routes API

### Routes disponibles

| Route | Worker Function | Méthodes | Description |
|-------|----------------|----------|-------------|
| `/api/access-requests` | `functions/api/access-requests.js` | GET, POST, PUT, DELETE | Gérer les demandes d'accès |
| `/api/verify-token` | `functions/api/verify-token.js` | GET | Vérifier les tokens |

### Exemples d'utilisation

#### Créer une demande d'accès (POST)
```javascript
POST /api/access-requests
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "token": "token123",
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

#### Obtenir une demande d'accès (GET)
```javascript
GET /api/access-requests?email=user@example.com
```

#### Mettre à jour le statut (PUT)
```javascript
PUT /api/access-requests
Content-Type: application/json

{
  "email": "user@example.com",
  "status": "approved",
  "reviewedBy": "admin@example.com"
}
```

#### Vérifier un token (GET)
```javascript
GET /api/verify-token?email=user@example.com&token=token123
```

## ✅ Vérification

### Tester les routes API

1. **Tester localement** (avec Wrangler) :
   ```bash
   wrangler pages dev build
   ```

2. **Tester en production** :
   ```bash
   curl https://lasoireedurire.ca/api/access-requests?email=test@example.com
   ```

### Vérifier les routes dashboard

1. **Tester `/dashboard`** :
   - Devrait charger React App
   - React Router gère le routage

2. **Tester `/dashboard/approve`** :
   - Devrait charger React App
   - React Router gère le routage

## 🐛 Dépannage

### Les routes API ne fonctionnent pas

1. **Vérifier que les Workers sont dans `functions/api/`** :
   ```bash
   ls functions/api/
   ```

2. **Vérifier que `_redirects` contient `/api/* 200` en premier**

3. **Vérifier les logs Cloudflare** :
   ```bash
   wrangler tail
   ```

### Les routes dashboard ne fonctionnent pas

1. **Vérifier que `_redirects` contient les routes dashboard**

2. **Vérifier que React Router est configuré** :
   - Vérifier `src/index.js` pour le routage conditionnel

3. **Vérifier la console du navigateur** pour les erreurs

### Les routes API sont capturées par le catch-all

**Solution** : Assurez-vous que `/api/* 200` est **avant** `/* /index.html 200` dans `_redirects`

## 📚 Ressources

- [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)

---

**Toutes les routes sont maintenant correctement configurées !** ✅

