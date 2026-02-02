# 🚀 Configuration Rapide - Authentification Dashboard

## ✅ Ce qui est déjà configuré

1. ✅ Système d'authentification Google Sign-In
2. ✅ Vérification des permissions par email
3. ✅ Envoi automatique d'emails de demande d'accès
4. ✅ Pages d'approbation/refus
5. ✅ Intégration avec GitHub Secrets
6. ✅ Protection du dashboard (seul votre email a accès direct)

## 📋 Configuration Requise

### 1. Ajouter les Secrets GitHub

Allez dans **Settings** → **Secrets and variables** → **Actions** et ajoutez :

| Secret | Valeur | Où trouver |
|--------|--------|------------|
| `REACT_APP_GOOGLE_CLIENT_ID` | `417559096229-odg5v7bi3glglcp2fg7d95g9ajil07pe.apps.googleusercontent.com` | Google Cloud Console |
| `REACT_APP_GA4_PROPERTY_ID` | `<YOUR_GA4_PROPERTY_ID>` | Google Analytics |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | `info@lasoireedurire.ca` | Votre email Google |

### 2. Configurer le Template EmailJS

1. Créez un template EmailJS pour les demandes d'accès
2. Ajoutez les variables : `{{user_email}}`, `{{user_name}}`, `{{approval_link}}`, `{{denial_link}}`
3. (Optionnel) Ajoutez `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` dans GitHub Secrets

### 3. Vérifier votre Email Admin

Assurez-vous que `REACT_APP_DASHBOARD_ADMIN_EMAIL` correspond exactement à votre email Google qui se connecte.

## 🎯 Comment ça fonctionne

1. **Votre email (admin)** : Accès immédiat ✅
2. **Autres emails** :
   - Tentative de connexion → Email envoyé à vous
   - Vous recevez un email avec liens **Approuver** / **Refuser**
   - Cliquez sur le lien pour approuver/refuser
   - L'utilisateur peut ensuite se connecter (si approuvé)

## ⚠️ Note importante sur les permissions

Les permissions sont actuellement stockées dans `localStorage` du navigateur. Cela signifie :

- Si vous approuvez depuis votre navigateur, l'utilisateur devra vous demander de se connecter depuis son navigateur
- Pour une solution de production, utilisez un backend avec base de données

**Solution temporaire** : L'utilisateur peut vous demander de se connecter depuis son navigateur pour activer les permissions.

## 🔧 Test Rapide

1. **Connectez-vous avec votre email admin** → Accès immédiat
2. **Connectez-vous avec un autre email** → Email de demande envoyé
3. **Cliquez sur le lien d'approbation** → Permissions accordées

---

**Tous les secrets GitHub sont configurés dans `.github/workflows/deploy.yml` !** ✅

