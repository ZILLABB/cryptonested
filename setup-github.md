# GitHub Setup Instructions

Follow these steps to push your CryptoNested project to GitHub:

## 1. Initialize Git Repository (if not already done)

```bash
git init
```

## 2. Add all files to staging

```bash
git add .
```

## 3. Create initial commit

```bash
git commit -m "feat: initial commit - complete CryptoNested v0.2.0 with staking system

- Complete cryptocurrency portfolio tracker
- Supabase authentication and database
- Real-time market data integration
- Comprehensive staking system (Flexible 4%, Standard 8%, Premium 12% APY)
- Responsive UI with dark/light themes
- Portfolio management with CSV import/export
- News aggregation and filtering
- Dashboard with analytics and charts
- Testing framework with Jest
- CI/CD pipeline with GitHub Actions
- Complete documentation and deployment guides"
```

## 4. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it `cryptonested`
4. Add description: "A comprehensive cryptocurrency portfolio tracker with staking rewards"
5. Make it public (or private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## 5. Add GitHub remote

Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/cryptonested.git
```

## 6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## 7. Set up GitHub repository settings

### Enable GitHub Pages (optional)
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select source: "Deploy from a branch"
4. Select branch: "main"
5. Select folder: "/ (root)"

### Add repository topics
Add these topics to help others discover your project:
- `cryptocurrency`
- `portfolio-tracker`
- `nextjs`
- `react`
- `typescript`
- `supabase`
- `staking`
- `defi`
- `crypto`
- `blockchain`

### Set up branch protection (recommended)
1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## 8. Set up Vercel deployment (optional)

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Deploy!

## 9. Update README with your repository URL

Update the GitHub links in README.md to point to your repository:

```bash
# Find and replace in README.md
# Replace: https://github.com/yourusername/cryptonested
# With: https://github.com/YOURACTUALUSERNAME/cryptonested
```

## 10. Create first release

1. Go to your repository on GitHub
2. Click "Releases" on the right sidebar
3. Click "Create a new release"
4. Tag version: `v0.2.0`
5. Release title: `CryptoNested v0.2.0 - Complete Staking System`
6. Description:
   ```markdown
   ## 🚀 CryptoNested v0.2.0 - Complete Staking System

   This release includes a fully functional cryptocurrency portfolio tracker with an integrated staking platform.

   ### ✨ New Features
   - **Complete Staking System** with three plans (4%, 8%, 12% APY)
   - **Portfolio Management** with real-time tracking
   - **Market Data Integration** with live prices
   - **News Aggregation** with filtering
   - **Responsive Design** with dark/light themes
   - **Authentication System** with Supabase
   - **Testing Framework** with Jest
   - **CI/CD Pipeline** with GitHub Actions

   ### 🛠️ Technical Stack
   - Next.js 15 with App Router
   - React 19 with TypeScript
   - Supabase for backend
   - TailwindCSS for styling
   - Framer Motion for animations

   ### 📚 Documentation
   - Complete setup and deployment guides
   - API documentation
   - Contributing guidelines

   See the [README.md](README.md) for full installation and usage instructions.
   ```
7. Click "Publish release"

## Next Steps

After pushing to GitHub, you can:

1. **Set up continuous deployment** with Vercel or Netlify
2. **Configure GitHub Actions** for automated testing
3. **Add collaborators** if working with a team
4. **Create issues** for future features and improvements
5. **Set up project boards** for task management

## Troubleshooting

### If you get authentication errors:
```bash
# Use personal access token instead of password
# Go to GitHub Settings > Developer settings > Personal access tokens
# Generate a new token with repo permissions
```

### If you need to change remote URL:
```bash
git remote set-url origin https://github.com/yourusername/cryptonested.git
```

### If you need to force push (use carefully):
```bash
git push --force-with-lease origin main
```

---

🎉 **Congratulations!** Your CryptoNested project is now on GitHub and ready for the world to see!
