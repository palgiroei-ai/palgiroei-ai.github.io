# PalgiTraining Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish the one-page Hebrew RTL marketing site for Roei Palgi's coaching business at https://palgiroei-ai.github.io.

**Architecture:** Single static page (`index.html` + `style.css` + `assets/`), no framework, no build step, hosted on GitHub Pages from `main`. Dark theme built around the white-on-black PalgiTraining logo; photos processed locally with macOS `sips`.

**Tech Stack:** HTML5, CSS3, macOS `sips` for image processing, Google Fonts (Heebo), GitHub Pages, `gh` CLI.

## Global Constraints

- Language: Hebrew only; `<html lang="he" dir="rtl">` on every page.
- Mobile-first: every section must look right at 375px width first, then desktop.
- No JS frameworks, no build step. Vanilla HTML/CSS (tiny inline JS allowed only if a real need appears; none planned).
- Dark theme tokens (from spec): background near-black, white text, one warm accent. Defined once as CSS variables in `:root` — never hardcode colors in section CSS.
- All Hebrew copy in this plan is a **DRAFT** — Roei reviews and corrects all copy at the Task 9 checkpoint before launch. Do not push before Task 9 approval.
- **Push = live site. NEVER `git push` without Roei's explicit approval** (standing deploy rule).
- Page weight: all images combined ≤ 2.5 MB; hero image ≤ 450 KB.
- Contact facts (exact values): WhatsApp `https://wa.me/972507721477`, email `palgitraining@gmail.com`.
- Photo source folder (read-only — never modify originals): `/Users/tamooz/Photos for website`.
- Repo root: `/Users/tamooz/palgiroei-ai.github.io`. All paths below are relative to it.

---

### Task 1: Base scaffold — skeleton page + design tokens

**Files:**
- Create: `.gitignore`
- Create: `index.html`
- Create: `style.css`

**Interfaces:**
- Produces: section anchors `#hero`, `#about`, `#services`, `#gallery`, `#contact` (Tasks 3–7 fill them); CSS variables `--bg --surface --text --muted --accent --radius --maxw`; helper classes `.container`, `.section`, `.section-title` used by all section tasks.

- [ ] **Step 1: Write `.gitignore`**

```gitignore
.DS_Store
```

- [ ] **Step 2: Write `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PalgiTraining — רועי פלגי | אימון טיפוס תחרותי ופיזיותרפיה</title>
  <meta name="description" content="רועי פלגי — פיזיותרפיסט ומאמן טיפוס תחרותי. אימוני טיפוס לספורטאים תחרותיים, תוכניות אימון מרחוק, שיעורי טכניקה אישיים ופיזיותרפיה.">
  <link rel="icon" href="assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header id="hero"><!-- Task 3 --></header>
  <main>
    <section id="about" class="section"><!-- Task 4 --></section>
    <section id="services" class="section"><!-- Task 5 --></section>
    <section id="gallery" class="section"><!-- Task 6 --></section>
    <section id="contact" class="section"><!-- Task 7 --></section>
  </main>
  <footer id="footer"><!-- Task 7 --></footer>
</body>
</html>
```

- [ ] **Step 3: Write `style.css` — tokens, reset, shared layout**

```css
/* ===== Design tokens ===== */
:root {
  --bg: #0c0c0e;
  --surface: #17171b;
  --text: #f4f4f1;
  --muted: #b7b7b0;
  --accent: #ff7a2f;
  --accent-press: #e5661d;
  --radius: 14px;
  --maxw: 1060px;
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img { max-width: 100%; display: block; }
a { color: inherit; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Heebo', system-ui, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ===== Shared layout ===== */
.container {
  max-width: var(--maxw);
  margin-inline: auto;
  padding-inline: 20px;
}

.section { padding-block: 64px; }

.section-title {
  font-size: 1.9rem;
  font-weight: 800;
  margin-bottom: 24px;
}

.section-title::after {
  content: "";
  display: block;
  width: 56px;
  height: 4px;
  background: var(--accent);
  border-radius: 2px;
  margin-top: 10px;
}

@media (min-width: 700px) {
  .section { padding-block: 88px; }
  .section-title { font-size: 2.3rem; }
}
```

