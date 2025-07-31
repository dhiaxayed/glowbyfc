# 🚀 Instructions pour publier sur GitHub

## Étapes pour créer et publier votre repository

### 1. Créer un repository sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Connectez-vous à votre compte
3. Cliquez sur le bouton **"New"** ou **"+"** → **"New repository"**
4. Remplissez les informations :
   - **Repository name**: `glow-by-fc-landing`
   - **Description**: `Site de landing moderne pour Glow by FC - Next.js 15, React 19, Tailwind CSS`
   - **Public** ou **Private** (selon votre préférence)
   - ⚠️ **NE cochez PAS** "Add a README file" (nous en avons déjà un)
   - ⚠️ **NE cochez PAS** "Add .gitignore" (nous en avons déjà un)
   - ⚠️ **NE cochez PAS** "Choose a license" (nous en avons déjà une)

### 2. Connecter votre dépôt local à GitHub

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Ajouter l'origine GitHub (remplacez YOUR_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/YOUR_USERNAME/glow-by-fc-landing.git

# Renommer la branche principale en main (optionnel mais recommandé)
git branch -M main

# Pousser votre code vers GitHub
git push -u origin main
```

### 3. Configuration des variables d'environnement (pour Vercel)

Si vous déployez sur Vercel, ajoutez ces variables d'environnement dans les paramètres de votre projet :

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=votre-email@gmail.com
EMAIL_TO=destination@example.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/glowbyfc
NEXT_PUBLIC_CONTACT_EMAIL=contact@glowbyfc.com
```

### 4. Configuration des secrets GitHub (pour CI/CD)

Si vous voulez utiliser les GitHub Actions pour le déploiement automatique :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :
   - `VERCEL_TOKEN` : Token d'API Vercel
   - `VERCEL_ORG_ID` : ID de votre organisation Vercel
   - `VERCEL_PROJECT_ID` : ID de votre projet Vercel

### 5. Activer les discussions et issues

1. Allez dans **Settings** de votre repository
2. Dans la section **Features** :
   - ✅ Cochez **Issues**
   - ✅ Cochez **Discussions** (optionnel)

### 6. Ajouter des topics (tags)

1. Sur la page principale de votre repository
2. Cliquez sur l'icône ⚙️ à côté de **About**
3. Ajoutez ces topics :
   - `nextjs`
   - `react`
   - `typescript`
   - `tailwindcss`
   - `landing-page`
   - `glow-by-fc`
   - `framer-motion`
   - `radix-ui`
   - `shadcn-ui`

## 🎉 Votre repository est prêt !

Votre projet est maintenant configuré avec :

- ✅ Documentation complète (README, CONTRIBUTING, etc.)
- ✅ Templates d'issues et de pull requests
- ✅ Workflow GitHub Actions pour CI/CD
- ✅ Configuration de sécurité
- ✅ License MIT
- ✅ Code of Conduct
- ✅ Gitignore approprié
- ✅ Configuration Vercel

## 📋 Prochaines étapes recommandées

1. **Personnaliser** les emails de contact dans les fichiers de documentation
2. **Configurer** les variables d'environnement pour la newsletter
3. **Tester** le déploiement sur Vercel ou autre plateforme
4. **Ajouter** des images/logos personnalisés dans le dossier public
5. **Inviter** des collaborateurs si nécessaire

## 🆘 Besoin d'aide ?

- [Documentation GitHub](https://docs.github.com)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

Bonne chance avec votre projet ! 🚀
