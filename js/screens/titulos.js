/* ============================================================
   Pantallas 3-8 — Títulos
   ============================================================ */

/* ---------- 3. Generación ---------- */
function screenGeneracion() {
  const vig = emisionVigente();
  const asignadas = 5321037150; // acciones asignadas antes de hoy (Feb-26)
  const disp = (vig ? vig.acciones : 0) - asignadas;
  window._afterRender = () => bindGeneracion();
  return pageHead({
    crumbs: ['Títulos', 'Generación'], title: 'Generación de título',
    sub: 'Emite un nuevo título accionario. La acción inicial y final se calculan solas a partir del saldo de la emisión.',
  }) + `
  <div class="grid grid-side">
    <div class="card"><div class="card-body col gap-4">
      <div class="field"><label>Emisión</label>
        <select class="select" id="genEmision" onchange="genEmisionChange()">${emisionesDe().map(e => `<option value="${e.id}" ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}${e.vigente ? ' · vigente' : ''}</option>`).join('')}<option value="__nueva">+ Nueva emisión…</option></select>
      </div>
      <div class="field"><label>Accionista</label>
        <div class="row gap-2">
          <select class="select grow" id="genAccionista">${DATA.accionistas.map(a => `<option value="${a.id}" ${a.id === 'a3' ? 'selected' : ''}>${esc(a.nombre)}</option>`).join('')}</select>
          <button class="btn btn-secondary" onclick="modalAltaAccionista()">${ICON('plus')} Dar de alta accionista</button>
        </div>
      </div>
      <div class="field"><label>Acciones</label><input class="input num" id="genAcciones" type="text" value="5,000" oninput="recalcGen()"></div>
      <div class="grid grid-2">
        <div class="field"><label>Acción inicial <span class="badge">auto</span></label><input class="input num readonly" id="genAccIni" value="5,321,037,151" readonly></div>
        <div class="field"><label>Acción final <span class="badge">auto</span></label><input class="input num readonly" id="genAccFin" value="5,321,042,150" readonly></div>
      </div>
      <div class="alert alert-info">${ICON('info')} La numeración continúa automáticamente desde el último título emitido en la emisión. No hay huecos ni traslapes.</div>
      <div class="row gap-2"><button class="btn btn-primary" onclick="generarTitulo()">${ICON('file')} Generar título</button><button class="btn btn-ghost" onclick="go('inicio')">Cancelar</button></div>
      <div id="genResult"></div>
    </div></div>

    <div class="card"><div class="card-head"><h3>Saldo de la emisión</h3></div><div class="card-body col gap-3">
      <div class="saldo-row"><span class="secondary">Total de acciones de la emisión</span><span class="strong num">${fmtNum(vig ? vig.acciones : 0)}</span></div>
      <div class="saldo-row"><span class="secondary">Asignadas en títulos vigentes</span><span class="strong num">${fmtNum(asignadas)}</span></div>
      <div class="progress"><div class="bar" style="width:${(asignadas / (vig.acciones)) * 100}%"></div></div>
      <div class="saldo-row total"><span>Disponibles</span><span class="strong num">${fmtNum(disp)}</span></div>
      <div class="tiny muted">Emisión vigente: ${esc(vig.corto)} · cupón inicial ${vig.cuponIni} · cupón actual ${vig.cuponActual}</div>
    </div></div>
  </div>`;
}
function bindGeneracion() {}
function genEmisionChange() {
  const sel = document.getElementById('genEmision');
  if (sel.value === '__nueva') { sel.value = emisionVigente().id; modalEmision(); }
}
function recalcGen() {
  const acc = parseInt(document.getElementById('genAcciones').value.replace(/[^\d]/g, '') || '0');
  const ini = 5321037151; const fin = ini + acc - 1;
  document.getElementById('genAccIni').value = fmtNum(ini);
  document.getElementById('genAccFin').value = fmtNum(acc ? fin : ini);
}
function generarTitulo() {
  toastBitacora('Generación de título', `Título 103 emitido`, 'T-103');
  const acc = document.getElementById('genAcciones').value;
  const accName = document.getElementById('genAccionista').selectedOptions[0].text;
  document.getElementById('genResult').innerHTML = `<div style="margin-top:8px">` + renderDocPanel([
    { nombre: 'Recibo de título nuevo', meta: 'PDF · Título 103', preview: pdfSheet({
      title: 'Recibo de título nuevo',
      kv: [['Título', '103'], ['Emisión', emisionVigente().nombre], ['Accionista', accName], ['Acciones', acc], ['Acción inicial', document.getElementById('genAccIni').value], ['Acción final', document.getElementById('genAccFin').value]],
      note: 'Documento generado automáticamente por el Sistema de Gestión y Canje de Títulos.',
      signs: ['Solicita', 'Autoriza'],
    }) }
  ]) + `</div>`;
}

