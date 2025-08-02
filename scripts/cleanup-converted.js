#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script de nettoyage des fichiers WebP/AVIF générés
 * Utile pour faire de la place ou reconvertir avec de nouveaux paramètres
 */

async function cleanupConvertedImages() {
  console.log('🧹 Nettoyage des fichiers convertis...\n');
  
  const patterns = [
    'public/**/*.webp',
    'public/**/*.avif'
  ];
  
  let deleted = 0;
  let totalSize = 0;
  
  try {
    for (const pattern of patterns) {
      const files = await glob.glob(pattern, { ignore: ['node_modules/**', '.next/**'] });
      
      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          totalSize += stats.size;
          
          await fs.unlink(file);
          console.log(`🗑️  Supprimé: ${path.relative(process.cwd(), file)}`);
          deleted++;
        } catch (error) {
          console.error(`❌ Erreur pour ${file}:`, error.message);
        }
      }
    }
    
    console.log(`\n✨ Nettoyage terminé !`);
    console.log(`🗑️  ${deleted} fichiers supprimés`);
    console.log(`💾 ${(totalSize / 1024 / 1024).toFixed(1)} MB libérés`);
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Confirmation avant suppression
if (require.main === module) {
  console.log('⚠️  Ce script va supprimer TOUS les fichiers .webp et .avif');
  console.log('   Tapez "yes" pour confirmer, ou Ctrl+C pour annuler');
  
  process.stdin.once('data', (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'yes' || input === 'y') {
      cleanupConvertedImages();
    } else {
      console.log('❌ Opération annulée');
      process.exit(0);
    }
  });
}

module.exports = cleanupConvertedImages;
