# 🔍 Dépannage EmailJS - Email d'Approbation Non Reçu

## Problème : Email d'approbation non reçu

Si vous n'avez pas reçu l'email d'approbation pour les demandes d'accès au dashboard, suivez ces étapes de débogage.

## 🔍 Étape 1 : Vérifier dans la Console du Navigateur

### 1. Ouvrir la Console

1. Ouvrez votre navigateur sur le dashboard
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **"Console"**

### 2. Tester avec un Email Non Autorisé

1. Déconnectez-vous du dashboard
2. Reconnectez-vous avec un email qui n'est pas autorisé (pas `carl.g.bisaillon@gmail.com` ou `info@lasoireedurire.ca`)
3. Regardez les logs dans la console

### 3. Logs Attendus

**Si EmailJS est configuré correctement, vous devriez voir :**

```
📧 Sending dashboard access request email:
EmailJS Service ID: service_xxxxx
EmailJS Template ID: template_xxxxx
To: info@lasoireedurire.ca
User: test@example.com Test User
Approval Link: https://stats.lasoireedurire.ca/approve?email=...
Denial Link: https://stats.lasoireedurire.ca/approve?email=...
Email Data: {...}
✅ Email sent successfully: {...}
Response status: 200
Response text: OK
```

**Si EmailJS n'est pas configuré, vous verrez :**

```
❌ EmailJS not configured for dashboard access requests
EmailJS_SERVICE_ID: ❌ Missing
EMAILJS_TEMPLATE_ID: ❌ Missing
EMAILJS_PUBLIC_KEY: ❌ Missing
```

**Si EmailJS échoue, vous verrez :**

```
❌ EmailJS send error: {...}
Error details: {
  code: ...,
  text: ...,
  status: ...,
  message: ...
}
```

## 🔧 Étape 2 : Vérifier les Secrets GitHub

### 1. Vérifier dans GitHub Secrets

