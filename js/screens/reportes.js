/* ============================================================
   Pantalla 14 — Reportes
   ============================================================ */
const REPORTES = [
  { id: 'sabana', nombre: 'Resumen de pago de dividendos', desc: 'Sábana por accionista con liquidación, cupones pagados e importe. Firmas Solicita/Autoriza.', icon: 'report', badge: 'actual' },
  { id: 'divmes', nombre: 'Dividendos pagados por mes', desc: 'Importe por día (CUFIN / CUFINRE) con total del mes.', icon: 'coins', badge: 'both' },
  { id: 'reemb', nombre: 'Resumen de pago de reembolsos', desc: 'Cupón 19, acumulado consecutivo y firmas.', icon: 'dollar', badge: 'actual' },
  { id: 'reembmes', nombre: 'Reembolsos pagados por mes', desc: 'Importe por día con total del mes.', icon: 'coins', badge: 'both' },
  { id: 'registro', nombre: 'Registro de acciones', desc: 'Por emisión, con datos del título y del accionista. Filtros por columna.', icon: 'book', badge: 'actual' },
  { id: 'fracciones', nombre: 'Fracciones sobrantes (desde 1996)', desc: 'Fracciones e importes por canje, con total pagado.', icon: 'scissors', badge: 'both' },
  { id: 'canjes', nombre: 'Canjes mensuales', desc: 'Detalle de canjes del mes y conciliación.', icon: 'swap', badge: 'both' },
];
function repBadge(b) { return b === 'actual' ? badgeActual() : b === 'both' ? `${badgeActual()} ${badgeNew()}` : badgeNew(); }

function screenReportes() {
  const cards = REPORTES.map(r => `<div class="report-card" onclick="abrirReporte('${r.id}')">
    <div class="row between" style="align-items:flex-start"><span class="rc-ic">${ICON(r.icon)}</span><div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">${repBadge(r.badge)}</div></div>
    <h3>${esc(r.nombre)}</h3><p>${esc(r.desc)}</p>
  </div>`).join('');
  return pageHead({ crumbs: ['Reportes'], title: 'Reportes', sub: 'Galería de reportes. Cada uno se abre con parámetros a la izquierda y vista previa del documento a la derecha.' })
    + `<div class="report-gallery">${cards}</div>`;
}

let _repTab = {}; // pestañas Mejora por reporte
function abrirReporte(id) {
  const r = REPORTES.find(x => x.id === id);
  _repTab[id] = _repTab[id] || 'principal';
  const view = document.getElementById('view');
  view.innerHTML = pageHead({
    crumbs: ['Reportes', r.nombre], title: r.nombre, badge: repBadge(r.badge),
    actions: `<div class="row gap-2">${exportBar(r.nombre)}<button class="btn btn-primary" onclick="doPrint('${esc(r.nombre)}')">${ICON('print')} Imprimir</button></div>`,
  }) + `<button class="btn btn-ghost" style="margin-bottom:12px" onclick="render('reportes')">${ICON('arrowLeft')} Volver a reportes</button>
  <div class="report-viewer">
    <div class="card report-params"><div class="card-head"><h3>Parámetros</h3></div><div class="card-body col gap-4">${repParams(id)}</div></div>
    <div class="col gap-3" style="min-width:0">
      ${repTabs(id)}
      <div class="pdf-scroll" id="repPreview">${repPreview(id, _repTab[id])}</div>
    </div>
  </div>`;
  window.scrollTo(0, 0);
}
function repTabs(id) {
  const tabsByRep = {
    divmes: [['principal', 'Principal'], ['detalle', 'Detalle · Mejora'], ['anual', 'Anual · Mejora']],
    reembmes: [['principal', 'Principal'], ['anual', 'Anual · Mejora']],
    fracciones: [['principal', 'Principal'], ['arqueo', 'Arqueo · Mejora']],
    canjes: [['principal', 'Principal'], ['concil', 'Conciliación · Mejora'], ['poracc', 'Por accionista · Mejora']],
  };
  const tabs = tabsByRep[id];
  if (!tabs) return '';
  return `<div class="tabs">${tabs.map(([k, l]) => `<div class="tab ${_repTab[id] === k ? 'active' : ''}" onclick="setRepTab('${id}','${k}')">${esc(l)}</div>`).join('')}</div>`;
}
function setRepTab(id, k) {
  _repTab[id] = k;
  document.getElementById('repPreview').innerHTML = repPreview(id, k);
  document.querySelectorAll('.report-viewer .tabs .tab').forEach(el => el.classList.toggle('active', el.getAttribute('onclick').includes(`'${k}'`)));
}

