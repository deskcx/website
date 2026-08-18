# desk-website

Public marketing site for **The Desk** — a desktop app for tracking UAE free zone
compliance (QFZP thresholds, VAT, ESR & UBO) per entity.

The site has two jobs: explain what the product does, and get visitors to Install.

## Stack

- Next.js 16 (App Router) + TypeScript
- Plain CSS Modules, no CSS framework
- Deployed on Vercel

## Colour theme

The palette in `app/globals.css` is ported from the desktop app's
`frontend/src/styles/theme.css`. Keep the two in sync rather than tweaking values
here ad hoc.

Theme selection is stored in `localStorage` under `desk-theme` and applied to
`<html data-theme>` by an inline script in `app/layout.tsx` before first paint.

## Pages

| Route | Status |
| --- | --- |
| `/` | Built |
| `/about` | Placeholder |
| `/install` | Placeholder |
| `/docs` | Placeholder |
| `/contact` | Placeholder |

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npx eslint .    # lint
npx tsc --noEmit  # typecheck
```
