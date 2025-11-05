# 📧 Configuration du Template EmailJS pour les Demandes d'Accès

## Configuration GitHub Secrets

Vous avez deux options pour les templates EmailJS :

### Option 1 : Utiliser le template existant (formulaire de contact) ✅ Simple

Si vous ne voulez pas créer un nouveau template, le système utilisera automatiquement votre template de contact existant (`EMAILJS_TEMPLATE_ID`).

**Aucune action requise** - Le système fonctionnera avec votre template actuel.

### Option 2 : Créer un template spécifique (recommandé) 🎯 Recommandé

Si vous voulez un template personnalisé pour les demandes d'accès au dashboard :

#### 1. Créer le Template EmailJS

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Créez un nouveau **Email Template**
3. Configurez-le avec ces variables :

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

Actions:
Approuver: {{approval_link}}
Refuser: {{denial_link}}

Dashboard: {{dashboard_url}}
```

4. Configurez l'email de destination : `info@lasoireedurire.ca`
5. Sauvegardez et notez l'**ID du template** (ex: `template_1pwn12i`)

#### 2. Ajouter le Secret GitHub

1. Allez dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. **Name** : `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID`
5. **Value** : `template_1pwn12i` (votre ID de template)
6. Cliquez sur **"Add secret"**

#### 3. Vérifier

Après le prochain déploiement, le système utilisera automatiquement ce template pour les demandes d'accès.

## ✅ Checklist

- [ ] Template EmailJS créé dans EmailJS Dashboard
- [ ] Template configuré avec toutes les variables nécessaires
- [ ] ID du template noté (ex: `template_1pwn12i`)
- [ ] Secret GitHub `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` ajouté
- [ ] Email de destination configuré dans le template
- [ ] Prochain déploiement attendu

## 📝 Variables Disponibles dans le Template

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{to_email}}` | Email de destination | `info@lasoireedurire.ca` |
| `{{user_email}}` | Email de l'utilisateur qui demande l'accès | `user@example.com` |
| `{{user_name}}` | Nom de l'utilisateur | `John Doe` |
| `{{approval_link}}` | Lien pour approuver l'accès | `https://stats.lasoireedurire.ca/approve?email=...&token=...&action=approve` |
| `{{denial_link}}` | Lien pour refuser l'accès | `https://stats.lasoireedurire.ca/approve?email=...&token=...&action=deny` |
| `{{approval_link_html}}` | Lien HTML formaté pour approuver | `<a href="...">✅ Approuver l'accès</a>` |
| `{{denial_link_html}}` | Lien HTML formaté pour refuser | `<a href="...">❌ Refuser l'accès</a>` |
| `{{request_date}}` | Date de la demande | `5 novembre 2024, 11:00` |
| `{{dashboard_url}}` | URL du dashboard | `https://stats.lasoireedurire.ca` |

## 🔍 Vérification

Après avoir ajouté le secret, vérifiez dans la console du navigateur (F12) lors d'une demande d'accès :

```
📧 Sending dashboard access request email:
EmailJS Service ID: service_xxxxx
EmailJS Template ID: template_1pwn12i  ← Votre nouveau template
To: info@lasoireedurire.ca
...
✅ Email sent successfully
```

Si vous voyez encore l'ancien template ID, attendez le prochain déploiement GitHub Actions.

---

**Note** : Si vous n'ajoutez pas `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID`, le système utilisera automatiquement `EMAILJS_TEMPLATE_ID` (votre template de contact).