function repParams(id) {
  if (id === 'sabana') {
    return `<div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="grid grid-2"><div class="field"><label>Cupón</label><input class="input num" value="44"></div><div class="field"><label>Acumulado</label><input class="input num" value="2"></div></div>
      <div class="field acumular-field">
        <label class="switch-row"><input type="checkbox" id="acumChk"> Acumular dividendos</label>
        <p class="hint acumular-hint">Sin marcar: reporte preliminar, no acumula. Marcada: reporte definitivo, acumula los dividendos.</p>
      </div>
      <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: Resumen de pago de dividendos')">${ICON('refresh')} Generar vista previa</button>`;
  }
  if (id === 'reemb') {
    return `<div class="field"><label>Emisión</label><select class="select"><option selected>TD Cla I Ser 'A' Feb-04</option>${emisionesDe().filter(e => e.id !== 'e2').map(e => `<option>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="grid grid-2"><div class="field"><label>Cupón</label><input class="input num" value="19"></div><div class="field"><label>Acumulado consecutivo</label><input class="input num" value="159"></div></div>
      <label class="switch-row" style="margin-top:2px"><input type="checkbox"> Acumular reembolsos</label>
      <p class="hint" style="margin-top:-6px">Sin marcar: reporte preliminar, no acumula. Marcada: reporte definitivo, acumula los reembolsos.</p>
      <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: Resumen de pago de reembolsos')">${ICON('refresh')} Generar vista previa</button>`;
  }
  if (id === 'divmes' || id === 'reembmes') {
    return `<div class="grid grid-2"><div class="field"><label>Año</label><input class="input num" value="2026"></div><div class="field"><label>Mes</label><select class="select"><option selected>Septiembre</option><option>Todos</option></select></div></div>
      <div class="alert alert-info">${ICON('info')} El encabezado de impresión incluye la emisora, el nombre del reporte y el mes.</div>
      <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: ${id}')">${ICON('refresh')} Generar vista previa</button>`;
  }
  if (id === 'registro') {
    return `<div class="field"><label>Emisión</label><select class="select"><option selected>TD Cla I Ser 'A' Feb-26</option>${emisionesDe().filter(e => !e.vigente).map(e => `<option>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Orden</label><select class="select"><option>Por número de título</option><option>Por accionista</option></select></div>
      <div class="alert alert-info">${ICON('info')} La tabla tiene filtros por columna. "No. de títulos emitidos" y "Total de acciones" se actualizan con los filtros. ${badgeNew()}</div>
      <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: Registro de acciones')">${ICON('refresh')} Generar vista previa</button>`;
  }
  if (id === 'fracciones') {
    return `<div class="grid grid-2"><div class="field"><label>Desde</label><input class="input" value="1996"></div><div class="field"><label>Hasta</label><input class="input" value="2026"></div></div>
      <div class="alert alert-info">${ICON('info')} La tabla tiene filtros por columna. El "Total pagado por fracciones sobrantes" se actualiza con los filtros. ${badgeNew()}</div>
      <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: Fracciones sobrantes')">${ICON('refresh')} Generar vista previa</button>`;
  }
  // canjes
  return `<div class="grid grid-2"><div class="field"><label>Año</label><input class="input num" value="2026"></div><div class="field"><label>Mes</label><select class="select"><option selected>Septiembre</option></select></div></div>
    <button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: Canjes mensuales')">${ICON('refresh')} Generar vista previa</button>`;
}

function repPreview(id, tab) {
  tab = tab || 'principal';
  if (id === 'sabana') return repSabana();
  if (id === 'divmes') return repDivMes(tab);
  if (id === 'reemb') return repReemb();
  if (id === 'reembmes') return repReembMes(tab);
  if (id === 'registro') return repRegistro();
  if (id === 'fracciones') return repFracciones(tab);
  return repCanjes(tab);
}

