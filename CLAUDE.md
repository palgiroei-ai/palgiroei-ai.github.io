# CLAUDE.md — palgiroei-ai.github.io

- **push = live deploy.** Preview → Roei approves → then push. No exceptions.
- Roei previews on his phone: `python3 -m http.server 8080` + current LAN IP
  (`ipconfig getifaddr en0` — it changes between networks).
- Headless-Chrome screenshots: min layout width ≈ 500px (narrow-viewport
  "overflow" is an artifact); use temp `_shot.html/_shot.css` (hero svh→px)
  and `--force-prefers-reduced-motion` for layout checks.
- Image tooling: no system PIL/ImageMagick — create a Pillow venv in the
  session scratchpad. Photo budget: ≤2.5MB total, hero ≤450KB, via `sips`.
- Copy: Roei's voice, gender-inclusive (ספורטאיות וספורטאים), stats verbatim
  from Roei. Duotone photos were rejected — don't reintroduce.
