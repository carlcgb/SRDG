# 🚀 Guide de Démarrage Rapide - Dashboard

## Accès au Dashboard

### En développement local :
```
http://localhost:3000/dashboard
```

### En production :
```
https://dashboard.lasoireedurire.ca
```

ou

```
https://lasoireedurire.ca/dashboard
```

## Configuration Rapide

### 1. Variables d'environnement

Créez un fichier `.env` à la racine :

```env
REACT_APP_GA4_PROPERTY_ID=123456789
```

### 2. Connecter Google Analytics 4

1. Obtenez votre Property ID depuis Google Analytics
2. Ajoutez-le dans `.env`
3. Configurez l'API Google Analytics (voir `DASHBOARD_SETUP.md`)

### 3. Tester le Dashboard

```bash
npm start
# Ouvrez http://localhost:3000/dashboard
```

## Fonctionnalités

✅ Tableau de bord avec métriques clés  
✅ Statistiques en temps réel  
✅ Pages les plus visitées  
✅ Sources de trafic  
✅ Répartition par appareil  
✅ Design correspondant à votre palette de couleurs  

## Prochaines Étapes

1. Lisez `DASHBOARD_SETUP.md` pour la configuration complète
2. Connectez votre base de données Google Analytics 4
3. Personnalisez les métriques selon vos besoins