/* a. Resumen de pago de dividendos */
function repSabana() {
  const cupones = [39, 40, 41, 42, 43, 44];
  const rogelio = [976.36, 1046.10, 582.05, 1064.86, 1080.97, 1133.28];
  const head = ['Accionista', 'Liquidación', ...cupones.map(c => 'C' + c), 'Total'];
  const rows = [
    ['Rogelio Treviño Leal', '10144037', ...rogelio.map(v => fmtMoney(v)), '<b>' + fmtMoney(5883.62) + '</b>'],
  ];
  const total = 5543839944;
  const acumActual = { 39: 5208900100, 40: 5209512340, 41: 5209905870, 42: 5210180400, 43: 5210344980, 44: 5210493607 };
  const acumAnterior = { 39: 5208412050, 40: 5208900100, 41: 5209512340, 42: 5209905870, 43: 5210180400, 44: 5210455120 };
  const bottomRows = [
    ['Acumulado anterior', ...cupones.map(c => fmtNum(acumAnterior[c]))],
    ['Acumulado actual', ...cupones.map(c => fmtNum(acumActual[c]))],
    ['Por pagar', ...cupones.map(c => fmtNum(total - acumActual[c]))],
    ['Total de acciones', ...cupones.map(() => fmtNum(total))],
  ];
  const bottom = '<h4 class="pdf-title" style="margin-top:16px">Acciones por cupón</h4>' +
    '<div class="pdf-tbl-scroll"><table class="pdf-tbl-sticky"><thead><tr><th></th>' + cupones.map(c => '<th class="num">C' + c + '</th>').join('') + '</tr></thead><tbody>' +
    bottomRows.map(r => '<tr><td><b>' + r[0] + '</b></td>' + r.slice(1).map(v => '<td class="num" style="text-align:right">' + v + '</td>').join('') + '</tr>').join('') +
    '</tbody></table></div>';
  return pdfSheet({
    title: 'Resumen de pago de dividendos',
    kv: [['Emisión', "TD Cla I Ser 'A' Feb-26"], ['Cupón', '44'], ['Acumulado', '2'], ['Estado', 'Preliminar (sin acumular)']],
    table: { head, rows, nums: [1, 2, 3, 4, 5, 6, 7, 8] },
    extra: bottom,
    signs: ['Solicita', 'Autoriza'],
    landscape: true, stickyFirst: true,
  });
}

/* b. Dividendos pagados por mes */
function repDivMes(tab) {
  if (tab === 'detalle') {
    return pdfSheet({
      title: 'Dividendos pagados durante el mes — Detalle',
      landscape: true,
      kv: [['Emisora', 'SIGMA FOODS, S.A.B. DE C.V.'], ['Mes', 'Septiembre de 2026']],
      table: { head: ['No. liquidación', 'No. cheque', 'No. accionista', 'Nombre', 'Acciones', 'Factor', 'Importe'], nums: [4, 5, 6], rows: [
        ['10144037', 'CH 5290', 'A1', 'Rogelio Treviño Leal', '3,487', fmtFactor(0.325), fmtMoney(1133.28)],
        ['10144001', 'CH 5291', 'A3', 'María Fernanda Salinas Cantú', '5,000', fmtFactor(0.325), fmtMoney(1625.00)],
        ['10144002', 'CH 5292', 'A2', 'Estela Garza Villarreal', '7,000', fmtFactor(0.325), fmtMoney(2275.00)],
      ] },
      extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total pagado</b></span><b>' + fmtMoney(5033.28) + '</b></div>',
    });
  }
  if (tab === 'anual') {
    const meses = [['Enero', 0, 0], ['Febrero', 0, 0], ['Marzo', 182400.00, 0], ['Abril', 0, 0], ['Mayo', 0, 0], ['Junio', 0, 0], ['Julio', 0, 0], ['Agosto', 0, 0], ['Septiembre', 5033.28, 0], ['Octubre', 0, 0], ['Noviembre', 0, 0], ['Diciembre', 0, 0]];
    const tC = meses.reduce((s, m) => s + m[1], 0), tR = meses.reduce((s, m) => s + m[2], 0);
    return pdfSheet({
      title: 'Dividendos pagados — Resumen anual 2026',
      landscape: true,
      table: { head: ['Mes', 'CUFIN', 'CUFINRE', 'Total'], rows: meses.map(m => [m[0], fmtMoney(m[1]), fmtMoney(m[2]), fmtMoney(m[1] + m[2])]) },
      extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total</b></span><b>' + fmtMoney(tC + tR) + '</b></div>',
    });
  }
  const dias = [['15/09/2026', 0, 0], ['30/09/2026', 5033.28, 0]];
  const tC = dias.reduce((s, d) => s + d[1], 0), tR = dias.reduce((s, d) => s + d[2], 0);
  return pdfSheet({
    title: 'Dividendos pagados durante el mes',
    landscape: true,
    note: 'SIGMA FOODS, S.A.B. DE C.V. · Dividendos pagados durante el mes · Septiembre de 2026',
    table: { head: ['Día', 'Importe CUFIN', 'Importe CUFINRE'], rows: dias.map(d => [d[0], fmtMoney(d[1]), fmtMoney(d[2])]) },
    extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total dividendo pagado</b></span><b>' + fmtMoney(tC + tR) + '</b></div>',
  });
}

