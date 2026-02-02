# 🔐 Configuration GitHub Secrets Uniquement

## Vue d'ensemble

Ce projet utilise **uniquement GitHub Secrets** pour toutes les informations sensibles. Aucune variable d'environnement `.env` n'est nécessaire pour le développement local, car toutes les variables sont injectées au moment du build via GitHub Actions.

## 📋 Secrets Requis

### Secrets GitHub à configurer

Dans **Settings** → **Secrets and variables** → **Actions**, ajoutez :

| Nom du Secret | Description | Exemple |
|---------------|-------------|---------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Client ID Google OAuth 2.0 | `417559096229-...` |
| `REACT_APP_GA4_PROPERTY_ID` | Property ID Google Analytics 4 | `<YOUR_GA4_PROPERTY_ID>` |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Email admin du dashboard | `info@lasoireedurire.ca` |
| `REACT_APP_EMAILJS_SERVICE_ID` | ID du service EmailJS | `service_xxxxx` |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | ID du template EmailJS | `template_xxxxx` |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | Clé publique EmailJS | `xxxxx` |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Template pour demandes d'accès (optionnel) | `template_xxxxx` |
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare | `xxxxx` |
| `CLOUDFLARE_ACCOUNT_ID` | ID compte Cloudflare | `xxxxx` |

## 🚀 Développement Local

### Option 1 : Utiliser des valeurs mockées (Recommandé pour développement)

Le code utilise automatiquement des données mockées si les variables d'environnement ne sont pas configurées :

- **Dashboard** : Affiche des données de démonstration si `REACT_APP_GA4_PROPERTY_ID` n'est pas défini
- **Authentification** : Utilise des valeurs par défaut si `REACT_APP_GOOGLE_CLIENT_ID` n'est pas défini

### Option 2 : Créer un fichier `.env.local` (Pour développement uniquement)

Si vous voulez tester avec de vraies valeurs en local, créez un fichier `.env.local` (qui est ignoré par Git) :

```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GA4_PROPERTY_ID=your_property_id_here
REACT_APP_DASHBOARD_ADMIN_EMAIL=your_email@example.com
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

**⚠️ Important** : Le fichier `.env.local` est dans `.gitignore` et ne sera jamais commité. Utilisez-le uniquement pour le développement local.

## 📦 Build et Déploiement

### GitHub Actions injecte automatiquement les secrets

Les secrets GitHub sont automatiquement injectés lors du build dans `.github/workflows/deploy.yml` :

```yaml
- name: Build with environment variables
  run: npm run build:prod
  env:
    REACT_APP_GOOGLE_CLIENT_ID: ${{ secrets.REACT_APP_GOOGLE_CLIENT_ID }}
    REACT_APP_GA4_PROPERTY_ID: ${{ secrets.REACT_APP_GA4_PROPERTY_ID }}
    REACT_APP_DASHBOARD_ADMIN_EMAIL: ${{ secrets.REACT_APP_DASHBOARD_ADMIN_EMAIL }}
    # ... autres secrets
```

### Vérification des secrets

Le workflow GitHub Actions vérifie automatiquement que tous les secrets sont configurés :

```yaml
- name: Verify environment variables
  run: |
    if [ -z "$REACT_APP_GOOGLE_CLIENT_ID" ]; then
      echo "WARNING: REACT_APP_GOOGLE_CLIENT_ID is not set"
    fi
    # ... autres vérifications
```

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter `.env`** : Le fichier `.env` est dans `.gitignore`
2. **Utiliser uniquement GitHub Secrets** : Toutes les valeurs sensibles sont dans GitHub Secrets
3. **Ne pas partager les secrets** : Les secrets GitHub ne peuvent pas être lus une fois sauvegardés
4. **Rotation des secrets** : Changez les secrets régulièrement si compromis

### Variables d'environnement dans le code

Le code utilise uniquement `process.env.REACT_APP_*` qui sont injectées au moment du build :

```javascript
// ✅ Correct - Variable injectée au build
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ❌ Incorrect - Ne jamais faire ça
const CLIENT_ID = 'hardcoded-value';
```

## 🐛 Dépannage

### Les variables ne sont pas détectées en local

**Solution** : Utilisez des valeurs mockées ou créez `.env.local` (non commité)

### Les variables ne sont pas détectées en production

**Solution** : Vérifiez que les secrets GitHub sont configurés et que le workflow GitHub Actions les injecte correctement

### Les secrets GitHub ne sont pas injectés

**Solution** :
1. Vérifiez que les secrets sont dans **Actions** secrets, pas **Dependabot**
2. Vérifiez que les noms des secrets correspondent exactement (sensibles à la casse)
3. Vérifiez les logs GitHub Actions pour voir si les secrets sont injectés

## 📚 Ressources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

**Toutes les informations sensibles sont maintenant gérées via GitHub Secrets uniquement !** 🔐

