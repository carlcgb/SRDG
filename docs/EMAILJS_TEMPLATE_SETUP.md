# 📧 Configuration EmailJS Template pour Demandes d'Accès

## ⚠️ Problème : Liens vides dans EmailJS

Si les variables `{{approval_link}}` et `{{denial_link}}` apparaissent vides dans vos emails, voici comment corriger :

## 🔧 Solution 1 : Vérifier les noms des variables dans EmailJS

### Dans votre template EmailJS, utilisez EXACTEMENT ces noms :

- `{{approval_link}}` (avec underscore, pas de tiret)
- `{{denial_link}}` (avec underscore, pas de tiret)
- `{{user_email}}`
- `{{user_name}}`
- `{{request_date}}`
- `{{dashboard_url}}`

### Format correct du template :

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

## 🔍 Vérification dans EmailJS

1. Allez dans votre template EmailJS
2. Vérifiez que les variables sont écrites **exactement** comme ci-dessus
3. Assurez-vous qu'il n'y a pas d'espaces supplémentaires
4. Les liens doivent être sur des lignes séparées pour s'afficher correctement

## 🐛 Dépannage

### Les liens sont vides

**Cause possible 1 : Noms de variables incorrects**
- Vérifiez que vous utilisez `{{approval_link}}` et `{{denial_link}}` (avec underscore)
- PAS `{{approval-link}}` ou `{{approvalLink}}`

**Cause possible 2 : Variables non passées**
- Vérifiez la console du navigateur lors de l'envoi
- Vous devriez voir un log avec les données envoyées
- Les liens devraient être visibles dans le log

**Cause possible 3 : Template EmailJS incorrect**
- Vérifiez que le template utilise bien ces variables
- Testez le template avec des valeurs de test dans EmailJS

### Tester les liens

1. Ouvrez la console du navigateur (F12)
2. Connectez-vous avec un email non autorisé
3. Regardez les logs - vous devriez voir :
   ```
   Sending email with data: {
     approval_link: "https://lasoireedurire.ca/dashboard/approve?...",
     denial_link: "https://lasoireedurire.ca/dashboard/approve?..."
   }
   ```

### Format des liens dans l'email

Les liens doivent être formatés comme des liens HTML dans EmailJS :

**Option A : Lien simple (recommandé)**
```
Pour approuver: {{approval_link}}

Pour refuser: {{denial_link}}
```

**Option B : Lien HTML formaté**
```
Pour approuver: <a href="{{approval_link}}">Cliquez ici pour approuver</a>

Pour refuser: <a href="{{denial_link}}">Cliquez ici pour refuser</a>
```

## 📝 Exemple de Template Complet

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

Si les liens ci-dessus ne fonctionnent pas, copiez et collez ces URLs dans votre navigateur:

Approuver: {{approval_link}}
Refuser: {{denial_link}}

---
Dashboard La Soirée du Rire de Granby
```

## ✅ Checklist

- [ ] Variables nommées correctement avec underscore (`{{approval_link}}`)
- [ ] Template EmailJS sauvegardé
- [ ] Testé avec un email de test
- [ ] Liens visibles dans l'email reçu
- [ ] Liens cliquables et fonctionnels

## 🔗 Format des URLs générées

Les liens générés ressemblent à :
```
https://lasoireedurire.ca/dashboard/approve?email=user@example.com&token=ABC123&action=approve
https://lasoireedurire.ca/dashboard/approve?email=user@example.com&token=ABC123&action=deny
```

Si vous voyez ces URLs dans les logs mais pas dans l'email, le problème est dans le template EmailJS.

