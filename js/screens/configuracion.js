/* ============================================================
   Pantallas 15-19 — Configuración
   ============================================================ */

/* ---------- 15. Emisoras ---------- */
function screenEmisoras() {
  const cols = [
    { key: 'id', label: 'Clave' },
    { key: 'nombre', label: 'Nombre actual', render: e => `<span class="strong">${esc(e.nombre)}</span>` },
    { key: 'estado', label: 'Estado', render: () => `<span class="badge badge-success">Activa</span>` },
    { key: 'acc', label: '', render: e => `<button class="btn btn-secondary btn-sm" onclick="modalEmisora('${e.id}')">${ICON('edit')} Editar</button>` },
  ];
  return pageHead({ crumbs: ['Configuración', 'Emisoras'], title: 'Emisoras', sub: 'Administra las emisoras y su denominación. Cada cambio de nombre queda en el historial.', actions: `<button class="btn btn-primary" onclick="modalEmisora()">${ICON('plus')} Nueva emisora</button>` })
    + dataTable({ cols, rows: DATA.emisoras });
}
function modalEmisora(id) {
  const e = id ? emisoraById(id) : { id: '', nombre: '' };
  openModal(`<div class="modal-head"><h3>${id ? 'Editar emisora' : 'Nueva emisora'}</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Clave</label><input class="input num" value="${e.id}"></div><div class="field"><label>Nombre</label><input class="input" value="${esc(e.nombre)}"></div></div>
      ${id ? `<div class="field"><label>Historial de cambios de denominación</label><div class="timeline">
        <div class="tl-item hl"><div class="tl-date">2024</div><div class="tl-title">${esc(e.nombre)}</div><div class="tl-desc">Denominación actual</div></div>
        <div class="tl-item"><div class="tl-date">2004</div><div class="tl-title">Denominación anterior</div><div class="tl-desc">Cambio registrado en asamblea</div></div>
      </div></div>` : ''}
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Configuración','Emisora guardada')">Guardar</button></div>`, { size: 'lg' });
}

/* ---------- 16. Emisiones ---------- */
function screenEmisiones() {
  const cols = [
    { key: 'id', label: 'Número', render: (e, i) => e.id.replace('e', '') },
    { key: 'nombre', label: 'Nombre', render: e => `<span class="strong">${esc(e.nombre)}</span>` },
    { key: 'corto', label: 'Nombre corto' },
    { key: 'acciones', label: 'Número de acciones', num: true, render: e => fmtNum(e.acciones) },
    { key: 'cuponIni', label: 'Cupón inicial', num: true },
    { key: 'cuponFin', label: 'Cupón final', num: true },
    { key: 'vigente', label: 'Estado', render: e => e.vigente ? `<span class="badge badge-success">Vigente</span>` : e.historica ? `<span class="badge">Histórica</span>` : `<span class="badge badge-warning">Anterior</span>` },
  ];
  return pageHead({ crumbs: ['Configuración', 'Emisiones'], title: 'Emisiones', sub: 'Alta y control de emisiones por emisora.', actions: `<button class="btn btn-primary" onclick="modalEmision()">${ICON('plus')} Nueva emisión</button>` })
    + dataTable({ cols, rows: emisionesDe() });
}
function modalEmision() {
  openModal(`<div class="modal-head"><h3>Alta de emisión</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-4">
      <div class="grid grid-2"><div class="field"><label>Número</label><input class="input num" placeholder="6"></div><div class="field"><label>Nombre corto</label><input class="input" placeholder="TD A Feb-27"></div></div>
      <div class="field"><label>Nombre</label><input class="input" placeholder="TD Cla I Ser 'A' Feb-27"></div>
      <div class="grid grid-2"><div class="field"><label>Número de acciones</label><input class="input num" placeholder="5,600,000,000"></div><div class="field"><label>Factor (9,8)</label><input class="input num" placeholder="1.00000000"></div></div>
      <div class="grid grid-2"><div class="field"><label>Cupón inicial</label><input class="input num" placeholder="53"></div><div class="field"><label>Cupón final</label><input class="input num" placeholder="64"></div></div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Configuración','Emisión creada')">Crear emisión</button></div>`, { size: 'lg' });
}