- [ ] **Step 4: Verify skeleton renders**

Run: `cd /Users/tamooz/palgiroei-ai.github.io && python3 -m http.server 8080` (background), then `curl -s http://localhost:8080 | grep 'dir="rtl"'`
Expected: the `<html lang="he" dir="rtl">` line prints. Page loads with dark background (empty content is fine).

- [ ] **Step 5: Commit**

```bash
git add .gitignore index.html style.css
git commit -m "feat: base scaffold — RTL skeleton, dark design tokens"
```

---

### Task 2: Assets — logos, favicon, processed photos

**Files:**
- Create: `assets/logo.jpg`, `assets/wordmark.jpg`, `assets/favicon.png`
- Create: `assets/img/hero.jpg` and `assets/img/gallery-01.jpg` … `gallery-NN.jpg` (6–10 photos)

**Interfaces:**
- Consumes: originals in `/Users/tamooz/Photos for website` (read-only).
- Produces: exact paths `assets/logo.jpg`, `assets/wordmark.jpg`, `assets/favicon.png`, `assets/img/hero.jpg`, `assets/img/gallery-NN.jpg` — Tasks 3, 6, 7 reference these names verbatim.

- [ ] **Step 1: Copy logos and make favicon**

```bash
cd /Users/tamooz/palgiroei-ai.github.io
mkdir -p assets/img
cp '/Users/tamooz/Photos for website/0PalgiTraining_newlogo_inverted.jpg' assets/logo.jpg
cp '/Users/tamooz/Photos for website/פָּלְגִיטְּרֶיְנִינְג.jpg' assets/wordmark.jpg
sips -Z 180 -s format png assets/logo.jpg --out assets/favicon.png
```

- [ ] **Step 2: View every photo and select**

Open each of the 14 photos in `/Users/tamooz/Photos for website` with the Read tool. Selection criteria:
- **Hero (pick 1):** landscape orientation, high resolution (candidates by size: `DSC01642-Enhanced-NR.JPEG` 5499×3093, `BlocMastersQualis-2.jpg` 3600×2400, `AS4A0066/0887/0890/1459.JPEG` 3000×2000), dramatic, works with white text overlaid (darker/uncluttered top area preferred).
- **Gallery (pick 6–10):** sharp, well-lit, shows Roei coaching or climbing / with athletes; mix of portrait and landscape is fine.
Record the mapping (original → web name) in the commit message.

- [ ] **Step 3: Process selected photos**

```bash
cd /Users/tamooz/palgiroei-ai.github.io
# Hero: max 2200px on the long edge, quality 72
sips -Z 2200 -s format jpeg -s formatOptions 72 '/Users/tamooz/Photos for website/<HERO_ORIGINAL>' --out assets/img/hero.jpg
# Each gallery pick: max 1400px, quality 72 (repeat per photo, numbering 01, 02, ...)
sips -Z 1400 -s format jpeg -s formatOptions 72 '/Users/tamooz/Photos for website/<ORIGINAL>' --out assets/img/gallery-01.jpg
```

- [ ] **Step 4: Verify page-weight budget**

Run: `du -ch assets/img/*.jpg | tail -1` and `ls -la assets/img/hero.jpg`
Expected: total ≤ 2.5 MB, hero.jpg ≤ 450 KB. If over: re-run sips with `formatOptions 60` or drop a gallery photo.

- [ ] **Step 5: Commit**

```bash
git add assets
git commit -m "feat: assets — logos, favicon, optimized photos (mapping: <list original→web names>)"
```

---

### Task 3: Hero section

**Files:**
- Modify: `index.html` (fill `<header id="hero">`)
- Modify: `style.css` (append hero styles)

**Interfaces:**
- Consumes: `assets/logo.jpg`, `assets/img/hero.jpg` (Task 2); tokens (Task 1).
- Produces: in-page anchor link to `#contact` (Task 7 must keep that id).

- [ ] **Step 1: Fill hero HTML**

