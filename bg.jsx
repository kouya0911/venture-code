// bg.jsx — テック感のあるアニメ背景。グリッド + パーティクルネットワーク。
function TechBackground({ accent = "#22d3ff", density = "mid", motion = true, variant = "network", mode = "dark" }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H, dpr;
    const reduce = !motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isLight = mode === "light";
    let r, g, b;
    if (isLight) {
      r = 36; g = 40; b = 56;
    } else {
      const hex = accent.replace("#", "");
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    const rgb = (a) => `rgba(${r},${g},${b},${a})`;
    const k = isLight ? 1.5 : 1;

    const countMap = { low: 36, mid: 60, high: 90 };
    let N = countMap[density] || 60;
    let pts = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      N = Math.round((countMap[density] || 60) * Math.min(1.2, (W * H) / (1280 * 720)));
      seed();
    }

    function seed() {
      pts = [];
      for (let i = 0; i < N; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          z: Math.random() * 0.7 + 0.3,
        });
      }
    }

    const GRID = 46;
    let t = 0;

    function drawGrid() {
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgb(0.045 * k);
      const off = reduce ? 0 : (t * 0.25) % GRID;
      ctx.beginPath();
      for (let x = -GRID + off; x < W + GRID; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = -GRID + off; y < H + GRID; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
    }

    function frame() {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      drawGrid();

      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
        }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
      }

      const maxD = 130;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const bb = pts[j];
          const dx = a.x - bb.x;
          const dy = a.y - bb.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const o = (1 - d / maxD) * 0.16 * k;
            ctx.strokeStyle = rgb(o);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bb.x, bb.y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const s = p.z * 1.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fillStyle = rgb((0.35 * p.z + 0.15) * k);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    if (reduce) frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [accent, density, motion, variant, mode]);

  return <canvas ref={ref} className="tech-bg" aria-hidden="true" />;
}

window.TechBackground = TechBackground;