function modalAltaAccionista() {
  openModal(`<div class="modal-head"><h3>Dar de alta accionista</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-3">
      <div class="grid grid-2">
        <div class="field"><label>Id accionista</label><input class="input readonly" value="Automático" readonly></div>
        <div class="field"><label>Marcador</label><select class="select"><option>Persona física</option><option>Institucional</option><option>Indeval</option></select></div>
      </div>
      <div class="field"><label>Nombre completo</label><input class="input" placeholder="Nombre del accionista"></div>
      <div class="grid grid-2">
        <div class="field"><label>RFC</label><input class="input" placeholder="XAXX010101000"></div>
        <div class="field"><label>CURP</label><input class="input" placeholder="18 caracteres"></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Nacionalidad</label><input class="input" value="Mexicana"></div>
        <div class="field"><label>País</label><select class="select">${DATA.paises.map(p => `<option>${p}</option>`).join('')}</select></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Estado</label><select class="select">${DATA.estados.map(p => `<option>${p}</option>`).join('')}</select></div>
        <div class="field"><label>Ciudad</label><select class="select">${DATA.ciudades.map(p => `<option>${p}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Domicilio</label><input class="input" placeholder="Calle, número, colonia"></div>
      <div class="grid grid-2">
        <div class="field"><label>Teléfono</label><input class="input" placeholder="81 0000 0000"></div>
        <div class="field"><label>Correo electrónico</label><input class="input" placeholder="correo@dominio.com"></div>
      </div>
      <div class="alert alert-info">${ICON('info')} El catálogo de accionistas es propio de cada emisora. Si ya existe en otra, puedes vincularlo desde Accionistas.</div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Alta de accionista','Nuevo accionista registrado')">Guardar accionista</button></div>`, { size: 'lg' });
}

/* ---------- 4. Canje — asistente de 5 pasos (caso Don Rogelio · Canje 93) ---------- */
const CANJE = {
  paso: 1,
  caso: DATA.casoRogelio,
  // distribución
  dist: [{ titulo: 104, acciones: 2000 }, { titulo: 105, acciones: 1487 }],
  multi: true,
  formaPago: 'cheque', // 'cheque' | 'transferencia'
};

function screenCanje() {
  window._afterRender = () => { document.addEventListener('keydown', canjeKeys); };
  const steps = ['Identificar', 'Calcular', 'Distribuir', 'Dividendos', 'Verificación'];
  return pageHead({
    crumbs: ['Títulos', 'Canje'], title: 'Asistente de canje',
    sub: 'Caso precargado: Don Rogelio Treviño Leal · Título 17 de 1996 · Canje 93.',
    actions: `<button class="btn btn-ghost" onclick="go('inicio')">${ICON('x')} Cancelar</button>`,
  }) + `
  <div class="card" style="margin-bottom:18px"><div class="card-body" style="padding:16px 20px">${stepper(steps, CANJE.paso)}</div></div>
  <div id="canjeBody">${canjeStep()}</div>`;
}

function canjeKeys(e) {
  if (e.target.matches('input,textarea,select')) { if (e.key !== 'Enter') return; }
  if (e.key === 'Enter' && CANJE.paso < 5) { e.preventDefault(); canjeNext(); }
  if (e.key === 'Enter' && CANJE.paso === 5) { e.preventDefault(); confirmarCanje(); }
  if (e.key === 'Escape') go('inicio');
}
function canjeGoto(n) { CANJE.paso = n; document.getElementById('canjeBody').innerHTML = canjeStep(); refreshStepper(); }
function canjeNext() { if (CANJE.paso < 5) canjeGoto(CANJE.paso + 1); }
function canjePrev() { if (CANJE.paso > 1) canjeGoto(CANJE.paso - 1); }
function refreshStepper() {
  const steps = ['Identificar', 'Calcular', 'Distribuir', 'Dividendos', 'Verificación'];
  document.querySelector('#view .card .card-body .stepper').outerHTML = stepper(steps, CANJE.paso);
}

function canjeNav(backLabel = 'Atrás', nextLabel = 'Continuar', nextFn = 'canjeNext()') {
  return `<div class="wizard-nav">
    ${CANJE.paso > 1 ? `<button class="btn btn-secondary" onclick="canjePrev()">${ICON('arrowLeft')} ${backLabel}</button>` : '<span></span>'}
    ${shortcutHints()}
    <button class="btn btn-primary" onclick="${nextFn}">${nextLabel} ${ICON('arrowRight')}</button>
  </div>`;
}

function canjeStep() {
  return [null, canjeP1, canjeP2, canjeP3, canjeP4, canjeP5][CANJE.paso]();
}

/* Paso 1 — Identificar */
function canjeP1() {
  const vig = emisionVigente();
  return `<div class="grid grid-wizard">
    <div class="card"><div class="card-head"><h3>Paso 1 · Identificar el canje</h3></div><div class="card-body col gap-4">
      <div class="field"><label>Emisión para el canje</label>
        <select class="select" id="canjeEmision">${emisionesDe().map(e => `<option value="${e.id}" ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}${e.vigente ? ' · vigente' : ''}</option>`).join('')}</select>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Total de acciones de la emisión</label><input class="input num readonly" value="${fmtNum(vig.acciones)}" readonly></div>
        <div class="field"><label>Precio por acción</label><input class="input num readonly" value="${fmtMoney(DATA.precioPorAccion)}" readonly></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Siguiente consecutivo de canje</label><input class="input readonly num" value="Canje 93" readonly></div>
        <div class="field"><label>Siguiente número de título</label><input class="input readonly num" value="Título 104" readonly></div>
      </div>
      <div class="section-title">Título presentado</div>
      <div class="grid grid-2">
        <div class="field"><label>Emisión origen</label><input class="input readonly" value="T.D. Serie 'A' Junio-96" readonly></div>
        <div class="field"><label>Número de título</label><input class="input num" value="17"></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Acciones</label><input class="input num" value="2,450"></div>
        <div class="field"><label>Último cupón cobrado</label><input class="input num" value="38"></div>
      </div>
      <div class="alert alert-warning">${ICON('alertTri')} Este título es anterior a 2004. Se generará el <b>Recibo Hylsamex</b>.</div>
      ${canjeNav()}
    </div></div>

    <div class="card"><div class="card-head"><h3>Accionista</h3></div><div class="card-body col gap-3">
      <div class="row gap-3"><span class="avatar" style="background:linear-gradient(135deg,#1F1F24,#55585F)">RT</span>
        <div><div class="strong">Rogelio Treviño Leal</div><div class="tiny muted">Alta: 18/06/1996 · Monterrey, N.L.</div></div></div>
      <div class="saldo-row"><span class="secondary">RFC</span>${maskedField('TRLR580312H3','rfc')}</div>
      <div class="saldo-row"><span class="secondary">Títulos vigentes</span><span class="strong num">1</span></div>
      <div class="saldo-row"><span class="secondary">Acciones (origen)</span><span class="strong num">2,450</span></div>
      <div class="alert alert-info" style="margin-top:6px">${ICON('info')} Para cambiar de titular usa <b>Endoso</b>, no el canje.</div>
    </div></div>
  </div>`;
}

