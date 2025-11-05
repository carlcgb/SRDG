# 🗄️ Configuration Cloudflare D1 Database

## Vue d'ensemble

Ce guide vous aide à configurer Cloudflare D1 pour stocker les demandes d'accès au dashboard. D1 est une base de données SQLite légère gérée par Cloudflare.

## 📋 Prérequis

1. Compte Cloudflare avec accès à D1
2. Wrangler CLI installé (`npm install -g wrangler`)
3. Authentification Cloudflare configurée (`wrangler login`)

## 🚀 Configuration

### 1. Créer la base de données D1

```bash
# Créer la base de données
wrangler d1 create dashboard-access
```

Cette commande va créer une base de données et afficher un `database_id` et un `preview_database_id`.

### 2. Mettre à jour wrangler.toml

Copiez les IDs générés dans `wrangler.toml` :

```toml
[[d1_databases]]
binding = "DB"
database_name = "dashboard-access"
database_id = "YOUR_DATABASE_ID" # Copiez depuis la sortie de wrangler d1 create
preview_database_id = "YOUR_PREVIEW_DATABASE_ID" # Copiez depuis la sortie de wrangler d1 create
```

### 3. Créer le schéma de base de données

```bash
# Exécuter le schéma SQL
wrangler d1 execute dashboard-access --local --file=./schema.sql
```

Pour la production (après déploiement) :

```bash
# Exécuter le schéma en production
wrangler d1 execute dashboard-access --file=./schema.sql
```

### 4. Vérifier la création des tables

```bash
# Lister les tables
wrangler d1 execute dashboard-access --local --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Vous devriez voir `access_requests` dans la liste.

## 📊 Structure de la base de données

### Table: `access_requests`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INTEGER | ID unique (auto-increment) |
| `email` | TEXT | Email de l'utilisateur (unique) |
| `name` | TEXT | Nom de l'utilisateur |
| `picture` | TEXT | URL de la photo de profil |
| `status` | TEXT | Statut: 'pending', 'approved', 'denied' |
| `requested_at` | TEXT | Date de la demande (ISO 8601) |
| `reviewed_at` | TEXT | Date de la révision (ISO 8601) |
| `reviewed_by` | TEXT | Email de l'admin qui a révisé |
| `token` | TEXT | Token pour liens d'approbation/refus |
| `expires_at` | TEXT | Date d'expiration du token (ISO 8601) |

### Index

- `idx_access_requests_email` : Index sur `email`
- `idx_access_requests_status` : Index sur `status`
- `idx_access_requests_token` : Index sur `token`

## 🔧 Développement Local

### Tester avec la base de données locale

```bash
# Exécuter le schéma localement
wrangler d1 execute dashboard-access --local --file=./schema.sql

# Insérer des données de test
wrangler d1 execute dashboard-access --local --command="INSERT INTO access_requests (email, name, status, token, expires_at) VALUES ('test@example.com', 'Test User', 'pending', 'test-token', datetime('now', '+1 day'));"

# Vérifier les données
wrangler d1 execute dashboard-access --local --command="SELECT * FROM access_requests;"
```

### Tester les API Workers

Les API Workers sont dans `functions/api/` :
- `access-requests.js` : CRUD pour les demandes d'accès
- `verify-token.js` : Vérification des tokens

## 🚀 Déploiement

### 1. Déployer les fonctions Workers

Les fonctions dans `functions/` sont automatiquement déployées avec Cloudflare Pages.

### 2. Déployer le schéma en production

```bash
# Créer les tables en production
wrangler d1 execute dashboard-access --file=./schema.sql
```

### 3. Vérifier le déploiement

```bash
# Vérifier les tables en production
wrangler d1 execute dashboard-access --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## 📝 Requêtes Utiles

### Voir toutes les demandes en attente

```bash
wrangler d1 execute dashboard-access --command="SELECT * FROM access_requests WHERE status='pending' ORDER BY requested_at DESC;"
```

### Voir toutes les demandes approuvées

```bash
wrangler d1 execute dashboard-access --command="SELECT * FROM access_requests WHERE status='approved' ORDER BY reviewed_at DESC;"
```

### Supprimer une demande

```bash
wrangler d1 execute dashboard-access --command="DELETE FROM access_requests WHERE email='user@example.com';"
```

### Nettoyer les tokens expirés

```bash
wrangler d1 execute dashboard-access --command="DELETE FROM access_requests WHERE expires_at < datetime('now');"
```

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer les credentials** : Les credentials D1 sont gérés automatiquement par Cloudflare
2. **Limiter les accès** : Seuls les utilisateurs autorisés peuvent modifier les demandes
3. **Nettoyer les tokens expirés** : Exécuter périodiquement une tâche de nettoyage
4. **Valider les entrées** : Toutes les entrées sont validées dans les Workers API

### Rotation des tokens

Les tokens expirent automatiquement après 24 heures. Vous pouvez configurer une tâche cron pour nettoyer les tokens expirés :

```toml
# Dans wrangler.toml
[[triggers.cron]]
cron = "0 0 * * *" # Tous les jours à minuit
```

## 🐛 Dépannage

### Les requêtes échouent

1. Vérifiez que la base de données est créée : `wrangler d1 list`
2. Vérifiez que le schéma est exécuté : `wrangler d1 execute dashboard-access --command="SELECT name FROM sqlite_master WHERE type='table';"`
3. Vérifiez les logs : `wrangler tail`

### Les Workers ne peuvent pas accéder à la base de données

1. Vérifiez que `wrangler.toml` contient la configuration D1
2. Vérifiez que le binding `DB` est correct
3. Vérifiez que `database_id` est correct

### Erreurs de permissions

1. Vérifiez que vous êtes authentifié : `wrangler whoami`
2. Vérifiez que vous avez les permissions nécessaires sur le compte Cloudflare

## 📚 Ressources

- [Documentation Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

**Une fois configuré, votre base de données D1 stockera toutes les demandes d'accès au dashboard de manière sécurisée et centralisée !** 🎉