1. Allez dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Vérifiez que ces secrets existent :
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`
   - `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` (optionnel)

### 2. Vérifier dans GitHub Actions

1. Allez dans **Actions** → Dernier workflow
2. Ouvrez le job **"Verify environment variables"**
3. Vérifiez que tous les secrets sont marqués comme **"set"**

Si vous voyez **"WARNING: EMAILJS_XXX is not set"**, cela signifie que le secret n'est pas configuré.

## 🔧 Étape 3 : Vérifier le Template EmailJS

### 1. Vérifier que le Template Existe

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Allez dans **Email Templates**
3. Vérifiez que le template existe (ID : celui configuré dans GitHub Secrets)

### 2. Vérifier les Variables du Template

Le template doit avoir ces variables :

- `{{to_email}}` - Email de destination
- `{{user_email}}` - Email de l'utilisateur
- `{{user_name}}` - Nom de l'utilisateur
- `{{approval_link}}` - Lien pour approuver
- `{{denial_link}}` - Lien pour refuser
- `{{approval_link_html}}` - Lien HTML pour approuver
- `{{denial_link_html}}` - Lien HTML pour refuser
- `{{request_date}}` - Date de la demande
- `{{dashboard_url}}` - URL du dashboard

### 3. Vérifier l'Email de Destination

Dans le template EmailJS, vérifiez que l'email de destination est :
- Soit `{{to_email}}` (variable dynamique)
- Soit directement `info@lasoireedurire.ca`

## 🔧 Étape 4 : Vérifier les Logs EmailJS

### 1. Vérifier dans EmailJS Dashboard

1. Allez sur [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Allez dans **Email Logs** ou **Activity**
3. Vérifiez si des emails ont été envoyés
4. Si vous voyez des erreurs, notez-les

### 2. Vérifier les Limites EmailJS

- Vérifiez que vous n'avez pas dépassé la limite mensuelle d'emails
- Vérifiez que votre compte EmailJS est actif

## 🔧 Étape 5 : Test Manuel

### Test 1 : Vérifier les Variables d'Environnement

Dans la console du navigateur (F12), exécutez :

```javascript
console.log('EmailJS Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
console.log('EmailJS Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
console.log('EmailJS Public Key:', process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? 'Set' : 'Not set');
console.log('Dashboard Template ID:', process.env.REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID);
```

**Si vous voyez `undefined`**, cela signifie que les variables ne sont pas passées au build.

### Test 2 : Vérifier le Fallback Mailto

Si EmailJS échoue, le système devrait ouvrir un client email (mailto). Vérifiez si une fenêtre email s'ouvre.

## 🐛 Erreurs Courantes et Solutions

### Erreur : "EmailJS not configured"

**Cause** : Les secrets GitHub ne sont pas configurés ou ne sont pas passés au build

**Solution** :
1. Vérifiez que les secrets existent dans GitHub Secrets
2. Vérifiez que les secrets sont passés dans `.github/workflows/deploy.yml`
3. Redéployez l'application

### Erreur : "Invalid template ID"

**Cause** : Le template ID n'existe pas dans EmailJS

**Solution** :
1. Vérifiez que le template existe dans EmailJS Dashboard
2. Vérifiez que l'ID du template correspond à celui dans GitHub Secrets

### Erreur : "Invalid service ID"

**Cause** : Le service ID n'existe pas dans EmailJS

**Solution** :
1. Vérifiez que le service existe dans EmailJS Dashboard
2. Vérifiez que l'ID du service correspond à celui dans GitHub Secrets

### Erreur : "Invalid public key"

**Cause** : La clé publique est incorrecte

**Solution** :
1. Vérifiez la clé publique dans EmailJS Dashboard → Account
2. Assurez-vous que c'est la clé publique, pas la clé secrète

### Erreur : "Template variables not found"

**Cause** : Le template utilise des variables qui ne sont pas envoyées

**Solution** :
1. Vérifiez que toutes les variables du template correspondent aux variables envoyées dans `emailData`
2. Vérifiez les logs dans la console pour voir quelles variables sont envoyées

## ✅ Checklist de Vérification

### Configuration
- [ ] Secrets GitHub configurés (`EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`)
- [ ] Secrets passés dans `.github/workflows/deploy.yml`
- [ ] Build GitHub Actions réussi avec tous les secrets
- [ ] Application déployée après la configuration des secrets

### EmailJS Dashboard
- [ ] Service EmailJS existe et est actif
- [ ] Template EmailJS existe pour les demandes d'accès
- [ ] Template configuré avec toutes les variables nécessaires
- [ ] Email de destination configuré dans le template
- [ ] Compte EmailJS actif (pas de limite dépassée)

### Test
- [ ] Logs dans la console montrent "✅ Email sent successfully"
- [ ] EmailJS Dashboard → Email Logs montre l'email envoyé
- [ ] Email reçu dans la boîte email (vérifier spam aussi)
- [ ] Liens d'approbation/refus fonctionnent dans l'email

## 🔍 Debugging Avancé

### Forcer l'Envoi d'Email

Si vous voulez tester manuellement, vous pouvez créer un script de test :

```javascript
// Dans la console du navigateur (F12)
import emailjs from '@emailjs/browser';

const testEmail = async () => {
  emailjs.init('YOUR_PUBLIC_KEY');
  
  const response = await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {
      to_email: 'info@lasoireedurire.ca',
      user_email: 'test@example.com',
      user_name: 'Test User',
      approval_link: 'https://stats.lasoireedurire.ca/approve?email=test@example.com&token=test&action=approve',
      denial_link: 'https://stats.lasoireedurire.ca/approve?email=test@example.com&token=test&action=deny',
      // ... autres variables
    }
  );
  
  console.log('Email sent:', response);
};

testEmail();
```

## 📝 Notes

- Les emails peuvent prendre quelques minutes à arriver
- Vérifiez aussi le dossier **spam** de votre boîte email
- Les logs EmailJS dans le dashboard peuvent prendre quelques minutes à s'afficher
- Si vous utilisez le fallback mailto, une fenêtre email s'ouvrira au lieu d'un email automatique

---

**Si vous avez toujours des problèmes, vérifiez les logs dans la console du navigateur (F12) lors d'une demande d'accès !** 🔍