/* c. Resumen de pago de reembolsos */
function repReemb() {
  const rows = [
    ['R-2004-118', 'Estela Garza Villarreal', fmtMoney(2214.00), fmtMoney(2214.00)],
    ['R-2004-119', 'Jorge Alberto Elizondo Ríos', fmtMoney(5076.00), fmtMoney(5076.00)],
  ];
  const bottom = '<h4 class="pdf-title" style="margin-top:16px">Acciones del cupón 19</h4>' +
    '<table><tbody>' +
    '<tr><td>Acumulado anterior</td><td style="text-align:right"><b>' + fmtNum(3720004100) + '</b></td></tr>' +
    '<tr><td>Acumulado actual</td><td style="text-align:right"><b>' + fmtNum(3720064700) + '</b></td></tr>' +
    '<tr><td>Por pagar</td><td style="text-align:right"><b>' + fmtNum(79935300) + '</b></td></tr>' +
    '<tr><td><b>Total de acciones</b></td><td style="text-align:right"><b>' + fmtNum(3800000000) + '</b></td></tr>' +
    '</tbody></table>';
  return pdfSheet({
    title: 'Resumen de pago de reembolsos — Reporte N° 159',
    landscape: true,
    kv: [['Emisión', "TD Cla I Ser 'A' Feb-04"], ['Cupón', '19'], ['Acumulado consecutivo', '159']],
    table: { head: ['No. de reembolso', 'Accionista', 'Importe cupón 19', 'Total por accionista'], rows },
    extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total del periodo</b></span><b>' + fmtMoney(7290.00) + '</b></div>' + bottom,
    signs: ['Solicita', 'Autoriza'],
  });
}

/* d. Reembolsos pagados por mes */
function repReembMes(tab) {
  if (tab === 'anual') {
    const meses = [['Enero', 0], ['Febrero', 180400.00], ['Marzo', 204120.00], ['Abril', 0], ['Mayo', 0], ['Junio', 0], ['Julio', 0], ['Agosto', 0], ['Septiembre', 7290.00], ['Octubre', 0], ['Noviembre', 0], ['Diciembre', 0]];
    const tot = meses.reduce((s, m) => s + m[1], 0);
    return pdfSheet({
      title: 'Reembolsos pagados — Resumen anual 2026',
      landscape: true,
      table: { head: ['Mes', 'Importe'], rows: meses.map(m => [m[0], fmtMoney(m[1])]) },
      extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total</b></span><b>' + fmtMoney(tot) + '</b></div>',
    });
  }
  const dias = [['10/09/2026', 5076.00], ['22/09/2026', 2214.00]];
  const tot = dias.reduce((s, d) => s + d[1], 0);
  return pdfSheet({
    title: 'Reembolsos pagados durante el mes de septiembre de 2026',
    landscape: true,
    note: 'SIGMA FOODS, S.A.B. DE C.V. · Reembolsos pagados durante el mes de septiembre de 2026',
    table: { head: ['Día', 'Importe'], rows: dias.map(d => [d[0], fmtMoney(d[1])]) },
    extra: '<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total del mes</b></span><b>' + fmtMoney(tot) + '</b></div>',
  });
}

