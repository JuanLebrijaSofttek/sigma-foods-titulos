/* ============================================================
   Pantallas 9-11 — Liquidaciones y Cheques
   ============================================================ */

/* ---------- 9. Liquidaciones ---------- */
function screenLiquidaciones() {
  // Los Títulos 104 y 105 NO aparecen: ya se liquidaron en el canje 93.
  const rows = [
    { titulo: 103, acc: 'María Fernanda Salinas Cantú', cupon: 44, acciones: 5000, importe: 5000 * 0.325 },
    { titulo: 106, acc: 'Estela Garza Villarreal', cupon: 44, acciones: 7000, importe: 7000 * 0.325 },
    { titulo: 107, acc: 'Estela Garza Villarreal', cupon: 44, acciones: 5000, importe: 5000 * 0.325 },
  ];
  const totAcc = rows.reduce((s, r) => s + r.acciones, 0);
  const totImp = rows.reduce((s, r) => s + r.importe, 0);
  const cols = [
    { key: 'titulo', label: 'Título', num: true, render: r => 'Título ' + r.titulo },
    { key: 'acc', label: 'Accionista' },
    { key: 'cupon', label: 'Último cupón', num: true },
    { key: 'acciones', label: 'Acciones', num: true, render: r => fmtNum(r.acciones) },
    { key: 'importe', label: 'Importe', num: true, render: r => fmtMoney(r.importe) },
  ];
  const foot = [
    { value: 'Totales', span: 3 },
    { value: fmtNum(totAcc), num: true },
    { value: fmtMoney(totImp), num: true },
  ];
  return pageHead({ crumbs: ['Liquidaciones y Cheques', 'Liquidaciones'], title: 'Liquidaciones', sub: 'Genera la liquidación de dividendos por rango de títulos y pásala directo a cheques.' }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="grid grid-4">
      <div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Título (del)</label><input class="input num" value="103"></div>
      <div class="field"><label>Título (al)</label><input class="input num" value="107"></div>
      <div class="field"><label>Tipo de moneda</label>
        <div class="segmented"><button class="active">Pesos</button><button>Dólares</button><button>Ambos</button></div>
      </div>
    </div>
    <div class="grid grid-2" style="margin-top:14px;max-width:520px">
      <div class="field"><label>Forma de pago</label>
        <div class="segmented"><button class="active">Cheque</button><button>Transferencia</button></div>
      </div>
    </div>
  </div></div>
  ${dataTable({ cols, rows, foot, filters: true })}
  <div class="card" style="margin-top:16px"><div class="card-body row between wrap gap-4">
    <div class="row gap-6 wrap" style="gap:32px">
      <div><div class="tiny muted">Liquidación inicial</div><div class="strong num">${DATA.folios.liquidacionInicial}</div></div>
      <div><div class="tiny muted">Cupón actual</div><div class="strong num">44</div></div>
      <div><div class="tiny muted">Dividendo por acción</div><div class="strong num">${fmtMoney(0.325)}</div></div>
    </div>
    <button class="btn btn-primary" onclick="toastBitacora('Liquidación','Liquidación generada · rango 103-107','${DATA.folios.liquidacionInicial}');go('liquidaciones/cheques')">${ICON('arrowRight')} Generar y pasar a cheques</button>
  </div></div>
  <div class="alert alert-info" style="margin-top:14px">${ICON('info')} Los Títulos 104 y 105 no aparecen: ya se liquidaron en el canje 93 (liquidación 10144037).</div>`;
}

/* ---------- 10. Liquidaciones Indeval ---------- */
function screenIndeval() {
  const rows = [
    { titulo: 51, acc: 'Jorge Alberto Elizondo Ríos', acciones: 12800 },
    { titulo: 63, acc: 'Estela Garza Villarreal', acciones: 9500 },
    { titulo: 77, acc: 'María Fernanda Salinas Cantú', acciones: 4200 },
  ];
  const tot = rows.reduce((s, r) => s + r.acciones, 0);
  const cols = [
    { key: 'titulo', label: 'Título entregado', num: true, render: r => 'Título ' + r.titulo },
    { key: 'acc', label: 'Accionista de origen' },
    { key: 'acciones', label: 'Acciones', num: true, render: r => fmtNum(r.acciones) },
    { key: 'x', label: 'Nuevo titular', render: () => `<span class="badge badge-inst">${ICON('bank')} S.D. INDEVAL</span>` },
  ];
  return pageHead({ crumbs: ['Liquidaciones y Cheques', 'Liquidaciones Indeval'], title: 'Liquidaciones Indeval', sub: 'Captura los títulos que varios accionistas entregan a Indeval. El titular cambia a S.D. INDEVAL y se consolidan en un solo título.' }) + `
  <div class="grid grid-side">
    <div class="card"><div class="card-head"><h3>Títulos entregados a Indeval</h3><button class="btn btn-secondary btn-sm">${ICON('plus')} Agregar título</button></div><div class="card-body">
      ${dataTable({ cols, rows, foot: [{ value: 'Total de acciones', span: 2 }, { value: fmtNum(tot), num: true }, { value: '' }] })}
      <div class="row gap-2" style="margin-top:16px"><button class="btn btn-primary" onclick="toastBitacora('Liquidación','Consolidación Indeval · 3 títulos','T-108')">${ICON('layers')} Consolidar en un título</button></div>
    </div></div>
    <div class="card parity-card"><div class="card-head"><h3>Vista previa de consolidación</h3></div><div class="card-body col gap-3">
      <div class="alert alert-info">${ICON('info')} Al canjear, los 3 títulos se consolidan en un único título a nombre de S.D. INDEVAL.</div>
      <div class="saldo-row"><span class="secondary">Títulos origen</span><span class="strong num">3</span></div>
      <div class="saldo-row"><span class="secondary">Nuevo título</span><span class="strong num">Título 108</span></div>
      <div class="saldo-row total"><span>Acciones consolidadas</span><span class="strong num">${fmtNum(tot)}</span></div>
    </div></div>
  </div>`;
}

/* ---------- 11. Cheques ---------- */
let _chequeTab = 'imprimir';
let _chequeConcepto = 'Todos';
function screenCheques() {
  window._afterRender = () => renderChequeTab();
  return pageHead({ crumbs: ['Liquidaciones y Cheques', 'Cheques'], title: 'Cheques', sub: 'Imprime, reimprime y sustituye cheques. La vista previa se imprime en tu impresora local desde el navegador.' }) + `
  <div class="tabs" style="margin-bottom:16px">
    <div class="tab ${_chequeTab === 'imprimir' ? 'active' : ''}" onclick="setChequeTab('imprimir')">Por imprimir</div>
    <div class="tab ${_chequeTab === 'reimpresion' ? 'active' : ''}" onclick="setChequeTab('reimpresion')">Reimpresión</div>
    <div class="tab ${_chequeTab === 'sustitucion' ? 'active' : ''}" onclick="setChequeTab('sustitucion')">Sustitución</div>
  </div>
  <div id="chequeBody"></div>`;
}
function setChequeTab(t) { _chequeTab = t; renderChequeTab(); document.querySelectorAll('.tabs .tab').forEach((el, i) => el.classList.toggle('active', ['imprimir', 'reimpresion', 'sustitucion'][i] === t)); }
function setChequeConcepto(c) { _chequeConcepto = c; renderChequeTab(); }
function renderChequeTab() {
  const body = document.getElementById('chequeBody');
  if (!body) return;
  if (_chequeTab === 'imprimir') {
    let rows = [
      { folio: 5290, acc: 'Rogelio Treviño Leal', liq: '10144037', concepto: 'Dividendos', importe: 5883.62 },
      { folio: 5291, acc: 'María Fernanda Salinas Cantú', liq: '10144001', concepto: 'Dividendos', importe: 1625.00 },
      { folio: 5292, acc: 'Estela Garza Villarreal', liq: '10144002', concepto: 'Dividendos', importe: 2275.00 },
      { folio: 5293, acc: 'Jorge Alberto Elizondo Ríos', liq: '10119014', concepto: 'Reembolso', importe: 5076.00 },
      { folio: 5294, acc: 'Estela Garza Villarreal', liq: '10119015', concepto: 'Reembolso', importe: 1440.00 },
    ];
    if (_chequeConcepto !== 'Todos') rows = rows.filter(r => r.concepto === _chequeConcepto);
    const tot = rows.reduce((s, r) => s + r.importe, 0);
    const cols = [
      { key: 'sel', label: '', render: () => `<input type="checkbox" checked style="accent-color:var(--sigma-red)">` },
      { key: 'folio', label: 'Cheque', render: r => 'CH ' + r.folio },
      { key: 'acc', label: 'Beneficiario' },
      { key: 'concepto', label: 'Concepto', render: r => `<span class="badge ${r.concepto === 'Reembolso' ? 'badge-warning' : ''}">${esc(r.concepto)}</span>` },
      { key: 'liq', label: 'Liquidación' },
      { key: 'importe', label: 'Importe', num: true, render: r => fmtMoney(r.importe) },
    ];
    const chips = ['Todos', 'Dividendos', 'Reembolso'].map(c => `<button class="chip ${_chequeConcepto === c ? 'active' : ''}" onclick="setChequeConcepto('${c}')">${c}</button>`).join('');
    body.innerHTML = `<div class="grid grid-side">
      <div class="col gap-3">
        <div class="chip-row"><span class="tiny muted" style="align-self:center;margin-right:4px">Concepto:</span>${chips}</div>
        ${dataTable({ cols, rows, foot: [{ value: 'Total seleccionado', span: 5 }, { value: fmtMoney(tot), num: true }], filters: true })}
        <div class="row"><button class="btn btn-primary" onclick="doPrint('Cheques seleccionados (${rows.length})')">${ICON('print')} Imprimir cheques seleccionados</button></div>
      </div>
      <div class="card"><div class="card-head"><h3>Vista previa · CH 5290</h3></div><div class="card-body doc-preview" style="background:#EEF0F3">${chequeSheet({ folio: 5290, beneficiario: 'Rogelio Treviño Leal', importe: 5883.62, concepto: 'Dividendos cupones 39-44', fecha: '30/09/2026' })}</div></div>
    </div>`;
  } else if (_chequeTab === 'reimpresion') {
    body.innerHTML = `<div class="card" style="max-width:640px"><div class="card-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Cheque inicial</label><input class="input num" value="5285"></div><div class="field"><label>Cheque final</label><input class="input num" value="5289"></div></div>
      <div class="field"><label>Folio original</label><input class="input num readonly" value="CH 5285" readonly></div>
      <div class="field"><label>Motivo de reimpresión <span style="color:var(--error)">*</span></label>
        <select class="select"><option>Atasco de impresora</option><option>Error de impresión</option><option>Otro</option></select>
      </div>
      <div class="alert alert-warning">${ICON('alertTri')} Toda reimpresión queda registrada en la bitácora de impresión.</div>
      <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Impresión','Reimpresión de cheques 5285-5289 · Atasco de impresora','CH-5285')">${ICON('print')} Reimprimir rango</button></div>
    </div></div>`;
  } else {
    body.innerHTML = `<div class="card" style="max-width:640px"><div class="card-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Cheque a sustituir</label><input class="input num readonly" value="CH 5285" readonly></div><div class="field"><label>Beneficiario</label><input class="input readonly" value="Jorge Alberto Elizondo Ríos" readonly></div></div>
      <div class="field"><label>Concepto</label><input class="input readonly" value="Dividendos cupón 44" readonly></div>
      <div class="grid grid-2"><div class="field"><label>Total</label><input class="input num readonly" value="$4,092.00" readonly></div><div class="field"><label>Nuevo folio asignado <span class="badge">auto</span></label><input class="input num readonly" value="CH 5291" readonly></div></div>
      <div class="field"><label>Motivo <span style="color:var(--error)">*</span></label>
        <select class="select"><option>Cheque extraviado</option><option>Datos incorrectos</option><option>Deterioro</option><option>Otro</option></select>
      </div>
      <div class="alert alert-info">${ICON('info')} El cheque original CH 5285 queda <b>Cancelado</b> y se registra en la bitácora de impresión.</div>
      <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Cheque','Cheque CH 5285 sustituido por CH 5291 · Cheque extraviado','CH-5291')">${ICON('replace')} Sustituir cheque</button></div>
    </div></div>`;
  }
}
