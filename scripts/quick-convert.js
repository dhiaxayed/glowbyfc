#!/usr/bin/env node

const sharp = require('sharp');
const glob = require('glob');
const path = require('path');

/**
 * Script de conversion rapide pour le développement
 */

async function quickConvert() {
  console.log('🚀 Conversion rapide WebP/AVIF...\n');
  
  const patterns = [
    'public/assets/**/*.{jpg,jpeg,png}',
    'public/glow2/**/*.{jpg,jpeg,png}'
  ];
  
  let converted = 0;
  
  for (const pattern of patterns) {
    const files = await glob.glob(pattern);
    
    for (const file of files) {
      const parsed = path.parse(file);
      const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
      const avifPath = path.join(parsed.dir, `${parsed.name}.avif`);
      
      try {
        // WebP - qualité élevée, conversion rapide
        await sharp(file)
          .webp({ quality: 85, effort: 3 })
          .toFile(webpPath);
        
        // AVIF - qualité optimale mais conversion plus rapide
        await sharp(file)
          .avif({ quality: 80, effort: 3 })
          .toFile(avifPath);
        
        console.log(`✅ ${path.basename(file)} → WebP + AVIF`);
        converted++;
        
      } catch (error) {
        console.error(`❌ Erreur: ${file}`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 ${converted} images converties !`);
}

quickConvert().catch(console.error);
