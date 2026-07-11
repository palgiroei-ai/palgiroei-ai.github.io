# PalgiTraining Website

Public marketing site for Roei Palgi — physiotherapist & competitive climbing
coach. **Live at https://palgiroei-ai.github.io** (GitHub Pages, `main` branch).

## ⚠️ Deploy rule

`git push` = the live site updates within ~1 minute. Never push without
Roei's explicit approval after he has seen a preview.

## Stack & layout

Plain HTML/CSS/vanilla JS, no build step. `index.html` + `style.css` +
`script.js` + `assets/`. Hebrew, RTL, mobile-first, dark warm-purple theme
(tokens in `:root`). All animation is gated behind `prefers-reduced-motion`
and degrades safely without JS.

## Local preview (Roei reviews on his phone)

```bash
python3 -m http.server 8080   # run from repo root
ipconfig getifaddr en0        # give Roei http://<that-ip>:8080 (same Wi-Fi)
```

## Photos

Source originals: `/Users/tamooz/claude-projects/Photos for website` (never modify).
Process with `sips` into `assets/img/` (it also converts the `.jpg.avif`
files). Weight: currently 2.6 MB total — keep near this; hero ≤ 450 KB.
Permission confirmed by Roei (2026-07-10) for all current photos.
**When replacing an image under the same filename, bump its `?v=N`
query in index.html — phones cache aggressively.**

## Content rules

- Hebrew copy is Roei's voice — he approves all wording.
- Gender-inclusive forms (ספורטאיות וספורטאים) in all visible copy.
- Stats numbers come from Roei verbatim — never invent or adjust.
- Duotone photo treatment was tried and rejected — don't reintroduce.
- Service mockups mirror Roei's real Google Sheets files: real structure and
  colors (#1f1434 headers, #f7efdf cream cells, #d9d2e9 lavender), fictional
  athletes/data only ("דנה כ׳ · הדגמה"). Never copy real athlete names or
  values, never invent metrics his files don't have.
- App-style mockup variant preserved on branch `services-app-mockups`.

## Docs

Spec: `docs/superpowers/specs/2026-07-10-palgitraining-website-design.md`
Plan: `docs/superpowers/plans/2026-07-10-palgitraining-website.md`
Future phases (testimonials, athletes area, portal, domain) are in the spec.

## Campus Climber game + live leaderboard

Game section (`#game`) between workflow and gallery. Leaderboard backend:
`leaderboard/` — standalone Apps Script web app; the **"Campus Climber
Leaderboard" Sheet in Roei's Drive is the moderation panel** (delete a row =
remove a score). Code updates: `clasp push`, then **Roei redeploys from the
editor** (Manage deployments → edit → new version) — a CLI `clasp deploy`
over the web-app deployment breaks its URL. After any deploy of the site,
browsers may serve the old page for up to ~10 minutes (GitHub Pages cache).