/* e. Registro de acciones — solo títulos de Feb-26 */
// Estado de filtros por columna (Cambio 4)
let _regFiltros = { nombre: '', rfc: '', dir: '', fIni: '', fFin: '', accIni: '', accFin: '', aiIni: '', aiFin: '', afIni: '', afFin: '', cupon: '' };
function _regDatos() {
  const ts = DATA.titulos.filter(t => t.emision === 'e5' && t.estatus !== 'Anulado');
  const byId = id => DATA.accionistas.find(x => x.id === id);
  return ts.map(t => {
    const ac = byId(t.accionista);
    return {
      num: t.num,
      noTitulo: 'Título ' + t.num,
      fecha: t.fecha, // ISO para comparar
      fechaTxt: t.fecha.split('-').reverse().join('/'),
      ultimoCupon: t.ultimoCupon,
      nombre: 'Título nominativo ' + t.num,
      rfc: ac.rfc,
      rfcMask: ac.rfc.slice(0, 4) + '••••••' + ac.rfc.slice(-2),
      dir: ac.domicilio,
      acciones: t.acciones,
      accIni: t.accIni,
      accFin: t.accFin,
    };
  });
}
function _regFiltrados() {
  const f = _regFiltros;
  const inRange = (val, lo, hi) => {
    if (lo !== '' && val < Number(lo)) return false;
    if (hi !== '' && val > Number(hi)) return false;
    return true;
  };
  const inDateRange = (iso, lo, hi) => {
    if (lo && iso < lo) return false;
    if (hi && iso > hi) return false;
    return true;
  };
  return _regDatos().filter(r => {
    if (f.nombre && !r.nombre.toLowerCase().includes(f.nombre.toLowerCase())) return false;
    if (f.rfc && !r.rfc.toLowerCase().includes(f.rfc.toLowerCase())) return false;
    if (f.dir && !r.dir.toLowerCase().includes(f.dir.toLowerCase())) return false;
    if (!inDateRange(r.fecha, f.fIni, f.fFin)) return false;
    if (!inRange(r.acciones, f.accIni, f.accFin)) return false;
    if (!inRange(r.accIni, f.aiIni, f.aiFin)) return false;
    if (!inRange(r.accFin, f.afIni, f.afFin)) return false;
    if (f.cupon && String(r.ultimoCupon) !== f.cupon) return false;
    return true;
  });
}
function repRegistro() {
  const rows = _regFiltrados();
  const totAcc = rows.reduce((s, r) => s + r.acciones, 0);
  const cuponesOpts = [...new Set(_regDatos().map(r => r.ultimoCupon))].sort((a, b) => a - b);
  // Encabezados
  const head = ['No. título', 'Fecha inicio', 'Último cupón', 'Nombre de título', 'RFC', 'Dirección', 'Acciones', 'Acción inicial', 'Acción final'];
  const headHtml = head.map((hh, i) => `<th class="${[2, 6, 7, 8].includes(i) ? 'num' : ''}">${esc(hh)}</th>`).join('');
  const txtF = (key, ph) => `<input class="col-filter" placeholder="${ph}" value="${esc(_regFiltros[key])}" oninput="setRegFiltro('${key}',this.value)" onclick="event.stopPropagation()">`;
  const rangeF = (kLo, kHi, type = 'number') => `<div class="col-filter-range"><input class="col-filter" type="${type}" placeholder="Desde" value="${esc(_regFiltros[kLo])}" oninput="setRegFiltro('${kLo}',this.value)"><input class="col-filter" type="${type}" placeholder="Hasta" value="${esc(_regFiltros[kHi])}" oninput="setRegFiltro('${kHi}',this.value)"></div>`;
  const selF = `<select class="col-filter" onchange="setRegFiltro('cupon',this.value)"><option value="">Todos</option>${cuponesOpts.map(c => `<option value="${c}" ${_regFiltros.cupon === String(c) ? 'selected' : ''}>${c}</option>`).join('')}</select>`;
  const filterRow = `<tr class="filter-row">
    <th></th>
    <th>${rangeF('fIni', 'fFin', 'date')}</th>
    <th>${selF}</th>
    <th>${txtF('nombre', 'Nombre…')}</th>
    <th>${txtF('rfc', 'RFC…')}</th>
    <th>${txtF('dir', 'Dirección…')}</th>
    <th>${rangeF('accIni', 'accFin')}</th>
    <th>${rangeF('aiIni', 'aiFin')}</th>
    <th>${rangeF('afIni', 'afFin')}</th>
  </tr>`;
  const bodyRows = _regBodyHtml(rows);
  const tableHtml = `<div class="pdf-tbl-scroll"><table class="pdf-tbl-sticky">
      <thead><tr>${headHtml}</tr>${filterRow}</thead>
      <tbody>${bodyRows}</tbody>
    </table></div>`;
  const totales = `<div class="reg-totales" style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>No. de títulos emitidos: ${rows.length}</b></span><b>Total de acciones: ${fmtNum(totAcc)}</b></div>`;
  const limpiar = `<div class="row between" style="margin-bottom:10px;align-items:center"><span class="tiny muted">Filtros por columna</span><button class="btn btn-secondary btn-sm" onclick="limpiarRegFiltros()">${ICON('x')} Limpiar filtros</button></div>`;
  return `<div class="pdf-sheet pdf-sheet--landscape" id="regSheet">
    <div class="pdf-brand"><span class="co">SIGMA FOODS, S.A.B. DE C.V.</span>${SIGMA_LOGO(24)}</div>
    <h4 class="pdf-title">Registro de acciones</h4>
    ${limpiar}
    ${tableHtml}
    ${totales}
    <p style="font-size:11px;color:#666;margin-top:12px">SIGMA FOODS, S.A.B. DE C.V. · Emisión TD Cla I Ser 'A' Feb-26. Conforme al Art. 8 de los estatutos y Art. 128 de la LGSM.</p>
  </div>`;
}
function _regBodyHtml(rows) {
  const bodyRows = rows.map(r => `<tr>
    <td>${esc(r.noTitulo)}</td>
    <td class="num">${esc(r.fechaTxt)}</td>
    <td class="num">${r.ultimoCupon}</td>
    <td>${esc(r.nombre)}</td>
    <td>${esc(r.rfcMask)}</td>
    <td>${esc(r.dir)}</td>
    <td class="num">${fmtNum(r.acciones)}</td>
    <td class="num">${fmtNum(r.accIni)}</td>
    <td class="num">${fmtNum(r.accFin)}</td>
  </tr>`).join('');
  const emptyRow = rows.length ? '' : `<tr><td colspan="9" style="text-align:center;color:#888;padding:14px">Sin resultados para los filtros aplicados.</td></tr>`;
  return bodyRows + emptyRow;
}
function setRegFiltro(key, val) {
  _regFiltros[key] = val;
  _regRefresh();
}
function _regRefresh() {
  const sheet = document.getElementById('regSheet');
  if (!sheet) return;
  const rows = _regFiltrados();
  const totAcc = rows.reduce((s, r) => s + r.acciones, 0);
  const tbody = sheet.querySelector('.pdf-tbl-sticky tbody');
  if (tbody) tbody.innerHTML = _regBodyHtml(rows);
  const tot = sheet.querySelector('.reg-totales');
  if (tot) tot.innerHTML = `<span><b>No. de títulos emitidos: ${rows.length}</b></span><b>Total de acciones: ${fmtNum(totAcc)}</b>`;
}
function limpiarRegFiltros() {
  _regFiltros = { nombre: '', rfc: '', dir: '', fIni: '', fFin: '', accIni: '', accFin: '', aiIni: '', aiFin: '', afIni: '', afFin: '', cupon: '' };
  const sheet = document.getElementById('regSheet');
  if (sheet) sheet.outerHTML = repRegistro();
}

