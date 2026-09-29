/* ============================================================
   Pantalla 14 — Reportes
   ============================================================ */
const REPORTES = [
  { id: 'sabana', nombre: 'Resumen de pago de dividendos (sábana)', desc: 'Filas por accionista con liquidación, cupones pagados, importe y acciones. Firmas Solicita/Autoriza.', icon: 'report', badge: 'parity', extras: ['Detalle por accionista', 'Casilla Acumular dividendos'] },
  { id: 'divmes', nombre: 'Dividendos pagados por mes', desc: 'CUFIN / CUFINRE por día, detalle por liquidación, cheque y accionista.', icon: 'coins', badge: 'both', extras: ['Detalle por liquidación (Nuevo)', 'Resumen anual por mes (Nuevo)'] },
  { id: 'reemb', nombre: 'Resumen de pago de reembolsos', desc: 'Cupón 19, acumulado y firmas.', icon: 'dollar', badge: 'parity' },
  { id: 'reembmes', nombre: 'Reembolsos pagados por mes', desc: 'Detalle mensual de reembolsos.', icon: 'coins', badge: 'both', extras: ['Resumen anual (Nuevo)'] },
  { id: 'registro', nombre: 'Registro de acciones', desc: 'Conforme al Art. 8 de los estatutos y Art. 128 de la LGSM. Filtros por columna.', icon: 'book', badge: 'parity' },
  { id: 'fracciones', nombre: 'Fracciones sobrantes (desde 1996)', desc: 'Histórico de fracciones sobrantes.', icon: 'scissors', badge: 'both', extras: ['Arqueo de fracciones sobrantes (Nuevo)'] },
  { id: 'canjes', nombre: 'Canjes mensuales', desc: 'Resumen de acciones canjeadas por mes.', icon: 'swap', badge: 'both', extras: ['Conciliación de canjes del mes (Nuevo)', 'Canjes por accionista del mes (Nuevo)'] },
];
function repBadge(b) { return b === 'parity' ? badgeParity() : b === 'both' ? `${badgeParity()} ${badgeNew()}` : badgeNew(); }

function screenReportes() {
  const cards = REPORTES.map(r => `<div class="report-card" onclick="abrirReporte('${r.id}')">
    <div class="row between" style="align-items:flex-start"><span class="rc-ic">${ICON(r.icon)}</span><div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">${repBadge(r.badge)}</div></div>
    <h3>${esc(r.nombre)}</h3><p>${esc(r.desc)}</p>
  </div>`).join('');
  return pageHead({ crumbs: ['Reportes'], title: 'Reportes', sub: 'Galería de reportes. Cada uno se abre con parámetros a la izquierda y vista previa del documento a la derecha.' })
    + `<div class="report-gallery">${cards}</div>`;
}

function abrirReporte(id) {
  const r = REPORTES.find(x => x.id === id);
  const view = document.getElementById('view');
  view.innerHTML = pageHead({
    crumbs: ['Reportes', r.nombre], title: r.nombre, badge: repBadge(r.badge),
    actions: `<div class="row gap-2">${exportBar(r.nombre)}<button class="btn btn-primary" onclick="doPrint('${esc(r.nombre)}')">${ICON('print')} Imprimir</button></div>`,
  }) + `<button class="btn btn-ghost" style="margin-bottom:12px" onclick="render('reportes')">${ICON('arrowLeft')} Volver a reportes</button>
  <div class="report-viewer">
    <div class="card report-params"><div class="card-head"><h3>Parámetros</h3></div><div class="card-body col gap-4">${repParams(id)}</div></div>
    <div class="pdf-scroll">${repPreview(id)}</div>
  </div>`;
  window.scrollTo(0, 0);
}

