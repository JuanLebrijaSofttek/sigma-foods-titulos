/* ============================================================
   Pantalla 12 — Accionistas + Ficha del accionista
   ============================================================ */
let _accFiltro = 'todos';
function screenAccionistas() {
  const filtro = _accFiltro;
  let list = DATA.accionistas.slice();
  if (filtro === 'inst') list = list.filter(a => a.marcador);
  if (filtro === 'indeval') list = list.filter(a => a.marcador === 'Indeval');
  const cols = [
    { key: 'nombre', label: 'Accionista', render: a => `<div class="strong">${esc(a.nombre)}</div><div class="tiny muted">${esc(a.ciudad)}, ${esc(a.estado)}</div>` },
    { key: 'marcador', label: 'Marcador', render: a => a.marcador === 'Indeval' ? `<span class="badge badge-inst">${ICON('bank')} Indeval</span>` : a.marcador ? `<span class="badge badge-inst">${ICON('bank')} Institucional</span>` : `<span class="badge">Persona física</span>` },
    { key: 'titulos', label: 'Títulos', num: true },
    { key: 'acciones', label: 'Acciones', num: true, render: a => fmtNum(a.acciones) },
    { key: 'alta', label: 'Alta', render: a => a.alta.split('-').reverse().join('/') },
    { key: 'acc', label: '', render: a => `<div class="row gap-1" style="justify-content:flex-end"><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();modalEditarAccionista('${a.id}')">${ICON('edit')} Editar</button><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();fichaAccionista('${a.id}')">Ver ficha ${ICON('arrowRight')}</button></div>` },
  ];
  return pageHead({
    crumbs: ['Accionistas'], title: 'Accionistas',
    sub: 'Catálogo de accionistas de la emisora actual. Cada emisora mantiene su propio catálogo.',
    actions: `<button class="btn btn-secondary" onclick="modalVincular()">${ICON('link')} Vincular de otra emisora</button><button class="btn btn-primary" onclick="modalAltaAccionista()">${ICON('plus')} Nuevo accionista</button>`,
  }) + `
  <div class="chip-row" style="margin-bottom:14px">
    <button class="chip ${filtro === 'todos' ? 'active' : ''}" onclick="setAccFiltro('todos')">Todos</button>
    <button class="chip ${filtro === 'inst' ? 'active' : ''}" onclick="setAccFiltro('inst')">${ICON('bank')} Institucional</button>
    <button class="chip ${filtro === 'indeval' ? 'active' : ''}" onclick="setAccFiltro('indeval')">Indeval</button>
  </div>
  ${dataTable({ cols, rows: list, filters: true })}`;
}
function setAccFiltro(f) { _accFiltro = f; render('accionistas'); }
function modalVincular() {
  openModal(`<div class="modal-head"><h3>Vincular accionista de otra emisora</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-3">
      <div class="alert alert-info">${ICON('info')} Cada emisora mantiene su propio catálogo de accionistas. Vincular crea una referencia; los datos fiscales se copian a esta emisora.</div>
      <div class="field"><label>Emisora origen</label><select class="select">${DATA.emisoras.filter(e => e.id !== STATE.emisoraActual).map(e => `<option>${e.id} ${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Buscar accionista</label><input class="input" placeholder="Nombre o RFC"></div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Alta de accionista','Accionista vinculado desde otra emisora')">Vincular</button></div>`, { size: 'lg' });
}

// Edición de accionista (mismos campos que el alta, precargados)
function modalEditarAccionista(id) {
  const a = DATA.accionistas.find(x => x.id === id);
  openModal(`<div class="modal-head"><h3>Editar accionista</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-3">
      <div class="grid grid-2">
        <div class="field"><label>Id accionista</label><input class="input readonly" value="${esc(a.id.toUpperCase())}" readonly></div>
        <div class="field"><label>Marcador</label><select class="select"><option ${!a.marcador ? 'selected' : ''}>Persona física</option><option ${a.marcador === 'Institucional' ? 'selected' : ''}>Institucional</option><option ${a.marcador === 'Indeval' ? 'selected' : ''}>Indeval</option></select></div>
      </div>
      <div class="field"><label>Nombre completo</label><input class="input" value="${esc(a.nombre)}"></div>
      <div class="grid grid-2">
        <div class="field"><label>RFC</label><input class="input" value="${esc(a.rfc)}"></div>
        <div class="field"><label>CURP</label><input class="input" value="${esc(a.curp)}"></div>
      </div>
      <div class="grid grid-2">
        ${nacionalidadField(a.nacionalidad)}
        <div class="field"><label>País</label><select class="select">${DATA.paises.map(p => `<option ${p === a.pais ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Estado</label><select class="select">${DATA.estados.map(p => `<option ${p === a.estado ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
        <div class="field"><label>Ciudad</label><select class="select">${DATA.ciudades.map(p => `<option ${p === a.ciudad ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Domicilio</label><input class="input" value="${esc(a.domicilio)}"></div>
      <div class="grid grid-2">
        <div class="field"><label>Teléfono</label><input class="input" value="${esc(a.telefono || '')}"></div>
        <div class="field"><label>Correo electrónico</label><input class="input" value="${esc(a.email || '')}"></div>
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Edición de accionista','${esc(a.nombre)} actualizado')">Guardar cambios</button></div>`, { size: 'lg' });
}

let _fichaTab = 'datos';
function fichaAccionista(id) {
  const a = DATA.accionistas.find(x => x.id === id);
  _fichaTab = 'datos';
  const view = document.getElementById('view');
  const tabs = [['datos', 'Datos generales'], ['titulos', 'Títulos'], ['canjes', 'Canjes'], ['liq', 'Liquidaciones y cheques'], ['endosos', 'Endosos'], ['tl', 'Línea de tiempo']];
  view.innerHTML = pageHead({ crumbs: ['Accionistas', a.nombre], title: 'Ficha del accionista', actions: `<button class="btn btn-ghost" onclick="render('accionistas')">${ICON('arrowLeft')} Volver</button>` }) + `
  <div class="card" style="margin-bottom:16px"><div class="acc-head">
    <span class="acc-avatar">${a.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
    <div class="grow"><h2>${esc(a.nombre)}</h2><div class="row gap-2" style="margin-top:6px">${a.marcador ? `<span class="badge badge-inst">${ICON('bank')} ${esc(a.marcador)}</span>` : `<span class="badge">Persona física</span>`}<span class="tiny muted">RFC ${a.rfc.slice(0,4)}••••••${a.rfc.slice(-2)}</span></div></div>
    <div class="text-right"><div class="tiny muted">Acciones totales</div><div class="strong num" style="font-size:20px">${fmtNum(a.acciones)}</div></div>
  </div></div>
  <div class="tabs" style="margin-bottom:16px" id="fichaTabs">${tabs.map(([k, l]) => `<div class="tab ${k === 'datos' ? 'active' : ''}" onclick="setFichaTab('${id}','${k}')">${esc(l)}</div>`).join('')}</div>
  <div id="fichaBody">${fichaContent(a, 'datos')}</div>`;
  window.scrollTo(0, 0);
}
function setFichaTab(id, tab) {
  _fichaTab = tab;
  const a = DATA.accionistas.find(x => x.id === id);
  document.getElementById('fichaBody').innerHTML = fichaContent(a, tab);
  const map = { datos: 0, titulos: 1, canjes: 2, liq: 3, endosos: 4, tl: 5 };
  document.querySelectorAll('#fichaTabs .tab').forEach((el, i) => el.classList.toggle('active', i === map[tab]));
}
function fichaContent(a, tab) {
  if (tab === 'datos') {
    return `<div class="card"><div class="card-body">
      <div class="row between" style="margin-bottom:14px"><h3>Datos generales y fiscales</h3><button class="btn btn-secondary btn-sm" onclick="modalEditarAccionista('${a.id}')">${ICON('edit')} Editar</button></div>
      <div class="kv-grid">
      ${kvItem('Id accionista', esc(a.id.toUpperCase()))}
      ${kvItem('RFC', maskedField(a.rfc, 'rfc'))}
      ${kvItem('CURP', a.curp === '—' ? '—' : maskedField(a.curp, 'curp'))}
      ${kvItem('Nacionalidad', esc(a.nacionalidad))}
      ${kvItem('País', esc(a.pais))}
      ${kvItem('Estado', esc(a.estado))}
      ${kvItem('Ciudad', esc(a.ciudad))}
      ${kvItem('Domicilio', esc(a.domicilio))}
      ${kvItem('Teléfono', esc(a.telefono || '—'))}
      ${kvItem('Correo electrónico', esc(a.email || '—'))}
      ${kvItem('Marcador', a.marcador ? esc(a.marcador) : 'Persona física')}
    </div>
    <div class="alert alert-info" style="margin-top:16px">${ICON('info')} Los datos sensibles se muestran enmascarados y se revelan según tu rol.</div>
    </div></div>`;
  }
  if (tab === 'titulos') {
    const ts = DATA.titulos.filter(t => t.accionista === a.id);
    if (!ts.length) return emptyState('files', 'Sin títulos', 'Este accionista aún no tiene títulos en esta emisora.');
    return dataTable({ cols: [{ key: 'num', label: 'Título', num: true, render: t => 'Título ' + t.num }, { key: 'emisionNombre', label: 'Emisión' }, { key: 'acciones', label: 'Acciones', num: true, render: t => fmtNum(t.acciones) }, { key: 'ultimoCupon', label: 'Último cupón', num: true }, { key: 'estatus', label: 'Estatus', render: t => t.estatus === 'Vigente' ? `<span class="badge badge-success">${esc(t.estatus)}</span>` : t.estatus === 'Canjeado' ? `<span class="badge badge-warning">${esc(t.estatus)}</span>` : `<span class="badge">${esc(t.estatus)}</span>` }], rows: ts });
  }
  if (tab === 'canjes') {
    if (a.id === 'a1') return dataTable({ cols: [{ key: 'c', label: 'Canje' }, { key: 'o', label: 'Título origen' }, { key: 'd', label: 'Títulos destino' }, { key: 'f', label: 'Fecha' }], rows: [{ c: 'Canje 93', o: 'Título 17', d: '104, 105', f: '30/09/2026' }] });
    return emptyState('swap', 'Sin canjes', 'Aún no hay canjes registrados para este accionista.');
  }
  if (tab === 'liq') {
    if (a.id === 'a1') return dataTable({ cols: [{ key: 'l', label: 'Liquidación' }, { key: 'ch', label: 'Cheque' }, { key: 'cup', label: 'Cupones' }, { key: 'i', label: 'Importe', num: true }], rows: [{ l: '10144037', ch: 'CH 5290', cup: '39–44', i: fmtMoney(5883.62) }] });
    return emptyState('bank', 'Sin liquidaciones', 'Cuando este accionista cobre dividendos, aquí verás sus liquidaciones y cheques.');
  }
  if (tab === 'endosos') return emptyState('endorse', 'Sin endosos', 'Este accionista no ha participado en endosos.');
  if (tab === 'tl') {
    if (a.id === 'a1') return `<div class="card"><div class="card-body"><div class="timeline">
      <div class="tl-item hl"><div class="tl-date">18/06/1996</div><div class="tl-title">Alta del Título 17</div><div class="tl-desc">2,450 acciones · Serie 'A' Junio-96</div></div>
      <div class="tl-item"><div class="tl-date">14/05/2001</div><div class="tl-title">Split 1:1.35</div><div class="tl-desc">Ajuste automático de acciones</div></div>
      <div class="tl-item"><div class="tl-date">22/08/2012</div><div class="tl-title">Certificado provisional</div><div class="tl-desc">+180 acciones (ampliación de capital)</div></div>
      <div class="tl-item hl"><div class="tl-date">30/09/2026</div><div class="tl-title">Canje 93</div><div class="tl-desc">Títulos 104 y 105 · dividendos cupones 39-44 cobrados</div></div>
    </div></div></div>`;
    return `<div class="card"><div class="card-body"><div class="timeline">
      <div class="tl-item hl"><div class="tl-date">${a.alta.split('-').reverse().join('/')}</div><div class="tl-title">Alta como accionista</div><div class="tl-desc">${fmtNum(a.acciones)} acciones</div></div>
    </div></div></div>`;
  }
}
function kvItem(k, v) { return `<div class="kv"><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`; }
