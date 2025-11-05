# 🔍 Checklist de Débogage EmailJS - Email Non Envoyé

## ✅ Vérification Rapide

### 1. Vérifier dans la Console du Navigateur

**Ouvrez la console (F12) et testez avec un email non autorisé. Vous devriez voir :**

```
📝 Marking user as pending: test@example.com
✅ User marked as pending in database
📧 Attempting to send access request email...
📧 Sending dashboard access request email:
EmailJS Service ID: service_xxxxx
EmailJS Template ID: template_xxxxx
EmailJS Public Key: Set (length: XX)
To: info@lasoireedurire.ca
📤 Attempting to send email via EmailJS...
✅ Email sent successfully: {...}
✅ Email sent successfully, setting status to request_sent
```

**Si vous voyez des erreurs, notez-les !**

## 🔧 Causes Possibles

### Cause 1 : Secrets GitHub Non Configurés

**Symptôme** : Console montre `❌ Missing` pour les variables EmailJS

**Solution** :
1. Allez dans GitHub → Settings → Secrets and variables → Actions
2. Vérifiez que ces secrets existent :
   - `EMAILJS_SERVICE_ID` = `service_xxxxx`
   - `EMAILJS_TEMPLATE_ID` = `template_xxxxx` (ou `template_1pwn12i` pour le dashboard)
   - `EMAILJS_PUBLIC_KEY` = votre clé publique
3. Si vous avez un template spécifique pour le dashboard :
   - `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` = `template_1pwn12i`
4. Redéployez l'application après avoir ajouté les secrets

### Cause 2 : Template ID Incorrect

**Symptôme** : EmailJS échoue avec "Invalid template ID"

**Solution** :
1. Vérifiez dans EmailJS Dashboard que le template "Demande d'accès STATS" existe
2. Template ID devrait être : `template_1pwn12i`
3. Vérifiez que le secret GitHub `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` = `template_1pwn12i`
4. Si vous n'avez pas ce secret, le code utilisera `EMAILJS_TEMPLATE_ID` (template de contact)

### Cause 3 : Variables du Template Manquantes

**Symptôme** : Email envoyé mais vide ou mal formaté

**Solution** :
1. Allez dans EmailJS Dashboard → Email Templates
2. Ouvrez le template "Demande d'accès STATS"
3. Vérifiez que toutes ces variables sont présentes :
   - `{{to_email}}`
   - `{{user_email}}`
   - `{{user_name}}`
   - `{{approval_link}}`
   - `{{denial_link}}`
   - `{{approval_link_html}}` (optionnel)
   - `{{denial_link_html}}` (optionnel)
   - `{{request_date}}`
   - `{{dashboard_url}}`

### Cause 4 : EmailJS Non Initialisé

**Symptôme** : Console montre `⚠️ EmailJS Public Key not configured`

**Solution** :
1. Vérifiez que `EMAILJS_PUBLIC_KEY` est dans GitHub Secrets
2. Vérifiez que le secret est passé dans `.github/workflows/deploy.yml`
3. Redéployez l'application

### Cause 5 : Limite EmailJS Dépassée

**Symptôme** : EmailJS Dashboard montre "0 requests left" ou erreur de quota

**Solution** :
1. Vérifiez dans EmailJS Dashboard le nombre de requêtes restantes
2. Si vous avez atteint la limite, attendez le renouvellement mensuel
3. Ou passez à un plan payant EmailJS

### Cause 6 : Email Dans Spam

**Symptôme** : EmailJS dit que l'email est envoyé mais vous ne le recevez pas

**Solution** :
1. Vérifiez votre dossier spam
2. Vérifiez dans EmailJS Dashboard → Email History si l'email a été envoyé
3. Vérifiez les logs EmailJS pour voir si l'email a été délivré

## 📋 Checklist Complète

### Configuration GitHub Secrets
- [ ] `EMAILJS_SERVICE_ID` configuré
- [ ] `EMAILJS_TEMPLATE_ID` configuré (template de contact)
- [ ] `EMAILJS_PUBLIC_KEY` configuré
- [ ] `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` configuré avec `template_1pwn12i` (optionnel mais recommandé)

### Configuration EmailJS Dashboard
- [ ] Template "Demande d'accès STATS" existe (ID: `template_1pwn12i`)
- [ ] Template a toutes les variables nécessaires
- [ ] Email de destination configuré (`{{to_email}}` ou `info@lasoireedurire.ca`)
- [ ] Service EmailJS actif
- [ ] Quota EmailJS disponible (pas "0 requests left")

### Code
- [ ] Variables d'environnement passées dans `.github/workflows/deploy.yml`
- [ ] Build GitHub Actions réussi
- [ ] Application déployée après configuration

### Test
- [ ] Console montre "✅ Email sent successfully"
- [ ] EmailJS Dashboard → Email History montre l'email envoyé
- [ ] Email reçu dans la boîte email (vérifier spam aussi)

## 🔍 Test Manuel

### Test 1 : Vérifier les Variables d'Environnement

Dans la console du navigateur (F12), exécutez :

```javascript
console.log('EmailJS Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
console.log('EmailJS Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
console.log('Dashboard Template ID:', process.env.REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID);
console.log('EmailJS Public Key:', process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? 'Set' : 'Not set');
```

**Si vous voyez `undefined`**, les variables ne sont pas passées au build.

### Test 2 : Vérifier EmailJS Dashboard

1. Allez dans EmailJS Dashboard → **Email History**
2. Vérifiez si des emails ont été envoyés
3. Si vous voyez des erreurs, notez-les

### Test 3 : Test Direct EmailJS

Si vous voulez tester EmailJS directement, vous pouvez créer un script de test dans la console :

```javascript
// Dans la console du navigateur (F12)
import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js').then((emailjs) => {
  emailjs.default.init('YOUR_PUBLIC_KEY');
  
  emailjs.default.send(
    'YOUR_SERVICE_ID',
    'template_1pwn12i', // Template ID pour dashboard
    {
      to_email: 'info@lasoireedurire.ca',
      user_email: 'test@example.com',
      user_name: 'Test User',
      approval_link: 'https://stats.lasoireedurire.ca/approve?email=test@example.com&token=test&action=approve',
      denial_link: 'https://stats.lasoireedurire.ca/approve?email=test@example.com&token=test&action=deny',
      request_date: new Date().toLocaleString('fr-CA'),
      dashboard_url: 'https://stats.lasoireedurire.ca'
    }
  ).then((response) => {
    console.log('✅ Email sent:', response);
  }).catch((error) => {
    console.error('❌ Email error:', error);
  });
});
```

## 🎯 Solution Immédiate

Basé sur votre screenshot, vous avez le template `template_1pwn12i` pour "Demande d'accès STATS".

**Vérifiez que :**

1. **GitHub Secret** `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` = `template_1pwn12i`
2. **Template EmailJS** a toutes les variables nécessaires
3. **Email de destination** est configuré dans le template

**Si le secret n'existe pas**, le code utilisera `EMAILJS_TEMPLATE_ID` (template de contact) au lieu du template dashboard.

---

**Après avoir vérifié ces points, testez à nouveau et partagez les logs de la console !** 🔍

