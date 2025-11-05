# 🔒 Configuration de la Politique de Confidentialité dans Google Cloud Console

## Vue d'ensemble

Google Cloud Console exige un lien vers la politique de confidentialité de l'application pour les applications OAuth qui demandent des scopes sensibles (comme `analytics.readonly`).

## 📋 Étape 1 : Vérifier que la page existe

La page de politique de confidentialité est maintenant disponible à :
- `https://lasoireedurire.ca/privacy`
- `https://lasoireedurire.ca/privacy-policy`

## 🔧 Étape 2 : Ajouter le lien dans Google Cloud Console

### 1. Accéder à OAuth Consent Screen

1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. Assurez-vous que le bon projet est sélectionné
3. Naviguez vers **APIs & Services** → **OAuth consent screen**

### 2. Ajouter le lien de politique de confidentialité

1. Dans la section **"Application privacy policy link"** (ou **"Application privacy policy link (subtle)"**)
2. Cliquez sur **"Add link"** ou **"Edit"**
3. Entrez l'URL : `https://lasoireedurire.ca/privacy`
4. Cliquez sur **"Save"** ou **"Update"**

### 3. Vérifier les autres champs requis

Assurez-vous que tous les champs suivants sont remplis :

- ✅ **App name** : La Soirée du Rire Dashboard (ou similaire)
- ✅ **User support email** : info@lasoireedurire.ca
- ✅ **Developer contact information** : info@lasoireedurire.ca
- ✅ **Application privacy policy link** : `https://lasoireedurire.ca/privacy`
- ✅ **Application home page** : `https://lasoireedurire.ca`
- ✅ **Authorized domains** : `lasoireedurire.ca`

### 4. Vérifier les scopes

Assurez-vous que les scopes suivants sont configurés :

- ✅ `email`
- ✅ `profile`
- ✅ `openid`
- ✅ `https://www.googleapis.com/auth/analytics.readonly`

### 5. Sauvegarder les modifications

1. Cliquez sur **"Save and Continue"**
2. Vérifiez que toutes les étapes sont complétées
3. Si votre application est en mode "Testing", vous pouvez la publier si nécessaire

## ✅ Checklist de Configuration

- [ ] Page de politique de confidentialité créée à `/privacy`
- [ ] Page accessible publiquement (pas de login requis)
- [ ] Lien ajouté dans Google Cloud Console → OAuth consent screen
- [ ] URL correcte : `https://lasoireedurire.ca/privacy`
- [ ] Tous les champs requis remplis dans OAuth consent screen
- [ ] Scopes Analytics ajoutés
- [ ] Modifications sauvegardées

## 🧪 Test

1. **Vérifier que la page est accessible** :
   - Ouvrez `https://lasoireedurire.ca/privacy` dans votre navigateur
   - Vérifiez que la page s'affiche correctement
   - Vérifiez que le contenu est complet et à jour

2. **Vérifier dans Google Cloud Console** :
   - Allez dans **APIs & Services** → **OAuth consent screen**
   - Vérifiez que le lien `https://lasoireedurire.ca/privacy` est affiché
   - Cliquez sur le lien pour vérifier qu'il fonctionne

3. **Tester le flux OAuth** :
   - Déconnectez-vous du dashboard
   - Reconnectez-vous avec Google Sign-In
   - Vérifiez que le popup de consentement OAuth fonctionne correctement
   - Vérifiez que le lien de politique de confidentialité est visible dans le popup (si requis)

## 📝 Notes

- Le lien de politique de confidentialité doit être accessible publiquement (pas de login requis)
- La page doit être en HTTPS
- Le contenu doit être à jour et conforme aux pratiques de Google
- Si vous modifiez la politique de confidentialité, mettez à jour la date de dernière modification sur la page

## 🔗 Liens utiles

- [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [Politique de confidentialité Google](https://developers.google.com/identity/protocols/oauth2/web-server#privacy)
- [Page de politique de confidentialité](https://lasoireedurire.ca/privacy)

---

**Une fois le lien ajouté dans Google Cloud Console, votre application OAuth sera conforme aux exigences de Google !** ✅

