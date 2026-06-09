# CLAUDE.md — Handoff: «Ejercicio en niños y adolescentes»

> App de **apoyo a la decisión** para tamizar, prescribir y monitorizar ejercicio en
> niños y adolescentes (formato **FITT-VP**), basada en **ACSM 11.ª/12.ª ed.**, **OMS 2020**
> y **US Physical Activity Guidelines 2.ª ed.**

Este repositorio contiene un **prototipo de alta fidelidad funcional** (HTML + React vía Babel,
sin paso de build) que define el **sistema de diseño, la arquitectura de información y todos los flujos**.
Úsalo como **fuente de verdad visual y funcional** para construir la app de producción en **React + Vite**.

---

## 1. Qué hay aquí

```
app/
├── index.html              # Punto de entrada del prototipo (carga todo por <script>)
├── styles.css              # Sistema de diseño completo: tokens (oklch), componentes, impresión, responsive
├── data.js                 # Modelo de contenido clínico (window.DATA) — paráfrasis + citas + flags "verificar"
├── icons.jsx               # Set de iconos line-style (<Icon name=… />)
├── components.jsx          # Primitivos UI: Banner, Cite, Chip, OptRow, Stepper, Segmented, Switch, Modal, Btn…
├── app.jsx                 # Shell: sidebar, topbar, rail de seguridad, ruteo por hash, estado + localStorage
├── screens/
│   ├── Dashboard.jsx       # Inicio: KPIs, casos recientes, marco de consenso, accesos rápidos
│   ├── Screening.jsx       # Ingreso + PPE + COMPUERTA de derivación (bloquea ante banderas críticas)
│   ├── FITTBuilder.jsx     # Constructor FITT-VP (stepper de 4 pasos) + resumen reutilizable
│   ├── Populations.jsx     # 12 módulos de población (chips + detalle) que inyectan modificaciones
│   ├── Monitoring.jsx      # Escala OMNI interactiva (0–10), talk test, señales para suspender
│   ├── Handout.jsx         # Folleto familiar/escolar en lenguaje sencillo (imprimible)
│   ├── Export.jsx          # Prescripción profesional imprimible (PDF vía print) + opciones de export
│   └── References.jsx      # Referencias + descargos + maduración + fuerza juvenil + Configuración
└── docs/
    └── super-prompt.md     # Especificación original completa (requisitos de producto)
```

Para verlo: abre `app/index.html` en un navegador (requiere conexión la primera vez para React/Babel/fuentes desde CDN).

---

## 2. Objetivo del trabajo de producción

Reescribir el prototipo como app **React + Vite, 100% client-side**, conservando 1:1 el diseño y los flujos:

- **Stack:** React + Vite, TypeScript recomendado, sin backend.
- **Estado + persistencia:** `localStorage` (el prototipo ya usa las claves `ena_case` y `ena_prof`).
- **Offline-capable:** degradación elegante de fuentes; considerar PWA / service worker.
- **Exportación PDF:** impresión del navegador con la hoja de estilo de impresión ya definida en `styles.css` (`@media print`).
- **Despliegue:** Netlify (arrastrar `dist/`, sin configuración de servidor).
- **Accesibilidad:** WCAG 2.1 AA — navegación por teclado, foco visible, objetivos táctiles ≥44px, contraste suficiente.
- **Responsive real:** escritorio (sidebar + rail) y tablet (sidebar colapsable, rail oculto) — breakpoints en `styles.css`.

### Migración sugerida
1. `npm create vite@latest` (plantilla react-ts).
2. Mover `styles.css` tal cual a `src/` (los tokens son CSS variables, funcionan sin cambios).
3. Convertir `data.js` → `src/data.ts` exportando tipos + datos (en vez de `window.DATA`).
4. Convertir cada `screens/*.jsx` y `components.jsx` a módulos ES con `import/export` (eliminar el patrón `window.X = X`).
5. Reemplazar el ruteo por hash casero por `react-router` (o mantener hash routing si se prefiere simplicidad).
6. Sustituir Babel-en-navegador por el build de Vite.