/* f. Fracciones sobrantes */
const _fracDatos = [
  { emision: "TD Cla I Ser 'A' Feb-26", canje: 93, fecha: '2026-09-30', fechaTxt: '30/09/2026', accionista: 'Rogelio Treviño Leal', fraccion: 0.50, importe: 6.50 },
  { emision: "TD Cla I Ser 'A' Jun-25", canje: 88, fecha: '2025-09-18', fechaTxt: '18/09/2025', accionista: 'Estela Garza Villarreal', fraccion: 0.25, importe: 3.25 },
];
let _fracFiltros = { emision: '', accionista: '', canjeIni: '', canjeFin: '', fIni: '', fFin: '', fracIni: '', fracFin: '', impIni: '', impFin: '' };
function _fracFiltrados() {
  const f = _fracFiltros;
  const inRange = (val, lo, hi) => {
    if (lo !== '' && val < Number(lo)) return false;
    if (hi !== '' && val > Number(hi)) return false;
    return true;
  };
  const inDateRange = (iso, lo, hi) => {
    if (lo && iso < lo) return false;
    if (hi && iso > hi) return false;
    return true;
  };
  return _fracDatos.filter(r => {
    if (f.emision && r.emision !== f.emision) return false;
    if (f.accionista && !r.accionista.toLowerCase().includes(f.accionista.toLowerCase())) return false;
    if (!inRange(r.canje, f.canjeIni, f.canjeFin)) return false;
    if (!inDateRange(r.fecha, f.fIni, f.fFin)) return false;
    if (!inRange(r.fraccion, f.fracIni, f.fracFin)) return false;
    if (!inRange(r.importe, f.impIni, f.impFin)) return false;
    return true;
  });
}
function _fracBodyHtml(rows) {
  const body = rows.map(r => `<tr>
    <td>${esc(r.emision)}</td>
    <td class="num">${r.canje}</td>
    <td class="num">${esc(r.fechaTxt)}</td>
    <td>${esc(r.accionista)}</td>
    <td class="num">${fmtNum(r.fraccion, 2)}</td>
    <td class="num">${fmtMoney(r.importe)}</td>
  </tr>`).join('');
  const empty = rows.length ? '' : `<tr><td colspan="6" style="text-align:center;color:#888;padding:14px">Sin resultados para los filtros aplicados.</td></tr>`;
  return body + empty;
}
function repFracciones(tab) {
  if (tab === 'arqueo') {
    return pdfSheet({ title: 'Arqueo de fracciones sobrantes', table: { head: ['Concepto', 'Importe'], rows: [['Saldo inicial', fmtMoney(1240.00)], ['Solicitudes de efectivo', '- ' + fmtMoney(320.50)], ['Compras', '+ ' + fmtMoney(150.00)], ['Saldo caja', fmtMoney(1069.50)]], nums: [1] }, landscape: true });
  }
  const rows = _fracFiltrados();
  const totPagado = rows.reduce((s, r) => s + r.importe, 0);
  const emisionesOpts = [...new Set(_fracDatos.map(r => r.emision))];
  const head = ['Emisión vigente', 'No. de canje', 'Fecha de operación', 'Accionista', 'Fracción sobrante', 'Importe'];
  const headHtml = head.map((hh, i) => `<th class="${[1, 4, 5].includes(i) ? 'num' : ''}">${esc(hh)}</th>`).join('');
  const txtF = (key, ph) => `<input class="col-filter" placeholder="${ph}" value="${esc(_fracFiltros[key])}" oninput="setFracFiltro('${key}',this.value)" onclick="event.stopPropagation()">`;
  const rangeF = (kLo, kHi, type = 'number', step = '') => `<div class="col-filter-range"><input class="col-filter" type="${type}" ${step ? `step="${step}"` : ''} placeholder="Desde" value="${esc(_fracFiltros[kLo])}" oninput="setFracFiltro('${kLo}',this.value)"><input class="col-filter" type="${type}" ${step ? `step="${step}"` : ''} placeholder="Hasta" value="${esc(_fracFiltros[kHi])}" oninput="setFracFiltro('${kHi}',this.value)"></div>`;
  const selF = `<select class="col-filter" onchange="setFracFiltro('emision',this.value)"><option value="">Todas</option>${emisionesOpts.map(e => `<option value="${esc(e)}" ${_fracFiltros.emision === e ? 'selected' : ''}>${esc(e)}</option>`).join('')}</select>`;
  const filterRow = `<tr class="filter-row">
    <th>${selF}</th>
    <th>${rangeF('canjeIni', 'canjeFin')}</th>
    <th>${rangeF('fIni', 'fFin', 'date')}</th>
    <th>${txtF('accionista', 'Accionista…')}</th>
    <th>${rangeF('fracIni', 'fracFin', 'number', '0.01')}</th>
    <th>${rangeF('impIni', 'impFin', 'number', '0.01')}</th>
  </tr>`;
  const tableHtml = `<div class="pdf-tbl-scroll"><table class="pdf-tbl-sticky">
      <thead><tr>${headHtml}</tr>${filterRow}</thead>
      <tbody>${_fracBodyHtml(rows)}</tbody>
    </table></div>`;
  const totales = `<div class="frac-totales" style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total pagado por fracciones sobrantes</b></span><b>${fmtMoney(totPagado)}</b></div>`;
  const limpiar = `<div class="row between" style="margin-bottom:10px;align-items:center"><span class="tiny muted">Filtros por columna</span><button class="btn btn-secondary btn-sm" onclick="limpiarFracFiltros()">${ICON('x')} Limpiar filtros</button></div>`;
  return `<div class="pdf-sheet pdf-sheet--landscape" id="fracSheet">
    <div class="pdf-brand"><span class="co">SIGMA FOODS, S.A.B. DE C.V.</span>${SIGMA_LOGO(24)}</div>
    <h4 class="pdf-title">Fracciones sobrantes (desde 1996)</h4>
    ${limpiar}
    ${tableHtml}
    ${totales}
  </div>`;
}
function setFracFiltro(key, val) {
  _fracFiltros[key] = val;
  const sheet = document.getElementById('fracSheet');
  if (!sheet) return;
  const rows = _fracFiltrados();
  const totPagado = rows.reduce((s, r) => s + r.importe, 0);
  const tbody = sheet.querySelector('.pdf-tbl-sticky tbody');
  if (tbody) tbody.innerHTML = _fracBodyHtml(rows);
  const tot = sheet.querySelector('.frac-totales');
  if (tot) tot.innerHTML = `<span><b>Total pagado por fracciones sobrantes</b></span><b>${fmtMoney(totPagado)}</b>`;
}
function limpiarFracFiltros() {
  _fracFiltros = { emision: '', accionista: '', canjeIni: '', canjeFin: '', fIni: '', fFin: '', fracIni: '', fracFin: '', impIni: '', impFin: '' };
  const sheet = document.getElementById('fracSheet');
  if (sheet) sheet.outerHTML = repFracciones('principal');
}

