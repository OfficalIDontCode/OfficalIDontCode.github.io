/* ============================================================================
   nsa.gov / IDontCode — script
   - WebGL: animated grid + scanline shader on the hero canvas
   - DOM: custom crosshair cursor, scroll-spy nav, paragraph reveals,
          hero parallax, live UTC clock
   - native scroll: no smooth-scroll lib (browser handles wheel/keys)
   ============================================================================ */

(() => {
  'use strict';

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------------
     2. data-reveal — fade/translate paragraphs on enter
     ----------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }

  /* -------------------------------------------------------------------------
     3. hud nav scroll-spy
     ----------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.hud-nav a[data-target]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(navLinks.map((a) => [a.dataset.target, a]));
    const targets = navLinks.map((a) => document.getElementById(a.dataset.target)).filter(Boolean);
    const visible = new Map();

    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.toggle('active', a.dataset.target === id));
    };

    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.intersectionRatio));
      let best = { id: null, r: -1 };
      visible.forEach((r, id) => { if (r > best.r) best = { id, r }; });
      if (best.id && map.has(best.id)) setActive(best.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    targets.forEach((t) => io2.observe(t));
  }

  /* -------------------------------------------------------------------------
     4. hero parallax — mouse-driven micro motion on display headline
     ----------------------------------------------------------------------- */
  const display = document.querySelector('.display');
  const hero = document.querySelector('.hero');
  if (display && hero && !reduceMotion) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let inside = false;

    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 .. 0.5
      const py = (e.clientY - r.top)  / r.height - 0.5;
      tx = px * 14;
      ty = py * 8;
      inside = true;
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; inside = false; });

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      display.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* -------------------------------------------------------------------------
     5. custom crosshair cursor
     ----------------------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (cursor && finePointer && !reduceMotion) {
    let mx = -100, my = -100, x = -100, y = -100;
    let raf = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    const loop = () => {
      x += (mx - x) * 0.30;
      y += (my - y) * 0.30;
      cursor.style.transform = `translate3d(${(x - 18).toFixed(1)}px, ${(y - 18).toFixed(1)}px, 0)`;
      if (Math.abs(mx - x) > 0.05 || Math.abs(my - y) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const hotSel = 'a, button, [role="button"], .chip, .cta, .frame, video, summary, label, input, textarea';
    document.addEventListener('mouseover', (e) => {
      const hot = e.target.closest(hotSel);
      cursor.classList.toggle('is-hot', !!hot);
    });
    document.addEventListener('mouseout', (e) => {
      const hot = e.target.closest(hotSel);
      if (hot) cursor.classList.remove('is-hot');
    });
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  /* -------------------------------------------------------------------------
     6. hex-footer live clock
     ----------------------------------------------------------------------- */
  const hexTime = document.getElementById('hex-time');
  if (hexTime) {
    const tick = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      hexTime.textContent = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* -------------------------------------------------------------------------
     7. WebGL background — animated grid + scanline drift
     fragment shader paints a slow-moving warped grid; subtle, fades from top.
     ----------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !reduceMotion) initGL(canvas);

  function initGL(c) {
    const gl = c.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false })
            || c.getContext('experimental-webgl');
    if (!gl) return;

    const VS = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const FS = `
      precision mediump float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;

      // hash + noise
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p  = uv * 2.0 - 1.0;
        p.x *= u_res.x / u_res.y;

        // warp by very slow noise
        float n = noise(p * 1.4 + u_time * 0.06);
        vec2 warped = p + (n - 0.5) * 0.10;

        // grid lines
        vec2 g = abs(fract(warped * 14.0) - 0.5);
        float line = smoothstep(0.48, 0.50, max(g.x, g.y));
        line = 1.0 - line;

        // mouse glow
        vec2 m = u_mouse * 2.0 - 1.0;
        m.x *= u_res.x / u_res.y;
        float md = length(p - m);
        float glow = smoothstep(0.9, 0.0, md) * 0.35;

        // scanlines (subtle horizontal moving stripe)
        float scan = 0.5 + 0.5 * sin((uv.y * u_res.y * 0.55) - u_time * 1.4);
        scan = pow(scan, 6.0) * 0.10;

        // vertical fade (brighter at top)
        float fade = smoothstep(1.0, -0.2, uv.y);

        // composite
        vec3 col = vec3(0.0);
        col += vec3(0.95, 0.24, 0.12) * line * 0.18 * fade;     // grid edges in signal red
        col += vec3(0.55, 0.55, 0.55) * line * 0.10 * fade;     // soft white edges
        col += vec3(0.95, 0.24, 0.12) * glow;                    // mouse halo
        col += vec3(0.18) * scan;                                // scanline

        // vignette
        float vig = smoothstep(1.6, 0.4, length(p));
        col *= vig;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // shader failed; bail silently
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: 0.5, y: 0.5 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth, h = window.innerHeight;
      c.width  = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width  = w + 'px';
      c.style.height = h + 'px';
      gl.viewport(0, 0, c.width, c.height);
    }
    window.addEventListener('resize', resize);
    resize();

    const t0 = performance.now();
    let running = true;
    let visible = true;

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
    });

    // pause when hero is offscreen — saves cycles
    const heroEl = document.querySelector('.hero');
    if (heroEl && 'IntersectionObserver' in window) {
      const io3 = new IntersectionObserver((entries) => {
        running = entries[0].isIntersecting;
      }, { threshold: 0.0 });
      io3.observe(heroEl);
    }

    function frame() {
      if (visible && running) {
        const t = (performance.now() - t0) / 1000;
        gl.uniform2f(uRes, c.width, c.height);
        gl.uniform1f(uTime, t);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
