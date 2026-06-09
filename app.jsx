/* App shell: navegación, topbar, rail de seguridad, ruteo por hash, persistencia */
const { useState: uS, useEffect: uE } = React;

const ROUTES = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "Inicio" },
  { id: "screening", label: "Ingreso y tamizaje", icon: "clipboard", group: "Flujo principal" },
  { id: "builder", label: "Constructor FITT-VP", icon: "steps", group: "Flujo principal" },
  { id: "populations", label: "Módulos de población", icon: "layers", group: "Flujo principal" },
  { id: "monitoring", label: "Monitoreo y RPE", icon: "gauge", group: "Herramientas" },
  { id: "handout", label: "Folleto familiar", icon: "family", group: "Herramientas" },
  { id: "export", label: "Exportar / imprimir", icon: "printer", group: "Herramientas" },
  { id: "references", label: "Referencias", icon: "book", group: "Información" },
  { id: "settings", label: "Configuración", icon: "settings", group: "Información" },
];

const SCREENS = {
  dashboard: "Dashboard", screening: "Screening", builder: "FITTBuilder", populations: "Populations",
  monitoring: "Monitoring", handout: "Handout", export: "Export", references: "References", settings: "Settings",
};

const SAMPLE_RECENTS = [
  { id: "r1", name: "M. P.", initials: "MP", age: 9, band: "child", goal: "Salud y MVPA", flag: false },
  { id: "r2", name: "Caso 2024-118", initials: "JT", age: 15, band: "teen", goal: "Reintegro deportivo", flag: false },
  { id: "r3", name: "L. R.", initials: "LR", age: 4, band: "pre", goal: "Juego activo", flag: false },
  { id: "r4", name: "Caso 2024-121", initials: "AS", age: 13, band: "teen", goal: "Manejo de peso", flag: true },
];

const DEFAULT_CASE = { name: "", age: "", sex: "", band: "child", height: "", weight: "", screening: {}, populations: [], goal: "", intensityMethod: "omni", notes: "" };

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}

