#!/usr/bin/env node

const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs').promises;

/**
 * Script de conversion automatique d'images JPEG/PNG vers WebP et AVIF
 * Optimisé pour les performances web et la compatibilité mobile
 */

// Configuration de conversion
const CONVERSION_CONFIG = {
  // Qualités pour différents formats
  webp: {
    quality: 85,
    effort: 6, // Compression maximale
    nearLossless: false,
    smartSubsample: true
  },
  avif: {
    quality: 80,
    effort: 6, // Compression maximale
    chromaSubsampling: '4:2:0'
  },
  // Dossiers à traiter
  inputPaths: [
    'public/assets/**/*.{jpg,jpeg,png}',
    'public/glow2/**/*.{jpg,jpeg,png}',
    'public/*.{jpg,jpeg,png}'
  ],
  // Extensions à ignorer (déjà optimisées)
  skipExtensions: ['.webp', '.avif', '.svg'],
  // Taille minimale pour éviter de traiter les très petites images
  minSize: 1024 // 1KB
};

// Statistiques de conversion
const stats = {
  processed: 0,
  webpCreated: 0,
  avifCreated: 0,
  errors: 0,
  totalSizeOriginal: 0,
  totalSizeWebp: 0,
  totalSizeAvif: 0
};

/**
 * Affiche les informations de démarrage
 */
function displayStartInfo() {
  console.log('\n🎨 Conversion automatique d\'images - Glow by FC');
  console.log('================================================');
  console.log('📁 Dossiers à traiter:');
  CONVERSION_CONFIG.inputPaths.forEach(path => console.log(`   • ${path}`));
  console.log(`📏 Taille minimale: ${CONVERSION_CONFIG.minSize} bytes`);
  console.log(`🎯 Formats de sortie: WebP (${CONVERSION_CONFIG.webp.quality}%) + AVIF (${CONVERSION_CONFIG.avif.quality}%)`);
  console.log('');
}

/**
 * Obtient la taille d'un fichier
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * Vérifie si un fichier existe
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convertit une image vers WebP
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp(CONVERSION_CONFIG.webp)
      .toFile(outputPath);
    
    const size = await getFileSize(outputPath);
    stats.webpCreated++;
    stats.totalSizeWebp += size;
    return size;
  } catch (error) {
    console.error(`❌ Erreur WebP pour ${inputPath}:`, error.message);
    stats.errors++;
    return 0;
  }
}

/**
 * Convertit une image vers AVIF
 */
async function convertToAVIF(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .avif(CONVERSION_CONFIG.avif)
      .toFile(outputPath);
    
    const size = await getFileSize(outputPath);
    stats.avifCreated++;
    stats.totalSizeAvif += size;
    return size;
  } catch (error) {
    console.error(`❌ Erreur AVIF pour ${inputPath}:`, error.message);
    stats.errors++;
    return 0;
  }
}

/**
 * Traite une image individuelle
 */
async function processImage(imagePath) {
  try {
    // Vérifier la taille minimum
    const originalSize = await getFileSize(imagePath);
    if (originalSize < CONVERSION_CONFIG.minSize) {
      console.log(`⚠️  Ignoré (trop petit): ${imagePath}`);
      return;
    }

    stats.totalSizeOriginal += originalSize;
    
    const parsedPath = path.parse(imagePath);
    const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
    const avifPath = path.join(parsedPath.dir, `${parsedPath.name}.avif`);

    console.log(`🔄 Traitement: ${path.relative(process.cwd(), imagePath)}`);
    console.log(`   📊 Taille originale: ${(originalSize / 1024).toFixed(1)} KB`);

    // Conversion WebP (si pas déjà existant)
    if (!(await fileExists(webpPath))) {
      const webpSize = await convertToWebP(imagePath, webpPath);
      if (webpSize > 0) {
        const compression = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        console.log(`   ✅ WebP créé: ${(webpSize / 1024).toFixed(1)} KB (-${compression}%)`);
      }
    } else {
      console.log(`   ⏭️  WebP existe déjà`);
    }

    // Conversion AVIF (si pas déjà existant)
    if (!(await fileExists(avifPath))) {
      const avifSize = await convertToAVIF(imagePath, avifPath);
      if (avifSize > 0) {
        const compression = ((originalSize - avifSize) / originalSize * 100).toFixed(1);
        console.log(`   ✅ AVIF créé: ${(avifSize / 1024).toFixed(1)} KB (-${compression}%)`);
      }
    } else {
      console.log(`   ⏭️  AVIF existe déjà`);
    }

    stats.processed++;
    console.log('');

  } catch (error) {
    console.error(`❌ Erreur pour ${imagePath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Trouve tous les fichiers images à traiter
 */
async function findImages() {
  const allImages = [];
  
  for (const pattern of CONVERSION_CONFIG.inputPaths) {
    try {
      const files = await glob.glob(pattern, { 
        ignore: ['node_modules/**', '.next/**'],
        absolute: true 
      });
      allImages.push(...files);
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche ${pattern}:`, error.message);
    }
  }

  // Filtrer les doublons et les extensions à ignorer
  const uniqueImages = [...new Set(allImages)].filter(file => {
    const ext = path.extname(file).toLowerCase();
    return !CONVERSION_CONFIG.skipExtensions.includes(ext);
  });

  return uniqueImages;
}

/**
 * Affiche les statistiques finales
 */
function displayStats() {
  console.log('\n📊 Statistiques de conversion');
  console.log('===============================');
  console.log(`📁 Images traitées: ${stats.processed}`);
  console.log(`🎨 WebP créés: ${stats.webpCreated}`);
  console.log(`🚀 AVIF créés: ${stats.avifCreated}`);
  console.log(`❌ Erreurs: ${stats.errors}`);
  
  if (stats.totalSizeOriginal > 0) {
    console.log(`\n💾 Tailles totales:`);
    console.log(`   Original: ${(stats.totalSizeOriginal / 1024 / 1024).toFixed(1)} MB`);
    
    if (stats.totalSizeWebp > 0) {
      const webpSavings = ((stats.totalSizeOriginal - stats.totalSizeWebp) / stats.totalSizeOriginal * 100).toFixed(1);
      console.log(`   WebP: ${(stats.totalSizeWebp / 1024 / 1024).toFixed(1)} MB (-${webpSavings}%)`);
    }
    
    if (stats.totalSizeAvif > 0) {
      const avifSavings = ((stats.totalSizeOriginal - stats.totalSizeAvif) / stats.totalSizeOriginal * 100).toFixed(1);
      console.log(`   AVIF: ${(stats.totalSizeAvif / 1024 / 1024).toFixed(1)} MB (-${avifSavings}%)`);
    }
  }
  
  console.log('\n✨ Conversion terminée !');
}

/**
 * Fonction principale
 */
async function main() {
  try {
    displayStartInfo();
    
    console.log('🔍 Recherche des images...');
    const images = await findImages();
    
    if (images.length === 0) {
      console.log('⚠️  Aucune image trouvée à convertir.');
      return;
    }
    
    console.log(`📸 ${images.length} image(s) trouvée(s)\n`);
    
    // Traitement séquentiel pour éviter la surcharge mémoire
    for (const image of images) {
      await processImage(image);
    }
    
    displayStats();
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  main();
}

module.exports = { main, CONVERSION_CONFIG };
