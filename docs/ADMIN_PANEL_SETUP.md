# ⚙️ Panel d'Administration - Guide de Configuration

## 🎯 Vue d'ensemble

Le Panel d'Administration permet de gérer tous les utilisateurs et les demandes d'accès au dashboard. Il est **réservé exclusivement** à l'administrateur principal (`carl.g.bisaillon@gmail.com`).

## 🔐 Accès au Panel Admin

### URL d'accès

**Sur le sous-domaine** :
```
https://stats.lasoireedurire.ca/admin
```

**Sur le domaine principal** :
```
https://lasoireedurire.ca/dashboard/admin
```

### Authentification

- Seul `carl.g.bisaillon@gmail.com` peut accéder au panel
- L'utilisateur doit d'abord être connecté au dashboard
- Le système vérifie automatiquement l'email avant d'autoriser l'accès

### Accès depuis le Dashboard

Un bouton **"⚙️ Admin"** apparaît dans le header du dashboard uniquement pour l'administrateur principal.

## 📋 Fonctionnalités

### 1. Gestion des Utilisateurs

**Onglet "Utilisateurs"** affiche tous les utilisateurs du système :

- **Email** : Adresse email de l'utilisateur
- **Nom** : Nom complet (optionnel)
- **Admin** : Statut administrateur (peut être activé/désactivé)
- **Actif** : Statut actif/inactif (peut être activé/désactivé)
- **Créé le** : Date de création du compte
- **Dernière connexion** : Date de la dernière connexion

**Actions disponibles** :
- ✅ **Ajouter un utilisateur** : Créer un nouveau compte email/password
- ✏️ **Modifier** : Modifier les informations d'un utilisateur
- 🔄 **Toggle Admin** : Activer/désactiver le statut administrateur
- 🔄 **Toggle Actif** : Activer/désactiver le compte

### 2. Gestion des Demandes d'Accès

**Onglet "Demandes d'accès"** affiche toutes les demandes d'accès :

- **Email** : Adresse email du demandeur
- **Nom** : Nom du demandeur
- **Statut** : Approuvé, En attente, ou Refusé
- **Demandé le** : Date de la demande
- **Révisé le** : Date de la révision (si applicable)
- **Révisé par** : Email de l'administrateur qui a révisé

**Statistiques** :
- Nombre d'accès approuvés
- Nombre de demandes en attente
- Nombre d'accès refusés

**Actions disponibles** :
- ✅ **Approuver** : Accorder l'accès au dashboard (pour les demandes en attente)
- ❌ **Refuser** : Refuser l'accès au dashboard (pour les demandes en attente)
- 🗑️ **Supprimer** : Supprimer complètement une demande d'accès

## 🔧 Utilisation

### Ajouter un Utilisateur

1. Cliquez sur **"+ Ajouter un utilisateur"**
2. Remplissez le formulaire :
   - **Email** * (requis)
   - **Nom** (optionnel)
   - **Mot de passe** * (requis, minimum 8 caractères)
   - **Administrateur** (case à cocher)
3. Cliquez sur **"Ajouter"**

### Modifier un Utilisateur

1. Cliquez sur **"✏️ Modifier"** à côté de l'utilisateur
2. Modifiez les champs souhaités
3. Cliquez sur **"Modifier"**

**Note** : La modification du mot de passe nécessite une fonctionnalité séparée (à implémenter si nécessaire).

### Approuver/Refuser une Demande d'Accès

1. Dans l'onglet **"Demandes d'accès"**
2. Trouvez la demande avec le statut **"⏳ En attente"**
3. Cliquez sur **"✅ Approuver"** ou **"❌ Refuser"**
4. L'action est immédiate et le statut est mis à jour

### Supprimer une Demande d'Accès

1. Cliquez sur **"🗑️ Supprimer"** à côté de la demande
2. Confirmez la suppression
3. La demande est supprimée définitivement

## 🔒 Sécurité

- **Accès restreint** : Seul `carl.g.bisaillon@gmail.com` peut accéder
- **Vérification d'email** : Le système vérifie l'email à chaque chargement
- **Authentification requise** : L'utilisateur doit être connecté au dashboard
- **Autorisation dashboard** : L'utilisateur doit avoir accès au dashboard avant d'accéder au panel admin

## 🐛 Dépannage

### Le bouton "Admin" n'apparaît pas

- Vérifiez que vous êtes connecté avec `carl.g.bisaillon@gmail.com`
- Vérifiez que vous avez accès au dashboard
- Rafraîchissez la page

### Erreur "Accès refusé"

- Vérifiez que votre email correspond exactement à `carl.g.bisaillon@gmail.com`
- Vérifiez que vous avez accès au dashboard
- Déconnectez-vous et reconnectez-vous

### Les données ne se chargent pas

- Vérifiez que l'API Cloudflare D1 est correctement configurée
- Vérifiez la console du navigateur pour les erreurs
- Cliquez sur **"🔄 Actualiser"** pour recharger les données

## 📝 Notes Techniques

- Les utilisateurs sont stockés dans la table `dashboard_users` (Cloudflare D1)
- Les demandes d'accès sont stockées dans la table `access_requests` (Cloudflare D1)
- Les modifications sont immédiates et synchronisées avec la base de données
- Le panel utilise les API Cloudflare Workers pour toutes les opérations

## 🔄 Mises à jour Futures

Fonctionnalités potentielles à ajouter :
- Modification du mot de passe des utilisateurs
- Export des données (CSV, Excel)
- Historique des modifications
- Notifications par email lors des changements
- Filtres et recherche avancée