/* Paso 2 — Calcular */
function canjeP2() {
  const c = CANJE.caso;
  const r = CALC.splitAndProvisional(c.accionesOriginales, c.splitFactor, c.certificadoProvisional);
  const fracImporte = +(r.fraccion * DATA.precioPorAccion).toFixed(2);
  const rows = [
    { desc: '2,450 acciones originales × 1.35 (split 2001)', op: 'Split 1:1.35', amt: fmtNum(r.conSplit, 2) },
    { desc: '+ 180 acciones de certificado provisional (ampliación 2012)', op: 'Ampliación de capital', amt: '+ ' + fmtNum(c.certificadoProvisional), cls: 'sub' },
    { desc: 'Subtotal acciones equivalentes', op: '=', amt: fmtNum(r.total, 2) },
    { desc: 'Acciones al día (enteras)', op: 'piso', amt: fmtNum(r.enteras) },
    { desc: `Fracción sobrante ${fmtNum(r.fraccion,2)} × ${fmtMoney(DATA.precioPorAccion)}`, op: 'a pagar', amt: fmtMoney(fracImporte), cls: 'sub' },
    { desc: 'Acciones que recibe en la emisión vigente', op: 'RESULTADO', amt: fmtNum(r.enteras), cls: 'total' },
  ];
  return `<div class="grid grid-wizard">
    <div class="card"><div class="card-head"><h3>Paso 2 · Cálculo automático</h3></div><div class="card-body col gap-4">
      ${calcCard('Desglose del cálculo', rows)}
      <div class="alert alert-success">${ICON('checkCircle')} El sistema aplicó por sí mismo el split y la ampliación de capital. La fracción de <b>0.50</b> se paga en efectivo: <b>${fmtMoney(fracImporte)}</b>.</div>
      ${canjeNav()}
    </div></div>
    <div class="card"><div class="card-head"><h3>Línea de tiempo · Eventos corporativos</h3></div><div class="card-body">
      <div class="timeline">
        <div class="tl-item hl"><div class="tl-date">18/06/1996</div><div class="tl-title">Emisión del Título 17</div><div class="tl-desc">2,450 acciones · Serie 'A' Junio-96</div></div>
        <div class="tl-item"><div class="tl-date">14/05/2001</div><div class="tl-title">Split 1:1.35</div><div class="tl-desc">2,450 → 3,307.50 acciones</div></div>
        <div class="tl-item"><div class="tl-date">22/08/2012</div><div class="tl-title">Ampliación de capital</div><div class="tl-desc">+180 acciones (certificado provisional)</div></div>
        <div class="tl-item hl"><div class="tl-date">Hoy</div><div class="tl-title">Canje a emisión vigente</div><div class="tl-desc">3,487 acciones + fracción de $6.50</div></div>
      </div>
    </div></div>
  </div>`;
}

