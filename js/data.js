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

  // Emisiones de SIGMA FOODS, cupones sin traslapes (Bloque 1).
  // cuponFin puede ser 'Abierto' en la emisión vigente.
  emisiones: [
    { id: 'e1', emisora: '01', nombre: "T.D. Serie 'A' Junio-96", corto: 'TD A Jun-96', acciones: 1200000000, cuponIni: 1, cuponFin: 18, historica: true, vigente: false, fecha: '1996-06-01' },
    { id: 'e2', emisora: '01', nombre: "TD Cla I Ser 'A' Feb-04", corto: 'TD A Feb-04', acciones: 3800000000, cuponIni: 19, cuponFin: 38, vigente: false, fecha: '2004-02-01' },
    { id: 'e3', emisora: '01', nombre: "TD Cla I Ser 'A' Nov-23", corto: 'TD A Nov-23', acciones: 5200000000, cuponIni: 39, cuponFin: 41, vigente: false, fecha: '2023-11-01' },
    { id: 'e4', emisora: '01', nombre: "TD Cla I Ser 'A' Jun-25", corto: 'TD A Jun-25', acciones: 5450000000, cuponIni: 42, cuponFin: 42, vigente: false, fecha: '2025-06-01' },
    { id: 'e5', emisora: '01', nombre: "TD Cla I Ser 'A' Feb-26", corto: 'TD A Feb-26', acciones: 5543839944, cuponIni: 43, cuponFin: 'Abierto', cuponActual: 44, vigente: true, fecha: '2026-02-01' },
  ],

  precioPorAccion: 13.00,

  cupones: [
    { num: 39, factor: 0.28000000, fecha: '2024-03-15', cuenta: 'CUFIN', folioIni: '10139001', liquidacion: '10139028', acumulado: 28, dividendo: 0.28 },
    { num: 40, factor: 0.30000000, fecha: '2024-09-20', cuenta: 'CUFIN', folioIni: '10140001', liquidacion: '10140031', acumulado: 31, dividendo: 0.30 },
    { num: 41, factor: 0.16692000, fecha: '2025-04-03', cuenta: 'CUFIN', folioIni: '10141001', liquidacion: '10141026', acumulado: 26, dividendo: 0.16692 },
    { num: 42, factor: 0.30538050, fecha: '2025-09-18', cuenta: 'CUFIN', folioIni: '10142001', liquidacion: '10142029', acumulado: 29, dividendo: 0.3053805 },
    { num: 43, factor: 0.31000000, fecha: '2026-03-12', cuenta: 'CUFIN', folioIni: '10143001', liquidacion: '10143022', acumulado: 22, dividendo: 0.31 },
    { num: 44, factor: 0.32500000, fecha: '2026-09-15', cuenta: 'CUFIN', folioIni: '10144001', liquidacion: '10144037', acumulado: 37, dividendo: 0.325, vigente: true },
  ],

  eventos: [
    { id: 'ev1', tipo: 'Split', desc: 'Split 1:1.35', factor: 1.35, fecha: '2001-05-14', anio: 2001, detalle: 'Cada acción se convirtió en 1.35 acciones.' },
    { id: 'ev2', tipo: 'Ampliación de capital', desc: 'Ampliación con certificados provisionales', fecha: '2012-08-22', anio: 2012, detalle: 'Se emitieron certificados provisionales por accionista.' },
  ],

  accionistas: [
    { id: 'a1', nombre: 'Rogelio Treviño Leal', rfc: 'TRLR580312H3', curp: 'TRLR580312HNLRLG08', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', domicilio: 'Av. Vasconcelos 1220, Col. Del Valle', telefono: '81 8340 1122', email: 'rogelio.trevino@correo.com', marcador: null, alta: '1996-06-18', titulos: 2, acciones: 3487 },
    { id: 'a2', nombre: 'Estela Garza Villarreal', rfc: 'GAVE620711M4', curp: 'GAVE620711MNLRLS02', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'San Pedro Garza García', domicilio: 'Río Sena 340, Col. Del Valle', telefono: '81 8100 5566', email: 'estela.garza@correo.com', marcador: null, alta: '2004-03-02', titulos: 2, acciones: 12000 },
    { id: 'a3', nombre: 'María Fernanda Salinas Cantú', rfc: 'SACF880125K1', curp: 'SACF880125MNLLNR09', nacionalidad: 'Mexicana', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', domicilio: 'Calzada del Valle 500, Col. Del Valle', telefono: '81 8288 7788', email: 'mf.salinas@correo.com', marcador: null, alta: '2026-09-30', titulos: 1, acciones: 5000 },
    { id: 'a4', nombre: 'Jorge Alberto Elizondo Ríos', rfc: 'EIRJ750930P7', curp: 'EIRJ750930HNLLSR05', nacionalidad: 'Mexicana', pais: 'México', estado: 'Coahuila', ciudad: 'Saltillo', domicilio: 'Blvd. Venustiano Carranza 2200', telefono: '844 412 3344', email: 'jorge.elizondo@correo.com', marcador: null, alta: '2008-01-20', titulos: 2, acciones: 42300 },
    { id: 'a5', nombre: 'S.D. INDEVAL Institución para el Depósito de Valores', rfc: 'IND0509018F3', curp: '—', nacionalidad: 'Mexicana', pais: 'México', estado: 'Ciudad de México', ciudad: 'Ciudad de México', domicilio: 'Paseo de la Reforma 255, Cuauhtémoc', telefono: '55 5342 9000', email: 'contacto@indeval.com.mx', marcador: 'Indeval', alta: '2005-09-01', titulos: 148, acciones: 5321004000 },
  ],

  // Títulos tras los movimientos de hoy (30/09/2026).
  titulos: [
    { num: 17, emision: 'e1', emisionNombre: "T.D. Serie 'A' Junio-96", accionista: 'a1', accionistaNombre: 'Rogelio Treviño Leal', acciones: 2450, accIni: 45501, accFin: 47950, ultimoCupon: 38, estatus: 'Canjeado', fecha: '1996-06-18', pendienteCanje: false },
    { num: 103, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a3', accionistaNombre: 'María Fernanda Salinas Cantú', acciones: 5000, accIni: 5321037151, accFin: 5321042150, ultimoCupon: 44, estatus: 'Vigente', fecha: '2026-09-30', pendienteCanje: false },
    { num: 104, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a1', accionistaNombre: 'Rogelio Treviño Leal', acciones: 2000, accIni: 5321042151, accFin: 5321044150, ultimoCupon: 44, estatus: 'Vigente', fecha: '2026-09-30', pendienteCanje: false },
    { num: 105, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a1', accionistaNombre: 'Rogelio Treviño Leal', acciones: 1487, accIni: 5321044151, accFin: 5321045637, ultimoCupon: 44, estatus: 'Vigente', fecha: '2026-09-30', pendienteCanje: false },
    { num: 106, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a2', accionistaNombre: 'Estela Garza Villarreal', acciones: 7000, accIni: 5321045638, accFin: 5321052637, ultimoCupon: 44, estatus: 'Vigente', fecha: '2026-09-30', pendienteCanje: false },
    { num: 107, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a2', accionistaNombre: 'Estela Garza Villarreal', acciones: 5000, accIni: 5321052638, accFin: 5321057637, ultimoCupon: 44, estatus: 'Vigente', fecha: '2026-09-30', pendienteCanje: false },
    { num: 88, emision: 'e5', emisionNombre: "TD Cla I Ser 'A' Feb-26", accionista: 'a2', accionistaNombre: 'Estela Garza Villarreal', acciones: 12000, accIni: 5321033638, accFin: 5321045637, ultimoCupon: 44, estatus: 'Anulado', fecha: '2026-02-15', pendienteCanje: false },
    { num: 45, emision: 'e3', emisionNombre: "TD Cla I Ser 'A' Nov-23", accionista: 'a4', accionistaNombre: 'Jorge Alberto Elizondo Ríos', acciones: 12800, accIni: 300001, accFin: 312800, ultimoCupon: 40, estatus: 'Vigente', fecha: '2023-11-30', pendienteCanje: true },
    { num: 46, emision: 'e3', emisionNombre: "TD Cla I Ser 'A' Nov-23", accionista: 'a4', accionistaNombre: 'Jorge Alberto Elizondo Ríos', acciones: 29500, accIni: 312801, accFin: 342300, ultimoCupon: 40, estatus: 'Vigente', fecha: '2023-11-30', pendienteCanje: true },
  ],

  // Contadores / folios
  folios: {
    proxCanje: 94,
    canjeHoy: 93,
    proxTitulo: 108,
    proxCheque: 5291,
    chequeHoy: 5290,
    proxLiquidacion: '10144038',
    liquidacionInicial: '10144001',
    liquidacionHoy: '10144037',
    reglaLiquidacion: '1 + emisora(2) + cupón(2) + consecutivo(3)',
    folioTitulo: 108,
    folioCanje: 94,
    conversionAcciones: 1.00,
  },

  // Caso Don Rogelio — parámetros de cálculo del canje 93
  casoRogelio: {
    titulo: 17,
    accionesOriginales: 2450,
    splitFactor: 1.35,
    certificadoProvisional: 180,
    ultimoCuponCobrado: 38,
    // dividendos pendientes cupones 39-44 (base 3,487 acciones)
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
    fraccion: 0.50,
    fraccionImporte: 6.50,
    canje: 93,
    titulosDestino: [{ titulo: 104, acciones: 2000 }, { titulo: 105, acciones: 1487 }],
  },

  usuarios: [
    { nombre: 'Carlos Menéndez', email: 'carlos.menendez@sigmafoods.com', rol: 'Operador', origen: 'Entra ID', estado: 'Activo', ultimo: '30/09/2026 08:40', accesos: { '01': 'Operador' } },
    { nombre: 'Ana Lucía Robles', email: 'ana.robles@sigmafoods.com', rol: 'Administrador', origen: 'Entra ID', estado: 'Activo', ultimo: '30/09/2026 07:40', accesos: { '01': 'Administrador', '02': 'Administrador', '05': 'Administrador', '06': 'Administrador' } },
    { nombre: 'Héctor Peña', email: 'hector.pena@sigmafoods.com', rol: 'Auditor', origen: 'Entra ID', estado: 'Activo', ultimo: '29/09/2026 18:20', accesos: { '01': 'Auditor', '02': 'Auditor' } },
    { nombre: 'Mónica Vela', email: 'monica.vela@sigmafoods.com', rol: 'Reporteador', origen: 'Entra ID', estado: 'Suspendido', ultimo: '14/09/2026 11:05', accesos: { '01': 'Reporteador' } },
  ],

  tenants: [
    { dominio: 'sigmafoods.com', tenantId: '8f21c0d4-...-a91b', clientId: 'a03e9f11-...-77c2', credencial: 'Secreto', estado: 'Principal' },
    { dominio: 'alpek.com', tenantId: '2b90ee71-...-0d4a', clientId: 'f7a1c3b8-...-9e01', credencial: 'Certificado', estado: 'Activo' },
    { dominio: 'nemak.com', tenantId: 'c1d5a882-...-3f6e', clientId: '9c22b7d0-...-1a55', credencial: 'Secreto', estado: 'Activo' },
  ],

  bitacora: [], // se llena dinámicamente + semilla

  paises: ['México', 'Estados Unidos', 'España', 'Canadá'],
  estados: ['Nuevo León', 'Coahuila', 'Ciudad de México', 'Jalisco', 'Tamaulipas'],
  ciudades: ['Monterrey', 'San Pedro Garza García', 'Saltillo', 'Guadalajara', 'Ciudad de México'],
};

// Semilla de bitácora (actividad de hoy 30/09/2026 + histórica)
DATA.bitacora = [
  { fecha: '30/09/2026 11:20:14', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Sustitución', detalle: 'Sustitución Título 88 → Títulos 106 y 107', folio: 'T-88' },
  { fecha: '30/09/2026 10:08:37', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Cheque', detalle: 'Impresión cheque CH 5290 (Rogelio Treviño Leal)', folio: 'CH-5290' },
  { fecha: '30/09/2026 10:07:52', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Impresión', detalle: 'Recibos de canje, liquidación, Hylsamex y pago de fracción · Canje 93', folio: 'CJ-93' },
  { fecha: '30/09/2026 10:06:15', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Liquidación', detalle: 'Liquidación 10144037 · cupones 39 a 44 (Rogelio Treviño Leal)', folio: '10144037' },
  { fecha: '30/09/2026 10:05:03', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Canje', detalle: 'Canje 93 · Título 17 → Títulos 104 y 105', folio: 'CJ-93' },
  { fecha: '30/09/2026 09:13:40', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Impresión', detalle: 'Recibo de título nuevo · Título 103', folio: 'T-103' },
  { fecha: '30/09/2026 09:12:08', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Generación', detalle: 'Generación Título 103 (María Fernanda Salinas Cantú)', folio: 'T-103' },
  { fecha: '30/09/2026 08:40:22', usuario: 'Carlos Menéndez', emisora: '01 SIGMA FOODS', evento: 'Inicio de sesión', detalle: 'Autenticado con Microsoft Entra ID + MFA', folio: '—' },
  { fecha: '15/09/2026 09:00:11', usuario: 'Ana Lucía Robles', emisora: '01 SIGMA FOODS', evento: 'Configuración', detalle: 'Cupón 44 generado', folio: 'C-44' },
  { fecha: '14/09/2026 17:22:11', usuario: 'Ana Lucía Robles', emisora: '01 SIGMA FOODS', evento: 'Cambio de permisos', detalle: 'Rol Reporteador otorgado a Mónica Vela', folio: '—' },
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
  rolDemo: 'Administrador', // "Ver como" — filtra el menú (demo)
};

function emisoraById(id) { return DATA.emisoras.find(e => e.id === id); }
function emisionVigente(emisora = STATE.emisoraActual) { return DATA.emisiones.find(e => e.emisora === emisora && e.vigente); }
function emisionesDe(emisora = STATE.emisoraActual) { return DATA.emisiones.filter(e => e.emisora === emisora); }
