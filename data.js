/* =========================================================================
   Modelo de contenido clínico — paráfrasis de consenso público + ACSM 11/12.
   NO reproduce tablas/figuras/texto literal con copyright. Cifras inciertas
   se marcan con verify:true → etiqueta "verificar con fuente".
   ========================================================================= */
window.DATA = (function () {

  const SRC = {
    OMS:   { id: "OMS",  label: "OMS 2020", full: "OMS — Directrices sobre actividad física y comportamientos sedentarios (2020)" },
    USPA:  { id: "USPA", label: "US PA Guidelines", full: "U.S. Physical Activity Guidelines for Americans, 2.ª ed. (2018)" },
    ACSM:  { id: "ACSM", label: "ACSM 11/12", full: "ACSM Guidelines for Exercise Testing and Prescription, 11.ª–12.ª ed." },
    NSCA:  { id: "NSCA", label: "Posición fuerza juvenil", full: "Posición de consenso sobre entrenamiento de fuerza en jóvenes (NSCA / consenso internacional)" },
  };

  const ageBands = [
    { id: "pre",   range: "3–5",   label: "Preescolar",     color: "var(--age-pre)",   note: "Juego activo y habilidades motrices fundamentales." },
    { id: "child", range: "6–12",  label: "Niñez",          color: "var(--age-child)", note: "≥60 min/día de MVPA; fortalecimiento ≥3 d/sem." },
    { id: "teen",  range: "13–17", label: "Adolescencia",   color: "var(--age-teen)",  note: "Multideporte; ajustar por maduración (PHV)." },
  ];

  // ---- Marco general de consenso (base de la app) ----
  const framework = {
    child_teen: {
      title: "6–17 años",
      source: SRC.OMS,
      items: [
        "≥60 min/día de actividad moderada a vigorosa (MVPA), mayormente aeróbica.",
        "Actividad vigorosa ≥3 días/semana.",
        "Fortalecimiento muscular ≥3 días/semana.",
        "Fortalecimiento óseo ≥3 días/semana.",
      ],
    },
    preschool: {
      title: "3–5 años (preescolar)",
      source: SRC.OMS,
      items: [
        "Activos a lo largo del día, con variedad de intensidades.",
        "Énfasis en el juego y las habilidades motrices fundamentales.",
        "Al menos 180 min de actividad distribuida en el día.",
      ],
    },
    cross: {
      title: "Transversal",
      source: SRC.USPA,
      items: [
        "Reducir el tiempo sedentario y de pantallas recreativas.",
        "Priorizar el disfrute y la adherencia por encima del rendimiento.",
      ],
    },
  };

  // ---- Componentes FITT-VP (etiquetas para la matriz) ----
  const fittComponents = [
    { key: "F",  letter: "F", es: "Frecuencia",  name: "Frequency" },
    { key: "I",  letter: "I", es: "Intensidad",  name: "Intensity" },
    { key: "T1", letter: "T", es: "Tiempo",      name: "Time" },
    { key: "T2", letter: "T", es: "Tipo",        name: "Type" },
    { key: "V",  letter: "V", es: "Volumen",     name: "Volume" },
    { key: "P",  letter: "P", es: "Progresión",  name: "Progression" },
  ];

  // ---- FITT-VP por MODALIDAD (las tres dosis mínimas semanales) ----
  // Aeróbico (MVPA) · Fortalecimiento muscular (fuerza) · Fortalecimiento óseo (impacto)
  const fittTypes = [
    {
      id: "aerobic", name: "Aeróbico", sub: "MVPA", icon: "gauge", source: SRC.OMS,
      freq: "≥60 min/día · vigoroso ≥3 d/sem",
      v: {
        F:  "La mayoría de los días de la semana; actividad vigorosa ≥3 días/semana.",
        I:  "Moderada a vigorosa (OMNI ≈ 4–8 / talk test).",
        T1: "≥60 min/día de MVPA, acumulables en bloques a lo largo del día.",
        T2: "Juego activo, correr, nadar, ciclismo, deportes; multideporte en adolescentes.",
        V:  "Acumulación diaria de MVPA; priorizar disfrute y adherencia.",
        P:  "Aumentar duración y variedad gradualmente.",
      },
      verify: { I: true },
    },
    {
      id: "strength", name: "Fortalecimiento muscular", sub: "Fuerza", icon: "dumbbell", source: SRC.NSCA,
      freq: "≥3 d/sem · no consecutivos",
      v: {
        F:  "≥3 días/semana (2–3), en días no consecutivos.",
        I:  "Baja a moderada; peso corporal o cargas bajas. Evitar levantamientos máximos y test de 1RM en inmaduros.",
        T1: "Sesiones acotadas; técnica primero. Aprox. 1–3 series con repeticiones altas.",
        T2: "Peso corporal, bandas, trepar, empujar/traccionar, sentadillas asistidas, juegos de fuerza.",
        V:  "Técnica y dominio del movimiento antes que carga.",
        P:  "Aumentar repeticiones / complejidad antes que la carga.",
      },
      verify: { I: true, T1: true },
    },
    {
      id: "bone", name: "Fortalecimiento óseo", sub: "Impacto", icon: "shield", source: SRC.OMS,
      freq: "≥3 d/sem",
      v: {
        F:  "≥3 días/semana.",
        I:  "Actividades de impacto bien toleradas, apropiadas a la edad.",
        T1: "Integrado en el juego y dentro de la sesión.",
        T2: "Saltar, brincar, saltar la cuerda, correr, juegos de impacto.",
        V:  "Series cortas de saltos / impacto.",
        P:  "Progresar el volumen de impactos gradualmente.",
      },
      verify: {},
    },
  ];

  // Nota por banda para las modalidades
  const fittBandNote = {
    pre:   "En preescolar (3–5), la fuerza y el impacto óseo se desarrollan a través del JUEGO activo (trepar, saltar, brincar), no con entrenamiento estructurado.",
    child: "En la niñez (6–12), introducir fuerza con peso corporal y muchos juegos de impacto; énfasis en técnica y disfrute.",
    teen:  "En adolescencia (13–17), puede progresarse la fuerza con supervisión calificada; ajustar por maduración (PHV).",
  };

  // ---- FITT-VP pediátrico (visión general por componente) ----
  const fitt = [
    { letter: "F", key: "frequency", name: "Frequency", es: "Frecuencia",
      detail: "Aeróbico la mayoría de los días (vigoroso ≥3 d/sem). Fuerza 2–3 días no consecutivos. Flexibilidad/movilidad la mayoría de los días.",
      source: SRC.OMS },
    { letter: "I", key: "intensity", name: "Intensity", es: "Intensidad",
      detail: "Moderada a vigorosa. Métodos apropiados a la edad: escala OMNI de RPE (0–10) o pictórica, talk test. Usar %FCmáx con cautela: las fórmulas de FCmáx son menos fiables en jóvenes.",
      source: SRC.ACSM, verify: true },
    { letter: "T", key: "time", name: "Time", es: "Tiempo",
      detail: "≥60 min/día de MVPA, acumulables en bloques a lo largo del día. Sesiones de fuerza acotadas, con técnica primero.",
      source: SRC.OMS },
    { letter: "T", key: "type", name: "Type", es: "Tipo",
      detail: "Desarrollar y variar. Juego estructurado en menores; habilidades motrices fundamentales; multideporte en adolescentes; evitar especialización temprana.",
      source: SRC.USPA },
    { letter: "V", key: "volume", name: "Volume", es: "Volumen",
      detail: "Acumulación diaria de MVPA + dosis de fuerza/óseo semanal. Técnica y dominio del movimiento antes que carga.",
      source: SRC.ACSM, verify: true },
    { letter: "P", key: "progression", name: "Progression", es: "Progresión",
      detail: "Progresión gradual; ajustar por maduración biológica (PHV). Aumentar repeticiones/complejidad antes que carga; revaluar periódicamente.",
      source: SRC.NSCA },
  ];

  // ---- Métodos de intensidad apropiados a la edad ----
  const intensityMethods = [
    { id: "omni",  name: "Escala OMNI de RPE (0–10)", tag: "Recomendada", detail: "Esfuerzo percibido pictórico, validado en jóvenes. 0 = muy fácil, 10 = máximo.", recommended: true },
    { id: "talk",  name: "Talk test", tag: "Recomendada", detail: "Moderada: puede hablar pero no cantar. Vigorosa: pocas palabras sin pausa para respirar.", recommended: true },
    { id: "hrmax", name: "%FCmáx", tag: "Con cautela", detail: "Las fórmulas de FCmáx son menos fiables en jóvenes; usar solo como referencia secundaria.", caution: true },
  ];

  // ---- OMNI: descriptores por nivel (paráfrasis) ----
  const omniScale = [
    { v: 0, label: "Nada de esfuerzo", zone: "reposo" },
    { v: 1, label: "Muy, muy fácil", zone: "ligera" },
    { v: 2, label: "Muy fácil", zone: "ligera" },
    { v: 3, label: "Fácil", zone: "ligera" },
    { v: 4, label: "Algo fácil", zone: "moderada" },
    { v: 5, label: "Moderado", zone: "moderada" },
    { v: 6, label: "Algo difícil", zone: "moderada" },
    { v: 7, label: "Difícil", zone: "vigorosa" },
    { v: 8, label: "Muy difícil", zone: "vigorosa" },
    { v: 9, label: "Muy, muy difícil", zone: "vigorosa" },
    { v: 10, label: "Máximo", zone: "máxima" },
  ];

  // ---- Entrenamiento de fuerza en jóvenes ----
  const strengthYouth = {
    source: SRC.NSCA,
    points: [
      "Seguro y eficaz con diseño y supervisión adecuados (desmiente el mito de que «frena el crecimiento»).",
      "Requiere instrucción calificada y supervisión; técnica correcta antes de progresar carga.",
      "Comenzar con peso corporal / cargas bajas y más repeticiones.",
      "Evitar levantamientos máximos y test de 1RM en jóvenes inmaduros, salvo contexto muy controlado.",
      "2–3 días/semana, no consecutivos.",
    ],
  };

  // ---- Tamizaje pre-participación (PPE) ----
  const screening = [
    { group: "Cardiovascular", flag: true, q: [
      { id: "syncope", text: "Síncope o presíncope con el esfuerzo", critical: true },
      { id: "chestpain", text: "Dolor torácico durante el ejercicio", critical: true },
      { id: "palpit", text: "Palpitaciones o ritmo cardiaco irregular", critical: true },
      { id: "fam_scd", text: "Historia familiar de muerte súbita cardiaca (<50 años)", critical: true },
      { id: "murmur", text: "Soplo cardiaco no evaluado", critical: false },
    ]},
    { group: "Respiratorio", flag: true, q: [
      { id: "asthma", text: "Asma o síntomas respiratorios con el ejercicio", critical: false },
      { id: "wheeze", text: "Sibilancias / tos / dificultad para respirar al esforzarse", critical: false },
    ]},
    { group: "Musculoesquelético", flag: false, q: [
      { id: "injury", text: "Lesión actual o reciente que limite el movimiento", critical: false },
      { id: "pain", text: "Dolor articular u óseo persistente", critical: false },
    ]},
    { group: "Condiciones crónicas / medicación", flag: true, q: [
      { id: "chronic", text: "Condición crónica diagnosticada (ver módulos de población)", critical: false },
      { id: "meds", text: "Toma medicación que pueda afectar la respuesta al ejercicio", critical: false },
      { id: "seizure", text: "Antecedente de crisis convulsivas", critical: false },
    ]},
  ];

  // ---- Señales de alarma para suspender la actividad ----
  const stopSigns = [
    "Dolor torácico u opresión.",
    "Disnea desproporcionada al esfuerzo.",
    "Mareo, aturdimiento o síncope.",
    "Palpitaciones o ritmo irregular.",
    "Palidez, sudoración fría o náuseas marcadas.",
    "Dolor articular agudo o lesión.",
  ];

  // ---- Maduración y desarrollo ----
  const maturation = {
    phv: "Estimar el estadio de maduración biológica (pico de velocidad de crecimiento, PHV) y referenciar estadios de Tanner para individualizar la progresión en adolescentes.",
    thermo: "Los niños disipan el calor de forma distinta a los adultos: prevenir la enfermedad por calor e insistir en la hidratación.",
    psychosocial: "Autonomía, disfrute, competencia percibida y motivación son ejes centrales de la adherencia.",
  };

  // ---- Poblaciones clínicas pediátricas ----
  // Cada módulo: objetivos, modFITT, contra, stop, monitor, meds — citados; verify donde aplique.
  const populations = [
    {
      id: "obesity", name: "Sobrepeso / obesidad", icon: "scale", tone: "primary",
      summary: "Aumentar gasto y disfrute; proteger articulaciones; progresar gradualmente.",
      objetivos: ["Aumentar MVPA diaria y reducir sedentarismo.", "Mejorar composición corporal y aptitud cardiorrespiratoria.", "Construir hábitos disfrutables y sostenibles."],
      modFITT: ["Priorizar actividades de bajo impacto al inicio (caminar, nadar, ciclismo).", "Progresión gradual de duración antes que intensidad.", "Incluir fuerza 2–3 d/sem para masa magra."],
      contra: ["Sin contraindicaciones absolutas para actividad adaptada."],
      stop: ["Disnea desproporcionada.", "Dolor articular por sobrecarga."],
      monitor: ["Adherencia y disfrute.", "Carga articular y molestias.", "Tendencia de crecimiento."],
      meds: ["Revisar comorbilidades (apnea, prediabetes) según corresponda."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "asthma", name: "Asma / broncoconstricción por ejercicio", icon: "lungs", tone: "primary",
      summary: "El ejercicio es beneficioso; prevenir la broncoconstricción inducida.",
      objetivos: ["Mantener actividad regular sin desencadenar síntomas.", "Mejorar tolerancia al esfuerzo."],
      modFITT: ["Calentamiento prolongado y progresivo.", "Considerar intervalos frente a esfuerzo continuo intenso.", "Tener broncodilatador de rescate disponible."],
      contra: ["Asma no controlada o crisis activa: posponer y derivar."],
      stop: ["Sibilancias, tos persistente o dificultad respiratoria.", "Uso de rescate sin mejoría."],
      monitor: ["Síntomas pre/post.", "Uso de medicación de rescate.", "Desencadenantes ambientales (frío, polen)."],
      meds: ["Plan de uso de broncodilatador peri-ejercicio según indicación médica."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "t1dm", name: "Diabetes tipo 1", icon: "drop", tone: "caution",
      summary: "Manejo de glucosa peri-ejercicio; prevención de hipoglucemia.",
      objetivos: ["Actividad regular segura con buen control glucémico.", "Educar sobre ajuste de insulina/carbohidratos."],
      modFITT: ["Medir glucemia antes, durante (sesiones largas) y después.", "Disponer de carbohidratos de acción rápida.", "Atención a hipoglucemia tardía/nocturna."],
      contra: ["Glucemia muy elevada con cetosis: posponer.", "Hipoglucemia: corregir antes de iniciar."],
      stop: ["Síntomas de hipoglucemia (temblor, confusión, sudoración).", "Malestar marcado."],
      monitor: ["Glucemia peri-ejercicio.", "Patrón de respuesta por tipo/horario de actividad."],
      meds: ["Coordinar ajuste de insulina/ingesta con el equipo médico tratante."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "t2dm", name: "Diabetes tipo 2", icon: "drop", tone: "caution",
      summary: "Combinar aeróbico + fuerza; mejorar sensibilidad a la insulina.",
      objetivos: ["Mejorar control glucémico y composición corporal.", "Reducir sedentarismo."],
      modFITT: ["Aeróbico la mayoría de los días + fuerza 2–3 d/sem.", "Progresión gradual del volumen."],
      contra: ["Descompensación metabólica aguda: estabilizar primero."],
      stop: ["Síntomas de hipo/hiperglucemia.", "Disnea o mareo."],
      monitor: ["Glucemia y adherencia.", "Comorbilidades cardiovasculares."],
      meds: ["Revisar fármacos hipoglucemiantes y riesgo de hipoglucemia."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "cf", name: "Fibrosis quística", icon: "lungs", tone: "caution",
      summary: "El ejercicio favorece función pulmonar y aclaramiento; vigilar hidratación y sal.",
      objetivos: ["Mantener función pulmonar y capacidad aeróbica.", "Favorecer aclaramiento de secreciones."],
      modFITT: ["Combinar aeróbico, fuerza y movilidad torácica.", "Hidratación y reposición de sal, especialmente con calor."],
      contra: ["Exacerbación respiratoria aguda: ajustar/posponer."],
      stop: ["Desaturación, disnea marcada.", "Mareo o deshidratación."],
      monitor: ["SpO₂ si está indicado.", "Hidratación y pérdida de sal.", "Tolerancia al esfuerzo."],
      meds: ["Coordinar con el equipo de neumología."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "chd", name: "Cardiopatía congénita", icon: "heart", tone: "danger",
      summary: "Requiere estratificación y autorización cardiológica antes de prescribir.",
      objetivos: ["Actividad segura acorde al riesgo individual.", "Mantener aptitud sin sobrepasar límites."],
      modFITT: ["Definir intensidad y tipos permitidos SOLO según informe cardiológico.", "Evitar esfuerzos isométricos máximos salvo autorización."],
      contra: ["Sin autorización cardiológica vigente: NO prescribir.", "Lesiones de alto riesgo según especialista."],
      stop: ["Dolor torácico, síncope, palpitaciones, disnea desproporcionada."],
      monitor: ["Signos cardiovasculares.", "Seguimiento cardiológico programado."],
      meds: ["Según indicación del cardiólogo (p. ej. betabloqueantes)."],
      source: SRC.ACSM, verify: true, gate: true,
    },
    {
      id: "cp", name: "Parálisis cerebral / discapacidad física", icon: "accessible", tone: "primary",
      summary: "Individualizar por función motora; favorecer participación y movilidad.",
      objetivos: ["Mejorar fuerza, movilidad y participación.", "Prevenir desuso y contracturas."],
      modFITT: ["Adaptar tipo y postura según nivel funcional (p. ej. GMFCS).", "Combinar fuerza, aeróbico adaptado y movilidad."],
      contra: ["Sin contraindicaciones absolutas para actividad adaptada."],
      stop: ["Dolor, fatiga excesiva o espasticidad dolorosa."],
      monitor: ["Función motora y fatiga.", "Riesgo de caídas y seguridad del entorno."],
      meds: ["Considerar efectos de antiespásticos/anticonvulsivos."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "idd", name: "Discapacidad intelectual / del desarrollo", icon: "brain", tone: "primary",
      summary: "Instrucciones simples, rutinas y apoyos visuales; foco en disfrute.",
      objetivos: ["Aumentar actividad y habilidades motrices.", "Promover autonomía y participación social."],
      modFITT: ["Instrucciones claras, demostración y apoyos visuales.", "Rutinas predecibles; progresión por dominio."],
      contra: ["Considerar condiciones asociadas (p. ej. inestabilidad atloaxoidea en algunos síndromes)."],
      stop: ["Signos de malestar o sobrecarga."],
      monitor: ["Participación y motivación.", "Seguridad y comprensión de la tarea."],
      meds: ["Revisar medicación conductual y sus efectos."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "adhd", name: "TDAH y trastornos del comportamiento", icon: "brain", tone: "primary",
      summary: "La actividad física apoya atención y autorregulación; estructura y variedad.",
      objetivos: ["Aprovechar la actividad como apoyo de atención/conducta.", "Mejorar aptitud y bienestar."],
      modFITT: ["Sesiones estructuradas, dinámicas y variadas.", "Reglas claras y refuerzo positivo."],
      contra: ["Sin contraindicaciones específicas para actividad adaptada."],
      stop: ["Signos de agotamiento o desregulación marcada."],
      monitor: ["Atención, conducta y disfrute.", "Posibles efectos de estimulantes (FC, apetito)."],
      meds: ["Considerar efecto de estimulantes sobre frecuencia cardiaca."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "cancer", name: "Sobreviviente de cáncer pediátrico", icon: "shield", tone: "caution",
      summary: "El ejercicio es beneficioso; individualizar por secuelas del tratamiento.",
      objetivos: ["Recuperar/mantener aptitud y función.", "Mitigar fatiga y secuelas."],
      modFITT: ["Progresión muy gradual; ajustar por fatiga.", "Vigilar secuelas cardiotóxicas/musculoesqueléticas."],
      contra: ["Citopenias severas, fiebre o trombocitopenia marcada: ajustar/posponer."],
      stop: ["Fatiga desproporcionada, mareo, disnea, dolor."],
      monitor: ["Recuentos hematológicos según indicación.", "Función cardiaca si hubo cardiotóxicos."],
      meds: ["Coordinar con oncología (efectos tardíos del tratamiento)."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "epilepsy", name: "Epilepsia", icon: "brain", tone: "caution",
      summary: "El ejercicio suele ser seguro y recomendable; planificar el entorno.",
      objetivos: ["Mantener actividad regular con seguridad.", "Mejorar bienestar y aptitud."],
      modFITT: ["Preferir actividades con supervisión adecuada.", "Cautela con natación/altura: nunca en solitario."],
      contra: ["Crisis no controladas: cautela en actividades de riesgo (agua, altura)."],
      stop: ["Aura, signos prodrómicos o crisis: aplicar plan de emergencia."],
      monitor: ["Frecuencia de crisis y desencadenantes.", "Adherencia a la medicación."],
      meds: ["Considerar efectos de anticonvulsivos (fatiga, equilibrio)."],
      source: SRC.ACSM, verify: true,
    },
    {
      id: "htn", name: "Hipertensión", icon: "heart", tone: "caution",
      summary: "Poco frecuente en jóvenes; el ejercicio aeróbico ayuda al control.",
      objetivos: ["Apoyar el control de la presión arterial.", "Mejorar aptitud cardiovascular."],
      modFITT: ["Énfasis en aeróbico regular.", "Cautela con esfuerzos isométricos máximos / Valsalva."],
      contra: ["Hipertensión severa no controlada: estabilizar y derivar."],
      stop: ["Cefalea intensa, mareo, disnea desproporcionada."],
      monitor: ["Presión arterial periódica.", "Causas secundarias evaluadas por médico."],
      meds: ["Revisar antihipertensivos y su efecto en el ejercicio."],
      source: SRC.ACSM, verify: true,
    },
  ];

  // ---- Pruebas de aptitud apropiadas a la edad (descritas, no reproducidas) ----
  const fitnessTests = [
    { name: "Capacidad aeróbica", ex: "Carrera progresiva de ida y vuelta (tipo course-navette / PACER).", note: "Estima la aptitud cardiorrespiratoria." },
    { name: "Fuerza / resistencia muscular", ex: "Flexiones, abdominales o suspensión, según protocolo.", note: "Apropiado a la edad y madurez." },
    { name: "Flexibilidad", ex: "Sit-and-reach u observación de movilidad funcional.", note: "Complementario." },
    { name: "Composición corporal", ex: "IMC para la edad / perímetros, según contexto.", note: "Interpretar con percentiles pediátricos." },
  ];

  // ---- Referencias ----
  const references = [
    { tag: "OMS 2020", text: "Organización Mundial de la Salud. Directrices sobre actividad física y comportamientos sedentarios (2020).", kind: "Consenso" },
    { tag: "US PA Guidelines", text: "U.S. Department of Health and Human Services. Physical Activity Guidelines for Americans, 2.ª ed. (2018).", kind: "Consenso" },
    { tag: "ACSM 11/12", text: "American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription, 11.ª–12.ª ed.", kind: "Referencia clínica" },
    { tag: "Fuerza juvenil", text: "Posiciones de consenso sobre entrenamiento de fuerza en niños y adolescentes (p. ej. NSCA / consenso internacional).", kind: "Posición" },
  ];

  return {
    SRC, ageBands, framework, fitt, fittComponents, fittTypes, fittBandNote,
    intensityMethods, omniScale, strengthYouth,
    screening, stopSigns, maturation, populations, fitnessTests, references,
  };
})();