function repParams(id) {
  const base = `<div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>`;
  let extra = '';
  if (id === 'sabana') extra = `<div class="field"><label>Cupón</label><input class="input num" value="44"></div>
    <label class="switch-row"><input type="checkbox" id="acumChk" onchange="toggleAcum(this.checked)"> Acumular dividendos</label>
    <div class="alert alert-info" id="acumHint">${ICON('info')} Sin marcar es <b>preliminar</b>; marcada es <b>definitivo</b>.</div>`;
  else if (id === 'reemb') extra = `<div class="field"><label>Cupón</label><input class="input num" value="19"></div>`;
  else if (id === 'divmes' || id === 'reembmes') extra = `<div class="grid grid-2"><div class="field"><label>Año</label><input class="input num" value="2026"></div><div class="field"><label>Mes</label><select class="select"><option>Septiembre</option><option>Todos</option></select></div></div><label class="switch-row"><input type="checkbox" checked> Incluir resumen anual ${badgeNew()}</label>`;
  else if (id === 'registro') extra = `<div class="field"><label>Orden</label><select class="select"><option>Por número de título</option><option>Por accionista</option></select></div>`;
  else if (id === 'fracciones') extra = `<div class="grid grid-2"><div class="field"><label>Desde</label><input class="input" value="1996"></div><div class="field"><label>Hasta</label><input class="input" value="2026"></div></div><label class="switch-row"><input type="checkbox" checked> Incluir arqueo de caja ${badgeNew()}</label>`;
  else if (id === 'canjes') extra = `<div class="grid grid-2"><div class="field"><label>Año</label><input class="input num" value="2026"></div><div class="field"><label>Mes</label><select class="select"><option>Septiembre</option></select></div></div><label class="switch-row"><input type="checkbox" checked> Incluir conciliación ${badgeNew()}</label>`;
  return base + extra + `<button class="btn btn-primary btn-block" onclick="toastBitacora('Exportación','Reporte generado: ${id}')">${ICON('refresh')} Generar vista previa</button>`;
}
function toggleAcum(v) { const h = document.getElementById('acumHint'); h.innerHTML = v ? `${ICON('checkCircle')} Modo <b>definitivo</b>: los dividendos quedan acumulados.` : `${ICON('info')} Sin marcar es <b>preliminar</b>; marcada es <b>definitivo</b>.`; h.className = v ? 'alert alert-success' : 'alert alert-info'; }

