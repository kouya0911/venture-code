// sections.jsx — Venture Code セクション群
const { useState, useEffect, useRef } = React;

/* ---------- スクロールリビール ---------- */
function Reveal({ children, className = "", delay = 0, as = "div", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  const dcls = delay ? ` d${delay}` : "";
  return <Tag ref={ref} className={`reveal${dcls} ${seen ? "in" : ""} ${className}`} {...rest}>{children}</Tag>;
}

/* ---------- ロゴ ---------- */
function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Venture Code">
      <span className="logo-mark" aria-hidden="true"></span>
      <span className="logo-text"><b>VENTURE</b><span className="slash">/</span>CODE</span>
    </a>
  );
}

/* ===================================================== HEADER */
function Header({ c, lang, onToggleLang }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const n = c.nav;
  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap header-row">
        <Logo />
        <nav className="header-nav">
          <a href="#stance">{n.stance}</a>
          <a href="#services">{n.services}</a>
          <a href="#proof">{n.proof}</a>
          <a href="#flow">{n.flow}</a>
        </nav>
        <div className="header-tools">
          <button className="lang-toggle" onClick={onToggleLang} aria-label="switch language">
            {n.langLabel}
          </button>
          <a className="btn btn-accent" href="#contact">
            {n.cta}<span className="arr">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------- ターミナル・タイピング ---------- */
function Terminal({ title, lines }) {
  const parsed = lines.map((ln) => {
    if (ln.p !== undefined) return { prefix: `➜ ${ln.p} ~ `, text: ln.cmd, textClass: "cmd" };
    if (ln.ok !== undefined) return { prefix: "", text: ln.ok, textClass: "ok", lineClass: "ok" };
    return { prefix: "", text: ln.c, textClass: "", lineClass: "comment" };
  });
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) { setLi(parsed.length); setCi(0); return; }
    if (li >= parsed.length) return;
    const cur = parsed[li];
    if (ci < cur.text.length) {
      const t = setTimeout(() => setCi(ci + 1), 26 + Math.random() * 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLi(li + 1); setCi(0); }, 360);
      return () => clearTimeout(t);
    }
  }, [li, ci]);

  const done = li >= parsed.length;
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="tdot r"></span><span className="tdot y"></span><span className="tdot g"></span>
        <span className="ttitle">{title}</span>
      </div>
      <div className="terminal-body">
        {parsed.map((ln, idx) => {
          if (idx > li) return null;
          const typed = idx < li ? ln.text : ln.text.slice(0, ci);
          const showCaret = idx === li && !done;
          return (
            <div key={idx} className={`tline ${ln.lineClass || ""}`}>
              {ln.prefix &&
                <span>
                  <span className="tilde">➜</span>
                  <span className="prompt">{ln.prefix.replace("➜ ", " ").replace(/ ~ $/, "")}</span>
                  <span className="tilde"> ~ </span>
                </span>
              }
              <span className={ln.textClass}>{typed}</span>
              {showCaret && <span className="tcursor">▋</span>}
            </div>
          );
        })}
        {done && <div className="tline"><span className="tilde">➜</span><span className="prompt"> vc@venture-code </span><span className="tilde">~ </span><span className="tcursor">▋</span></div>}
      </div>
    </div>
  );
}

/* ---------- Hero 共通コピー ---------- */
function HeroCopy({ h, center }) {
  return (
    <div className={center ? "hero-center" : ""}>
      <div className="hero-status">
        <span className="chip"><span className="dot"></span>{h.status}</span>
      </div>
      <h1 className="hero-title">
        {h.title_lines.map((line, i) => {
          if (line.includes(h.title_accent)) {
            const [a, b] = line.split(h.title_accent);
            return <span key={i}>{a}<span className="accent">{h.title_accent}</span>{b}<br /></span>;
          }
          return <span key={i}>{line}<br /></span>;
        })}
      </h1>
      <p className="hero-sub">{h.sub}</p>
      <div className="hero-cta">
        <a className="btn btn-accent btn-lg" href="#contact">{h.cta_primary}<span className="arr">→</span></a>
        <a className="btn btn-ghost btn-lg" href="#services">{h.cta_secondary}</a>
      </div>
    </div>
  );
}