/* Paso 3 — Distribuir */
function canjeP3() {
  const total = 3487;
  const rows = CANJE.dist.map((d, i) => `<tr>
    <td>Título ${d.titulo}</td>
    <td>Rogelio Treviño Leal</td>
    <td class="num"><input class="input num" style="height:32px;width:120px" value="${fmtNum(d.acciones)}" oninput="updDist(${i}, this.value)"></td>
    <td><button class="btn btn-ghost btn-sm" onclick="rmDist(${i})">${ICON('trash')}</button></td>
  </tr>`).join('');
  const suma = CANJE.dist.reduce((s, d) => s + d.acciones, 0);
  const hayCero = CANJE.dist.some(d => d.acciones < 1);
  const ok = suma === total && !hayCero;
  let msg;
  if (hayCero) msg = `${ICON('alertTri')} Cada título debe tener al menos 1 acción`;
  else if (ok) msg = `${ICON('checkCircle')} Suma distribuida: <b class="num">${fmtNum(suma)}</b> de <b class="num">${fmtNum(total)}</b> · correcto`;
  else msg = `${ICON('alertTri')} Suma distribuida: <b class="num">${fmtNum(suma)}</b> de <b class="num">${fmtNum(total)}</b> · debe coincidir`;
  return `<div class="grid grid-wizard">
    <div class="card"><div class="card-head"><h3>Paso 3 · Distribuir en títulos</h3></div><div class="card-body col gap-4">
      <label class="switch-row"><input type="checkbox" ${CANJE.multi ? 'checked' : ''} onchange="toggleMulti(this.checked)"> Distribuir en varios títulos (mismo titular)</label>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Título</th><th>Titular</th><th class="num">Acciones</th><th></th></tr></thead><tbody id="distBody">${rows}</tbody></table></div>
      <button class="btn btn-secondary btn-sm" onclick="addDist()" ${CANJE.multi ? '' : 'disabled'}>${ICON('plus')} Agregar título</button>
      <div class="dist-check ${ok ? 'ok' : 'bad'}" id="distCheck">${msg}</div>
      <div class="alert alert-info">${ICON('info')} Para cambiar de titular usa <b>Endoso</b>.</div>
      ${canjeNav('Atrás', 'Continuar', ok ? 'canjeNext()' : 'toast(\'Ajusta la distribución\',\'Cada título debe tener al menos 1 acción y la suma debe ser 3,487\',\'warning\')')}
    </div></div>
    <div class="card"><div class="card-head"><h3>Resumen</h3></div><div class="card-body col gap-3">
      <div class="saldo-row"><span class="secondary">Acciones a distribuir</span><span class="strong num">${fmtNum(total)}</span></div>
      <div class="saldo-row"><span class="secondary">Títulos generados</span><span class="strong num">${CANJE.dist.length}</span></div>
      <div class="saldo-row total"><span>Pendiente por asignar</span><span class="strong num" style="color:${ok ? 'var(--success)' : 'var(--error)'}">${fmtNum(total - suma)}</span></div>
    </div></div>
  </div>`;
}
function toggleMulti(v) { CANJE.multi = v; if (!v) CANJE.dist = [{ titulo: 104, acciones: 3487 }]; else CANJE.dist = [{ titulo: 104, acciones: 2000 }, { titulo: 105, acciones: 1487 }]; document.getElementById('canjeBody').innerHTML = canjeStep(); }
function updDist(i, v) { CANJE.dist[i].acciones = parseInt(v.replace(/[^\d]/g, '') || '0'); refreshDistCheck(); }
function addDist() { const n = 104 + CANJE.dist.length; CANJE.dist.push({ titulo: n, acciones: 0 }); document.getElementById('canjeBody').innerHTML = canjeStep(); }
function rmDist(i) { CANJE.dist.splice(i, 1); document.getElementById('canjeBody').innerHTML = canjeStep(); }
function refreshDistCheck() { document.getElementById('canjeBody').innerHTML = canjeStep(); }

/* Paso 4 — Dividendos pendientes */
function canjeP4() {
  const c = CANJE.caso;
  const rows = c.dividendos.map(d => ({ cupon: 'Cupón ' + d.cupon, factor: fmtFactor(d.factor), importe: fmtMoney(d.importe) }));
  const cols = [
    { key: 'cupon', label: 'Cupón' },
    { key: 'factor', label: 'Factor', num: true },
    { key: 'importe', label: 'Importe', num: true },
  ];
  const foot = [{ value: 'Total dividendos', span: 2 }, { value: fmtMoney(c.totalDividendos), num: true }];
  const esTransfer = CANJE.formaPago === 'transferencia';
  return `<div class="grid grid-wizard">
    <div class="card"><div class="card-head"><h3>Paso 4 · Dividendos pendientes</h3><span class="badge badge-success">${ICON('checkCircle')} Calculado</span></div><div class="card-body col gap-4">
      ${dataTable({ cols, rows, foot })}
      <div class="row between saldo-row" style="border:1px solid var(--border);border-radius:8px;padding:12px 14px">
        <div><div class="tiny muted">Liquidación generada</div><div class="strong num">Folio ${c.liquidacion}</div></div>
        <div class="text-right"><div class="tiny muted">Regla de folio</div><div class="tiny">1 + emisora(01) + cupón(44) + consec(037)</div></div>
      </div>
      <div class="field"><label>Forma de pago</label>
        <div class="segmented" style="width:fit-content">
          <button class="${esTransfer ? '' : 'active'}" onclick="setCanjePago('cheque')">Cheque</button>
          <button class="${esTransfer ? 'active' : ''}" onclick="setCanjePago('transferencia')">Transferencia</button>
        </div>
      </div>
      ${esTransfer ? `<div class="grid grid-3">
        <div class="field"><label>Banco</label><input class="input" value="BBVA México"></div>
        <div class="field"><label>CLABE</label>${maskedField('012580012345678901','otro')}</div>
        <div class="field"><label>Referencia</label><input class="input num" value="10144037"></div>
      </div>` : ''}
      <div class="alert alert-info">${ICON('info')} Se acumulan los cupones 39 a 44 que Don Rogelio nunca cobró. Cada importe se calcula con el factor del cupón y sus acciones al día.</div>
      ${canjeNav()}
    </div></div>
    <div class="card"><div class="card-head"><h3>Cómo se calcula</h3></div><div class="card-body">
      ${calcCard('Ejemplo · Cupón 44', [
        { desc: '3,487 acciones × 0.32500000', op: 'factor cupón 44', amt: fmtMoney(1133.28) },
        { desc: 'Importe cupón 44', op: '=', amt: fmtMoney(1133.28), cls: 'total' },
      ])}
      <div class="tiny muted" style="margin-top:10px">Sin redondeos. El importe es acciones × factor con 2 decimales.</div>
    </div></div>
  </div>`;
}
function setCanjePago(v) { CANJE.formaPago = v; document.getElementById('canjeBody').innerHTML = canjeStep(); }

