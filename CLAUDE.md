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
- Photo replaced under same filename → bump `?v=N` cache-buster in index.html.
- Service mockups: structure/colors from Roei's real sheets (#1f1434 /
  #f7efdf / #d9d2e9), data always fictional; never invent metrics. Reference
  files via gws (re-auth needed every ~7 days). Variant A on branch
  `services-app-mockups`.
- style.css/script.js are linked with `?v=N` — bump N in index.html on every
  deploy that changes either file (prevents stale-cache mismatches).
