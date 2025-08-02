# 🎨 Scripts de Conversion d'Images - Glow by FC

Scripts automatisés pour convertir les images JPEG/PNG en formats modernes WebP et AVIF pour des performances web optimales.

## 📦 Installation

Les dépendances sont déjà installées dans le projet :
- `sharp` - Traitement d'images haute performance
- `glob` - Recherche de fichiers par pattern

## 🚀 Scripts Disponibles

### 1. Conversion Complète (Recommandé)
```bash
npm run convert-images
```
- Script principal avec statistiques détaillées
- Configuration adaptative selon l'environnement
- Traitement par batch pour éviter la surcharge mémoire
- Support de tous les formats (JPEG, PNG → WebP + AVIF)

### 2. Conversion Rapide
```bash
npm run quick-convert
```
- Version allégée pour le développement
- Conversion rapide sans statistiques avancées
- Idéal pour tester rapidement

### 3. Optimisation Complète
```bash
npm run optimize-images
```
- Alias vers le script principal
- Utilisé automatiquement avant le build de production

### 4. Pré-build Automatique
La conversion se lance automatiquement avant chaque build :
```bash
npm run build  # Lance convert-images puis next build
```

## ⚙️ Configuration

### Fichier `scripts/image-config.js`

Personnalisez la conversion selon vos besoins :

```javascript
// Qualités par format
formats: {
  webp: { quality: 85, effort: 6 },  // 85% qualité, compression max
  avif: { quality: 80, effort: 6 }   // 80% qualité, compression max
}

// Dossiers à traiter
inputPaths: [
  'public/assets/**/*.{jpg,jpeg,png}',
  'public/glow2/**/*.{jpg,jpeg,png}'
]

// Optimisations
processing: {
  minSize: 1024,      // Ignorer les fichiers < 1KB
  maxWidth: 2048,     // Redimensionner si > 2048px
  concurrent: 4       // 4 conversions simultanées
}
```

### Configuration par Environnement

**Développement :**
- WebP: 75% qualité, compression rapide
- AVIF: 70% qualité, compression rapide

**Production :**
- WebP: 85% qualité, compression maximale
- AVIF: 80% qualité, compression maximale

## 📁 Dossiers Traités

Les scripts convertissent automatiquement les images dans :
- `public/assets/` - Assets principaux
- `public/glow2/` - Images de la galerie
- `public/` - Images racine

## 📊 Formats de Sortie

Pour chaque image `exemple.jpg`, les scripts créent :
- `exemple.webp` - Format WebP (support universel)
- `exemple.avif` - Format AVIF (compression supérieure)

L'image originale est conservée comme fallback.

## 🎯 Avantages

### Performances Web
- **WebP**: 25-35% de réduction de taille vs JPEG
- **AVIF**: 40-50% de réduction de taille vs JPEG
- Chargement plus rapide, surtout sur mobile

### Optimisations Incluses
- Compression adaptative selon la connexion
- Redimensionnement automatique si trop grand
- Suppression des métadonnées inutiles
- Progressive JPEG pour les fallbacks

### Intégration Next.js
Le `next.config.mjs` est déjà configuré pour utiliser les formats modernes :
```javascript
images: {
  formats: ['image/avif', 'image/webp'],  // AVIF en priorité
  qualities: [40, 50, 65, 75, 85, 90, 95]
}
```

## 🔍 Statistiques

Les scripts affichent des statistiques détaillées :
```
📊 STATISTIQUES DE CONVERSION
================================================
📁 Images traitées: 45
🎨 WebP créés: 45  
🚀 AVIF créés: 45
❌ Erreurs: 0
⏱️  Temps total: 12.3s

💾 COMPRESSION:
   Original: 15.2 MB
   WebP: 9.8 MB (-35.5%)
   AVIF: 7.1 MB (-53.3%)
```

## 🛠️ Scripts Avancés

### Conversion avec Options Personnalisées
```bash
# Environnement de production forcé
NODE_ENV=production npm run convert-images

# Debug avec logs détaillés
DEBUG=true npm run convert-images
```

### Conversion d'un Dossier Spécifique
Modifiez temporairement `inputPaths` dans `image-config.js` :
```javascript
inputPaths: ['public/assets/nouveau-dossier/**/*.{jpg,jpeg,png}']
```

## 🚨 Notes Importantes

1. **Première Exécution**: La conversion peut prendre plusieurs minutes selon le nombre d'images
2. **Fichiers Existants**: Les scripts ne reconvertissent pas les fichiers déjà existants
3. **Mémoire**: Le traitement par batch évite la surcharge mémoire
4. **Qualité**: Les paramètres sont optimisés pour le web, ajustez selon vos besoins

## 🔧 Dépannage

### Erreurs de Mémoire
Réduisez `concurrent` dans `image-config.js` :
```javascript
processing: {
  concurrent: 2  // Réduit de 4 à 2
}
```

### Images Trop Lourdes
Ajustez `maxWidth` et `maxHeight` :
```javascript
processing: {
  maxWidth: 1920,   // Réduit de 2048 à 1920
  maxHeight: 1920
}
```

### Conversion Échouée
Vérifiez le format du fichier source et les permissions d'écriture.

## 📈 Intégration CI/CD

Pour automatiser en production, ajoutez dans votre pipeline :
```yaml
- name: Optimize Images
  run: npm run convert-images

- name: Build
  run: npm run build
```

---

✨ **Les images modernes sont automatiquement servies par Next.js selon le support du navigateur !**