/* ---------- 17. Cupones y eventos corporativos ---------- */
let _cupTab = 'cupones';
function screenCupones() {
  window._afterRender = () => renderCupTab();
  const tree = emisionesDe().map((e, i) => `<div class="tree-node ${e.vigente ? 'active' : ''}">${ICON('file')} ${esc(e.corto)}</div>`).join('');
  return pageHead({ crumbs: ['Configuración', 'Cupones y eventos corporativos'], title: 'Cupones y eventos corporativos', badge: badgeNew(), sub: 'Genera cupones y administra splits, contra-splits y ampliaciones de capital. Antes era solo lectura.' }) + `
  <div class="grid" style="grid-template-columns:260px 1fr;gap:16px;align-items:start">
    <div class="card"><div class="card-head"><h3>${esc(emisoraById(STATE.emisoraActual).nombre)}</h3></div><div class="card-body tree"><div class="tiny muted" style="margin-bottom:6px">Emisiones</div>${tree}</div></div>
    <div>
      <div class="tabs" style="margin-bottom:16px">
        <div class="tab ${_cupTab === 'cupones' ? 'active' : ''}" onclick="setCupTab('cupones')">Cupones</div>
        <div class="tab ${_cupTab === 'split' ? 'active' : ''}" onclick="setCupTab('split')">Split / Contra-split</div>
        <div class="tab ${_cupTab === 'ampliacion' ? 'active' : ''}" onclick="setCupTab('ampliacion')">Ampliación de capital</div>
      </div>
      <div id="cupBody"></div>
    </div>
  </div>`;
}
function setCupTab(t) { _cupTab = t; renderCupTab(); document.querySelectorAll('.tabs .tab').forEach((el, i) => el.classList.toggle('active', ['cupones', 'split', 'ampliacion'][i] === t)); }
function renderCupTab() {
  const b = document.getElementById('cupBody'); if (!b) return;
  if (_cupTab === 'cupones') {
    const cols = [
      { key: 'num', label: 'Cupón', num: true },
      { key: 'fecha', label: 'Fecha', render: c => c.fecha.split('-').reverse().join('/') },
      { key: 'dividendo', label: 'Dividendo/acción', num: true, render: c => fmtFactor(c.factor) },
      { key: 'cuenta', label: 'Cuenta' },
      { key: 'liquidacion', label: 'Liquidación', render: c => c.liquidacion || '—' },
      { key: 'estado', label: 'Estado', render: c => c.vigente ? `<span class="badge badge-success">Vigente</span>` : `<span class="badge">Cerrado</span>` },
    ];
    b.innerHTML = `<div class="card" style="margin-bottom:16px"><div class="card-body">
      <div class="row between" style="margin-bottom:12px"><h3>Generar cupón</h3></div>
      <div class="grid grid-3">
        <div class="field"><label>Factor de pago por acción</label><input class="input num" value="0.35000000"></div>
        <div class="field"><label>Acciones en circulación</label><input class="input num readonly" value="${fmtNum(emisionVigente().acciones)}" readonly></div>
        <div class="field"><label>Emisión vigente</label><input class="input readonly" value="${esc(emisionVigente().corto)}" readonly></div>
      </div>
      <div class="row" style="margin-top:12px"><button class="btn btn-primary" onclick="toastBitacora('Configuración','Cupón 45 generado')">${ICON('plus')} Generar cupón</button></div>
    </div></div>` + dataTable({ cols, rows: DATA.cupones, filters: true });
  } else if (_cupTab === 'split') {
    b.innerHTML = `<div class="card"><div class="card-body col gap-4">
      <div class="grid grid-3"><div class="field"><label>Tipo</label><select class="select"><option>Split</option><option>Contra-split</option></select></div><div class="field"><label>Factor</label><input class="input num" value="1.35000000"></div><div class="field"><label>Fecha</label><input class="input" value="14/05/2001"></div></div>
      <div class="card" style="background:var(--surface-2)"><div class="card-body">
        <h4 style="margin-bottom:10px">Vista previa de impacto en canjes</h4>
        ${calcCard('Ejemplo · Título 17', [{ desc: '2,450 acciones × 1.35', op: 'factor split', amt: '3,307.50' }, { desc: 'Resultado', op: '=', amt: '3,307.50', cls: 'total' }])}
      </div></div>
      <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Configuración','Evento corporativo registrado')">${ICON('scissors')} Registrar evento</button></div>
    </div></div>`;
  } else {
    const rows = [{ acc: 'Rogelio Treviño Leal', cert: 'CP-1996-017', acciones: 180 }, { acc: 'Estela Garza Villarreal', cert: 'CP-2004-088', acciones: 320 }];
    b.innerHTML = `<div class="card"><div class="card-head"><h3>Certificados provisionales por accionista</h3><button class="btn btn-secondary btn-sm" onclick="toastBitacora('Configuración','Certificado provisional agregado')">${ICON('plus')} Agregar</button></div>
      ${dataTable({ cols: [{ key: 'acc', label: 'Accionista' }, { key: 'cert', label: 'Certificado' }, { key: 'acciones', label: 'Acciones', num: true }], rows, foot: [{ value: 'Total', span: 2 }, { value: '500', num: true }] })}</div>`;
  }
}

