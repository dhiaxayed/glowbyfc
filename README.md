# Glow by FC - Site de Landing

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Un site de landing moderne et élégant pour Glow by FC, construit avec Next.js 15, React 19, et Tailwind CSS.

## ✨ Fonctionnalités

- 🎨 Design moderne et responsive
- 🖼️ Galerie d'images infinie avec animation fluide
- 📱 Menu mobile interactif
- 📧 Système de newsletter intégré
- 🎭 Thème sombre/clair avec next-themes
- 🏃‍♂️ Performance optimisée avec Next.js 15
- 📱 Interface utilisateur avec Radix UI et shadcn/ui
- 🎬 Animations fluides avec Framer Motion

## 🚀 Technologies utilisées

### Core
- **Next.js 15.2.4** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Langage de programmation
- **Tailwind CSS 3.4.17** - Framework CSS utility-first

### UI & Design
- **Radix UI** - Composants UI primitifs
- **shadcn/ui** - Composants UI modernes
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **next-themes** - Gestion des thèmes

### Utilitaires
- **class-variance-authority** - Gestion des variants CSS
- **clsx** - Utilitaire de classes conditionnelles
- **tailwind-merge** - Fusion intelligente des classes Tailwind
- **react-hook-form** - Gestion des formulaires
- **zod** - Validation de schémas
- **nodemailer** - Envoi d'emails

## 📦 Installation

1. **Clonez le repository**
   ```bash
   git clone https://github.com/votre-username/glow-by-fc-landing.git
   cd glow-by-fc-landing
   ```

2. **Installez les dépendances**
   ```bash
   # Avec pnpm (recommandé)
   pnpm install
   
   # Ou avec npm
   npm install
   
   # Ou avec yarn
   yarn install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Puis modifiez `.env.local` avec vos variables d'environnement.

4. **Lancez le serveur de développement**
   ```bash
   pnpm dev
   ```

   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Scripts disponibles

```bash
# Développement
pnpm dev

# Build de production
pnpm build

# Démarrage du serveur de production
pnpm start

# Linting
pnpm lint
```

## 📁 Structure du projet

```
├── app/                    # App Router de Next.js 15
│   ├── api/               # Routes API
│   │   └── newsletter/    # Endpoint newsletter
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── about-section.tsx
│   ├── delivery-banner.tsx
│   ├── infinite-gallery.tsx
│   ├── mobile-menu.tsx
│   ├── newsletter-cta.tsx
│   └── simple-footer.tsx
├── contexts/             # Contextes React
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires
├── public/               # Assets statiques
│   ├── assets/          # Images et médias
│   └── glow2/           # Galerie d'images
└── styles/              # Styles additionnels
```

## 🎨 Personnalisation

### Thèmes
Le projet utilise CSS custom properties pour la gestion des thèmes. Vous pouvez modifier les couleurs dans `app/globals.css`.

### Composants
Tous les composants UI sont basés sur shadcn/ui et peuvent être personnalisés facilement.

### Animations
Les animations sont gérées par Framer Motion et des classes CSS personnalisées dans `globals.css`.

## 📧 Configuration de la Newsletter

Pour configurer la newsletter, vous devez :

1. Configurer les variables d'environnement pour nodemailer
2. Modifier `app/api/newsletter/route.ts` selon vos besoins
3. Adapter le composant `NewsletterCTA` si nécessaire

## 🚀 Déploiement

### Vercel (Recommandé)
1. Push votre code sur GitHub
2. Connectez votre repository à Vercel
3. Configurez vos variables d'environnement
4. Déployez !

### Autres plateformes
Le projet est compatible avec toutes les plateformes supportant Next.js :
- Netlify
- Railway
- Heroku
- AWS
- Azure

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion :

- 📧 Email : contact@glowbyfc.com
- 📱 Instagram : [@glowbyfc](https://instagram.com/glowbyfc)

---

Fait avec ❤️ par l'équipe Glow by FC
