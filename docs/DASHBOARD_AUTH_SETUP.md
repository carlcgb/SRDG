# 🔐 Configuration de l'Authentification du Dashboard

## Vue d'ensemble

Le dashboard utilise un système d'authentification par email avec notifications automatiques. Seul votre compte Google (email admin) peut accéder directement au dashboard. Les autres utilisateurs doivent demander l'accès et vous recevrez un email pour approuver ou refuser leur demande.

## 🔑 Variables d'Environnement Requises

### Pour le développement (`.env`)

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GA4_PROPERTY_ID=<YOUR_GA4_PROPERTY_ID>
REACT_APP_DASHBOARD_ADMIN_EMAIL=votre-email@gmail.com
REACT_APP_EMAILJS_SERVICE_ID=your-service-id
REACT_APP_EMAILJS_TEMPLATE_ID=your-template-id
REACT_APP_EMAILJS_PUBLIC_KEY=your-public-key
REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID=your-dashboard-template-id
```

### Pour GitHub Secrets (Production)

Ajoutez ces secrets dans **Settings** → **Secrets and variables** → **Actions** :

| Nom du Secret | Description | Exemple |
|---------------|-------------|---------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Client ID Google OAuth | `417559096229-...` |
| `REACT_APP_GA4_PROPERTY_ID` | Property ID Google Analytics 4 | `<YOUR_GA4_PROPERTY_ID>` |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Votre email Google (admin) | `votre-email@gmail.com` |
| `EMAILJS_SERVICE_ID` | ID du service EmailJS | `service_xxxxx` |
| `EMAILJS_TEMPLATE_ID` | ID du template EmailJS (pour les demandes) | `template_xxxxx` |
| `EMAILJS_PUBLIC_KEY` | Clé publique EmailJS | `xxxxx` |

## 📧 Configuration EmailJS pour les Demandes d'Accès

### 1. Créer un Template EmailJS pour les Demandes

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Créez un nouveau **Email Template**
3. Configurez le template avec ces variables :

**Sujet :**
```
Nouvelle demande d'accès au Dashboard - {{user_name}}
```

**Corps de l'email :**
```
Nouvelle demande d'accès au tableau de bord Analytics

Informations de l'utilisateur:
- Nom: {{user_name}}
- Email: {{user_email}}
- Date de la demande: {{request_date}}

Pour approuver l'accès (View Only):
{{approval_link}}

Pour refuser l'accès:
{{denial_link}}

URL du Dashboard: {{dashboard_url}}

---
Dashboard La Soirée du Rire de Granby
```

4. Notez l'**ID du template** (commence par `template_`)
5. Ajoutez-le dans `.env` comme `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID`

### 2. Variables Disponibles dans le Template

- `{{user_email}}` - Email de l'utilisateur qui demande l'accès
- `{{user_name}}` - Nom de l'utilisateur
- `{{user_picture}}` - Photo de profil (optionnel)
- `{{approval_link}}` - Lien pour approuver l'accès
- `{{denial_link}}` - Lien pour refuser l'accès
- `{{request_date}}` - Date de la demande
- `{{dashboard_url}}` - URL du dashboard

## 🔒 Système d'Autorisation

### Comment ça fonctionne

1. **Votre email (admin)** : Accès automatique et immédiat
2. **Autres emails** : 
   - Tentative de connexion → Demande d'accès envoyée
   - Vous recevez un email avec les options d'approbation/refus
   - Une fois approuvé, l'utilisateur peut se connecter

### Gestion des Permissions

Les permissions sont stockées dans `localStorage` du navigateur. Pour une gestion centralisée, vous pouvez :

1. **Approuver manuellement** : 
   - L'utilisateur reçoit un email d'approbation
   - Il peut se connecter après approbation

2. **Refuser l'accès** :
   - L'utilisateur ne peut pas accéder au dashboard
   - Une notification peut être envoyée (optionnel)

## 🚀 Configuration GitHub Secrets

### Ajouter les Secrets

1. Allez dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. Ajoutez chaque secret :

```
REACT_APP_GOOGLE_CLIENT_ID = 417559096229-odg5v7bi3glglcp2fg7d95g9ajil07pe.apps.googleusercontent.com
REACT_APP_GA4_PROPERTY_ID = <YOUR_GA4_PROPERTY_ID>
REACT_APP_DASHBOARD_ADMIN_EMAIL = votre-email@gmail.com
```

Les secrets EmailJS sont déjà configurés (si vous les avez déjà).

## 📋 Checklist de Configuration

- [ ] Admin email configuré dans `.env` et GitHub Secrets
- [ ] Template EmailJS créé pour les demandes d'accès
- [ ] `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` ajouté
- [ ] Google Client ID configuré
- [ ] GA4 Property ID configuré
- [ ] Tous les secrets GitHub ajoutés
- [ ] Test de connexion avec votre email admin
- [ ] Test de demande d'accès avec un autre email

## 🧪 Tests

### Test 1 : Connexion Admin

1. Connectez-vous avec votre email admin
2. ✅ Vous devriez avoir accès immédiatement au dashboard

### Test 2 : Demande d'Accès

1. Connectez-vous avec un autre email Google
2. ✅ Vous devriez recevoir un email de demande d'accès
3. ✅ L'utilisateur voit un message "Demande envoyée"

### Test 3 : Approbation

1. Cliquez sur le lien d'approbation dans l'email
2. ✅ L'utilisateur peut maintenant se connecter

## 🔧 Dépannage

### L'email admin n'a pas d'accès

- Vérifiez que `REACT_APP_DASHBOARD_ADMIN_EMAIL` correspond exactement à votre email Google
- Les emails sont comparés en minuscules (case-insensitive)

### Les emails de demande ne sont pas envoyés

- Vérifiez que `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, et `EMAILJS_PUBLIC_KEY` sont configurés
- Vérifiez que le template EmailJS contient les bonnes variables
- Consultez la console du navigateur pour les erreurs

### Les liens d'approbation/refus ne fonctionnent pas

- Les liens utilisent un token simple (pour la production, utilisez un backend sécurisé)
- Les tokens expirent après 24 heures

## 🔒 Sécurité

### Recommandations pour la Production

1. **Backend pour les permissions** : Utilisez un backend pour stocker et gérer les permissions
2. **Tokens sécurisés** : Utilisez des tokens JWT signés pour les liens d'approbation
3. **Base de données** : Stockez les permissions dans une base de données plutôt que localStorage
4. **Audit log** : Enregistrez toutes les tentatives de connexion et approbations

### Stockage Local vs Backend

- **Actuel** : localStorage (pour développement/rapide)
- **Production recommandé** : Backend avec base de données

## 📚 Ressources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