```html
<header id="hero">
  <div class="hero-inner container">
    <img class="hero-logo" src="assets/logo.jpg" alt="PalgiTraining לוגו" width="140" height="140">
    <h1>רועי פלגי</h1>
    <p class="hero-tagline">פיזיותרפיסט ומאמן טיפוס תחרותי</p>
    <p class="hero-sub">ליווי מקצועי לספורטאים — מהאימון הראשון ועד תחרויות בינלאומיות</p>
    <a class="btn-primary" href="#contact">דברו איתי</a>
  </div>
</header>
```

- [ ] **Step 2: Append hero CSS**

```css
/* ===== Hero ===== */
#hero {
  min-height: 92svh;
  display: grid;
  place-items: center;
  text-align: center;
  background:
    linear-gradient(rgba(12,12,14,0.55), rgba(12,12,14,0.88)),
    url("assets/img/hero.jpg") center / cover no-repeat;
  padding-block: 48px;
}

.hero-logo {
  width: 140px;
  height: auto;
  margin-inline: auto;
  margin-bottom: 20px;
  border-radius: 50%;
}

#hero h1 { font-size: 2.6rem; font-weight: 800; line-height: 1.15; }

.hero-tagline {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
  margin-top: 6px;
}

.hero-sub {
  color: var(--muted);
  max-width: 34ch;
  margin: 14px auto 28px;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: #111;
  font-weight: 800;
  font-size: 1.1rem;
  padding: 14px 38px;
  border-radius: 999px;
  text-decoration: none;
}

.btn-primary:active { background: var(--accent-press); }

@media (min-width: 700px) {
  #hero h1 { font-size: 3.4rem; }
}
```

- [ ] **Step 3: Verify in browser**

Run: `open http://localhost:8080` — check at full width and at 375px (responsive mode): logo visible on dark overlay, headline readable over the photo, button jumps to (still empty) contact section.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: hero section"
```

---

### Task 4: About section (אודות)

**Files:**
- Modify: `index.html` (fill `<section id="about">`)
- Modify: `style.css` (append about styles)

**Interfaces:**
- Consumes: `.section`, `.section-title`, `.container` (Task 1).

- [ ] **Step 1: Fill about HTML (copy = DRAFT for Roei)**

```html
<section id="about" class="section">
  <div class="container">
    <h2 class="section-title">אודות</h2>
    <div class="about-text">
      <p>אני רועי פלגי, פיזיותרפיסט ומאמן טיפוס תחרותי. אני מאמן ספורטאים תחרותיים — בהם ספורטאי נבחרות ישראל בטיפוס — ומלווה אותם באימונים, בבניית תוכניות אימון ובתחרויות בארץ ובעולם.</p>
      <p>השילוב בין פיזיותרפיה לאימון הוא הבסיס לשיטת העבודה שלי: תוכנית שמפתחת ביצועים ובאותה נשימה שומרת על גוף בריא — גם בעומסי אימון גבוהים. כל ספורטאי מקבל תוכנית אישית, מעקב צמוד ותקשורת פתוחה איתו ועם ההורים.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append about CSS**

```css
/* ===== About ===== */
.about-text { max-width: 62ch; }
.about-text p + p { margin-top: 14px; }
.about-text { font-size: 1.05rem; }
```

- [ ] **Step 3: Verify in browser** — RTL paragraph alignment (right-aligned), comfortable line length on desktop.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: about section (draft copy)"
```

---

### Task 5: Services section (שירותים) — 4 cards

**Files:**
- Modify: `index.html` (fill `<section id="services">`)
- Modify: `style.css` (append services styles)

**Interfaces:**
- Consumes: `.section`, `.section-title`, `--surface`, `--radius` (Task 1).

- [ ] **Step 1: Fill services HTML (copy = DRAFT for Roei)**

```html
<section id="services" class="section">
  <div class="container">
    <h2 class="section-title">שירותים</h2>
    <div class="cards">
      <article class="card">
        <h3>אימון טיפוס תחרותי</h3>
        <p>ליווי אישי וקבוצתי לספורטאים תחרותיים: תכנון עונה, בניית בלוקים של אימונים, מעקב התקדמות והכנה לתחרויות בארץ ובחו״ל.</p>
      </article>
      <article class="card">
        <h3>תוכניות אימון מרחוק</h3>
        <p>תוכנית אימון אישית שנבנית לפי המטרות, הרמה והזמן שלכם — עם מעקב ועדכונים שוטפים, מכל מקום בארץ.</p>
      </article>
      <article class="card">
        <h3>שיעורי טכניקה אישיים</h3>
        <p>אימון אחד־על־אחד לשיפור הטכניקה: קריאת מסלולים, עבודת רגליים, יעילות תנועה וביטחון על הקיר. מתאים לכל הרמות.</p>
      </article>
      <article class="card">
        <h3>פיזיותרפיה</h3>
        <p>אבחון וטיפול בפציעות טיפוס וספורט, ליווי בחזרה לאימונים ותוכניות חיזוק ומניעה — מפיזיותרפיסט שמכיר את הספורט מבפנים.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append services CSS**

