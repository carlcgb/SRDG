# 🔧 Cloudflare Pages API Routing

## Structure des Routes

Cloudflare Pages utilise un système de routing basé sur les dossiers pour les Functions. Voici comment les routes sont mappées :

### Routes API

```
functions/
  api/
    auth/
      [[path]].js    → /api/auth/*
    access-requests.js  → /api/access-requests
    users.js         → /api/users
    verify-token.js  → /api/verify-token
```

### Pattern de Routing

- **`functions/api/auth/[[path]].js`** : Capture toutes les routes sous `/api/auth/*`
  - `/api/auth/login` → `[[path]]` = `"login"`
  - `/api/auth/logout` → `[[path]]` = `"logout"`

- **`functions/api/access-requests.js`** : Route directe
  - `/api/access-requests` → ce fichier

### Exports Requis

Chaque fichier Function doit exporter les handlers pour les méthodes HTTP :

```javascript
export async function onRequestGet(context) { ... }
export async function onRequestPost(context) { ... }
export async function onRequestPut(context) { ... }
export async function onRequestDelete(context) { ... }
export async function onRequestOptions(context) { ... }
```

### Accès au Context

Le `context` contient :
- `context.request` : L'objet Request
- `context.env` : Variables d'environnement et bindings (comme `DB` pour D1)

### Configuration `_redirects`

Dans `public/_redirects`, les routes API doivent être en premier :

```
/api/*   200
```

Cela permet à Cloudflare Pages de gérer les routes API avant les redirections React.

## 🔍 Dépannage

### L'API retourne une erreur "réponse invalide"

1. **Vérifiez que le fichier Function existe** dans `functions/api/`
2. **Vérifiez que les exports sont corrects** (onRequestPost, etc.)
3. **Vérifiez que le binding D1 est configuré** dans `wrangler.toml`
4. **Vérifiez les logs Cloudflare** pour voir les erreurs du Worker

### L'API n'est pas trouvée (404)

1. **Vérifiez la structure des dossiers** - elle doit correspondre aux routes
2. **Vérifiez `_redirects`** - `/api/*` doit être en premier
3. **Redéployez** après avoir changé la structure

### Erreurs CORS

1. **Vérifiez que `addCorsHeaders` est appelé** sur toutes les réponses
2. **Vérifiez que `handleOptions` est exporté** pour les requêtes preflight
3. **Vérifiez les origines autorisées** dans `functions/api/cors.js`

---

**Note** : Après avoir modifié la structure des routes, vous devez redéployer sur Cloudflare Pages pour que les changements prennent effet.