/* Paso 5 — Verificación y documentos */
function canjeP5() {
  const c = CANJE.caso;
  return `<div class="grid grid-wizard">
    <div class="card"><div class="card-head"><h3>Paso 5 · Verificación</h3></div><div class="card-body col gap-4">
      <div class="verify-grid">
        ${vrow('Accionista', 'Rogelio Treviño Leal')}
        ${vrow('Título presentado', "Título 17 · T.D. Serie 'A' Junio-96")}
        ${vrow('Emisión destino', emisionVigente().nombre)}
        ${vrow('Acciones originales', '2,450')}
        ${vrow('Acciones al día', '3,487')}
        ${vrow('Fracción sobrante pagada', fmtMoney(6.50))}
        ${vrow('Títulos generados', CANJE.dist.map(d => `Título ${d.titulo} (${fmtNum(d.acciones)})`).join(', '))}
        ${vrow('Dividendos pendientes', fmtMoney(c.totalDividendos))}
        ${vrow('Liquidación', 'Folio ' + c.liquidacion)}
        ${vrow('Forma de pago', CANJE.formaPago === 'transferencia' ? 'Transferencia' : 'Cheque CH ' + c.cheque)}
      </div>
      <div class="alert alert-warning">${ICON('alertTri')} Se generará el Recibo Hylsamex por ser título anterior a 2004.</div>
      <div class="wizard-nav">
        <button class="btn btn-secondary" onclick="canjePrev()">${ICON('arrowLeft')} Atrás</button>
        ${shortcutHints()}
        <button class="btn btn-primary btn-lg" onclick="confirmarCanje()">${ICON('checkCircle')} Confirmar canje</button>
      </div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Total a entregar</h3></div><div class="card-body col gap-3">
      <div class="saldo-row"><span class="secondary">Dividendos</span><span class="strong num">${fmtMoney(c.totalDividendos)}</span></div>
      <div class="saldo-row"><span class="secondary">Fracción sobrante</span><span class="strong num">${fmtMoney(6.50)}</span></div>
      <div class="saldo-row total"><span>${CANJE.formaPago === 'transferencia' ? 'Transferencia total' : 'Cheque total'}</span><span class="strong num">${fmtMoney(c.totalDividendos)}</span></div>
      <div class="tiny muted">La fracción de $6.50 se paga por separado (pago de fracción).</div>
    </div></div>
  </div>`;
}
function vrow(k, v) { return `<div class="vrow"><span class="tiny muted">${esc(k)}</span><span class="strong">${v}</span></div>`; }

function confirmarCanje() {
  document.removeEventListener('keydown', canjeKeys);
  const c = CANJE.caso;
  toastBitacora('Canje', `Canje 93 · Título 17 → Títulos ${CANJE.dist.map(d => d.titulo).join(', ')}`, 'CJ-93');
  const pagoDoc = CANJE.formaPago === 'transferencia'
    ? { nombre: 'Comprobante de transferencia', meta: 'PDF · ' + fmtMoney(c.totalDividendos), preview: pdfSheet({ title: 'Comprobante de transferencia', kv: [['Beneficiario', 'Rogelio Treviño Leal'], ['Banco', 'BBVA México'], ['CLABE', '0125 8•••• •••• 8901'], ['Referencia', c.liquidacion], ['Importe', fmtMoney(c.totalDividendos)], ['Concepto', 'Dividendos cupones 39-44 · Liquidación ' + c.liquidacion], ['Fecha', '30/09/2026']] }) }
    : { nombre: `Cheque CH ${c.cheque}`, meta: 'PDF · ' + fmtMoney(c.totalDividendos), preview: chequeSheet({ folio: c.cheque, beneficiario: 'Rogelio Treviño Leal', importe: c.totalDividendos, concepto: 'Dividendos cupones 39-44 · Liquidación ' + c.liquidacion, fecha: '30/09/2026' }) };
  const docs = [
    { nombre: 'Recibo de canje', meta: 'PDF · Canje 93', preview: pdfSheet({ title: 'Recibo de canje', kv: [['Canje', '93'], ['Accionista', 'Rogelio Treviño Leal'], ['Título origen', "17 · Serie 'A' Junio-96"], ['Títulos destino', CANJE.dist.map(d => d.titulo).join(', ')], ['Acciones al día', '3,487'], ['Fracción pagada', fmtMoney(6.50)]], signs: ['Solicita', 'Autoriza'] }) },
    { nombre: 'Recibo de liquidación', meta: 'PDF · Folio ' + c.liquidacion, preview: pdfSheet({ title: 'Recibo de liquidación de dividendos', kv: [['Folio', c.liquidacion], ['Accionista', 'Rogelio Treviño Leal'], ['Cupones', '39 a 44']], table: { head: ['Cupón', 'Factor', 'Importe'], rows: c.dividendos.map(d => ['Cupón ' + d.cupon, fmtFactor(d.factor), fmtMoney(d.importe)]) }, extra: `<div style="text-align:right;font-weight:700;margin-top:6px">Total: ${fmtMoney(c.totalDividendos)}</div>` }) },
    pagoDoc,
    { nombre: 'Recibo Hylsamex', meta: 'PDF · anterior a 2004', preview: pdfSheet({ title: 'Recibo Hylsamex', note: 'Emitido por tratarse de un título anterior a 2004. Cualquier pago previo al 2004 se atiende directo con quien representa a Hylsamex, S.A. de C.V.', kv: [['Título origen', '17'], ['Serie', "'A' Junio-96"], ['Accionista', 'Rogelio Treviño Leal'], ['Acciones', '2,450']] }) },
    { nombre: 'Pago de fracción', meta: 'PDF · ' + fmtMoney(6.50), preview: pdfSheet({ title: 'Comprobante de pago de fracción sobrante', kv: [['Canje', '93'], ['Fracción', '0.50 acciones'], ['Precio por acción', fmtMoney(DATA.precioPorAccion)], ['Importe pagado', fmtMoney(6.50)], ['Accionista', 'Rogelio Treviño Leal']] }) },
  ];
  document.getElementById('canjeBody').innerHTML = `
    <div class="alert alert-success" style="margin-bottom:16px">${ICON('checkCircle')} <b>Listo.</b> Don Rogelio se va con su título al día y sus dividendos cobrados.</div>
    <div class="card" style="margin-bottom:16px"><div class="card-body">${renderDocPanel(docs)}</div></div>
    <div class="row gap-2"><button class="btn btn-primary" onclick="go('seguridad/auditoria')">${ICON('activity')} Ver registro en bitácora</button><button class="btn btn-secondary" onclick="resetCanje();go('inicio')">Terminar</button></div>`;
  CANJE.paso = 5;
}
function resetCanje() { CANJE.paso = 1; }

