// V9 Social marketing media: deterministic timeline helpers.
// Each scene calls V9.run(seek, duration). seek(t) renders the frame at t seconds
// from scratch, so render.mjs can capture exact frames; in a normal browser the
// scene loops in real time for previewing.
window.V9 = (() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const back = (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  const lin = (t, a, b) => clamp((t - a) / (b - a));
  const p = (t, a, b) => ease(lin(t, a, b));
  const pop = (t, a, b) => back(lin(t, a, b));
  const typed = (s, t, a, b) => s.slice(0, Math.round(lin(t, a, b) * s.length));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const stage = () => $('.stage');

  // Targets inside a closed dropdown report an empty rect, which would snap the
  // pointer to the stage corner. Remember the last real box and keep using it.
  const rects = new Map();
  const center = (sel) => {
    let r = $(sel).getBoundingClientRect();
    if (!r.width && !r.height) r = rects.get(sel) || r;
    else rects.set(sel, r);
    const s = stage().getBoundingClientRect();
    return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2];
  };

  // keys: [[time, selector | [x, y]], ...]; clicks: [time, ...]
  const cursor = (t, keys, clicks = []) => {
    const pos = (k) => (Array.isArray(k) ? k : center(k));
    let x, y;
    if (t <= keys[0][0]) [x, y] = pos(keys[0][1]);
    else if (t >= keys[keys.length - 1][0]) [x, y] = pos(keys[keys.length - 1][1]);
    else {
      for (let i = 0; i < keys.length - 1; i++) {
        const [t0, a] = keys[i];
        const [t1, b] = keys[i + 1];
        if (t >= t0 && t <= t1) {
          const k = p(t, t0, t1);
          const A = pos(a), B = pos(b);
          x = A[0] + (B[0] - A[0]) * k;
          y = A[1] + (B[1] - A[1]) * k;
          break;
        }
      }
    }
    let scale = 1, ring = -1;
    for (const ct of clicks) {
      const d = t - ct;
      if (d > -0.08 && d < 0.1) scale = 0.82;
      if (d >= 0 && d < 0.45) ring = d / 0.45;
    }
    $('.cursor').style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    const r = $('.ripple');
    r.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.3 + Math.max(ring, 0) * 1.2})`;
    r.style.opacity = ring >= 0 ? String(0.6 * (1 - ring)) : '0';
  };

  // Fade in at the start and out at the end so the loop restarts cleanly.
  const loopFade = (t, duration, inLen = 0.35, outLen = 0.45) => {
    const f = $('.fade');
    if (!f) return;
    f.style.opacity = String(Math.max(1 - lin(t, 0, inLen), lin(t, duration - outLen, duration)));
  };

  const style = (sel, props) => {
    const els = typeof sel === 'string' ? $$(sel) : [sel];
    els.forEach((el) => Object.assign(el.style, props));
  };

  const run = (seek, duration) => {
    window.DURATION = duration;
    window.seek = seek;
    const params = new URLSearchParams(location.search);
    if (params.has('render')) {
      seek(Number(params.get('t') || 0));
      return;
    }
    const t0 = performance.now();
    const loop = () => {
      seek(((performance.now() - t0) / 1000) % duration);
      requestAnimationFrame(loop);
    };
    document.fonts.ready.then(loop);
  };

  return { clamp, ease, lin, p, pop, typed, $, $$, center, cursor, loopFade, style, run };
})();
