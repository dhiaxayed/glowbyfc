#!/usr/bin/env node

const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs').promises;
const config = require('./image-config');

/**
 * Script avancé de conversion d'images avec configuration personnalisable
 * Support WebP et AVIF avec optimisations adaptées au projet Glow by FC
 */

class ImageConverter {
  constructor(options = {}) {
    this.config = { ...config, ...options };
    this.stats = {
      processed: 0,
      webpCreated: 0,
      avifCreated: 0,
      errors: 0,
      skipped: 0,
      totalSizeOriginal: 0,
      totalSizeWebp: 0,
      totalSizeAvif: 0,
      timeStart: Date.now()
    };
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Logs formatés avec couleurs
   */
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '\x1b[36m',     // Cyan
      success: '\x1b[32m',  // Vert
      warning: '\x1b[33m',  // Jaune
      error: '\x1b[31m',    // Rouge
      reset: '\x1b[0m'      // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  /**
   * Vérifie si un fichier existe
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtient la taille d'un fichier
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Détermine le type d'image selon le nom/chemin
   */
  getImageType(imagePath) {
    const filename = path.basename(imagePath).toLowerCase();
    
    if (filename.includes('thumb') || filename.includes('small')) {
      return 'thumbnail';
    }
    
    if (filename.includes('logo') || filename.includes('icon')) {
      return 'graphic';
    }
    
    return 'photo'; // Par défaut
  }

  /**
   * Obtient la configuration optimisée selon l'environnement
   */
  getOptimizedConfig(imageType) {
    const envConfig = this.isProduction ? this.config.production : this.config.development;
    const typeConfig = this.config.imageTypes[imageType];
    
    return {
      webp: {
        ...typeConfig.webp,
        quality: envConfig.quality.webp
      },
      avif: {
        ...typeConfig.avif,
        quality: envConfig.quality.avif
      }
    };
  }

  /**
   * Convertit une image vers WebP
   */
  async convertToWebP(inputPath, outputPath, options) {
    try {
      let pipeline = sharp(inputPath);
      
      // Redimensionnement si nécessaire
      if (this.config.processing.maxWidth || this.config.processing.maxHeight) {
        pipeline = pipeline.resize(
          this.config.processing.maxWidth,
          this.config.processing.maxHeight,
          { fit: 'inside', withoutEnlargement: true }
        );
      }

      await pipeline
        .webp({
          ...options,
          progressive: this.config.processing.progressive
        })
        .toFile(outputPath);
      
      const size = await this.getFileSize(outputPath);
      this.stats.webpCreated++;
      this.stats.totalSizeWebp += size;
      return size;
      
    } catch (error) {
      this.log(`Erreur WebP pour ${path.basename(inputPath)}: ${error.message}`, 'error');
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Convertit une image vers AVIF
   */
  async convertToAVIF(inputPath, outputPath, options) {
    try {
      let pipeline = sharp(inputPath);
      
      // Redimensionnement si nécessaire
      if (this.config.processing.maxWidth || this.config.processing.maxHeight) {
        pipeline = pipeline.resize(
          this.config.processing.maxWidth,
          this.config.processing.maxHeight,
          { fit: 'inside', withoutEnlargement: true }
        );
      }

      await pipeline
        .avif(options)
        .toFile(outputPath);
      
      const size = await this.getFileSize(outputPath);
      this.stats.avifCreated++;
      this.stats.totalSizeAvif += size;
      return size;
      
    } catch (error) {
      this.log(`Erreur AVIF pour ${path.basename(inputPath)}: ${error.message}`, 'error');
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Traite une image individuelle
   */
  async processImage(imagePath) {
    try {
      // Vérifier la taille minimum
      const originalSize = await this.getFileSize(imagePath);
      if (originalSize < this.config.processing.minSize) {
        this.stats.skipped++;
        return;
      }

      this.stats.totalSizeOriginal += originalSize;
      
      const parsedPath = path.parse(imagePath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      const avifPath = path.join(parsedPath.dir, `${parsedPath.name}.avif`);

      // Déterminer le type d'image et sa configuration
      const imageType = this.getImageType(imagePath);
      const optimizedConfig = this.getOptimizedConfig(imageType);

      this.log(`Traitement: ${path.relative(process.cwd(), imagePath)} (${imageType})`);

      const promises = [];

      // Conversion WebP
      if (!(await this.fileExists(webpPath))) {
        promises.push(
          this.convertToWebP(imagePath, webpPath, optimizedConfig.webp)
            .then(size => {
              if (size > 0) {
                const compression = ((originalSize - size) / originalSize * 100).toFixed(1);
                this.log(`  ✅ WebP: ${(size / 1024).toFixed(1)} KB (-${compression}%)`, 'success');
              }
            })
        );
      }

      // Conversion AVIF
      if (!(await this.fileExists(avifPath))) {
        promises.push(
          this.convertToAVIF(imagePath, avifPath, optimizedConfig.avif)
            .then(size => {
              if (size > 0) {
                const compression = ((originalSize - size) / originalSize * 100).toFixed(1);
                this.log(`  ✅ AVIF: ${(size / 1024).toFixed(1)} KB (-${compression}%)`, 'success');
              }
            })
        );
      }

      // Attendre les conversions
      await Promise.all(promises);
      this.stats.processed++;

    } catch (error) {
      this.log(`Erreur pour ${path.basename(imagePath)}: ${error.message}`, 'error');
      this.stats.errors++;
    }
  }

  /**
   * Trouve toutes les images à traiter
   */
  async findImages() {
    const allImages = [];
    
    for (const pattern of this.config.inputPaths) {
      try {
        const files = await glob.glob(pattern, { 
          ignore: this.config.ignore,
          absolute: true 
        });
        allImages.push(...files);
      } catch (error) {
        this.log(`Erreur lors de la recherche ${pattern}: ${error.message}`, 'error');
      }
    }

    // Filtrer les doublons
    return [...new Set(allImages)];
  }

  /**
   * Traite les images par batch pour éviter la surcharge mémoire
   */
  async processBatch(images, batchSize = 4) {
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      await Promise.all(batch.map(image => this.processImage(image)));
      
      // Affichage du progrès
      const progress = Math.round(((i + batch.length) / images.length) * 100);
      this.log(`Progression: ${progress}% (${i + batch.length}/${images.length})`, 'info');
    }
  }

  /**
   * Affiche les statistiques finales
   */
  displayStats() {
    const duration = ((Date.now() - this.stats.timeStart) / 1000).toFixed(1);
    
    console.log('\n' + '='.repeat(50));
    this.log('📊 STATISTIQUES DE CONVERSION', 'info');
    console.log('='.repeat(50));
    
    this.log(`📁 Images traitées: ${this.stats.processed}`, 'info');
    this.log(`⏭️  Images ignorées: ${this.stats.skipped}`, 'warning');
    this.log(`🎨 WebP créés: ${this.stats.webpCreated}`, 'success');
    this.log(`🚀 AVIF créés: ${this.stats.avifCreated}`, 'success');
    this.log(`❌ Erreurs: ${this.stats.errors}`, 'error');
    this.log(`⏱️  Temps total: ${duration}s`, 'info');
    
    if (this.stats.totalSizeOriginal > 0) {
      console.log('\n💾 COMPRESSION:');
      this.log(`   Original: ${(this.stats.totalSizeOriginal / 1024 / 1024).toFixed(1)} MB`, 'info');
      
      if (this.stats.totalSizeWebp > 0) {
        const webpSavings = ((this.stats.totalSizeOriginal - this.stats.totalSizeWebp) / this.stats.totalSizeOriginal * 100).toFixed(1);
        this.log(`   WebP: ${(this.stats.totalSizeWebp / 1024 / 1024).toFixed(1)} MB (-${webpSavings}%)`, 'success');
      }
      
      if (this.stats.totalSizeAvif > 0) {
        const avifSavings = ((this.stats.totalSizeOriginal - this.stats.totalSizeAvif) / this.stats.totalSizeOriginal * 100).toFixed(1);
        this.log(`   AVIF: ${(this.stats.totalSizeAvif / 1024 / 1024).toFixed(1)} MB (-${avifSavings}%)`, 'success');
      }
    }
    
    this.log('✨ Conversion terminée !', 'success');
  }

  /**
   * Lance la conversion
   */
  async run() {
    try {
      this.log(`🎨 Démarrage conversion ${this.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`, 'info');
      this.log('Recherche des images...', 'info');
      
      const images = await this.findImages();
      
      if (images.length === 0) {
        this.log('Aucune image trouvée à convertir.', 'warning');
        return;
      }
      
      this.log(`📸 ${images.length} image(s) trouvée(s)`, 'info');
      
      await this.processBatch(images, this.config.processing.concurrent);
      
      this.displayStats();
      
    } catch (error) {
      this.log(`Erreur générale: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Exécution du script
if (require.main === module) {
  const converter = new ImageConverter();
  converter.run();
}

module.exports = ImageConverter;
