# 🔧 Dépannage EmailJS - Liens Vides

## Problème : `{{approval_link}}` et `{{denial_link}}` sont vides

### ✅ Solution 1 : Vérifier les noms des variables dans EmailJS

Dans votre template EmailJS, les variables doivent être nommées **exactement** comme ceci :

- ✅ `{{approval_link}}` (avec underscore)
- ✅ `{{denial_link}}` (avec underscore)
- ✅ `{{user_email}}`
- ✅ `{{user_name}}`
- ✅ `{{request_date}}`
- ✅ `{{dashboard_url}}`

**❌ Ne PAS utiliser :**
- `{{approval-link}}` (tiret)
- `{{approvalLink}}` (camelCase)
- `{{approval link}}` (espace)

### ✅ Solution 2 : Vérifier le format du template

**Format correct :**
```
Pour approuver l'accès:
{{approval_link}}

Pour refuser l'accès:
{{denial_link}}
```

**Format HTML (alternative) :**
```
Pour approuver l'accès:
<a href="{{approval_link}}">Cliquez ici pour approuver</a>

Pour refuser l'accès:
<a href="{{denial_link}}">Cliquez ici pour refuser</a>
```

### ✅ Solution 3 : Tester avec la console du navigateur

1. Ouvrez la console du navigateur (F12)
2. Connectez-vous avec un email non autorisé
3. Vous devriez voir dans les logs :
   ```
   📧 Sending dashboard access request email:
   Approval Link: https://lasoireedurire.ca/dashboard/approve?email=...
   Denial Link: https://lasoireedurire.ca/dashboard/approve?email=...
   ```

Si les liens apparaissent dans la console mais pas dans l'email, le problème est dans le template EmailJS.

### ✅ Solution 4 : Vérifier le template EmailJS

1. Allez dans [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Ouvrez votre template
3. Vérifiez que :
   - Les variables sont écrites sans espaces : `{{approval_link}}`
   - Les variables sont sur des lignes séparées
   - Il n'y a pas de caractères invisibles

### ✅ Solution 5 : Utiliser les liens HTML formatés

Si les liens simples ne fonctionnent pas, utilisez les versions HTML dans le template :

```
{{approval_link_html}}

{{denial_link_html}}
```

Ces versions incluent le formatage HTML complet avec styles.

## 📋 Template EmailJS Complet Recommandé

```
Bonjour,

Une nouvelle demande d'accès au tableau de bord Analytics a été reçue.

Informations de l'utilisateur:
- Nom: {{user_name}}
- Email: {{user_email}}
- Date de la demande: {{request_date}}

ACTIONS REQUISES:

Pour approuver l'accès (View Only):
{{approval_link}}

Pour refuser l'accès:
{{denial_link}}

LIENS ALTERNATIFS (si les liens ci-dessus ne fonctionnent pas):

Approuver: {{approval_link}}
Refuser: {{denial_link}}

URL du Dashboard: {{dashboard_url}}

---
Dashboard La Soirée du Rire de Granby
```

## 🧪 Test Rapide

1. **Testez le template EmailJS directement** :
   - Dans EmailJS Dashboard, utilisez "Test"
   - Ajoutez des valeurs de test pour les variables
   - Vérifiez que les liens apparaissent

2. **Vérifiez les logs du navigateur** :
   - Ouvrez la console (F12)
   - Connectez-vous avec un email non autorisé
   - Vérifiez les logs pour voir les liens générés

3. **Vérifiez l'email reçu** :
   - Regardez le code source de l'email (si possible)
   - Vérifiez que les variables sont remplacées

## 🔍 Debugging Avancé

### Vérifier ce qui est envoyé à EmailJS

Le code log maintenant les données complètes. Dans la console, vous verrez :

```javascript
📧 Sending dashboard access request email:
To: info@lasoireedurire.ca
User: user@example.com John Doe
Approval Link: https://lasoireedurire.ca/dashboard/approve?email=user%40example.com&token=...
Denial Link: https://lasoireedurire.ca/dashboard/approve?email=user%40example.com&token=...
```

### Si les liens sont présents dans les logs mais absents de l'email

Le problème est dans EmailJS :
1. Vérifiez que le template utilise bien `{{approval_link}}` et `{{denial_link}}`
2. Vérifiez qu'il n'y a pas de filtres ou de sanitization qui suppriment les URLs
3. Testez avec un template simple d'abord

### Si les liens sont absents des logs

Le problème est dans le code :
1. Vérifiez que `window.location.origin` est défini
2. Vérifiez que `generateToken` fonctionne
3. Vérifiez les erreurs dans la console

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs de la console
2. Testez le template EmailJS directement
3. Vérifiez la documentation EmailJS : https://www.emailjs.com/docs/

