# 🔐 Configuration GitHub Secrets pour le Dashboard

## Vue d'ensemble

Ce guide vous aide à configurer tous les secrets GitHub nécessaires pour le dashboard, incluant l'authentification Google, Google Analytics 4, et les notifications EmailJS.

## 📋 Secrets Requis

### Secrets déjà configurés (si vous les avez déjà)

| Nom du Secret | Description | Variable |
|---------------|-------------|----------|
| `EMAILJS_SERVICE_ID` | ID du service EmailJS | `REACT_APP_EMAILJS_SERVICE_ID` |
| `EMAILJS_TEMPLATE_ID` | ID du template EmailJS (formulaire corporatif) | `REACT_APP_EMAILJS_TEMPLATE_ID` |
| `EMAILJS_PUBLIC_KEY` | Clé publique EmailJS | `REACT_APP_EMAILJS_PUBLIC_KEY` |

### Nouveaux secrets pour le Dashboard

| Nom du Secret | Description | Exemple | Variable |
|---------------|-------------|---------|----------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Client ID Google OAuth 2.0 | `417559096229-...` | `REACT_APP_GOOGLE_CLIENT_ID` |
| `REACT_APP_GA4_PROPERTY_ID` | Property ID Google Analytics 4 | `<YOUR_GA4_PROPERTY_ID>` | `REACT_APP_GA4_PROPERTY_ID` |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Votre email Google (admin) | `votre-email@gmail.com` | `REACT_APP_DASHBOARD_ADMIN_EMAIL` |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Template EmailJS pour demandes d'accès | `template_xxxxx` | `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` |

## 🚀 Configuration des Secrets

### 1. Accéder aux Secrets GitHub

1. Allez dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**

### 2. Ajouter les Secrets

#### Secret 1 : Google Client ID

- **Name** : `REACT_APP_GOOGLE_CLIENT_ID`
- **Value** : Votre Client ID Google OAuth (ex: `417559096229-odg5v7bi3glglcp2fg7d95g9ajil07pe.apps.googleusercontent.com`)
- **Description** : Client ID pour Google Sign-In du dashboard

#### Secret 2 : GA4 Property ID

- **Name** : `REACT_APP_GA4_PROPERTY_ID`
- **Value** : Votre Property ID GA4 (ex: `123456789`)
- **Description** : Property ID pour Google Analytics 4

#### Secret 3 : Admin Email

- **Name** : `REACT_APP_DASHBOARD_ADMIN_EMAIL`
- **Value** : Votre email Google (ex: `info@lasoireedurire.ca` ou `votre-email@gmail.com`)
- **Description** : Email admin qui a accès automatique au dashboard

#### Secret 4 : Template EmailJS pour Demandes (Optionnel)

- **Name** : `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID`
- **Value** : ID du template EmailJS pour les demandes d'accès (ex: `template_xxxxx`)
- **Description** : Template EmailJS pour envoyer les demandes d'accès au dashboard
- **Note** : Si non configuré, utilise le template EmailJS principal

### 3. Vérifier les Secrets Existant

Assurez-vous que ces secrets sont déjà configurés :

- ✅ `EMAILJS_SERVICE_ID`
- ✅ `EMAILJS_TEMPLATE_ID`
- ✅ `EMAILJS_PUBLIC_KEY`

Si ces secrets n'existent pas, créez-les également.

## 📧 Configuration EmailJS pour les Demandes d'Accès

### Créer un Template EmailJS

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Créez un nouveau **Email Template** nommé "Dashboard Access Request"
3. Configurez le template :

**Sujet :**
```
Nouvelle demande d'accès au Dashboard - {{user_name}}
```

**Corps de l'email :**
```
Bonjour,

Une nouvelle demande d'accès au tableau de bord Analytics a été reçue.

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
5. Ajoutez-le dans GitHub Secrets comme `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID`

**Note** : Si vous n'ajoutez pas ce secret, le système utilisera le template EmailJS principal (`EMAILJS_TEMPLATE_ID`).

## ✅ Checklist de Configuration

### Secrets GitHub

- [ ] `REACT_APP_GOOGLE_CLIENT_ID` ajouté
- [ ] `REACT_APP_GA4_PROPERTY_ID` ajouté
- [ ] `REACT_APP_DASHBOARD_ADMIN_EMAIL` ajouté
- [ ] `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` ajouté (optionnel)
- [ ] `EMAILJS_SERVICE_ID` vérifié/existant
- [ ] `EMAILJS_TEMPLATE_ID` vérifié/existant
- [ ] `EMAILJS_PUBLIC_KEY` vérifié/existant

### Configuration EmailJS

- [ ] Template EmailJS créé pour les demandes d'accès
- [ ] Template configuré avec toutes les variables
- [ ] Email de destination configuré (`info@lasoireedurire.ca`)

### Tests

- [ ] Build GitHub Actions réussi avec tous les secrets
- [ ] Dashboard accessible avec votre email admin
- [ ] Email de demande d'accès reçu lors d'une connexion non autorisée
- [ ] Liens d'approbation/refus fonctionnels

## 🔍 Vérification des Secrets

### Vérifier dans GitHub Actions

Après avoir poussé votre code, vérifiez les logs GitHub Actions :

1. Allez dans **Actions** → Dernier workflow
2. Ouvrez le job "Verify environment variables"
3. Vérifiez que tous les secrets sont marqués comme "set"

### Vérifier Localement

Créez un fichier `.env` avec les mêmes valeurs :

```env
REACT_APP_GOOGLE_CLIENT_ID=417559096229-odg5v7bi3glglcp2fg7d95g9ajil07pe.apps.googleusercontent.com
REACT_APP_GA4_PROPERTY_ID=123456789
REACT_APP_DASHBOARD_ADMIN_EMAIL=info@lasoireedurire.ca
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID=your_dashboard_template_id
```

## 🐛 Dépannage

### Les secrets ne sont pas injectés

- Vérifiez que les noms des secrets correspondent exactement (sensibles à la casse)
- Vérifiez que les secrets sont dans **Actions** secrets, pas **Dependabot** secrets
- Vérifiez que le workflow a accès aux secrets

### Le build échoue

- Vérifiez les logs GitHub Actions pour les erreurs spécifiques
- Vérifiez que tous les secrets requis sont définis
- Vérifiez que les valeurs sont correctes (pas d'espaces, caractères spéciaux, etc.)

### Les emails ne sont pas envoyés

- Vérifiez que `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, et `EMAILJS_PUBLIC_KEY` sont configurés
- Vérifiez que le template EmailJS contient les bonnes variables
- Vérifiez les logs du navigateur pour les erreurs

## 📚 Ressources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter** les fichiers `.env` avec des valeurs réelles
2. **Utiliser GitHub Secrets** pour toutes les valeurs sensibles en production
3. **Vérifier régulièrement** que les secrets sont à jour
4. **Limiter l'accès** aux secrets GitHub aux personnes autorisées
5. **Roter les secrets** si compromis

### Sécurité des Secrets

- Les secrets GitHub sont chiffrés et ne peuvent pas être lus une fois sauvegardés
- Les secrets ne sont pas visibles dans les logs GitHub Actions (sauf si explicitement affichés)
- Les secrets sont injectés uniquement dans les workflows GitHub Actions

---

**Une fois tous les secrets configurés, votre dashboard sera entièrement fonctionnel avec authentification et notifications !** 🎉