/* g. Canjes mensuales */
function repCanjes(tab) {
  if (tab === 'concil') {
    return pdfSheet({ title: 'Conciliación de canjes del mes — Septiembre 2026', landscape: true, table: { head: ['Concepto', 'Acciones'], rows: [['Acciones anteriores (título entrante)', fmtNum(2450)], ['Acciones nuevas (títulos generados)', fmtNum(3487)], ['Títulos generados', '2'], ['Diferencia de acciones', fmtNum(1037) + ' (split + cert. provisional)']], nums: [1] } });
  }
  if (tab === 'poracc') {
    return pdfSheet({ title: 'Canjes por accionista del mes — Septiembre 2026', landscape: true, table: { head: ['Accionista', 'Canjes', 'Acciones anteriores', 'Acciones nuevas'], rows: [['Rogelio Treviño Leal', '1', fmtNum(2450), fmtNum(3487)]], nums: [1, 2, 3] } });
  }
  return pdfSheet({
    title: 'Canjes mensuales — Septiembre 2026',
    landscape: true,
    table: { head: ['Emisión actual', 'No. canje', 'Fecha', 'Emisión anterior', 'No. título', 'Acc. anteriores', 'Acc. nuevas', 'Fracción', 'Pago fracción'], nums: [1, 4, 5, 6, 7, 8], rows: [
      ['TD A Feb-26', '93', '30/09/2026', 'TD A Jun-96', '17', fmtNum(2450), fmtNum(3487), '0.50', fmtMoney(6.50)],
    ] },
    extra: '<h4 class="pdf-title" style="margin-top:16px">Resumen de acciones canjeadas</h4>' +
      '<table><tbody>' +
      "<tr><td>Emisión</td><td style=\"text-align:right\"><b>TD Cla I Ser 'A' Feb-26</b></td></tr>" +
      '<tr><td>Serie</td><td style="text-align:right"><b>\'A\'</b></td></tr>' +
      '<tr><td>Total de acciones canjeadas</td><td style="text-align:right"><b>' + fmtNum(3487) + '</b></td></tr>' +
      '<tr><td>Acciones anteriores</td><td style="text-align:right"><b>' + fmtNum(2450) + '</b></td></tr>' +
      '<tr><td>Acciones nuevas</td><td style="text-align:right"><b>' + fmtNum(3487) + '</b></td></tr>' +
      '</tbody></table>',
  });
}
