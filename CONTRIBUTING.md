# Contributing to Glow by FC

Merci de votre intérêt pour contribuer à Glow by FC ! Nous accueillons toutes les contributions qui peuvent améliorer le projet.

## 🚀 Comment contribuer

### Signaler des bugs

Si vous trouvez un bug, veuillez créer une issue avec :
- Une description claire du problème
- Les étapes pour reproduire le bug
- Le comportement attendu vs le comportement actuel
- Des captures d'écran si applicable
- Votre environnement (OS, navigateur, version de Node.js)

### Proposer des améliorations

Pour proposer de nouvelles fonctionnalités :
- Vérifiez d'abord qu'une issue similaire n'existe pas déjà
- Décrivez clairement la fonctionnalité souhaitée
- Expliquez pourquoi cette fonctionnalité serait utile
- Proposez une implémentation si possible

### Pull Requests

1. **Fork** le repository
2. **Créez une branche** pour votre fonctionnalité :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Commitez** vos changements avec des messages clairs :
   ```bash
   git commit -m "feat: ajouter une nouvelle fonctionnalité"
   ```
4. **Respectez** la convention de nommage des commits (voir ci-dessous)
5. **Testez** vos changements localement
6. **Push** vers votre fork :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
7. **Créez** une Pull Request avec une description détaillée

## 📝 Convention de nommage des commits

Nous utilisons la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, points-virgules manquants, etc.
- `refactor:` refactoring du code
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

Exemples :
```
feat: ajouter système de newsletter
fix: corriger l'affichage mobile du menu
docs: mettre à jour le README
style: formater le code avec prettier
```

## 🛠️ Configuration de développement

1. **Prérequis**
   - Node.js 18+ 
   - pnpm (recommandé) ou npm

2. **Installation**
   ```bash
   git clone https://github.com/votre-username/glow-by-fc-landing.git
   cd glow-by-fc-landing
   pnpm install
   ```

3. **Variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```

4. **Lancement en développement**
   ```bash
   pnpm dev
   ```

## 🎨 Standards de code

### TypeScript
- Utilisez TypeScript pour tous les nouveaux fichiers
- Définissez des types explicites quand c'est possible
- Évitez `any`, préférez `unknown` si nécessaire

### React
- Utilisez des composants fonctionnels avec hooks
- Préférez les named exports aux default exports
- Utilisez `"use client"` uniquement quand nécessaire

### CSS/Styling
- Utilisez Tailwind CSS pour le styling
- Respectez la hiérarchie des couleurs du design system
- Testez sur mobile et desktop

### Structure des fichiers
```
components/
├── ui/           # Composants de base (shadcn/ui)
├── sections/     # Sections de page
└── shared/       # Composants réutilisables
```

## 🧪 Tests

Avant de soumettre une PR :
- Testez votre code localement
- Vérifiez que le build fonctionne : `pnpm build`
- Assurez-vous que le linting passe : `pnpm lint`
- Testez sur différentes tailles d'écran

## 📞 Questions

Si vous avez des questions :
- Créez une issue avec le tag `question`
- Contactez-nous par email : contact@glowbyfc.com

Merci pour votre contribution ! 🙏
