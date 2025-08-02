import { useEffect, useRef } from 'react';

/**
 * Hook optimisé pour la gestion du will-change selon Context7 best practices
 * Applique will-change juste avant l'animation et le retire après
 */
export function useOptimizedWillChange() {
  const elementRef = useRef<HTMLElement>(null);

  const startAnimation = () => {
    if (elementRef.current) {
      elementRef.current.classList.add('will-animate');
    }
  };

  const endAnimation = () => {
    if (elementRef.current) {
      elementRef.current.classList.remove('will-animate');
      elementRef.current.classList.add('will-animate-complete');
      
      // Nettoyer après un court délai
      setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.classList.remove('will-animate-complete');
        }
      }, 100);
    }
  };

  return {
    elementRef,
    startAnimation,
    endAnimation,
  };
}

/**
 * Hook pour optimiser les performances de la galerie infinie
 * Applique les optimisations Context7 pour les premières images
 */
export function useGalleryOptimization() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Appliquer les optimisations aux 3 premières images
      const firstImages = containerRef.current.querySelectorAll('.gallery-item:nth-child(-n+3)');
      firstImages.forEach((img) => {
        img.classList.add('gallery-first-images');
      });
    }
  }, []);

  return { containerRef };
}

/**
 * Hook pour gérer intelligemment l'acceleration GPU
 * Active/désactive selon le contexte
 */
export function useGPUAcceleration(shouldAccelerate: boolean = false) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      if (shouldAccelerate) {
        elementRef.current.classList.add('gpu-accelerated');
      } else {
        elementRef.current.classList.remove('gpu-accelerated');
      }
    }
  }, [shouldAccelerate]);

  return { elementRef };
}
