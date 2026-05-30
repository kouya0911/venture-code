// app.jsx — 全体の配線。言語切替・Tweaks(Hero3案 / アクセント色 / モーション)。

const TWEAK_DEFAULTS = {
  "mode": "light",
  "tone": "soft",
  "heroVariant": "terminal",
  "accent": "#5cc6f3",
  "motion": true
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)].join(", ");
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = React.useState(() => {
    try { return localStorage.getItem("vc_lang") || "ja"; } catch { return "ja"; }
  });

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent-base", t.accent);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(t.accent));
  }, [t.accent]);

  React.useEffect(() => {
    document.documentElement.dataset.tone = t.tone;
  }, [t.tone]);

  React.useEffect(() => {
    document.documentElement.dataset.mode = t.mode;
  }, [t.mode]);

  React.useEffect(() => {
    try { localStorage.setItem("vc_lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const c = window.CONTENT[lang];
  const toggleLang = () => setLang((l) => (l === "ja" ? "en" : "ja"));

  return (
    <React.Fragment>
      <Header c={c} lang={lang} onToggleLang={toggleLang} />
      <main>
        <Hero c={c} lang={lang} accent={t.accent} motion={t.motion} variant={t.heroVariant} mode={t.mode} />
        <Stance c={c} />
        <Services c={c} />
        <Flow c={c} />
        <Contact c={c} accent={t.accent} />
      </main>
      <Footer c={c} />

      <TweaksPanel>
        <TweakSection label="トーン" />
        <TweakRadio
          label="明るさ"
          value={t.mode}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          onChange={(v) => setTweak("mode", v)}
        />
        <TweakRadio
          label="全体の質感"
          value={t.tone}
          options={[{ value: "soft", label: "Soft" }, { value: "sharp", label: "Sharp" }]}
          onChange={(v) => setTweak("tone", v)}
        />
        <TweakSection label="ファーストビュー" />
        <TweakRadio
          label="Hero レイアウト"
          value={t.heroVariant}
          options={[{ value: "terminal", label: "Term" }, { value: "mega", label: "Mega" }, { value: "center", label: "Center" }]}
          onChange={(v) => setTweak("heroVariant", v)}
        />
        <TweakSection label="テーマ" />
        <TweakColor
          label="アクセント"
          value={t.accent}
          options={["#5cc6f3", "#54d6ac", "#9b8cff", "#ff9e7a"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakToggle label="背景アニメーション" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
