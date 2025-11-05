# 🐛 Dépannage Erreur 522 - Connection Timed Out

## Qu'est-ce que l'erreur 522 ?

L'erreur 522 signifie que Cloudflare a réussi à se connecter à votre serveur d'origine, mais que la connexion a expiré avant que le serveur ne réponde. Pour Cloudflare Pages, cela indique généralement un problème de configuration.

## 🔍 Causes Possibles

### 1. Sous-domaine non configuré dans Cloudflare Pages

Le CNAME DNS pointe vers `srdg.pages.dev`, mais le sous-domaine `stats.lasoireedurire.ca` n'est peut-être pas configuré dans Cloudflare Pages.

**Solution :**
1. Allez dans [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Pages** → Votre projet **SRDG**
3. **Custom domains** → **Set up a custom domain**
4. Ajoutez `stats.lasoireedurire.ca`
5. Attendez la propagation (quelques minutes)

### 2. Build échoué ou projet non déployé

Si le build GitHub Actions échoue, il n'y a pas de contenu à servir.

**Solution :**
1. Vérifiez **GitHub Actions** pour voir si le dernier build a réussi
2. Si le build échoue, corrigez les erreurs
3. Vérifiez que le projet est déployé dans **Cloudflare Pages**

### 3. Projet Cloudflare Pages non trouvé

Le projet `srdg` n'existe peut-être pas dans Cloudflare Pages.

**Solution :**
1. Vérifiez que le projet existe dans **Cloudflare Pages**
2. Vérifiez que le nom du projet correspond à `srdg` dans `wrangler.toml`
3. Si le projet n'existe pas, créez-le ou mettez à jour le CNAME DNS

### 4. Workers Functions mal configurés

Les Workers Functions peuvent causer des timeouts s'ils ne sont pas correctement configurés.

**Solution :**
1. Vérifiez que les fichiers dans `functions/api/` sont corrects
2. Vérifiez que `wrangler.toml` est correctement configuré
3. Vérifiez les logs Cloudflare pour les erreurs

## ✅ Étapes de Vérification

### Étape 1 : Vérifier le déploiement

1. Allez dans **Cloudflare Pages** → Projet **SRDG**
2. Vérifiez l'onglet **Deployments**
3. Assurez-vous qu'il y a un déploiement réussi récent

### Étape 2 : Vérifier les domaines personnalisés

1. Dans **Cloudflare Pages** → Projet **SRDG**
2. Allez dans **Custom domains**
3. Vérifiez que `stats.lasoireedurire.ca` est listé
4. Si non, ajoutez-le

### Étape 3 : Vérifier le DNS

1. Allez dans **DNS** → **Records**
2. Vérifiez que le CNAME `stats` pointe vers `srdg.pages.dev`
3. Vérifiez que le proxy est activé (orange cloud ☁️)

### Étape 4 : Vérifier GitHub Actions

1. Allez dans **GitHub** → **Actions**
2. Vérifiez le dernier workflow
3. Assurez-vous qu'il a réussi
4. Si échec, corrigez les erreurs

## 🔧 Solutions Rapides

### Solution 1 : Reconfigurer le sous-domaine

```bash
# Dans Cloudflare Dashboard
1. Pages → SRDG → Custom domains
2. Supprimer stats.lasoireedurire.ca (si présent)
3. Ajouter à nouveau stats.lasoireedurire.ca
4. Attendre 5-10 minutes
```

### Solution 2 : Vérifier le projet Pages

1. Vérifiez que le projet `srdg` existe dans Cloudflare Pages
2. Si le nom est différent, mettez à jour :
   - Le CNAME DNS pour pointer vers le bon projet
   - Ou renommez le projet dans Cloudflare Pages

### Solution 3 : Redéployer

1. Dans **GitHub**, créez un commit vide pour déclencher un nouveau déploiement :
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

### Solution 4 : Vérifier les Workers Functions

1. Vérifiez que `functions/api/` contient les bons fichiers
2. Vérifiez que `wrangler.toml` est correct
3. Vérifiez les logs Cloudflare pour les erreurs

## 📊 Diagnostic

### Vérifier les logs Cloudflare

1. Allez dans **Cloudflare Dashboard**
2. **Analytics & Logs** → **Workers & Pages**
3. Vérifiez les erreurs et les requêtes

### Tester le domaine Pages directement

Testez `https://srdg.pages.dev` pour voir si le projet fonctionne :
- Si ça fonctionne → Problème de configuration du sous-domaine
- Si ça ne fonctionne pas → Problème de déploiement

### Vérifier le build

1. Allez dans **GitHub Actions**
2. Ouvrez le dernier workflow
3. Vérifiez que toutes les étapes ont réussi
4. Vérifiez les logs du build pour les erreurs

## 🚨 Problèmes Courants

### Problème : Le CNAME pointe vers le mauvais projet

**Solution :** Mettez à jour le CNAME DNS pour pointer vers le bon projet Pages.

### Problème : Le sous-domaine n'est pas dans Cloudflare Pages

**Solution :** Ajoutez le sous-domaine dans **Pages** → **Custom domains**.

### Problème : Le build échoue

**Solution :** Corrigez les erreurs de build et repoussez le code.

### Problème : Les Workers Functions causent des erreurs

**Solution :** Vérifiez les logs et corrigez les erreurs dans `functions/api/`.

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs Cloudflare
2. Vérifiez les logs GitHub Actions
3. Contactez le support Cloudflare avec le Ray ID de l'erreur

---

**L'erreur 522 est généralement un problème de configuration, pas de code !** 🔧