```css
/* ===== Services ===== */
.cards {
  display: grid;
  gap: 16px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  border-top: 3px solid var(--accent);
}

.card h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 8px; }
.card p { color: var(--muted); }

@media (min-width: 700px) {
  .cards { grid-template-columns: 1fr 1fr; gap: 20px; }
}
```

- [ ] **Step 3: Verify in browser** — 1 column at 375px, 2×2 grid at desktop, accent line on top edge of each card.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: services section — 4 cards (draft copy)"
```

---

### Task 6: Gallery section

**Files:**
- Modify: `index.html` (fill `<section id="gallery">`)
- Modify: `style.css` (append gallery styles)

**Interfaces:**
- Consumes: `assets/img/gallery-NN.jpg` files (Task 2 — use the exact set produced there).

- [ ] **Step 1: Fill gallery HTML**

One `<img>` per Task-2 gallery file, loading lazily. Pattern (repeat for each, 01…NN):

```html
<section id="gallery" class="section">
  <div class="container">
    <h2 class="section-title">מהאימונים והתחרויות</h2>
    <div class="gallery-grid">
      <img src="assets/img/gallery-01.jpg" alt="רועי פלגי באימון טיפוס" loading="lazy">
      <!-- ... one img per gallery photo; alt text describes the actual photo content ... -->
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append gallery CSS**

```css
/* ===== Gallery ===== */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.gallery-grid img {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 10px;
}

@media (min-width: 700px) {
  .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
}
```

- [ ] **Step 3: Verify in browser** — 2-col grid on mobile, 3-col on desktop, no layout shift while scrolling (aspect-ratio holds space), photos not distorted.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: gallery section"
```

---

### Task 7: Contact section + footer

**Files:**
- Modify: `index.html` (fill `<section id="contact">` and `<footer>`)
- Modify: `style.css` (append contact/footer styles)

**Interfaces:**
- Consumes: `#contact` anchor (hero button targets it), `assets/wordmark.jpg` (Task 2), `.btn-primary` (Task 3).

- [ ] **Step 1: Fill contact + footer HTML (copy = DRAFT for Roei)**

```html
<section id="contact" class="section">
  <div class="container contact-inner">
    <h2 class="section-title">צור קשר</h2>
    <p>רוצים להתחיל? כתבו לי ונחשוב יחד מה מתאים לכם.</p>
    <div class="contact-actions">
      <a class="btn-primary" href="https://wa.me/972507721477?text=%D7%94%D7%99%D7%99%20%D7%A8%D7%95%D7%A2%D7%99%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%94%D7%90%D7%AA%D7%A8">וואטסאפ</a>
      <a class="btn-secondary" href="mailto:palgitraining@gmail.com">palgitraining@gmail.com</a>
    </div>
  </div>
</section>
```

```html
<footer id="footer">
  <div class="container footer-inner">
    <img class="footer-wordmark" src="assets/wordmark.jpg" alt="פלגיטריינינג" width="220">
    <p>© רועי פלגי · PalgiTraining</p>
  </div>
</footer>
```

(The `?text=` parameter pre-fills "היי רועי, הגעתי מהאתר" in WhatsApp.)

- [ ] **Step 2: Append contact/footer CSS**

