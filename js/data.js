/* ============================================================
   Datos de ejemplo — SIGMA FOODS
   Todos los nombres de accionistas son ficticios.
   ============================================================ */

// ---- Formateadores ----
const fmtMoney = (n, dec = 2) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtNum = (n, dec = 0) => Number(n).toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtFactor = (n) => Number(n).toLocaleString('es-MX', { minimumFractionDigits: 8, maximumFractionDigits: 8 });

const DATA = {
  user: { nombre: 'Carlos Menéndez', rol: 'Operador', iniciales: 'CM', email: 'carlos.menendez@sigmafoods.com' },
  ambiente: 'QA',

  emisoras: [
    { id: '01', nombre: 'SIGMA FOODS', corto: 'SIGMA FOODS', activa: true },
    { id: '02', nombre: "HYLSAMEX 'B'", corto: 'HYLSAMEX', activa: true },
    { id: '05', nombre: 'ALPEK', corto: 'ALPEK', activa: true },
    { id: '06', nombre: 'NEMAK', corto: 'NEMAK', activa: true },
  ],

  emisiones: [
    { id: 'e1', emisora: '01', nombre: "T.D. Serie 'A' Junio-96", corto: 'TD A Jun-96', acciones: 1200000000, cuponIni: 1, cuponFin: 38, historica: true, vigente: false, fecha: '1996-06-01' },
    { id: 'e2', emisora: '01', nombre: "TD Cla I Ser 'A' Feb-04", corto: 'TD A Feb-04', acciones: 3800000000, cuponIni: 39, cuponFin: 40, vigente: false, fecha: '2004-02-01' },
    { id: 'e3', emisora: '01', nombre: "TD Cla I Ser 'A' Nov-23", corto: 'TD A Nov-23', acciones: 5200000000, cuponIni: 40, cuponFin: 41, vigente: false, fecha: '2023-11-01' },
    { id: 'e4', emisora: '01', nombre: "TD Cla I Ser 'A' Jun-25", corto: 'TD A Jun-25', acciones: 5450000000, cuponIni: 42, cuponFin: 43, vigente: false, fecha: '2025-06-01' },
    { id: 'e5', emisora: '01', nombre: "TD Cla I Ser 'A' Feb-26", corto: 'TD A Feb-26', acciones: 5543839944, cuponIni: 41, cuponFin: 52, vigente: true, fecha: '2026-02-01' },
  ],

  precioPorAccion: 13.00,

  cupones: [
    { num: 39, factor: 0.28000000, fecha: '2022-04-05', cuenta: 'CUFIN', liquidacion: '10139012', dividendo: 0.28, acumulado: false },
    { num: 40, factor: 0.30000000, fecha: '2023-04-10', cuenta: 'CUFIN', liquidacion: '10140021', dividendo: 0.30, acumulado: false },
    { num: 41, factor: 0.16692000, fecha: '2024-03-19', cuenta: 'CUFIN', liquidacion: '10141033', dividendo: 0.16692, acumulado: false },
    { num: 42, factor: 0.30538050, fecha: '2025-04-03', cuenta: 'CUFIN', liquidacion: '10142028', dividendo: 0.3053805, acumulado: false },
    { num: 43, factor: 0.31000000, fecha: '2025-09-15', cuenta: 'CUFIN', liquidacion: '10143014', dividendo: 0.31, acumulado: false },
    { num: 44, factor: 0.32500000, fecha: '2026-04-01', cuenta: 'CUFIN', liquidacion: '', dividendo: 0.325, acumulado: false, vigente: true },
  ],

  eventos: [
    { id: 'ev1', tipo: 'Split', desc: 'Split 1:1.35', factor: 1.35, fecha: '2001-05-14', anio: 2001, detalle: 'Cada acción se convirtió en 1.35 acciones.' },
    { id: 'ev2', tipo: 'Ampliación de capital', desc: 'Ampliación con certificados provisionales', fecha: '2012-08-22', anio: 2012, detalle: 'Se emitieron certificados provisionales por accionista.' },
  ],

  accionistas: [
    { id: 'a1', nombre: 'Rogelio Treviño Leal', rfc: 'TRLR580312H3', curp: 'TRLR580312HNLRLG08', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', domicilio: 'Av. Vasconcelos 1220, Col. Del Valle', marcador: null, alta: '1996-06-18', titulos: 1, acciones: 2450 },
    { id: 'a2', nombre: 'Estela Garza Villarreal', rfc: 'GAVE620711M4', curp: 'GAVE620711MNLRLS02', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'San Pedro Garza García', domicilio: 'Río Sena 340, Col. Del Valle', marcador: null, alta: '2004-03-02', titulos: 2, acciones: 18450 },
    { id: 'a3', nombre: 'María Fernanda Salinas Cantú', rfc: 'SACF880125K1', curp: 'SACF880125MNLLNR09', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', domicilio: 'Calzada del Valle 500, Col. Del Valle', marcador: null, alta: '2011-09-14', titulos: 1, acciones: 7200 },
    { id: 'a4', nombre: 'Jorge Alberto Elizondo Ríos', rfc: 'EIRJ750930P7', curp: 'EIRJ750930HNLLSR05', nacionalidad: 'Mexicana', pais: 'México', estado: 'Coahuila', ciudad: 'Saltillo', domicilio: 'Blvd. Venustiano Carranza 2200', marcador: null, alta: '2008-01-20', titulos: 3, acciones: 42300 },
    { id: 'a5', nombre: 'S.D. INDEVAL Institución para el Depósito de Valores', rfc: 'IND0509018F3', curp: '—', nacionalidad: 'Mexicana', pais: 'México', estado: 'Ciudad de México', ciudad: 'Ciudad de México', domicilio: 'Paseo de la Reforma 255, Cuauhtémoc', marcador: 'Indeval', alta: '2005-09-01', titulos: 148, acciones: 5321004000 },
  ],

  titulos: [
    { num: 17, emision: 'e1', emisionNombre: "T.D. Serie 'A' Junio-96", accionista: 'a1', accionistaNombre: 'Rogelio Treviño Leal', acciones: 2450, accIni: 45501, accFin: 47950, ultimoCupon: 38, estatus: 'Vigente', fecha: '1996-06-18', pendienteCanje: true },
    { num: 88, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a2', accionistaNombre: 'Estela Garza Villarreal', acciones: 18450, accIni: 120001, accFin: 138450, ultimoCupon: 43, estatus: 'Vigente', fecha: '2025-07-03', pendienteCanje: false },
    { num: 92, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a3', accionistaNombre: 'María Fernanda Salinas Cantú', acciones: 7200, accIni: 200001, accFin: 207200, ultimoCupon: 43, estatus: 'Vigente', fecha: '2025-08-11', pendienteCanje: false },
    { num: 45, emision: 'e2', emisionNombre: "TD Cla I Ser 'A' Feb-04", accionista: 'a4', accionistaNombre: 'Jorge Alberto Elizondo Ríos', acciones: 12800, accIni: 300001, accFin: 312800, ultimoCupon: 40, estatus: 'Vigente', fecha: '2008-01-20', pendienteCanje: true },
    { num: 46, emision: 'e3', emisionNombre: "TD Cla I Ser 'A' Nov-23", accionista: 'a4', accionistaNombre: 'Jorge Alberto Elizondo Ríos', acciones: 29500, accIni: 312801, accFin: 342300, ultimoCupon: 40, estatus: 'Vigente', fecha: '2023-11-30', pendienteCanje: true },
  ],

  // Contadores / folios
  folios: {
    proxCanje: 93,
    proxTitulo: 104,
    proxCheque: 5290,
    proxLiquidacion: '10144037',
    reglaLiquidacion: '1 + emisora(2) + cupón(2) + consecutivo(3)',
    folioTitulo: 104,
    folioCanje: 93,
    conversionAcciones: 1.00,
  },

  // Caso Don Rogelio — parámetros de cálculo del canje
  casoRogelio: {
    titulo: 17,
    accionesOriginales: 2450,
    splitFactor: 1.35,
    certificadoProvisional: 180,
    ultimoCuponCobrado: 38,
    // dividendos pendientes cupones 39-44
    dividendos: [
      { cupon: 39, factor: 0.28000000, importe: 976.36 },
      { cupon: 40, factor: 0.30000000, importe: 1046.10 },
      { cupon: 41, factor: 0.16692000, importe: 582.05 },
      { cupon: 42, factor: 0.30538050, importe: 1064.86 },
      { cupon: 43, factor: 0.31000000, importe: 1080.97 },
      { cupon: 44, factor: 0.32500000, importe: 1133.28 },
    ],
    totalDividendos: 5883.62,
    liquidacion: '10144037',
    cheque: 5290,
  },

  usuarios: [
    { nombre: 'Carlos Menéndez', email: 'carlos.menendez@sigmafoods.com', rol: 'Operador', origen: 'Entra ID', estado: 'Activo', ultimo: '29/09/2026 08:12' },
    { nombre: 'Ana Lucía Robles', email: 'ana.robles@sigmafoods.com', rol: 'Administrador', origen: 'Entra ID', estado: 'Activo', ultimo: '29/09/2026 07:40' },
    { nombre: 'Héctor Peña', email: 'hector.pena@sigmafoods.com', rol: 'Auditor', origen: 'Entra ID', estado: 'Activo', ultimo: '28/09/2026 18:20' },
    { nombre: 'Mónica Vela', email: 'monica.vela@sigmafoods.com', rol: 'Reporteador', origen: 'Entra ID', estado: 'Suspendido', ultimo: '15/09/2026 11:05' },
  ],

  tenants: [
    { dominio: 'sigmafoods.com', tenantId: '8f21c0d4-...-a91b', clientId: 'a03e9f11-...-77c2', credencial: 'Certificado', estado: 'Principal' },
    { dominio: 'alpek.com', tenantId: '2b90ee71-...-0d4a', clientId: 'f7a1c3b8-...-9e01', credencial: 'Certificado', estado: 'Activo' },
    { dominio: 'nemak.com', tenantId: 'c1d5a882-...-3f6e', clientId: '9c22b7d0-...-1a55', credencial: 'Secreto', estado: 'Activo' },
  ],

  bitacora: [], // se llena dinámicamente + semilla

  paises: ['México', 'Estados Unidos', 'España', 'Canadá'],
  estados: ['Nuevo León', 'Coahuila', 'Ciudad de México', 'Jalisco', 'Tamaulipas'],
  ciudades: ['Monterrey', 'San Pedro Garza García', 'Saltillo', 'Guadalajara', 'Ciudad de México'],
};

// Semilla de bitácora (histórica del sistema anterior + reciente)
DATA.bitacora = [
  { fecha: '29/09/2026 08:12:30', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Inicio de sesión', detalle: 'Autenticado con Microsoft Entra ID + MFA', folio: '—' },
  { fecha: '29/09/2026 08:15:02', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Impresión', detalle: 'Recibo de título nuevo · Título 103', folio: 'T-103' },
  { fecha: '28/09/2026 17:22:11', usuario: 'Ana Lucía Robles', emisora: '01 SIGMA FOODS', evento: 'Cambio de permisos', detalle: 'Rol Reporteador otorgado a Mónica Vela', folio: '—' },
  { fecha: '28/09/2026 12:04:55', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Canje', detalle: 'Canje 92 · Título 92 (María Fernanda Salinas Cantú)', folio: 'CJ-92' },
  { fecha: '28/09/2026 12:05:40', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Cheque', detalle: 'Cheque CH 5289 por dividendos', folio: 'CH-5289' },
  { fecha: '27/09/2026 09:31:00', usuario: 'Héctor Peña', emisora: '01 SIGMA FOODS', evento: 'Exportación', detalle: 'Reporte Registro de acciones (PDF)', folio: '—' },
];

// Reglas de cálculo (motor)
const CALC = {
  splitAndProvisional(originales, split, provisional) {
    const conSplit = originales * split;
    const total = conSplit + provisional;
    const enteras = Math.floor(total);
    const fraccion = +(total - enteras).toFixed(2);
    return { conSplit, total, enteras, fraccion };
  },
  folioLiquidacion(emisora, cupon, consecutivo) {
    return `1${String(emisora).padStart(2, '0')}${String(cupon).padStart(2, '0')}${String(consecutivo).padStart(3, '0')}`;
  },
};

// Estado global de UI (contexto de emisora, sesión)
const STATE = {
  emisoraActual: '01',
  autenticado: false,
  sidebarCollapsed: false,
  rolPuedeVerDatos: true, // controla máscaras
};

function emisoraById(id) { return DATA.emisoras.find(e => e.id === id); }
function emisionVigente(emisora = STATE.emisoraActual) { return DATA.emisiones.find(e => e.emisora === emisora && e.vigente); }
function emisionesDe(emisora = STATE.emisoraActual) { return DATA.emisiones.filter(e => e.emisora === emisora); }
