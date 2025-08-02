#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION CSS OPTIMIZATION - GLOW BY FC');
console.log('================================================');

// Vérification des fichiers critiques
const criticalFiles = [
  'app/globals.css',
  'next.config.mjs',
  'components/infinite-gallery.tsx',
  'components/mobile-menu.tsx',
  'hooks/use-performance-optimization.ts'
];

let allGood = true;

console.log('\n1. 📁 Vérification des fichiers...');
criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MANQUANT`);
    allGood = false;
  }
});

// Vérification du contenu CSS optimisé
console.log('\n2. 🎨 Vérification CSS optimisé...');
try {
  const cssContent = fs.readFileSync('app/globals.css', 'utf8');
  
  const checks = [
    { pattern: /--transform-gpu/, name: 'CSS Variables' },
    { pattern: /@layer components/, name: 'CSS Layers' },
    { pattern: /\.z-mobile-menu/, name: 'Z-index Hierarchy' },
    { pattern: /\.will-animate/, name: 'Will-change optimisé' },
    { pattern: /\.infinite-gallery-container/, name: 'Container optimisé' },
    { pattern: /\.gallery-first-images/, name: 'Premières images optimisées' }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(cssContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - MANQUANT`);
      allGood = false;
    }
  });
} catch (error) {
  console.log('   ❌ Erreur lecture globals.css');
  allGood = false;
}

// Vérification configuration Next.js
console.log('\n3. ⚙️ Vérification Next.js config...');
try {
  const configContent = fs.readFileSync('next.config.mjs', 'utf8');
  
  const configChecks = [
    { pattern: /cssChunking:\s*['"`]strict['"`]/, name: 'CSS Chunking strict' },
    { pattern: /inlineCss:\s*true/, name: 'CSS Inline activé' }
  ];
  
  configChecks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - MANQUANT`);
      allGood = false;
    }
  });
} catch (error) {
  console.log('   ❌ Erreur lecture next.config.mjs');
  allGood = false;
}

// Vérification ancien fichier mobile-optimizations.css
console.log('\n4. 🗂️ Vérification migration...');
if (fs.existsSync('styles/mobile-optimizations.css')) {
  console.log('   ⚠️  Ancien mobile-optimizations.css encore présent');
  console.log('   👉 Peut être supprimé après tests');
} else {
  console.log('   ✅ Migration complète');
}

// Résumé
console.log('\n📊 RÉSUMÉ');
console.log('========');
if (allGood) {
  console.log('🎉 TOUT EST OPTIMISÉ !');
  console.log('');
  console.log('✅ Avantages obtenus :');
  console.log('   • CSS consolidé et organisé');
  console.log('   • Z-index hierarchy claire');
  console.log('   • Will-change intelligent');
  console.log('   • CSS Variables pour performance');
  console.log('   • Inline CSS activé');
  console.log('   • Chunking strict pour éviter conflits');
  console.log('');
  console.log('🚀 Prochaines étapes :');
  console.log('   1. Tester en développement');
  console.log('   2. Vérifier les performances');
  console.log('   3. Supprimer mobile-optimizations.css si tout fonctionne');
} else {
  console.log('❌ OPTIMISATION INCOMPLÈTE');
  console.log('Vérifiez les éléments marqués ❌ ci-dessus');
}

console.log('\n');