```css
/* ===== Contact ===== */
.contact-inner { text-align: center; }
.contact-inner .section-title::after { margin-inline: auto; }

.contact-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
}

.btn-secondary {
  color: var(--text);
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--muted);
  padding: 12px 30px;
  border-radius: 999px;
}

@media (min-width: 700px) {
  .contact-actions { flex-direction: row; justify-content: center; }
}

/* ===== Footer ===== */
#footer {
  border-top: 1px solid #26262b;
  padding-block: 32px;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
}

.footer-wordmark {
  width: 200px;
  margin: 0 auto 10px;
}
```

- [ ] **Step 3: Verify links**

Run: `curl -s http://localhost:8080 | grep -o 'wa.me/972507721477[^"]*'` and `grep -c 'mailto:palgitraining@gmail.com' index.html`
Expected: WhatsApp URL prints once; mailto count = 1. In browser: hero "דברו איתי" scrolls to contact; WhatsApp link opens chat with 050-772-1477 (verify on Roei's phone at checkpoint).

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: contact section + footer (draft copy)"
```

---

### Task 8: Quality pass

**Files:**
- Modify: `index.html`, `style.css` (fixes only as needed)

- [ ] **Step 1: Full-page checks in browser**

At 375px, 768px, 1280px widths: no horizontal scroll, all sections aligned RTL, images sharp, contrast readable. Fix anything broken.

- [ ] **Step 2: Weight + validity checks**

```bash
du -ch assets/img/*.jpg assets/*.jpg assets/*.png | tail -1   # expect ≤ 2.5M
python3 -c "import html.parser,sys; p=html.parser.HTMLParser(); p.feed(open('index.html',encoding='utf-8').read()); print('parsed OK')"
grep -n 'lang="he" dir="rtl"' index.html   # expect line 2
```

- [ ] **Step 3: Commit (if fixes were made)**

```bash
git add -A && git commit -m "polish: quality pass fixes"
```

---

### Task 9: CHECKPOINT — Roei previews and iterates (USER GATE)

**No files planned — iteration driven by Roei's feedback.**

- [ ] **Step 1: Open the preview for Roei** — `open http://localhost:8080` and walk him through each section.
- [ ] **Step 2: Collect feedback on:** all Hebrew copy (his voice wins), photo selection, accent color, section order. Apply changes, commit each round (`polish: checkpoint feedback — <what>`).
- [ ] **Step 3: Get explicit approval to publish.** Do not proceed to Task 10 without Roei saying yes — the next task makes the site public.

---

### Task 10: Publish — GitHub repo + Pages (REQUIRES ROEI'S APPROVAL FROM TASK 9)

**Files:** none (repo/infra only)

- [ ] **Step 1: Create the GitHub repo**

```bash
cd /Users/tamooz/palgiroei-ai.github.io
gh repo create palgiroei-ai/palgiroei-ai.github.io --public --source . --remote origin
```

If `gh` is not authenticated as `palgiroei-ai`: fall back to `git remote add origin git@github.com:palgiroei-ai/palgiroei-ai.github.io.git` after Roei creates the empty repo at github.com/new (name must be exactly `palgiroei-ai.github.io`, Public, no README). SSH port-22 fallback if needed: `ssh://git@ssh.github.com:443/palgiroei-ai/palgiroei-ai.github.io.git`.

- [ ] **Step 2: Push (this makes the site live — approval already given in Task 9)**

```bash
git push -u origin main
```

- [ ] **Step 3: Confirm Pages is serving**

For `<owner>.github.io` repos GitHub enables Pages automatically on the first push to the default branch; first build can take 1–3 minutes.

Run: `sleep 90 && curl -sI https://palgiroei-ai.github.io | head -3`
Expected: `HTTP/2 200`. If 404 after ~5 min: `gh api repos/palgiroei-ai/palgiroei-ai.github.io/pages -X POST -f "source[branch]=main" -f "source[path]=/"` then re-check.

- [ ] **Step 4: Live verification**

Open https://palgiroei-ai.github.io in a browser — repeat Task 8 Step 1 spot checks on the live URL. Send Roei the link to test the WhatsApp button from his phone.
