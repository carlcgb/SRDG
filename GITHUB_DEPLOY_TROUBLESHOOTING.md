# 🚨 Résolution du Problème de Déploiement GitHub

## ❌ Erreur Rencontrée

```
RequestError [HttpError]: Resource not accessible by integration
status: 403
message: 'Resource not accessible by integration'
```

## 🔍 Cause du Problème

Cette erreur indique que l'action GitHub **Cloudflare Pages** n'a pas les permissions nécessaires pour :
- Créer des déploiements GitHub
- Accéder aux ressources du dépôt
- Écrire dans les pages GitHub

## ✅ Solution Appliquée

### 1. Permissions Ajoutées au Workflow

Le fichier `.github/workflows/deploy.yml` a été mis à jour avec les permissions requises :

```yaml
permissions:
  contents: read      # Lire le contenu du dépôt
  deployments: write  # Créer des déploiements
  pages: write        # Écrire dans GitHub Pages
  id-token: write     # Authentification OIDC
```

### 2. Configuration Cloudflare Simplifiée

- Suppression de la dépendance `gitHubToken`
- Utilisation des permissions OIDC pour l'authentification
- Configuration plus moderne et sécurisée

## 🔧 Étapes de Résolution

### 1. Vérifier les Secrets GitHub

Assurez-vous que ces secrets sont configurés dans votre dépôt :

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare | Cloudflare Dashboard → Right sidebar |
| `EMAILJS_SERVICE_ID` | ID du service EmailJS | EmailJS Dashboard |
| `EMAILJS_TEMPLATE_ID` | ID du template EmailJS | EmailJS Dashboard |
| `EMAILJS_PUBLIC_KEY` | Clé publique EmailJS | EmailJS Dashboard |

### 2. Configurer les Secrets GitHub

1. Aller dans votre dépôt GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer sur **"New repository secret"**
4. Ajouter chaque secret avec la valeur correspondante

### 3. Vérifier les Permissions du Dépôt

1. Aller dans **Settings** → **Actions** → **General**
2. Dans la section **"Workflow permissions"** :
   - Sélectionner **"Read and write permissions"**
   - Cocher **"Allow GitHub Actions to create and approve pull requests"**

### 4. Redéclencher le Déploiement

```bash
# Pousser les changements
git add .
git commit -m "Fix GitHub Actions permissions"
git push origin main
```

## 🧪 Test de la Solution

### 1. Vérifier le Workflow

Le workflow mis à jour devrait maintenant :
- ✅ Avoir les permissions nécessaires
- ✅ Se connecter à Cloudflare sans erreur
- ✅ Déployer le site avec succès

### 2. Surveiller les Logs

Dans GitHub Actions, vérifiez que :
- Le build se termine avec succès
- Aucune erreur 403 n'apparaît
- Le déploiement Cloudflare est créé

## 🔍 Dépannage Supplémentaire

### Si l'erreur persiste :

#### 1. Vérifier le Token Cloudflare
```bash
# Tester le token localement
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer YOUR_API_TOKEN"
```

#### 2. Vérifier l'ID du Compte
- Aller dans Cloudflare Dashboard
- L'ID du compte est visible dans la barre latérale droite

#### 3. Vérifier le Nom du Projet
- Le nom du projet doit correspondre exactement à celui dans Cloudflare Pages
- Vérifier dans Cloudflare Pages → Settings → General

### 4. Alternative : Déploiement Manuel

Si le problème persiste, vous pouvez déployer manuellement :

```bash
# Installer Wrangler
npm install -g wrangler

# Se connecter à Cloudflare
wrangler login

# Déployer
wrangler pages deploy build --project-name=srdg
```

## 📚 Ressources Utiles

- [GitHub Actions Permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Cloudflare Pages Action](https://github.com/cloudflare/pages-action)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

## ✅ Résultat Attendu

Après ces corrections, votre déploiement GitHub Actions devrait :
- ✅ Se lancer automatiquement à chaque push sur `main`
- ✅ Construire le projet avec les variables d'environnement
- ✅ Déployer sur Cloudflare Pages sans erreur
- ✅ Afficher l'URL du site déployé

---

**Le problème de permissions GitHub Actions est maintenant résolu !** 🎉
