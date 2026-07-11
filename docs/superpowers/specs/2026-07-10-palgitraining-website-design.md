# PalgiTraining Website — Design Spec (v1: Informative)

**Date:** 2026-07-10
**Owner:** Roei Palgi
**Status:** Approved design, pending spec review

## Purpose

A public marketing website whose primary goal is **attracting new clients** —
prospective athletes and their parents. A future phase will add a functional
athletes area (schedules, sign-up, eventually a login portal), and the v1
structure must not block that.

## Audience & language

- Prospective competitive climbers and their parents (Israel).
- Amateur climbers looking for remote plans, technique sessions, or physio.
- **Hebrew only, RTL**, mobile-first — most visitors will arrive from a
  WhatsApp link on a phone.

## Platform & hosting (decided: Approach A)

- New GitHub repository **`palgiroei-ai/palgiroei-ai.github.io`** (this repo),
  separate from `palgi-training`.
- **GitHub Pages** from the `main` branch — site publishes at
  `https://palgiroei-ai.github.io` (root URL, no path).
- Plain **HTML + CSS + minimal JS**. No framework, no build step. One
  `index.html`, one stylesheet, an `assets/` folder for images.
- Deploy = `git push` to `main`. Per Roei's standing deploy rule: **ask before
  every push** once the site is live.
- Domain: free `github.io` address for now. A custom domain can be attached to
  the same repo later without rebuilding anything.

## Page structure (single page, top to bottom)

1. **Hero** — white-on-black PalgiTraining logo, Roei's name, one-line
   positioning: physiotherapist & competitive climbing coach (national-team
   experience), and a prominent "צור קשר" button (jumps to contact section).
2. **About (אודות)** — credentials, coaching experience incl. national youth
   team, the physio+coach combination as the differentiator.
2b. **Stats strip** (added at checkpoint, numbers from Roei 2026-07-10):
   10+ שנות אימון תחרותי · 40+ משלחות בינלאומיות · 60+ פודיומים ארציים ·
   25+ גמרים בינלאומיים (כולל מדליות בינלאומיות) — count-up on scroll.
   (Podiums 40→60 and finals 15→25 updated per Roei, 2026-07-10.)
3. **Services (שירותים)** — four cards, each with "who it's for" + what it
   includes (2–3 sentences):
   - אימון טיפוס תחרותי (competitive climbing coaching)
   - תוכניות אימון מרחוק (remote training plans)
   - שיעורי טכניקה אישיים (one-on-one climbing technique sessions)
   - פיזיותרפיה (physiotherapy)
4. **Gallery** — 6–10 curated photos, optimized/compressed for fast load.
5. **Contact (צור קשר)** — WhatsApp button (primary CTA, 050-772-1477 via
   `wa.me/972507721477`), email link (palgitraining@gmail.com).
6. **Footer** — Hebrew niqqud wordmark (פָּלְגִיטְּרֶיְנִינְג) as a secondary
   brand element, minimal text.
7. **Reserved for later (not built in v1):** testimonials section; athletes
   area ("אזור מתאמנים") linking to Apps Script web apps and, eventually, a
   login portal.

## Visual design

- **Dark theme**: both logo files are white-on-black JPGs (opaque background),
  so the brand lives on dark surfaces. Dark background with white/light text,
  accent color chosen during implementation to complement the photography.
- Primary logo: `0PalgiTraining_newlogo_inverted.jpg` (climber silhouette in
  circle). Secondary: Hebrew niqqud wordmark JPG.
- Mobile-first layout; must also look right on desktop.

## Content & assets

- **Copy:** Claude drafts all Hebrew copy; Roei reviews and corrects every
  section before launch. Roei's voice with parents/athletes wins over drafted
  text.
- **Photos:** source folder `/Users/tamooz/claude-projects/Photos for website` (14 photos +
  2 logos as of 2026-07-10, mainly Roei and Roei-with-athletes). Claude
  selects, resizes, and compresses into `assets/`. The set will change/grow
  later — gallery must be trivial to update (drop in file, add one tag).

## Privacy constraints

- Athlete photos: Roei confirmed (2026-07-10) that permission is in place for
  all photos currently in the source folder — all may be used.
- Publishing phone + email publicly was consciously approved by Roei
  (2026-07-10).

## Testing & launch gate

- Check rendering at phone and desktop widths, RTL correctness, WhatsApp link
  (`wa.me` deep link opens chat with correct number), email link, page weight
  (target: fast load on cellular).
- Roei sees a local/preview version and approves **before** the first public
  push (first push = the site goes live).

## Future phases (out of scope for v1)

- Testimonials collection and section.
- Athletes area: links to existing Apps Script tools (e.g., Wingate sign-up
  web form) — zero new infrastructure.
- Full athlete portal (login, personal plan view, session reporting) — separate
  project with its own spec; would likely need a real backend (e.g., Firebase)
  and does not constrain this static site.
- Custom domain.
- English version (only if international need appears).

## Revision — 2026-07-10 evening (services redesign, shipped)

Supersedes the "Services" bullet in Page structure:

- Services: four full-width alternating editorial sections (55/45 desktop
  split, numbered kickers, benefit bullets, per-service CTA), each with a
  Google-Sheets-style mockup mirroring Roei's real files (block tab w/ S&C
  sets/reps table; Schedule strip + מעקב אימון; tablet video analysis;
  physio exercise table). Fictional data only; real palette #1f1434/#f7efdf/
  #d9d2e9. App-style variant kept on branch `services-app-mockups`.
- New section after services: "כך נראה תהליך העבודה" — 5 steps with icons.
- Gallery renamed "גלריה", 9 photos.
- Instagram (instagram.com/palgi.roei) in contact + footer.

## Revision — 2026-07-11 (game + leaderboard, shipped)

- Campus Climber mini-game (#game, between workflow and gallery): timing-bar
  game, logo badge climbs a campus board with engraved rung numbers;
  personal-best rung highlighted (#6d3fb0); difficulty tuned by Roei
  (zone ×0.88/step, floor 3%); WhatsApp score share; summit cap 60.
- Live top-5 leaderboard with podium (2-1-3 medal blocks): Apps Script web
  app (leaderboard/) + "Campus Climber Leaderboard" Sheet as moderation
  panel; fetch retries ×3 + localStorage board cache; submit form only on
  qualifying score. Historical seeds: ישי 13, אורכה 12, לוטם 11.
- Stats updates: שנות אימון תחרותי (70+ ספורטאיות וספורטאי הישג),
  משלחות 40+. Workflow step 4 "הכנה לרגע האמת" + WhatsApp CTA.
- css/js links carry ?v=N (now v=5) — bump on every deploy touching them.
