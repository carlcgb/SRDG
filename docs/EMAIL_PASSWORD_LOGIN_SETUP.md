# 🔐 Configuration de la Connexion Email/Mot de Passe

## Vue d'ensemble

Le dashboard supporte maintenant deux méthodes de connexion :
1. **Google Sign-In** (existant)
2. **Email/Mot de Passe** (nouveau)

## 📋 Étapes de Configuration

### 1. Mettre à Jour la Base de Données

Exécutez le schéma SQL pour créer la table `dashboard_users` :

```bash
wrangler d1 execute dashboard-access --remote --file=./schema.sql
```

### 2. Créer un Utilisateur Admin

#### Option A : Utiliser le Script Node.js

```bash
node scripts/create-admin-user.js admin@example.com votre_mot_de_passe "Nom Admin"
```

Cela générera une commande SQL que vous pouvez exécuter :

```bash
wrangler d1 execute dashboard-access --remote --command="
INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)
VALUES ('admin@example.com', 'hashed_password_here', 'Nom Admin', 1, 1);
"
```

#### Option B : Créer Manuellement

1. Hash le mot de passe (SHA-256) :
   ```javascript
   // Dans la console du navigateur
   const crypto = window.crypto || window.webcrypto;
   const encoder = new TextEncoder();
   const data = encoder.encode('votre_mot_de_passe');
   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   console.log(hashHex);
   ```

2. Exécutez la commande SQL :
   ```bash
   wrangler d1 execute dashboard-access --remote --command="
   INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)
   VALUES ('admin@example.com', 'hash_hex_ici', 'Nom Admin', 1, 1);
   "
   ```

### 3. Vérifier la Configuration

Vérifiez que les Workers Functions sont déployés :

- `/api/auth/login` - POST pour l'authentification
- `/api/users` - GET pour lister les utilisateurs, POST pour créer

### 4. Tester la Connexion

1. Allez sur `https://stats.lasoireedurire.ca` ou `https://lasoireedurire.ca/dashboard`
2. Cliquez sur l'onglet "Email"
3. Entrez votre email et mot de passe
4. Cliquez sur "Se connecter"

## 🔒 Sécurité

### Hash de Mot de Passe

**Actuellement** : SHA-256 (simple, pour développement)

**Recommandé pour Production** : Utiliser bcrypt ou Argon2

Pour améliorer la sécurité, vous pouvez :
1. Installer une bibliothèque de hash adaptée pour Cloudflare Workers
2. Modifier `functions/api/auth.js` pour utiliser bcrypt
3. Re-hash tous les mots de passe existants

### Admin Users

Les utilisateurs avec `is_admin = 1` ont :
- Accès immédiat au dashboard (pas de vérification d'autorisation)
- Accès à toutes les fonctionnalités
- Pas besoin d'approbation

## 🎯 Utilisation

### Créer un Nouvel Utilisateur

```bash
# Via le script
node scripts/create-admin-user.js user@example.com password123 "Nom Utilisateur"

# Ou via SQL direct
wrangler d1 execute dashboard-access --remote --command="
INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)
VALUES ('user@example.com', 'hash_ici', 'Nom Utilisateur', 0, 1);
"
```

### Lister les Utilisateurs

```bash
wrangler d1 execute dashboard-access --remote --command="
SELECT id, email, name, is_admin, is_active, created_at, last_login 
FROM dashboard_users;
"
```

### Désactiver un Utilisateur

```bash
wrangler d1 execute dashboard-access --remote --command="
UPDATE dashboard_users SET is_active = 0 WHERE email = 'user@example.com';
"
```

### Changer le Mot de Passe

1. Hash le nouveau mot de passe
2. Mettre à jour dans la base de données :
   ```bash
   wrangler d1 execute dashboard-access --remote --command="
   UPDATE dashboard_users 
   SET password_hash = 'nouveau_hash_ici' 
   WHERE email = 'user@example.com';
   "
   ```

## 🚀 Optimisations

### Connexion Rapide

Les utilisateurs admin avec connexion email/password sont authentifiés immédiatement sans vérification supplémentaire, ce qui rend la connexion plus rapide.

### Vérification d'Authentification

Le système vérifie d'abord si l'utilisateur est admin (connexion rapide), puis vérifie les autres méthodes d'autorisation si nécessaire.

## 📝 Notes

- Les utilisateurs avec connexion email/password n'ont pas de photo de profil
- Les utilisateurs admin peuvent se connecter immédiatement sans approbation
- Les utilisateurs non-admin doivent toujours être approuvés via le système d'accès

---

**Pour plus d'informations, consultez :**
- `docs/DASHBOARD_AUTH_SETUP.md` - Configuration générale de l'authentification
- `docs/CLOUDFLARE_D1_SETUP.md` - Configuration de Cloudflare D1

