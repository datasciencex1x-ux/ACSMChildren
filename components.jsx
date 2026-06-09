/* Componentes UI compartidos. Dependen de window.Icon y window.DATA. */
const { useState, useEffect, useRef } = React;

/* ---- Cita / evidencia con tooltip ---- */
function Cite({ source, verify }) {
  if (!source) return null;
  return (
    <span className={"cite tip " + (verify ? "verify" : "")}>
      <span className="dot" />
      {verify ? "verificar con fuente" : source.label}
      <span className="tip-pop">
        {verify
          ? "Recomendación específica: verificar con la fuente — " + source.full
          : source.full}
      </span>
    </span>
  );
}

/* ---- Banner de alerta ---- */
function Banner({ kind = "info", icon, title, children, action }) {
  const defIc = { danger: "alert", caution: "alert", safe: "checkcircle", info: "info", neutral: "info" }[kind];
  return (
    <div className={"banner " + kind} role={kind === "danger" ? "alert" : "note"}>
      <Icon name={icon || defIc} size={19} className="b-ic" />
      <div className="b-body">
        {title && <b style={{ display: "block", marginBottom: children ? 3 : 0 }}>{title}</b>}
        {children}
      </div>
      {action}
    </div>
  );
}

/* ---- Segmented control ---- */
function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented" role="tablist">
      {options.map(o => (
        <button key={o.value} role="tab" aria-selected={value === o.value}
          className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---- Chip seleccionable ---- */
function Chip({ on, onClick, children, removable }) {
  return (
    <button className={"chip " + (on ? "on" : "")} onClick={onClick} aria-pressed={!!on}>
      {children}
      {on && removable && <Icon name="x" size={13} className="x" />}
    </button>
  );
}

/* ---- Fila de opción (checkbox grande) ---- */
function OptRow({ on, onClick, label, sub, flag }) {
  return (
    <button className={"opt-row " + (on ? "on " : "") + (flag ? "flag" : "")} onClick={onClick}
      role="checkbox" aria-checked={!!on} style={{ width: "100%", textAlign: "left" }}>
      <span className="check">{on && <Icon name="check" size={15} stroke={3} style={{ color: "#fff" }} />}</span>
      <span style={{ flex: 1 }}>
        <span className="label" style={{ display: "block" }}>{label}</span>
        {sub && <span className="sub">{sub}</span>}
      </span>
      {flag && on && <span className="badge solid-danger">red flag</span>}
    </button>
  );
}

/* ---- Switch ---- */
function Switch({ on, onChange }) {
  return <button className={"switch " + (on ? "on" : "")} onClick={() => onChange(!on)} role="switch" aria-checked={!!on} />;
}

/* ---- Campo ---- */
function Field({ label, hint, children }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

/* ---- Stat tile ---- */
function Stat({ k, v, d, accent }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v" style={accent ? { color: accent } : null}>{v}</div>
      {d && <div className="d">{d}</div>}
    </div>
  );
}

/* ---- Stepper ---- */
function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={i} className={"step " + (i < current ? "done " : "") + (i === current ? "active" : "")}>
          <div className="node">
            <div className="dot">{i < current ? <Icon name="check" size={15} stroke={3} /> : i + 1}</div>
            <div className="lbl">{s}</div>
          </div>
          {i < steps.length - 1 && <div className="bar" />}
        </div>
      ))}
    </div>
  );
}

/* ---- Punto de banda etaria ---- */
function AgeDot({ band }) {
  const b = window.DATA.ageBands.find(x => x.id === band);
  if (!b) return null;
  return (
    <span className="row" style={{ gap: 7 }}>
      <span className="age-dot" style={{ background: b.color }} />
      <span style={{ fontSize: 13 }}>{b.label} · <span className="mono">{b.range}</span></span>
    </span>
  );
}

/* ---- Modal ---- */
function Modal({ open, onClose, title, children, footer, width }) {
  useEffect(() => {
    if (!open) return;
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade" onClick={e => e.stopPropagation()} style={width ? { maxWidth: width } : null} role="dialog" aria-modal="true">
        <div className="card-head between">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={18} /></button>
        </div>
        <div className="card-pad">{children}</div>
        {footer && <div className="card-head" style={{ borderBottom: "none", borderTop: "1px solid var(--line)", justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ---- Botón con icono ---- */
function Btn({ kind = "ghost", size, icon, iconRight, children, ...rest }) {
  const cls = "btn btn-" + kind + (size === "lg" ? " btn-lg" : size === "sm" ? " btn-sm" : "");
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} className="ic" />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 15 : 17} className="ic" />}
    </button>
  );
}

/* ---- Section header inside card ---- */
function CardHead({ icon, title, sub, right }) {
  return (
    <div className="card-head between">
      <div className="row" style={{ gap: 11 }}>
        {icon && <Icon name={icon} size={19} style={{ color: "var(--primary)" }} />}
        <div>
          <h3>{title}</h3>
          {sub && <div className="sub">{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { Cite, Banner, Segmented, Chip, OptRow, Switch, Field, Stat, Stepper, AgeDot, Modal, Btn, CardHead });
