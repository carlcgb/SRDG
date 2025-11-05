# 🌐 Configuration du Sous-domaine stats.lasoireedurire.ca

## Vue d'ensemble

Ce guide explique comment configurer le sous-domaine `stats.lasoireedurire.ca` pour pointer vers le dashboard Analytics sur Cloudflare Pages.

## 📋 Prérequis

1. Accès à Cloudflare Dashboard
2. Projet Cloudflare Pages déployé
3. Domaine `lasoireedurire.ca` géré par Cloudflare

## 🚀 Configuration dans Cloudflare Pages

### Étape 1 : Ajouter le domaine personnalisé

1. Allez dans [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez votre compte
3. Allez dans **Pages** → Votre projet **SRDG**
4. Cliquez sur l'onglet **Custom domains**
5. Cliquez sur **Set up a custom domain**
6. Entrez `stats.lasoireedurire.ca`
7. Cliquez sur **Continue**

### Étape 2 : Cloudflare configure automatiquement le DNS

Cloudflare va automatiquement :
- Créer un enregistrement CNAME dans votre DNS
- Configurer le SSL/TLS
- Activer HTTPS automatiquement

**Note** : Cela peut prendre quelques minutes pour propager.

## 🔧 Configuration DNS Manuelle (si nécessaire)

Si Cloudflare ne configure pas automatiquement le DNS, vous pouvez le faire manuellement :

### Dans Cloudflare DNS

1. Allez dans **DNS** → **Records**
2. Cliquez sur **Add record**
3. Configurez :
   - **Type** : `CNAME`
   - **Name** : `stats`
   - **Target** : `[votre-projet].pages.dev` (ex: `srdg.pages.dev`)
   - **Proxy status** : ✅ Proxied (orange cloud)
   - **TTL** : Auto
4. Cliquez sur **Save**

### Exemple de configuration

```
Type: CNAME
Name: stats
Target: srdg.pages.dev
Proxy: ON (orange cloud)
TTL: Auto
```

## ✅ Vérification

### Vérifier la configuration DNS

```bash
# Vérifier le CNAME
nslookup stats.lasoireedurire.ca

# Ou avec dig
dig stats.lasoireedurire.ca CNAME
```

Vous devriez voir un CNAME pointant vers `[votre-projet].pages.dev`.

### Vérifier le SSL/TLS

1. Allez sur `https://stats.lasoireedurire.ca`
2. Vérifiez que le cadenas SSL est présent
3. Vérifiez que le certificat est valide

### Vérifier le dashboard

1. Allez sur `https://stats.lasoireedurire.ca/dashboard`
2. Vous devriez voir la page de connexion Google
3. Le dashboard devrait se charger correctement

## 🔄 Configuration du Code

Le code est déjà configuré pour supporter le sous-domaine `stats` :

### Fichier `src/utils/subdomainRouter.js`

```javascript
// Détecte automatiquement le sous-domaine 'stats'
export const isDashboardSubdomain = () => {
  return getSubdomain() === 'dashboard' || getSubdomain() === 'stats';
};
```

### Fichier `src/index.js`

```javascript
// Route automatiquement vers DashboardApp si sous-domaine 'stats'
const isDashboard = isDashboardSubdomain() || pathname.startsWith('/dashboard');
```

## 🌍 Autres Sous-domaines Possibles

Vous pouvez aussi configurer d'autres sous-domaines :

- `dashboard.lasoireedurire.ca` → Dashboard
- `stats.lasoireedurire.ca` → Dashboard (alias)
- `analytics.lasoireedurire.ca` → Dashboard (alias)

Pour ajouter un alias, répétez les étapes ci-dessus avec le nouveau nom de sous-domaine.

## 🐛 Dépannage

### Le sous-domaine ne fonctionne pas

1. **Vérifier le DNS** :
   - Le CNAME doit pointer vers `[votre-projet].pages.dev`
   - Le proxy doit être activé (orange cloud)

2. **Vérifier le SSL** :
   - Attendre quelques minutes pour la propagation SSL
   - Vérifier que le certificat est valide

3. **Vérifier les routes** :
   - Tester `https://stats.lasoireedurire.ca/dashboard`
   - Vérifier la console du navigateur pour les erreurs

### Le dashboard ne se charge pas

1. **Vérifier la console du navigateur** (F12) :
   - Chercher les erreurs JavaScript
   - Vérifier les requêtes réseau

2. **Vérifier les routes** :
   - S'assurer que `_redirects` est correctement configuré
   - Vérifier que les Workers Functions sont déployés

3. **Vérifier les secrets GitHub** :
   - S'assurer que tous les secrets sont configurés
   - Vérifier le workflow GitHub Actions

### Erreur SSL/TLS

1. **Attendre la propagation** :
   - Les certificats SSL peuvent prendre quelques minutes
   - Cloudflare configure automatiquement Let's Encrypt

2. **Vérifier le proxy** :
   - Le proxy Cloudflare doit être activé (orange cloud)
   - Désactiver le proxy peut causer des problèmes SSL

## 📚 Ressources

- [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Cloudflare DNS Records](https://developers.cloudflare.com/dns/manage-dns-records/)
- [Cloudflare SSL/TLS](https://developers.cloudflare.com/ssl/edge-certificates/)

## ✅ Checklist

- [ ] Sous-domaine ajouté dans Cloudflare Pages
- [ ] CNAME créé dans DNS (ou configuré automatiquement)
- [ ] SSL/TLS actif (cadenas vert)
- [ ] Dashboard accessible sur `https://stats.lasoireedurire.ca/dashboard`
- [ ] Authentification Google fonctionne
- [ ] Routes API fonctionnent (`/api/*`)

---

**Une fois configuré, votre dashboard sera accessible sur `https://stats.lasoireedurire.ca` !** 🎉