/* ---------- 18. Parámetros de emisora ---------- */
function screenParametros() {
  return pageHead({ crumbs: ['Configuración', 'Parámetros de emisora'], title: 'Parámetros de emisora', sub: 'Folios, reglas de folio, conversión de acciones y datos del retenedor y representante legal.' }) + `
  <div class="grid grid-2">
    <div class="card"><div class="card-head"><h3>Folios</h3></div><div class="card-body col gap-3">
      <div class="grid grid-2"><div class="field"><label>Folio de cheque</label><input class="input num" value="5290"></div><div class="field"><label>Folio de título</label><input class="input num" value="104"></div></div>
      <div class="field"><label>Folio de canje</label><input class="input num" value="93"></div>
      <div class="field"><label>Regla de folio de liquidación</label><input class="input readonly" value="${esc(DATA.folios.reglaLiquidacion)}" readonly></div>
      <div class="alert alert-info">${ICON('info')} Vista previa: <b class="num">${CALC.folioLiquidacion(1, 44, 37)}</b> (emisora 01 · cupón 44 · consecutivo 037)</div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Cálculo</h3></div><div class="card-body col gap-3">
      <div class="grid grid-2"><div class="field"><label>Conversión de acciones</label><input class="input num" value="1.00000000"></div><div class="field"><label>Precio por acción</label><input class="input num" value="${fmtMoney(DATA.precioPorAccion)}"></div></div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Datos del retenedor</h3></div><div class="card-body col gap-3">
      <div class="field"><label>Razón social</label><input class="input" value="SIGMA FOODS, S.A.B. DE C.V."></div>
      <div class="grid grid-2"><div class="field"><label>RFC</label><input class="input" value="SFO960601AB1"></div><div class="field"><label>Sello</label><input class="input" value="•••• cargado"></div></div>
    </div></div>
    <div class="card"><div class="card-head"><h3>Representante legal</h3></div><div class="card-body col gap-3">
      <div class="field"><label>Nombre</label><input class="input" value="Lic. Ana Lucía Robles"></div>
      <div class="grid grid-2"><div class="field"><label>RFC</label><input class="input" value="ROAA800101XXX"></div><div class="field"><label>CURP</label><input class="input" value="ROAA800101MNLBLN02"></div></div>
      <div class="field"><label>Firma digital</label><div class="row gap-2"><span class="badge badge-success">${ICON('checkCircle')} Certificado cargado</span></div></div>
    </div></div>
  </div>
  <div class="row" style="margin-top:16px"><button class="btn btn-primary" onclick="toastBitacora('Configuración','Parámetros de emisora guardados')">Guardar parámetros</button></div>`;
}

/* ---------- 19. Catálogos geográficos ---------- */
let _catTab = 'pais';
function screenCatalogos() {
  window._afterRender = () => renderCatTab();
  return pageHead({ crumbs: ['Configuración', 'Catálogos geográficos'], title: 'Catálogos geográficos', sub: 'País, Estado y Ciudad.' }) + `
  <div class="tabs" style="margin-bottom:16px">
    <div class="tab active" onclick="setCatTab('pais')">País</div>
    <div class="tab" onclick="setCatTab('estado')">Estado</div>
    <div class="tab" onclick="setCatTab('ciudad')">Ciudad</div>
  </div><div id="catBody"></div>`;
}
function setCatTab(t) { _catTab = t; renderCatTab(); document.querySelectorAll('.tabs .tab').forEach((el, i) => el.classList.toggle('active', ['pais', 'estado', 'ciudad'][i] === t)); }
function renderCatTab() {
  const b = document.getElementById('catBody'); if (!b) return;
  const data = { pais: DATA.paises, estado: DATA.estados, ciudad: DATA.ciudades }[_catTab];
  const lbl = { pais: 'País', estado: 'Estado', ciudad: 'Ciudad' }[_catTab];
  b.innerHTML = `<div style="max-width:560px">
    <div class="row between" style="margin-bottom:12px"><h3>${lbl}s</h3><button class="btn btn-secondary btn-sm" onclick="toastBitacora('Configuración','${lbl} agregado')">${ICON('plus')} Agregar ${lbl.toLowerCase()}</button></div>
    ${dataTable({ cols: [{ key: 'n', label: lbl }, { key: 'a', label: '', render: () => `<button class="btn btn-ghost btn-sm">${ICON('edit')}</button>` }], rows: data.map(n => ({ n })) })}
  </div>`;
}