/* ---------- 5. Sustitución ---------- */
function screenSustitucion() {
  return pageHead({ crumbs: ['Títulos', 'Sustitución'], title: 'Sustitución de título', sub: 'Anula un título vigente y genera uno nuevo en la misma emisión, conservando titular y acciones. El motivo es obligatorio y queda en bitácora.' }) + `
  <div class="grid grid-wizard">
    <div class="card"><div class="card-body col gap-4">
      <div class="grid grid-2">
        <div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>
        <div class="field"><label>Número de título</label><input class="input num" value="88"></div>
      </div>
      <div class="field"><label>Accionista</label><input class="input readonly" value="Estela Garza Villarreal" readonly></div>
      <div class="field"><label>Acciones</label><input class="input num readonly" value="12,000" readonly></div>
      <label class="switch-row"><input type="checkbox" checked onchange="toggleSustMulti(this.checked)" id="sustMulti"> Distribuir en varios títulos (mismo titular)</label>
      <div id="sustDist" class="table-wrap"><table class="tbl"><thead><tr><th>Título nuevo</th><th>Titular</th><th class="num">Acciones</th></tr></thead><tbody>
        <tr><td>Título 106 <span class="badge">auto</span></td><td>Estela Garza Villarreal</td><td class="num">7,000</td></tr>
        <tr><td>Título 107 <span class="badge">auto</span></td><td>Estela Garza Villarreal</td><td class="num">5,000</td></tr>
      </tbody></table></div>
      <div class="field"><label>Motivo <span style="color:var(--error)">*</span></label><textarea class="input" rows="3" placeholder="Motivo de la sustitución (obligatorio)">Deterioro del título original</textarea><span class="hint">Requerido. Se registra en la bitácora de auditoría.</span></div>
      <div class="row gap-2"><button class="btn btn-primary" onclick="sustituir()">${ICON('replace')} Generar sustitución</button><button class="btn btn-ghost" onclick="go('inicio')">Cancelar</button></div>
      <div id="sustResult"></div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Título actual</h3></div><div class="card-body col gap-3">
      <div class="saldo-row"><span class="secondary">Título</span><span class="strong num">88</span></div>
      <div class="saldo-row"><span class="secondary">Titular</span><span class="strong">Estela Garza Villarreal</span></div>
      <div class="saldo-row"><span class="secondary">Acciones</span><span class="strong num">12,000</span></div>
      <div class="saldo-row"><span class="secondary">Último cupón</span><span class="strong num">44</span></div>
      <div class="alert alert-info">${ICON('info')} El título 88 quedará <b>Anulado</b> y se generarán los títulos 106 y 107.</div>
    </div></div>
  </div>`;
}
function toggleSustMulti(v) {
  document.getElementById('sustDist').innerHTML = v
    ? `<table class="tbl"><thead><tr><th>Título nuevo</th><th>Titular</th><th class="num">Acciones</th></tr></thead><tbody>
        <tr><td>Título 106 <span class="badge">auto</span></td><td>Estela Garza Villarreal</td><td class="num">7,000</td></tr>
        <tr><td>Título 107 <span class="badge">auto</span></td><td>Estela Garza Villarreal</td><td class="num">5,000</td></tr>
      </tbody></table>`
    : `<table class="tbl"><thead><tr><th>Título nuevo</th><th>Titular</th><th class="num">Acciones</th></tr></thead><tbody>
        <tr><td>Título 106 <span class="badge">auto</span></td><td>Estela Garza Villarreal</td><td class="num">12,000</td></tr>
      </tbody></table>`;
}
function sustituir() {
  toastBitacora('Sustitución', 'Título 88 anulado · se generaron títulos 106 y 107', 'T-88');
  document.getElementById('sustResult').innerHTML = `<div class="col gap-3" style="margin-top:8px">
    <div class="alert alert-success">${ICON('checkCircle')} Título 88 anulado. Nuevos títulos: <b>106</b> (7,000) y <b>107</b> (5,000).</div>
    ${renderDocPanel([{ nombre: 'Recibo de sustitución', meta: 'PDF · Título 88', preview: pdfSheet({ title: 'Recibo de sustitución de título', kv: [['Título anulado', '88'], ['Títulos nuevos', '106, 107'], ['Accionista', 'Estela Garza Villarreal'], ['Acciones', '12,000'], ['Motivo', 'Deterioro del título original']], signs: ['Solicita', 'Autoriza'] }) }])}
  </div>`;
}

