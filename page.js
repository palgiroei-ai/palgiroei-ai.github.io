/* PalgiTraining scroll demo: page-local behaviour.
   The engine is mounted untouched; everything bespoke reads the act progress
   (`p`) the engine already computes. */
(function () {
  var SC = window.ScrollCraft;
  var reduce = SC.reduce;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var phone = matchMedia('(max-width: 860px)').matches;

  // Under reduced motion nothing travels, so long pins would be dead scroll.
  // Shorten them before the engine lays the page out.
  if (reduce) {
    [['hero', 1.8], ['services', 1.2], ['moment', 1.6], ['process', 1.2]].forEach(function (s) {
      document.getElementById(s[0]).setAttribute('data-sc-span', s[1]);
    });
  }

  var api = SC.mount(document.body);
  var act = function (id) {
    var el = document.getElementById(id);
    for (var i = 0; i < api.acts.length; i++) if (api.acts[i].el === el) return api.acts[i];
  };
  var hero = act('hero'), svc = act('services'), peak = act('moment');

  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };
  function rng(seed) {            // mulberry32: the same dust on every visit
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  function fit(cv) {
    var w = cv.clientWidth, h = cv.clientHeight;
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    var g = cv.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { g: g, w: w, h: h };
  }

  // A soft chalk puff, drawn once and stamped many times.
  // Two tones: a lit face and a shaded underside give the cloud volume, so
  // the whiteout reads as dust rather than as a blank screen.
  function makeSprite(rgb) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(' + rgb + ',1)');
    r.addColorStop(0.45, 'rgba(' + rgb + ',0.55)');
    r.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return c;
  }
  var sprite = makeSprite('244,241,235');
  var shade = makeSprite('150,144,134');

  // ------------------------------------------------ services: RTL rail --
  // The engine's pan device only travels leftward. In Hebrew the next item has
  // to arrive from the left, so the rail is driven here from --sc-p instead.
  var rail = document.querySelector('.svc__rail');
  function measureRail() {
    if (reduce) return;
    var over = Math.max(rail.scrollWidth - svc.stage.clientWidth, 0);
    rail.style.setProperty('--over', over + 'px');
  }

  // ------------------------------------------------ process: the route --
  // The route is rebuilt in real pixels on every resize: a stretched viewBox
  // breaks Chrome's dash maths (the line drew in pieces). Each hold then gets
  // the exact scroll point where the drawn line reaches it, so the hold lights
  // the moment the line arrives, not near it.
  var routeSvg = document.querySelector('.route__svg');
  var routeLis = Array.prototype.slice.call(document.querySelectorAll('.route__steps li'));
  function layoutRoute() {
    var w = routeSvg.clientWidth, h = routeSvg.clientHeight;
    if (!w || !h) return;
    routeSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var pts = routeLis.map(function (li) {
      return [parseFloat(li.style.getPropertyValue('--x')) / 100 * w, parseFloat(li.style.getPropertyValue('--y')) / 100 * h];
    });
    var d = 'M' + pts[0][0] + ' ' + h + ' L' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], my = (a[1] - b[1]) * 0.45;
      d += ' C' + a[0] + ' ' + (a[1] - my) + ' ' + b[0] + ' ' + (b[1] + my) + ' ' + b[0] + ' ' + b[1];
    }
    var last = pts[pts.length - 1];
    d += ' L' + last[0] + ' ' + (last[1] - h * 0.1);
    Array.prototype.forEach.call(routeSvg.querySelectorAll('.route__track, .route__draw'), function (p) { p.setAttribute('d', d); });
    // the arrowhead at the top of the route, pointing on up
    // two arms, each drawn OUT from the vertex, so the vertex is always the
    // exact end of the line however far the arrow has grown
    var tx = last[0], ty = last[1] - h * 0.1, aw = Math.max(w * 0.12, 11), ah = aw * 1.05;
    var arms = routeSvg.querySelectorAll('.route__arrow');
    arms[0].setAttribute('d', 'M' + tx + ' ' + ty + ' L' + (tx - aw) + ' ' + (ty + ah));
    arms[1].setAttribute('d', 'M' + tx + ' ' + ty + ' L' + (tx + aw) + ' ' + (ty + ah));
    routeSvg.style.setProperty('--alen', Math.hypot(aw, ah).toFixed(1));
    var draw = routeSvg.querySelector('.route__draw');
    var len = draw.getTotalLength();
    draw.parentNode.parentNode.style.setProperty('--len', len.toFixed(1));
    // where the line enters and leaves each icon's circle, walked in small
    // steps: the circle fills from its bottom edge as the line climbs through
    var r = (routeLis[0].querySelector('.route__hold').offsetWidth || 40) / 2;
    var step = Math.max(len / 900, 0.75), k = 0, inside = false, span = [];
    for (var s = 0; s <= len && k < pts.length; s += step) {
      var q = draw.getPointAtLength(s), dx = q.x - pts[k][0], dy = q.y - pts[k][1];
      var isIn = dx * dx + dy * dy <= r * r;
      if (isIn && !inside) { span[k] = [s / len]; inside = true; }
      else if (!isIn && inside) { span[k].push(s / len); inside = false; k++; }
    }
    var toP = function (f) { return (0.05 + f * 0.72).toFixed(4); };
    routeLis.forEach(function (li, i) {
      var sp = span[i] && span[i].length === 2 ? span[i] : [(i + 0.3) / routeLis.length, (i + 0.7) / routeLis.length];
      li.style.setProperty('--t0', toP(sp[0]));
      li.style.setProperty('--t1', toP(sp[1]));
    });
  }

  // ------------------------------------------------- the numbers --
  // Same count-up as the live site (0 to target, cubic ease-out, 1.4s), each
  // row a beat after the last, with a small landing bounce at the end.
  var nums = Array.prototype.slice.call(document.querySelectorAll('.ledger__num'));
  if (!reduce && 'IntersectionObserver' in window) {
    nums.forEach(function (dt) { dt.querySelector('[data-count]').textContent = '0'; dt.classList.add('is-waiting'); });
    var nio = new IntersectionObserver(function (entries) {
      entries.filter(function (en) { return en.isIntersecting; }).forEach(function (en, i) {
        nio.unobserve(en.target);
        var dt = en.target, span = dt.querySelector('[data-count]');
        var target = parseInt(span.getAttribute('data-count'), 10);
        var delay = i * 140;   // a beat between rows that arrive together
        setTimeout(function () {
          dt.classList.remove('is-waiting'); dt.classList.add('is-popping');
          var t0 = performance.now();
          (function step(now) {
            var k = Math.min(1, (now - t0) / 1400);
            span.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(step);
          })(t0);
        }, delay);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (dt) { nio.observe(dt); });
  }

  // ------------------------------------------------------- hero motes --
  var motesCv = document.querySelector('.hero__motes'), M, motes = [];
  function initMotes() {
    M = fit(motesCv);
    var r = rng(7), n = phone ? 34 : 64;
    motes = [];
    for (var i = 0; i < n; i++) {
      motes.push({ x: r() * M.w, y: r() * M.h, z: 0.3 + r() * 0.7,
                   s: 0.5 + r() * 1.8, a: 0.18 + r() * 0.5, v: 4 + r() * 10, ph: r() * 6.3 });
    }
  }
  function drawMotes(dt, p) {
    var g = M.g; g.clearRect(0, 0, M.w, M.h);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      if (!reduce) { m.y -= m.v * m.z * dt; if (m.y < -10) m.y += M.h + 20; m.ph += dt * 0.6; }
      var x = m.x + Math.sin(m.ph) * 6 * m.z;
      var y = m.y - p * M.h * 0.3 * m.z;          // nearer motes outrun the page
      y = ((y % (M.h + 20)) + M.h + 20) % (M.h + 20) - 10;
      g.globalAlpha = m.a;
      var s = m.s * (0.6 + m.z);
      g.drawImage(sprite, x - s * 2, y - s * 2, s * 4, s * 4);
    }
    g.globalAlpha = 1;
  }

  // ---------------------------------------------- peak: the chalk clap --
  // Every particle position is a pure function of the act's progress, so the
  // burst plays forward and backward exactly with the visitor's hand.
  var chalkCv = document.querySelector('.peak__chalk'), C, puffs = [], specks = [];
  function initChalk() {
    C = fit(chalkCv);
    var r = rng(19), big = Math.max(C.w, C.h), small = Math.min(C.w, C.h);
    puffs = []; specks = [];
    var nP = phone ? 90 : 160, nS = phone ? 320 : 700;
    for (var i = 0; i < nP; i++) {
      var th = r() * Math.PI * 2, s = Math.sqrt(r());
      puffs.push({ dx: Math.cos(th), dy: Math.sin(th) * 0.8 - 0.12, d: s * big * 0.62,
                   jx: (r() - 0.5) * small * 0.22, jy: (r() - 0.5) * small * 0.16, side: r() < 0.5 ? -1 : 1,
                   r0: small * (0.07 + r() * 0.14), up: r(), ph: r() * 6.3,
                   f0: 0.14 + r() * 0.22, a: 0.5 + r() * 0.35 });
    }
    for (var j = 0; j < nS; j++) {
      var t2 = r() * Math.PI * 2;
      specks.push({ dx: Math.cos(t2), dy: Math.sin(t2) * 0.85 - 0.2, d: (0.25 + r()) * big * 0.62,
                    g: 0.4 + r() * 0.8, sz: 0.7 + r() * 2.1, f0: 0.3 + r() * 0.3, a: 0.55 + r() * 0.4 });
    }
  }
  var ptr = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
  if (fine && !reduce) {
    chalkCv.parentNode.addEventListener('pointermove', function (e) {
      var b = chalkCv.getBoundingClientRect(); ptr.tx = e.clientX - b.left; ptr.ty = e.clientY - b.top;
      if (ptr.x < -1e3) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
    });
    chalkCv.parentNode.addEventListener('pointerleave', function () { ptr.tx = ptr.ty = -1e4; });
  }
  function push(x, y, out) {                       // the cursor parts the dust
    var dx = x - ptr.x, dy = y - ptr.y, d = Math.sqrt(dx * dx + dy * dy), R = 190;
    if (d > R || d < 0.001) { out[0] = x; out[1] = y; return; }
    var k = (1 - d / R); k = k * k * 110;
    out[0] = x + dx / d * k; out[1] = y + dy / d * k;
  }
  var tmp = [0, 0];
  function drawChalk(p) {
    var g = C.g, W = C.w, H = C.h;
    g.clearRect(0, 0, W, H);
    var t = clamp01((p - 0.27) / 0.63);
    if (t <= 0 || t >= 1) return;
    var ox = W * 0.5, oy = H * 0.58;
    var e = (1 - Math.exp(-12 * t)) / (1 - Math.exp(-12));
    var clap = smooth(t / 0.035);

    for (var i = 0; i < puffs.length; i++) {
      var q = puffs[i];
      // each puff thins over its own window, so the cloud opens unevenly
      var a = q.a * clap * (1 - smooth((t - q.f0) / 0.26));
      if (a < 0.004) continue;
      // two hands clap: the dust leaves from either side of the grip
      var x = ox + q.side * W * 0.035 + q.jx * (0.3 + e) + q.dx * q.d * e + Math.sin(t * 3 + q.ph) * 24 * t;
      var y = oy + q.jy * (0.3 + e) + q.dy * q.d * e - t * H * 0.14 * q.up;
      push(x, y, tmp);
      var s = q.r0 * (0.25 + 2.6 * e + 0.9 * t);
      g.globalAlpha = a * 0.55;
      g.drawImage(shade, tmp[0] - s * 0.8, tmp[1] - s * 0.55, s * 2, s * 2);
      g.globalAlpha = a;
      g.drawImage(sprite, tmp[0] - s * 1.05, tmp[1] - s * 1.15, s * 2, s * 2);
    }
    // the clap itself: a brief whiteout the photo can arrive under
    var flash = smooth((t - 0.04) / 0.06) * (1 - smooth((t - 0.1) / 0.18));
    if (flash > 0.002) {
      g.globalAlpha = flash * 0.42; g.fillStyle = '#e9e5de'; g.fillRect(0, 0, W, H);
    }
    g.fillStyle = '#f4f1eb';
    for (var j = 0; j < specks.length; j++) {
      var k = specks[j];
      var a2 = k.a * clap * (1 - smooth((t - k.f0) / 0.32));
      if (a2 < 0.01) continue;
      var e2 = (1 - Math.exp(-6 * t)) / (1 - Math.exp(-6));
      var x2 = ox + k.dx * k.d * e2;
      var y2 = oy + k.dy * k.d * e2 + t * t * H * 0.3 * k.g;
      push(x2, y2, tmp);
      g.globalAlpha = a2;
      g.fillRect(tmp[0], tmp[1], k.sz, k.sz);
    }
    g.globalAlpha = 1;
  }

  // --------------------------------------------------------------- loop --
  var last = performance.now(), lastPeakP = -1;
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (hero.live && !reduce) drawMotes(dt, hero.p);
    if (peak.live) {
      var moved = Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 0.5;
      ptr.x += (ptr.tx - ptr.x) * 0.14; ptr.y += (ptr.ty - ptr.y) * 0.14;
      if (moved || peak.p !== lastPeakP) { drawChalk(peak.p); lastPeakP = peak.p; }
    }
    requestAnimationFrame(frame);
  }

  function setup() {
    measureRail(); layoutRoute(); initMotes(); initChalk();
    lastPeakP = -1;
    if (reduce) { drawMotes(0, 0); drawChalk(0.72); }   // one still frame of settled haze
  }
  setup();
  if (document.fonts) document.fonts.ready.then(function () { measureRail(); api.layout(); api.read(); });
  var rw = innerWidth;
  addEventListener('resize', function () {
    phone = matchMedia('(max-width: 860px)').matches;
    if (innerWidth !== rw || !phone) { rw = innerWidth; setup(); }
  });
  if (!reduce) requestAnimationFrame(frame);
})();
