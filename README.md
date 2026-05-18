# GitHub Stats Dashboard

Dashboard analytics public pour visualiser n'importe quel profil GitHub : repos, langages, activité sur 12 mois, top stars. Esthétique terminal / developer-core, fond `#0d1117`, accents vert néon `#39d353`.

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Recharts
- `geist` font (mono + sans)
- GitHub REST API v3 (publique)

## Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) puis essaie un username : `torvalds`, `gaearon`, `sindresorhus`.

## Token GitHub (optionnel)

Sans token, la rate limit GitHub est de **60 req/h** par IP. Avec un token, elle passe à **5000 req/h**.

1. Crée un token sur [github.com/settings/tokens](https://github.com/settings/tokens) (scope public suffit).
2. Copie `.env.local.example` vers `.env.local` et colle ton token :

```bash
cp .env.local.example .env.local
```

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

## Architecture

```
app/
├── api/github/route.ts   # Proxy serveur vers l'API GitHub (cache 5 min)
├── layout.tsx            # Fonts Geist, metadata
├── page.tsx              # Recherche + assemblage du dashboard
└── globals.css           # Variables CSS + animations

components/
├── SearchBar.tsx         # Input + bouton RUN
├── ProfileCard.tsx       # Avatar, bio, liens
├── StatsRow.tsx          # Compteurs animés (repos / stars / forks / followers)
├── LanguageChart.tsx     # Barre composite + légende
├── ActivityChart.tsx     # Recharts — commits par mois
├── RepoList.tsx          # Grille des top 6 repos
├── RepoCard.tsx          # Carte repo individuelle
└── SkeletonCard.tsx      # Skeleton loader

lib/github.ts             # fetchDashboard() + agrégations (langages, activité)
types/github.ts           # Types TS de l'API GitHub + types dérivés
```

## Déploiement Vercel

```bash
npx vercel --prod
```

Ajoute `GITHUB_TOKEN` dans les variables d'environnement du projet Vercel si tu veux la rate limit étendue.

## Limites connues

- L'activité commits est calculée depuis l'endpoint `/events/public`, qui ne renvoie que les **90 derniers jours** et est plafonné à 100 événements — les profils très actifs peuvent voir des chiffres tronqués sur les mois les plus anciens.
- Le calcul des langages se base sur le **langage principal** de chaque repo (pas la répartition d'octets par fichier).