/* ---------- 6. Endoso ---------- */
let _endosoTipo = 'portador';
let _herederos = [{ nombre: 'Heredero 1', acciones: 4000 }, { nombre: 'Heredero 2', acciones: 3200 }];
function screenEndoso() {
  _endosoTipo = 'portador';
  window._afterRender = () => setEndosoTipo('portador');
  return pageHead({ crumbs: ['Títulos', 'Endoso'], title: 'Endoso de título', sub: 'Cambia la titularidad de un título. Primero selecciona la emisión y el título; el checklist y los datos dependen del tipo de endoso.' }) + `
  <div class="grid grid-wizard">
    <div class="card"><div class="card-body col gap-4">
      <div class="field"><label>Emisión</label><select class="select">${emisionesDe().map(e => `<option ${e.vigente ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Número de título</label><input class="input num" value="92"></div>
      <div class="field"><label>Tipo de endoso</label>
        <div class="segmented" style="width:fit-content">
          <button id="ent-portador" class="active" onclick="setEndosoTipo('portador')">Al portador</button>
          <button id="ent-vida" onclick="setEndosoTipo('vida')">En vida</button>
          <button id="ent-herencia" onclick="setEndosoTipo('herencia')">Herencia</button>
        </div>
      </div>
      <div id="endosoDetalle"></div>
      <div class="row gap-2"><button class="btn btn-primary" onclick="endosar()">${ICON('endorse')} Registrar endoso</button><button class="btn btn-ghost" onclick="go('inicio')">Cancelar</button></div>
      <div id="endosoResult"></div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Título</h3></div><div class="card-body col gap-3">
      <div class="saldo-row"><span class="secondary">Título</span><span class="strong num">92</span></div>
      <div class="saldo-row"><span class="secondary">Titular actual</span><span class="strong">María Fernanda Salinas Cantú</span></div>
      <div class="saldo-row"><span class="secondary">Acciones</span><span class="strong num">7,200</span></div>
    </div></div>
  </div>`;
}
function setEndosoTipo(t) {
  _endosoTipo = t;
  ['portador', 'vida', 'herencia'].forEach(x => { const el = document.getElementById('ent-' + x); if (el) el.classList.toggle('active', x === t); });
  const cont = document.getElementById('endosoDetalle');
  const nuevoAccionista = `<div class="field"><label>Nuevo accionista</label>
      <div class="row gap-2"><select class="select grow">${DATA.accionistas.map(a => `<option>${esc(a.nombre)}</option>`).join('')}</select><button class="btn btn-secondary" onclick="modalAltaAccionista()">${ICON('plus')} Alta</button></div>
      <span class="hint">Si el accionista no existe, puedes darlo de alta.</span></div>`;
  if (t === 'portador') {
    cont.innerHTML = `<div class="field"><label>Requisitos · Al portador</label>
      <div class="checklist">
        <label class="check-item"><input type="checkbox"> <span>Constancia de Situación Fiscal (CSF) de quien presenta el título</span></label>
        <label class="check-item"><input type="checkbox"> <span>Identificación oficial vigente (INE, Pasaporte o CURP) de quien presenta el título</span></label>
      </div></div>${nuevoAccionista}`;
  } else if (t === 'vida') {
    cont.innerHTML = `<div class="alert alert-warning">${ICON('alertTri')} Solo el titular puede endosar un título nombrado.</div>
      <div class="field"><label>Requisitos · En vida</label>
      <div class="checklist">
        <label class="check-item"><input type="checkbox"> <span>Identificación oficial vigente del <b>titular</b></span></label>
        <label class="check-item"><input type="checkbox"> <span>Constancia de Situación Fiscal (CSF) del <b>nuevo accionista</b></span></label>
      </div></div>${nuevoAccionista}`;
  } else {
    const filas = _herederos.map((hd, i) => `<tr>
      <td><input class="input" style="height:32px" value="${esc(hd.nombre)}" oninput="updHeredero(${i},'nombre',this.value)"></td>
      <td class="num"><input class="input num" style="height:32px;width:120px" value="${fmtNum(hd.acciones)}" oninput="updHeredero(${i},'acciones',this.value)"></td>
      <td><button class="btn btn-ghost btn-sm" onclick="rmHeredero(${i})">${ICON('trash')}</button></td>
    </tr>`).join('');
    const suma = _herederos.reduce((s, hd) => s + hd.acciones, 0);
    const ok = suma === 7200;
    cont.innerHTML = `<div class="card" style="background:var(--surface-2)"><div class="card-body col gap-3">
        <div class="row gap-2"><span class="badge badge-success">${ICON('shield')} Validación de Jurídico Sigma Foods</span></div>
        <div class="grid grid-3">
          <div class="field"><label>Número de oficio</label><input class="input" value="JUR-2026-0142"></div>
          <div class="field"><label>Fecha</label><input class="input" value="22/09/2026"></div>
          <div class="field"><label>Estatus</label><input class="input readonly" value="Validado" readonly></div>
        </div>
      </div></div>
      <div class="field"><label>Herederos</label>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Heredero</th><th class="num">Acciones</th><th></th></tr></thead><tbody>${filas}</tbody></table></div>
        <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addHeredero()">${ICON('plus')} Agregar heredero</button>
        <div class="dist-check ${ok ? 'ok' : 'bad'}" style="margin-top:8px">${ok ? ICON('checkCircle') : ICON('alertTri')} Suma asignada: <b class="num">${fmtNum(suma)}</b> de <b class="num">7,200</b> ${ok ? '· correcto' : '· debe coincidir con las acciones del título'}</div>
      </div>
      <div class="alert alert-info">${ICON('info')} Se genera un título y un recibo de endoso por heredero.</div>`;
  }
}
function updHeredero(i, k, v) { _herederos[i][k] = k === 'acciones' ? parseInt(v.replace(/[^\d]/g, '') || '0') : v; setEndosoTipo('herencia'); }
function addHeredero() { _herederos.push({ nombre: 'Heredero ' + (_herederos.length + 1), acciones: 0 }); setEndosoTipo('herencia'); }
function rmHeredero(i) { _herederos.splice(i, 1); setEndosoTipo('herencia'); }
function endosar() {
  if (_endosoTipo === 'herencia') {
    toastBitacora('Endoso', 'Título 92 endosado por herencia · un título por heredero', 'T-92');
    const docs = _herederos.map((hd, i) => ({ nombre: `Recibo de endoso · ${hd.nombre}`, meta: 'PDF · Título 92', preview: pdfSheet({ title: 'Recibo de endoso (herencia)', kv: [['Título origen', '92'], ['Titular anterior', 'María Fernanda Salinas Cantú'], ['Heredero', hd.nombre], ['Acciones', fmtNum(hd.acciones)], ['Oficio Jurídico', 'JUR-2026-0142']], signs: ['Cede', 'Recibe'] }) }));
    document.getElementById('endosoResult').innerHTML = `<div style="margin-top:8px">${renderDocPanel(docs)}</div>`;
    return;
  }
  toastBitacora('Endoso', 'Título 92 endosado', 'T-92');
  document.getElementById('endosoResult').innerHTML = `<div style="margin-top:8px">` + renderDocPanel([{ nombre: 'Recibo de endoso', meta: 'PDF · Título 92', preview: pdfSheet({ title: 'Recibo de endoso', kv: [['Título', '92'], ['Titular anterior', 'María Fernanda Salinas Cantú'], ['Nuevo titular', DATA.accionistas[0].nombre], ['Acciones', '7,200']], signs: ['Cede', 'Recibe'] }) }]) + `</div>`;
}

/* ---------- 7. Reimpresión y anulación ---------- */
function screenReimpresion() {
  return pageHead({ crumbs: ['Títulos', 'Reimpresión y anulación'], title: 'Reimpresión y anulación', sub: 'Busca un título y elige la acción. Toda reimpresión y anulación queda registrada con motivo.' }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body row gap-3">
    <div class="field grow"><label>Buscar título</label><input class="input" placeholder="Número de título o accionista" value="Título 104"></div>
    <button class="btn btn-secondary" style="align-self:flex-end">${ICON('search')} Buscar</button>
  </div></div>
  <div class="card"><div class="card-head"><h3>Título 104 · Rogelio Treviño Leal</h3><span class="badge badge-success">Vigente</span></div><div class="card-body">
    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="saldo-row"><span class="secondary">Acciones</span><span class="strong num">2,000</span></div>
      <div class="saldo-row"><span class="secondary">Último cupón</span><span class="strong num">44</span></div>
    </div>
    <div class="grid grid-2">
      ${reimpCard('Reimprimir título', 'Genera copia idéntica con mismo número.', 'print', "toastBitacora('Impresión','Reimpresión de Título 104','T-104')")}
      ${reimpCard('Reimprimir como nuevo número', 'Reimprime el mismo título con un nuevo número; no cambia accionista ni acciones. Para anular y redistribuir usa Sustitución.', 'files', "toastBitacora('Impresión','Título 104 reimpreso con nuevo número','T-108')")}
      ${reimpCard('Imprimir recibo del canje', 'Reimprime el recibo del canje asociado.', 'file', "toastBitacora('Impresión','Recibo de canje reimpreso','CJ-93')")}
      ${reimpCard('Anular título', 'Requiere motivo obligatorio.', 'trash', 'modalAnular()', true)}
    </div>
  </div></div>`;
}
function reimpCard(t, d, icon, fn, danger) {
  return `<button class="reimp-card ${danger ? 'danger' : ''}" onclick="${fn}"><span class="ri-ic">${ICON(icon)}</span><div><div class="strong">${esc(t)}</div><div class="tiny muted">${esc(d)}</div></div></button>`;
}
function modalAnular() {
  openModal(`<div class="modal-head"><h3>Anular título 104</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-3">
      <div class="alert alert-error">${ICON('alertTri')} La anulación es irreversible y queda registrada en bitácora.</div>
      <div class="field"><label>Motivo <span style="color:var(--error)">*</span></label><textarea class="input" rows="3" placeholder="Motivo de la anulación (obligatorio)"></textarea></div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="closeModal();toastBitacora('Anulación de título','Título 104 anulado','T-104')">Anular título</button></div>`);
}

/* ---------- 8. Títulos pendientes ---------- */
function screenPendientes() {
  const pend = DATA.titulos.filter(t => t.pendienteCanje);
  const vig = emisionVigente();
  const rows = pend.map(t => {
    // cupones de atraso = del último pagado+1 hasta el cupón actual de la vigente
    const atraso = vig.cuponActual - t.ultimoCupon;
    return { ...t, atraso };
  });
  const cols = [
    { key: 'emisionNombre', label: 'Emisión de origen' },
    { key: 'num', label: 'Título', num: true, render: r => 'Título ' + r.num },
    { key: 'accionistaNombre', label: 'Accionista' },
    { key: 'ultimoCupon', label: 'Último cupón pagado', num: true },
    { key: 'atraso', label: 'Cupones de atraso', num: true, render: r => `${r.ultimoCupon + 1}–${vig.cuponActual} (${r.atraso})` },
    { key: 'acc', label: '', render: r => `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();go('titulos/canje')">${ICON('swap')} Iniciar canje</button>` },
  ];
  return pageHead({ crumbs: ['Títulos', 'Títulos pendientes'], title: 'Títulos pendientes', sub: 'Títulos que no están en la emisión vigente.', actions: exportBar('Títulos pendientes') })
    + `<div class="alert alert-info" style="margin-bottom:14px">${ICON('info')} El canje se realiza cuando el accionista se presenta con su título original.</div>`
    + dataTable({ cols, rows, filters: true });
}
