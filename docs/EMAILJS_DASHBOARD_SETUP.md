# 📧 Configuration EmailJS pour les Demandes d'Accès Dashboard

## Problème

Si vous ne recevez pas d'email lors d'une demande d'accès au dashboard, vérifiez ces points :

## ✅ Checklist de Configuration

### 1. Secrets GitHub

Assurez-vous que ces secrets sont configurés dans **Settings** → **Secrets and variables** → **Actions** :

| Nom du Secret | Description | Obligatoire |
|---------------|-------------|-------------|
| `EMAILJS_SERVICE_ID` | ID du service EmailJS | ✅ Oui |
| `EMAILJS_TEMPLATE_ID` | ID du template EmailJS (formulaire corporatif) | ✅ Oui (fallback) |
| `EMAILJS_PUBLIC_KEY` | Clé publique EmailJS | ✅ Oui |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Template pour demandes d'accès | ⚠️ Optionnel (utilise EMAILJS_TEMPLATE_ID si non défini) |

### 2. Template EmailJS

#### Option A : Utiliser le template existant (formulaire corporatif)

Si vous n'avez pas de template spécifique pour les demandes d'accès, le système utilisera automatiquement le template EmailJS principal (`EMAILJS_TEMPLATE_ID`).

**Important** : Assurez-vous que ce template accepte les variables suivantes :
- `{{to_email}}` - Email de destination
- `{{user_email}}` - Email de l'utilisateur qui demande l'accès
- `{{user_name}}` - Nom de l'utilisateur
- `{{approval_link}}` - Lien d'approbation
- `{{denial_link}}` - Lien de refus
- `{{approval_link_html}}` - Lien d'approbation (HTML)
- `{{denial_link_html}}` - Lien de refus (HTML)
- `{{request_date}}` - Date de la demande
- `{{dashboard_url}}` - URL du dashboard

#### Option B : Créer un template spécifique (recommandé)

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Créez un nouveau **Email Template**
3. Configurez le template :

**Sujet :**
```
Nouvelle demande d'accès au Dashboard - {{user_name}}
```

**Corps de l'email (HTML) :**
```html
<h2>Nouvelle demande d'accès au tableau de bord Analytics</h2>

<p><strong>Informations de l'utilisateur :</strong></p>
<ul>
  <li><strong>Nom :</strong> {{user_name}}</li>
  <li><strong>Email :</strong> {{user_email}}</li>
  <li><strong>Date de la demande :</strong> {{request_date}}</li>
</ul>

<p><strong>Actions :</strong></p>
<p>{{approval_link_html}}</p>
<p>{{denial_link_html}}</p>

<p>Ou utilisez ces liens directs :</p>
<ul>
  <li><a href="{{approval_link}}">✅ Approuver l'accès</a></li>
  <li><a href="{{denial_link}}">❌ Refuser l'accès</a></li>
</ul>

<p><strong>Dashboard :</strong> <a href="{{dashboard_url}}">{{dashboard_url}}</a></p>

<hr>
<p><small>Dashboard La Soirée du Rire de Granby</small></p>
```

**Corps de l'email (texte) :**
```
Nouvelle demande d'accès au tableau de bord Analytics

Informations de l'utilisateur :
- Nom : {{user_name}}
- Email : {{user_email}}
- Date de la demande : {{request_date}}

Actions :
Approuver : {{approval_link}}
Refuser : {{denial_link}}

Dashboard : {{dashboard_url}}

---
Dashboard La Soirée du Rire de Granby
```

4. Configurez l'email de destination : `{{to_email}}` (ou directement `info@lasoireedurire.ca`)
5. Sauvegardez et notez l'**ID du template** (commence par "template_")
6. Ajoutez le secret `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` dans GitHub Secrets avec cet ID

### 3. Vérification dans la Console

Ouvrez la console du navigateur (F12) et regardez les logs lors d'une demande d'accès :

✅ **Si EmailJS est configuré :**
```
📧 Sending dashboard access request email:
EmailJS Service ID: service_xxxxx
EmailJS Template ID: template_xxxxx
To: info@lasoireedurire.ca
...
✅ Email sent successfully: {...}
```

❌ **Si EmailJS n'est pas configuré :**
```
❌ EmailJS not configured for dashboard access requests
EmailJS_SERVICE_ID: ❌ Missing
EMAILJS_TEMPLATE_ID: ❌ Missing
EMAILJS_PUBLIC_KEY: ❌ Missing
```

❌ **Si EmailJS échoue :**
```
❌ EmailJS send error: {...}
Error details: {
  code: ...,
  text: ...,
  status: ...,
  message: ...
}
```

### 4. Erreurs Courantes

#### Erreur : "Invalid template ID"
- **Cause** : Le template ID n'existe pas ou n'est pas accessible
- **Solution** : Vérifiez que le template existe dans EmailJS et que l'ID est correct

#### Erreur : "Invalid service ID"
- **Cause** : Le service ID n'existe pas ou n'est pas accessible
- **Solution** : Vérifiez que le service existe dans EmailJS et que l'ID est correct

#### Erreur : "Invalid public key"
- **Cause** : La clé publique est incorrecte
- **Solution** : Vérifiez la clé publique dans EmailJS Dashboard → Account

#### Erreur : "Template variables not found"
- **Cause** : Le template utilise des variables qui ne sont pas envoyées
- **Solution** : Vérifiez que toutes les variables du template correspondent aux variables envoyées dans `emailData`

### 5. Test Manuel

1. Connectez-vous avec un email qui n'est pas autorisé
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les logs pour voir si l'email est envoyé
4. Vérifiez votre boîte email (et spam) pour voir si l'email arrive
5. Si l'email n'arrive pas, vérifiez les logs EmailJS dans le dashboard

## 🔍 Debug

### Vérifier les Variables d'Environnement

Dans la console du navigateur :
```javascript
console.log('EmailJS Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
console.log('EmailJS Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
console.log('EmailJS Public Key:', process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? 'Set' : 'Not set');
console.log('Dashboard Template ID:', process.env.REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID);
```

### Vérifier les Secrets GitHub

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Vérifiez que tous les secrets sont présents
3. Vérifiez que les noms correspondent exactement (sensibles à la casse)

### Vérifier le Build GitHub Actions

1. Allez dans **Actions** → Dernier workflow
2. Ouvrez le job "Verify environment variables"
3. Vérifiez que tous les secrets sont marqués comme "set"

## 📝 Notes

- Si `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` n'est pas défini, le système utilisera `EMAILJS_TEMPLATE_ID` (template du formulaire corporatif)
- Assurez-vous que le template EmailJS accepte toutes les variables nécessaires
- Les emails peuvent prendre quelques minutes à arriver
- Vérifiez aussi le dossier spam

---

**Si vous avez toujours des problèmes, vérifiez les logs dans la console du navigateur lors d'une demande d'accès !** 🔍