/* ===================================================== HERO */
function Hero({ c, lang, accent, motion, variant, mode }) {
  const h = c.hero;
  const facts = lang === "ja"
    ? ["完全無料 / ¥0", "数日で実装", "ノーリスク提案", "AI × 学生"]
    : ["100% free / $0", "Shipped in days", "No-risk offer", "AI × students"];

  return (
    <section className="hero" id="top">
      <TechBackground accent={accent} motion={motion} density="mid" mode={mode} />
      <div className="hero-fade"></div>
      <div className="hero-inner">
        <div className="wrap">
          {variant === "terminal" &&
            <div className="hero-split">
              <div><HeroCopy h={h} /></div>
              <div className="hero-terminal-wrap"><Terminal title={h.terminal_title} lines={h.terminal_lines} /></div>
            </div>
          }

          {variant === "mega" &&
            <div className="hero-mega">
              <span className="eyebrow">{h.eyebrow}</span>
              <p className="megaword">
                <span className="m-accent">{h.mega[0]}</span>{" "}
                <span className="m-out">{h.mega[1]}</span>{" "}
                <span>{h.mega[2]}</span>
              </p>
              <div className="mega-foot">
                <div style={{ maxWidth: "46ch" }}>
                  <h1 className="hero-title" style={{ fontSize: "clamp(22px,2.6vw,34px)", marginBottom: 18 }}>
                    {h.title_lines.map((line, i) => {
                      if (line.includes(h.title_accent)) {
                        const [a, b] = line.split(h.title_accent);
                        return <span key={i}>{a}<span className="accent">{h.title_accent}</span>{b}</span>;
                      }
                      return <span key={i}>{line}</span>;
                    })}
                  </h1>
                  <p className="hero-sub" style={{ marginBottom: 22 }}>{h.sub}</p>
                  <div className="hero-cta">
                    <a className="btn btn-accent btn-lg" href="#contact">{h.cta_primary}<span className="arr">→</span></a>
                    <a className="btn btn-ghost btn-lg" href="#services">{h.cta_secondary}</a>
                  </div>
                </div>
              </div>
            </div>
          }

          {variant === "center" && <HeroCopy h={h} center />}
        </div>
      </div>

      <div className="hero-ticker">
        <div className="wrap hero-ticker-row">
          {facts.map((f, i) =>
            <div className="tk" key={i}>
              <span className="v mono">{f}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== STANCE */
function renderLead(text) {
  const keys = ["打席", "at-bats"];
  let parts = [text];
  keys.forEach((k) => {
    parts = parts.flatMap((seg) =>
      typeof seg === "string" && seg.includes(k)
        ? seg.split(k).flatMap((s, i, arr) => i < arr.length - 1 ? [s, <span className="hl" key={k + i}>{k}</span>] : [s])
        : [seg]
    );
  });
  return parts;
}

function Stance({ c }) {
  const s = c.stance;
  return (
    <section className="section stance" id="stance">
      <div className="wrap">
        <div className="stance-grid">
          <div>
            <Reveal as="span" className="eyebrow-wrap">
              <span className="eyebrow">{s.eyebrow}</span>
            </Reveal>
            <Reveal><h2 className="section-title">{s.title}</h2></Reveal>
          </div>
          <div>
            <Reveal><p className="stance-lead">{renderLead(s.lead)}</p></Reveal>
            <Reveal delay={1} className="stance-body">
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>
          </div>
        </div>
        <div className="pillars">
          {s.pillars.map((p, i) =>
            <Reveal key={i} delay={i + 1} className="pillar">
              <span className="pk">{p.k}</span>
              <p className="pt">{p.t}</p>
              <p className="pd">{p.d}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== SERVICES + PROOF */
function highlightNums(text) {
  const re = /(\d[\d,]*件|\d[\d,]*\sdata entries|1,000)/g;
  const out = [];
  let last = 0, m, key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<span className="num" key={key++}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Services({ c }) {
  const s = c.services;
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <Reveal as="span"><span className="eyebrow">{s.eyebrow}</span></Reveal>
        <Reveal><h2 className="section-title">{s.title}</h2></Reveal>
        <Reveal delay={1}><p className="section-lead">{s.lead}</p></Reveal>

        <div className="svc-list" id="proof">
          {s.items.map((it, i) =>
            <Reveal key={i} className="svc">
              <div className="svc-no">{it.no}</div>
              <div className="svc-head">
                <span className="chip accent svc-tag">{it.tag}</span>
                <h3 className="svc-title">{it.title}</h3>
                <p className="svc-desc">{it.desc}</p>
              </div>
              <div className="proof">
                <span className="proof-label">{s.proof_label}</span>
                <p className="proof-text">{highlightNums(it.proof)}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== FLOW */
function Flow({ c }) {
  const f = c.flow;
  return (
    <section className="section flow" id="flow">
      <div className="wrap">
        <Reveal as="span"><span className="eyebrow">{f.eyebrow}</span></Reveal>
        <Reveal><h2 className="section-title">{f.title}</h2></Reveal>
        <Reveal delay={1}><p className="section-lead">{f.lead}</p></Reveal>
        <div className="flow-steps">
          {f.steps.map((st, i) =>
            <Reveal key={i} delay={i + 1} className="fstep">
              <div className="fno"><span>{st.no}</span><span className="fidx">{i + 1}</span></div>
              <h3 className="ft">{st.t}</h3>
              <p className="fd">{st.d}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== CONTACT */
function Contact({ c, accent }) {
  const ct = c.contact;

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-aside">
            <Reveal as="span"><span className="eyebrow">{ct.eyebrow}</span></Reveal>
            <Reveal><h2 className="section-title">{ct.title}</h2></Reveal>
            <Reveal delay={1}><p className="section-lead" style={{ marginBottom: 36 }}>{ct.lead}</p></Reveal>
            <Reveal delay={2}>
              <div className="ca-item">
                <span className="ca-k">EMAIL</span>
                <span className="ca-v"><a href="mailto:hello@venture-code.dev">hello@venture-code.dev</a></span>
              </div>
              <div className="ca-item">
                <span className="ca-k">{c.footer.sns_label}</span>
                <span className="ca-v"><a href="#">@venture.code</a> <span style={{ color: "var(--text-faint)" }}>(Instagram)</span></span>
              </div>
              <div className="ca-item">
                <span className="ca-k">COST</span>
                <span className="ca-v" style={{ color: "var(--accent)", fontFamily: "var(--mono)" }}>¥0 — 完全無料</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={1}>
            <div className="form-card">
              <div className="hs-form-frame" data-region="na2" data-form-id="63fdef18-2f5a-4892-bab8-537f48c7b342" data-portal-id="246346607"></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== FOOTER */
function Footer({ c }) {
  const f = c.footer;
  const n = c.nav;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tagline">{f.tagline}</p>
            <p className="footer-built">{f.built}</p>
          </div>
          <div className="footer-col">
            <h4>{f.nav_label}</h4>
            <a href="#stance">{n.stance}</a>
            <a href="#services">{n.services}</a>
            <a href="#flow">{n.flow}</a>
            <a href="#contact">{n.contact}</a>
          </div>
          <div className="footer-col">
            <h4>{f.contact_label}</h4>
            <a href="mailto:hello@venture-code.dev">hello@venture-code.dev</a>
            <a href="#">@venture.code</a>
            <span className="fc-line" style={{ color: "var(--accent)" }}>¥0 — 完全無料</span>
          </div>
        </div>
        <div className="footer-mark" aria-hidden="true">VENTURE/CODE</div>
        <div className="footer-bottom">
          <span className="copy">{f.copyright}</span>
          <span className="made"><span className="dot"></span>{f.built}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Reveal, Logo, Header, Hero, Terminal, HeroCopy, Stance, Services, Flow, Contact, Footer });
