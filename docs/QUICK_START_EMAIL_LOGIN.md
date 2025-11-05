# 🚀 Démarrage Rapide - Connexion Email/Mot de Passe

## ⚡ Configuration en 3 Étapes

### 1. Mettre à Jour la Base de Données

```bash
wrangler d1 execute dashboard-access --remote --file=./schema.sql
```

### 2. Créer un Utilisateur Admin

```bash
# Générer la commande SQL
node scripts/create-admin-user.js votre@email.com votre_mot_de_passe "Votre Nom"

# Exécuter la commande générée (copiez-collez la sortie)
wrangler d1 execute dashboard-access --remote --command="
INSERT INTO dashboard_users (email, password_hash, name, is_admin, is_active)
VALUES ('votre@email.com', 'hash_généré', 'Votre Nom', 1, 1);
"
```

### 3. Tester la Connexion

1. Allez sur `https://stats.lasoireedurire.ca` ou `https://lasoireedurire.ca/dashboard`
2. Cliquez sur l'onglet **"Email"**
3. Entrez votre email et mot de passe
4. Cliquez sur **"Se connecter"**

## ✅ C'est tout !

Vous pouvez maintenant vous connecter avec email/mot de passe.

---

**Note** : Pour créer d'autres utilisateurs, répétez l'étape 2 avec leurs informations.

**Pour plus de détails**, consultez `docs/EMAIL_PASSWORD_LOGIN_SETUP.md`