---

## 3. Sistema de diseño (resumen)

- **Tipografía:** IBM Plex Sans (UI) · IBM Plex Mono (valores/datos numéricos).
- **Color:** base neutra clara (oklch desaturado); **primario** azul-teal profundo; **verde** seguro/proceder;
  **ámbar** precaución; **rojo** contraindicación/red flag. Bandas etarias: violeta (3–5), azul (6–12), verde (13–17).
- **Componentes clave:** tarjetas, tablas de datos legibles, segmented controls, **stepper**, **chips** de población,
  **banners** de alerta, **badges de cita/evidencia** (`<Cite>`), **rail de seguridad** persistente.
- Todos los tokens viven como variables CSS en `:root` dentro de `styles.css`. No inventar colores nuevos: usar los tokens.

---

## 4. Reglas clínicas y de contenido (NO negociables)

> Heredadas de `docs/super-prompt.md`. Mantenerlas en producción.

1. **Es apoyo a la decisión, no diagnóstico ni piloto automático.** El profesional decide; la app sugiere y advierte.
   Disclaimer permanente visible.
2. **Compuerta de derivación:** ante banderas críticas en el tamizaje (síncope/dolor torácico/palpitaciones con esfuerzo,
   historia familiar de muerte súbita), **bloquear la prescripción directa** y exigir autorización médica.
   La lógica vive en `Screening.jsx` (campo `critical` por pregunta).
3. **Trazabilidad:** cada bloque clínico muestra su **fuente** (`<Cite source=… />`). Las recomendaciones específicas
   inciertas se marcan **"verificar con fuente"** (`verify` en `data.js`). **Ninguna cifra clínica inventada.**
4. **Copyright:** **parafrasear siempre**; nunca reproducir tablas, figuras ni texto literal de ACSM u otras fuentes.
5. **Privacidad:** todo local; no enviar datos personales fuera del dispositivo; ofrecer borrado de datos.
6. **Seguridad siempre visible:** red flags y contraindicaciones activas en el rail persistente; señales para suspender el ejercicio.

### Dónde editar el contenido clínico
- `data.js` centraliza TODO: marco de consenso, FITT-VP, métodos de intensidad, escala OMNI, tamizaje (PPE),
  señales para suspender, maduración, **12 módulos de población** (objetivos, modFITT, contraindicaciones, señales para
  detener, monitoreo, notas de medicación, fuente y flag `verify`), pruebas de aptitud y referencias.
- Antes de uso clínico real: un profesional debe **validar y completar** todos los campos marcados `verify: true`
  contra ACSM 11.ª/12.ª ed.

---

## 5. Criterios de aceptación (del super-prompt)

- [x] Tamizaje con compuerta de derivación que bloquea ante banderas críticas.
- [x] Constructor FITT-VP por banda etaria con método de intensidad apropiado a la edad.
- [x] 12 módulos de población con modificaciones, contraindicaciones y monitoreo (citados).
- [x] Panel/rail de seguridad persistente con red flags activas.
- [x] Exportación PDF profesional + folleto familiar con estilos de impresión.
- [x] Sección de referencias y etiquetas "verificar con fuente".
- [x] Responsive (escritorio + tablet), persistencia en localStorage.
- [x] Cero contenido con copyright reproducido literalmente.
- [ ] **Pendiente para producción:** auditoría AA formal, validación clínica de los campos `verify`, PWA/offline, tests.

---

## 6. Notas de implementación del prototipo

- Cada `<script type="text/babel">` se transpila por separado; los componentes se publican en `window` para compartirse.
  En producción esto se reemplaza por `import/export` ES.
- El estado del caso (`caseData`) y del profesional (`prof`) se sincroniza a `localStorage` en `app.jsx`.
- El ruteo es por `location.hash` (`#dashboard`, `#screening`, `#builder`, …).
- La hoja de impresión (`@media print` en `styles.css`) oculta navegación/rail y deja solo la hoja imprimible.
