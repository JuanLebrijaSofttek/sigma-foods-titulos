/* ============================================================
   Pantallas 9-11 — Liquidaciones y Cheques
   ============================================================ */

/* ---------- 9. Liquidaciones ---------- */
function screenLiquidaciones() {
  const rows = [
    { titulo: 88, acc: 'Estela Garza Villarreal', cupon: 43, acciones: 18450, importe: 18450 * 0.31 },
    { titulo: 92, acc: 'María Fernanda Salinas Cantú', cupon: 43, acciones: 7200, importe: 7200 * 0.31 },
    { titulo: 104, acc: 'Rogelio Treviño Leal', cupon: 43, acciones: 2000, importe: 2000 * 0.31 },
    { titulo: 105, acc: 'Rogelio Treviño Leal', cupon: 43, acciones: 1487, importe: 1487 * 0.31 },
  ];
  const totAcc = rows.reduce((s, r) => s + r.acciones, 0);
  const totImp = rows.reduce((s, r) => s + r.importe, 0);
  const cols = [
    { key: 'titulo', label: 'Título', num: true, render: r => 'Título ' + r.titulo },
    { key: 'acc', label: 'Accionista' },
    { key: 'cupon', label: 'Último cupón', num: true },
    { key: 'acciones', label: 'Acciones', num: true, render: r => fmtNum(r.acciones) },
    { key: 'importe', label: 'Importe', num: true, render: r => fmtMoney(r.importe) },
  ];
  const foot = [
    { value: 'Totales', span: 3 },
    { value: fmtNum(totAcc), num: true },
    { value: fmtMoney(totImp), num: true },
  ];
  return pageHead({ crumbs: ['Liquidaciones y Cheques', 'Liquidaciones'], title: 'Liquidaciones', sub: 'Genera la liquidación de dividendos por rango de títulos y pásala directo a cheques.' }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="grid grid-4">
      <div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Título (del)</label><input class="input num" value="88"></div>
      <div class="field"><label>Título (al)</label><input class="input num" value="105"></div>
      <div class="field"><label>Tipo de moneda</label>
        <div class="segmented"><button class="active">Pesos</button><button>Dólares</button><button>Ambos</button></div>
      </div>
    </div>
  </div></div>
  ${dataTable({ cols, rows, foot, filters: true })}
  <div class="card" style="margin-top:16px"><div class="card-body row between wrap gap-4">
    <div class="row gap-6 wrap" style="gap:32px">
      <div><div class="tiny muted">Liquidación inicial</div><div class="strong num">${DATA.folios.proxLiquidacion}</div></div>
      <div><div class="tiny muted">Cupón actual</div><div class="strong num">43</div></div>
      <div><div class="tiny muted">Dividendo por acción</div><div class="strong num">${fmtMoney(0.31)}</div></div>
    </div>
    <button class="btn btn-primary" onclick="toastBitacora('Liquidación','Liquidación generada · rango 88-105','${DATA.folios.proxLiquidacion}');go('liquidaciones/cheques')">${ICON('arrowRight')} Generar y pasar a cheques</button>
  </div></div>`;
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
      <div class="row gap-2" style="margin-top:16px"><button class="btn btn-primary" onclick="toastBitacora('Liquidación','Consolidación Indeval · 3 títulos','T-107')">${ICON('layers')} Consolidar en un título</button></div>
    </div></div>
    <div class="card parity-card"><div class="card-head"><h3>Vista previa de consolidación</h3></div><div class="card-body col gap-3">
      <div class="alert alert-info">${ICON('info')} Al canjear, los 3 títulos se consolidan en un único título a nombre de S.D. INDEVAL.</div>
      <div class="saldo-row"><span class="secondary">Títulos origen</span><span class="strong num">3</span></div>
      <div class="saldo-row"><span class="secondary">Nuevo título</span><span class="strong num">Título 107</span></div>
      <div class="saldo-row total"><span>Acciones consolidadas</span><span class="strong num">${fmtNum(tot)}</span></div>
    </div></div>
  </div>`;
}

/* ---------- 11. Cheques ---------- */
let _chequeTab = 'imprimir';
function screenCheques() {
  window._afterRender = () => renderChequeTab();
  return pageHead({ crumbs: ['Liquidaciones y Cheques', 'Cheques'], title: 'Cheques', sub: 'Imprime, reimprime y sustituye cheques. La vista previa se imprime en tu impresora local desde el navegador.' }) + `
  <div class="tabs" style="margin-bottom:16px">
    <div class="tab ${_chequeTab === 'imprimir' ? 'active' : ''}" onclick="setChequeTab('imprimir')">Por imprimir</div>
    <div class="tab ${_chequeTab === 'reimpresion' ? 'active' : ''}" onclick="setChequeTab('reimpresion')">Reimpresión</div>
    <div class="tab ${_chequeTab === 'sustitucion' ? 'active' : ''}" onclick="setChequeTab('sustitucion')">Sustitución</div>
  </div>
  <div id="chequeBody"></div>`;
}
function setChequeTab(t) { _chequeTab = t; renderChequeTab(); document.querySelectorAll('.tabs .tab').forEach((el, i) => el.classList.toggle('active', ['imprimir', 'reimpresion', 'sustitucion'][i] === t)); }
function renderChequeTab() {
  const body = document.getElementById('chequeBody');
  if (!body) return;
  if (_chequeTab === 'imprimir') {
    const rows = [
      { folio: 5290, acc: 'Rogelio Treviño Leal', liq: '10144037', importe: 5883.62 },
      { folio: 5291, acc: 'Estela Garza Villarreal', liq: '10143014', importe: 5719.50 },
      { folio: 5292, acc: 'María Fernanda Salinas Cantú', liq: '10143014', importe: 2232.00 },
    ];
    const tot = rows.reduce((s, r) => s + r.importe, 0);
    const cols = [
      { key: 'sel', label: '', render: () => `<input type="checkbox" checked style="accent-color:var(--sigma-red)">` },
      { key: 'folio', label: 'Cheque', render: r => 'CH ' + r.folio },
      { key: 'acc', label: 'Beneficiario' },
      { key: 'liq', label: 'Liquidación' },
      { key: 'importe', label: 'Importe', num: true, render: r => fmtMoney(r.importe) },
    ];
    body.innerHTML = `<div class="grid grid-side">
      <div class="col gap-3">
        ${dataTable({ cols, rows, foot: [{ value: 'Total seleccionado', span: 4 }, { value: fmtMoney(tot), num: true }] })}
        <div class="row"><button class="btn btn-primary" onclick="doPrint('Cheques seleccionados (3)')">${ICON('print')} Imprimir cheques seleccionados</button></div>
      </div>
      <div class="card"><div class="card-head"><h3>Vista previa · CH 5290</h3></div><div class="card-body doc-preview" style="background:#EEF0F3">${chequeSheet({ folio: 5290, beneficiario: 'Rogelio Treviño Leal', importe: 5883.62, concepto: 'Dividendos cupones 39-44', fecha: '29/09/2026' })}</div></div>
    </div>`;
  } else if (_chequeTab === 'reimpresion') {
    body.innerHTML = `<div class="card" style="max-width:640px"><div class="card-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Cheque inicial</label><input class="input num" value="5285"></div><div class="field"><label>Cheque final</label><input class="input num" value="5289"></div></div>
      <div class="field"><label>Motivo <span style="color:var(--error)">*</span></label><textarea class="input" rows="3" placeholder="Motivo de la reimpresión (obligatorio)"></textarea></div>
      <div class="alert alert-warning">${ICON('alertTri')} Toda reimpresión queda registrada en la bitácora de impresión.</div>
      <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Impresión','Reimpresión de cheques 5285-5289','CH-5285')">${ICON('print')} Reimprimir rango</button></div>
    </div></div>`;
  } else {
    body.innerHTML = `<div class="card" style="max-width:640px"><div class="card-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Cheque a sustituir</label><input class="input num" value="5288"></div><div class="field"><label>Accionista</label><input class="input readonly" value="Jorge Alberto Elizondo Ríos" readonly></div></div>
      <div class="field"><label>Concepto</label><input class="input" value="Dividendos cupón 43"></div>
      <div class="grid grid-2"><div class="field"><label>Total</label><input class="input num" value="$4,092.00"></div><div class="field"><label>Nuevo folio <span class="badge">auto</span></label><input class="input num readonly" value="CH 5293" readonly></div></div>
      <div class="field"><label>Motivo <span style="color:var(--error)">*</span></label><textarea class="input" rows="3" placeholder="Motivo de la sustitución (obligatorio)"></textarea></div>
      <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Cheque','Cheque 5288 sustituido por 5293','CH-5293')">${ICON('replace')} Sustituir cheque</button></div>
    </div></div>`;
  }
}