function repPreview(id) {
  if (id === 'sabana') return pdfSheet({
    title: 'Resumen de pago de dividendos — Sábana (Cupón 44)',
    kv: [['Emisión', "TD Cla I Ser 'A' Feb-26"], ['Cupón', '44'], ['Factor', fmtFactor(0.325)], ['Estado', 'Preliminar']],
    table: { head: ['Accionista', 'Liquidación', 'Cupones pagados', 'Acciones', 'Importe'], rows: [
      ['Rogelio Treviño Leal', '10144037', '39-44', '3,487', fmtMoney(1133.28)],
      ['Estela Garza Villarreal', '10143014', '44', '18,450', fmtMoney(5996.25)],
      ['María Fernanda Salinas Cantú', '10143014', '44', '7,200', fmtMoney(2340.00)],
      ['Jorge Alberto Elizondo Ríos', '10143020', '44', '42,300', fmtMoney(13747.50)],
    ] },
    extra: `<div style="margin-top:10px;font-size:11.5px"><div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px"><span>Acumulado anterior</span><b>${fmtMoney(184920.00)}</b></div><div style="display:flex;justify-content:space-between"><span>Acumulado actual</span><b>${fmtMoney(208137.03)}</b></div><div style="display:flex;justify-content:space-between"><span>Por pagar</span><b>${fmtMoney(23217.03)}</b></div><div style="display:flex;justify-content:space-between"><span>Total de acciones</span><b>71,437</b></div></div>`,
    signs: ['Solicita', 'Autoriza'],
  });
  if (id === 'divmes') return pdfSheet({
    title: 'Dividendos pagados por mes (CUFIN / CUFINRE por día)',
    kv: [['Año', '2026'], ['Mes', 'Septiembre']],
    table: { head: ['Liquidación', 'Cheque', 'Accionista', 'Acciones', 'Factor', 'Importe'], rows: [
      ['10144037', 'CH 5290', 'Rogelio Treviño Leal', '3,487', fmtFactor(0.325), fmtMoney(1133.28)],
      ['10143014', 'CH 5291', 'Estela Garza Villarreal', '18,450', fmtFactor(0.31), fmtMoney(5719.50)],
    ] },
    extra: `<h4 class="pdf-title" style="margin-top:16px">Resumen anual por mes ${'(Nuevo)'}</h4><table><thead><tr><th>Mes</th><th>Cheques</th><th>Importe</th></tr></thead><tbody><tr><td>Abril</td><td>142</td><td>${fmtMoney(842190.00)}</td></tr><tr><td>Septiembre</td><td>37</td><td>${fmtMoney(48219.40)}</td></tr></tbody></table>`,
  });
  if (id === 'reemb') return pdfSheet({ title: 'Resumen de pago de reembolsos (Cupón 19)', kv: [['Cupón', '19'], ['Acumulado', fmtMoney(1204880.00)]], table: { head: ['Accionista', 'Acciones', 'Importe'], rows: [['Estela Garza Villarreal', '18,450', fmtMoney(2214.00)], ['Jorge Alberto Elizondo Ríos', '42,300', fmtMoney(5076.00)]] }, signs: ['Solicita', 'Autoriza'] });
  if (id === 'reembmes') return pdfSheet({ title: 'Reembolsos pagados por mes', kv: [['Año', '2026']], table: { head: ['Mes', 'Operaciones', 'Importe'], rows: [['Marzo', '88', fmtMoney(204120.00)], ['Septiembre', '12', fmtMoney(18400.00)]] }, extra: `<h4 class="pdf-title" style="margin-top:14px">Resumen anual (Nuevo)</h4><div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px"><span>Total 2026</span><b>${fmtMoney(1204880.00)}</b></div>` });
  if (id === 'registro') return pdfSheet({ title: 'Registro de acciones', note: 'Conforme al Art. 8 de los estatutos y Art. 128 de la LGSM.', table: { head: ['Título', 'Accionista', 'Acción inicial', 'Acción final', 'Acciones'], rows: DATA.titulos.map(t => ['Título ' + t.num, t.accionistaNombre, fmtNum(t.accIni), fmtNum(t.accFin), fmtNum(t.acciones)]) } });
  if (id === 'fracciones') return pdfSheet({ title: 'Fracciones sobrantes (desde 1996)', table: { head: ['Fecha', 'Accionista', 'Fracción', 'Importe'], rows: [['29/09/2026', 'Rogelio Treviño Leal', '0.50', fmtMoney(6.50)], ['12/04/2025', 'Estela Garza Villarreal', '0.25', fmtMoney(3.25)]] }, extra: `<h4 class="pdf-title" style="margin-top:16px">Arqueo de fracciones sobrantes (Nuevo)</h4><table><tbody><tr><td>Saldo inicial</td><td style="text-align:right"><b>${fmtMoney(1240.00)}</b></td></tr><tr><td>Solicitudes de efectivo</td><td style="text-align:right"><b>- ${fmtMoney(320.50)}</b></td></tr><tr><td>Compras</td><td style="text-align:right"><b>+ ${fmtMoney(150.00)}</b></td></tr><tr><td><b>Saldo caja</b></td><td style="text-align:right"><b>${fmtMoney(1069.50)}</b></td></tr></tbody></table>` });
  // canjes
  return pdfSheet({ title: 'Canjes mensuales — Septiembre 2026', table: { head: ['Canje', 'Accionista', 'Acciones canjeadas'], rows: [['Canje 93', 'Rogelio Treviño Leal', '3,487'], ['Canje 92', 'María Fernanda Salinas Cantú', '7,200']] }, extra: `<div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:6px;margin-top:6px"><span><b>Total acciones canjeadas</b></span><b>10,687</b></div><h4 class="pdf-title" style="margin-top:16px">Conciliación de canjes del mes (Nuevo)</h4><table><tbody><tr><td>Títulos entrantes</td><td style="text-align:right"><b>2</b></td></tr><tr><td>Títulos generados</td><td style="text-align:right"><b>3</b></td></tr><tr><td>Diferencia de acciones</td><td style="text-align:right;color:#12805C"><b>$0.00</b></td></tr></tbody></table>` });
}