function App() {
  const D = window.DATA;
  const [route, setRoute] = uS(() => (location.hash.replace("#", "") || "dashboard"));
  const [caseData, setCaseData] = uS(() => load("ena_case", DEFAULT_CASE));
  const [prof, setProfState] = uS(() => load("ena_prof", { name: "Dra. A. Morales", org: "Centro de Medicina del Deporte" }));
  const [navOpen, setNavOpen] = uS(false);
  const [toastMsg, setToastMsg] = uS(null);

  uE(() => { localStorage.setItem("ena_case", JSON.stringify(caseData)); }, [caseData]);
  uE(() => { localStorage.setItem("ena_prof", JSON.stringify(prof)); }, [prof]);
  uE(() => {
    const h = () => setRoute(location.hash.replace("#", "") || "dashboard");
    window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h);
  }, []);
  uE(() => { window.scrollTo(0, 0); setNavOpen(false); }, [route]);

  const go = r => { location.hash = r; setRoute(r); };
  const setCase = patch => setCaseData(c => ({ ...c, ...patch }));
  const setProf = patch => setProfState(p => ({ ...p, ...patch }));
  const toast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2200); };
  const startNewCase = () => { setCaseData(DEFAULT_CASE); go("screening"); toast("Nuevo caso iniciado"); };
  const openCase = c => { setCase({ name: c.name, age: c.age, band: c.band, goal: c.goal }); go("screening"); };
  const clearData = () => { if (confirm("¿Borrar todos los datos locales de este caso?")) { setCaseData(DEFAULT_CASE); toast("Datos borrados"); } };
  const setReferral = () => { toast("Caso marcado para derivación médica"); };

  // Banderas activas para el rail
  const answered = caseData.screening || {};
  const flags = [];
  D.screening.forEach(g => g.q.forEach(q => { if (answered[q.id]) flags.push({ ...q, group: g.group }); }));
  const activePops = D.populations.filter(p => (caseData.populations || []).includes(p.id));
  const activeContra = activePops.filter(p => p.gate || (p.contra && p.contra[0] && !p.contra[0].startsWith("Sin")));

  const ctx = { go, caseData, setCase, prof, setProf, toast, recents: SAMPLE_RECENTS, startNewCase, openCase, clearData, setReferral };
  const ScreenComp = window[SCREENS[route]] || window.Dashboard;

  // Mostrar rail en pantallas del flujo clínico
  const showRail = ["screening", "builder", "populations", "monitoring", "export"].includes(route);
  const curRoute = ROUTES.find(r => r.id === route) || ROUTES[0];

  // Agrupar nav
  const groups = [];
  ROUTES.forEach(r => { let g = groups.find(x => x.name === r.group); if (!g) { g = { name: r.group, items: [] }; groups.push(g); } g.items.push(r); });

  return (
    <div className={"app" + (showRail ? " has-rail" : "")}>
      {/* Sidebar */}
      <aside className={"sidebar" + (navOpen ? " open" : "")}>
        <div className="brand">
          <div className="brand-mark"><Icon name="dumbbell" size={20} style={{ color: "#fff" }} /></div>
          <div>
            <div className="brand-name">Ejercicio en niños<br />y adolescentes</div>
            <div className="brand-sub">Prescripción · FITT-VP</div>
          </div>
        </div>
        <nav className="nav">
          {groups.map(g => (
            <React.Fragment key={g.name}>
              <div className="nav-label">{g.name}</div>
              {g.items.map(r => (
                <button key={r.id} className={"nav-item" + (route === r.id ? " active" : "")} onClick={() => go(r.id)}>
                  <Icon name={r.icon} size={18} className="ic" />
                  {r.label}
                  {r.id === "populations" && activePops.length > 0 && <span className="nav-badge">{activePops.length}</span>}
                  {r.id === "screening" && flags.some(f => f.critical) && <span className="nav-badge danger">!</span>}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="sidebar-foot">
          Apoyo a la decisión · uso profesional.<br />Datos locales, offline-capable.
        </div>
      </aside>
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

      {/* Main */}
      <div className="main">
        <header className="topbar no-print">
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(true)} aria-label="Menú"><Icon name="menu" size={18} /></button>
          <div className="crumbs"><span>{curRoute.group}</span><Icon name="chevright" size={13} /><b>{curRoute.label}</b></div>
          <div className="topbar-spacer" />
          {(caseData.name || caseData.age) && (
            <div className="case-pill">
              <span className="avatar" style={{ background: D.ageBands.find(b => b.id === caseData.band).color }}>
                {(caseData.name || "·").slice(0, 2).toUpperCase()}
              </span>
              <span>{caseData.name || "Caso actual"} · <span className="mono">{caseData.age || "—"}a</span></span>
            </div>
          )}
          <Btn kind="primary" size="sm" icon="plus" onClick={startNewCase}>Nuevo caso</Btn>
        </header>

        <ScreenComp ctx={ctx} />
      </div>

      {/* Safety rail */}
      {showRail && (
        <aside className="rail no-print">
          <div className="rail-head">
            <Icon name="shield" size={18} style={{ color: flags.some(f => f.critical) ? "var(--danger)" : "var(--safe)" }} />
            <span className="t">Panel de seguridad</span>
          </div>
          <div className="rail-body">
            {flags.some(f => f.critical) && (
              <Banner kind="danger" icon="flag" title="Derivación requerida">Banderas críticas activas — no prescribir sin autorización.</Banner>
            )}
            <div className="rail-section">
              <div className="rt">Banderas del tamizaje</div>
              {flags.length === 0
                ? <div className="flag-item amber" style={{ background: "var(--safe-soft)", color: "var(--safe-ink)" }}><Icon name="check" size={15} className="fi-ic" />Sin banderas detectadas.</div>
                : flags.map((f, i) => (
                  <div key={i} className={"flag-item " + (f.critical ? "red" : "amber")} style={{ marginBottom: 6 }}>
                    <Icon name={f.critical ? "alert" : "info"} size={15} className="fi-ic" />{f.text}
                  </div>
                ))}
            </div>
            {activeContra.length > 0 && (
              <div className="rail-section">
                <div className="rt">Contraindicaciones activas</div>
                {activeContra.map(p => (
                  <div key={p.id} className="flag-item red" style={{ marginBottom: 6 }}>
                    <Icon name="x" size={15} className="fi-ic" /><span><b>{p.name}:</b> {p.contra[0]}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="rail-section">
              <div className="rt">Suspender la actividad si…</div>
              {D.stopSigns.slice(0, 4).map((s, i) => (
                <div key={i} className="flag-item amber" style={{ marginBottom: 6 }}><Icon name="alert" size={15} className="fi-ic" />{s}</div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 4, width: "100%" }} onClick={() => go("monitoring")}>Ver todas en Monitoreo</button>
            </div>
          </div>
        </aside>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="no-print" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--primary-700)", color: "#fff", padding: "12px 20px", borderRadius: 99, boxShadow: "var(--sh-pop)", fontSize: 13.5, fontWeight: 600, zIndex: 300 }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
