# 🔄 Migration vers Cloudflare D1

## Vue d'ensemble

Ce guide explique comment migrer de localStorage vers Cloudflare D1 pour stocker les demandes d'accès au dashboard.

## 📋 Changements Effectués

### 1. Base de données Cloudflare D1

- ✅ Schéma de base de données créé (`schema.sql`)
- ✅ Configuration D1 dans `wrangler.toml`
- ✅ API Workers pour gérer les demandes d'accès

### 2. Services Mis à Jour

- ✅ `dashboardAuthService.js` : Utilise maintenant Cloudflare API au lieu de localStorage
- ✅ `cloudflareApiService.js` : Nouveau service pour communiquer avec Cloudflare Workers
- ✅ `ApproveAccess.js` : Utilise maintenant l'API Cloudflare pour approuver/refuser

### 3. Variables d'environnement

- ✅ Toutes les variables `.env` sont maintenant uniquement dans GitHub Secrets
- ✅ Le code utilise uniquement des variables injectées au build
- ✅ Fallback vers données mockées si variables non configurées

## 🚀 Configuration Initiale

### 1. Créer la base de données D1

```bash
# Créer la base de données
wrangler d1 create dashboard-access
```

Copiez les IDs générés dans `wrangler.toml`.

### 2. Exécuter le schéma

```bash
# Exécuter le schéma localement (pour développement)
wrangler d1 execute dashboard-access --local --file=./schema.sql

# Exécuter le schéma en production
wrangler d1 execute dashboard-access --file=./schema.sql
```

### 3. Déployer les Workers

Les Workers dans `functions/api/` sont automatiquement déployés avec Cloudflare Pages.

## 📊 Migration des Données

Si vous avez des données existantes dans localStorage, vous pouvez les migrer :

### 1. Exporter les données localStorage

```javascript
// Dans la console du navigateur
const data = localStorage.getItem('dashboard_authorized_users');
console.log(data);
```

### 2. Migrer vers D1

```bash
# Pour chaque utilisateur approuvé, insérer dans D1
wrangler d1 execute dashboard-access --command="INSERT INTO access_requests (email, name, status, token, expires_at) VALUES ('user@example.com', 'User Name', 'approved', 'token', datetime('now', '+1 year'));"
```

## 🔧 Configuration GitHub Secrets

Assurez-vous que tous les secrets sont configurés :

- `REACT_APP_GOOGLE_CLIENT_ID`
- `REACT_APP_GA4_PROPERTY_ID`
- `REACT_APP_DASHBOARD_ADMIN_EMAIL`
- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

## ✅ Vérification

### 1. Tester la création de demande d'accès

1. Connectez-vous avec un email non autorisé
2. Vérifiez que la demande est stockée dans D1 :
   ```bash
   wrangler d1 execute dashboard-access --command="SELECT * FROM access_requests WHERE status='pending';"
   ```

### 2. Tester l'approbation

1. Cliquez sur le lien d'approbation dans l'email
2. Vérifiez que le statut est mis à jour :
   ```bash
   wrangler d1 execute dashboard-access --command="SELECT * FROM access_requests WHERE email='user@example.com';"
   ```

### 3. Tester l'accès

1. Connectez-vous avec l'email approuvé
2. Vérifiez que l'accès est accordé

## 🐛 Dépannage

### Les Workers ne fonctionnent pas

1. Vérifiez que les Workers sont dans `functions/api/`
2. Vérifiez que `wrangler.toml` contient la configuration D1
3. Vérifiez les logs : `wrangler tail`

### Les requêtes échouent

1. Vérifiez que la base de données est créée
2. Vérifiez que le schéma est exécuté
3. Vérifiez que les IDs dans `wrangler.toml` sont corrects

### Les variables d'environnement ne sont pas détectées

1. Vérifiez que les secrets GitHub sont configurés
2. Vérifiez que le workflow GitHub Actions injecte les secrets
3. Utilisez des données mockées pour le développement local

## 📚 Documentation

- [Configuration D1](docs/CLOUDFLARE_D1_SETUP.md)
- [GitHub Secrets](docs/GITHUB_SECRETS_ONLY.md)
- [API Workers](functions/api/)

---

**Migration complète vers Cloudflare D1 terminée !** 🎉

