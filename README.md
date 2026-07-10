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

Source originals: `/Users/tamooz/Photos for website` (never modify).
Process with `sips` into `assets/img/` — budget: all images ≤ 2.5 MB total,
hero ≤ 450 KB. Permission confirmed by Roei (2026-07-10) for all current
photos, including minors.

## Content rules

- Hebrew copy is Roei's voice — he approves all wording.
- Gender-inclusive forms (ספורטאיות וספורטאים) in all visible copy.
- Stats numbers come from Roei verbatim — never invent or adjust.
- Duotone photo treatment was tried and rejected — don't reintroduce.

## Docs

Spec: `docs/superpowers/specs/2026-07-10-palgitraining-website-design.md`
Plan: `docs/superpowers/plans/2026-07-10-palgitraining-website.md`
Future phases (testimonials, athletes area, portal, domain) are in the spec.
