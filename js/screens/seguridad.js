/* ============================================================
   Pantallas 20-24 — Seguridad y Auditoría
   ============================================================ */

/* ---------- 20. Usuarios y roles ---------- */
let _usuarioSel = 0;
function screenUsuarios() {
  const cols = [
    { key: 'nombre', label: 'Usuario', render: u => `<div class="user-cell"><span class="user-cell-avatar">${esc(u.nombre.split(' ').map(p => p[0]).slice(0, 2).join(''))}</span><div><div class="strong">${esc(u.nombre)}</div><div class="tiny muted">${esc(u.email)}</div></div></div>` },
    { key: 'origen', label: 'Origen', render: () => `<span class="badge badge-actual user-origin">${ICON('microsoft')} <span>Entra ID</span></span>` },
    { key: 'rol', label: 'Rol', render: u => `<span class="user-role">${esc(u.rol)}</span>` },
    { key: 'estado', label: 'Estado', render: u => `<span class="status-pill ${u.estado === 'Activo' ? 'is-active' : 'is-suspended'}"><span class="status-dot"></span>${esc(u.estado)}</span>` },
    { key: 'ultimo', label: 'Último acceso', render: u => `<span class="last-access">${esc(u.ultimo)}</span>` },
    { key: 'acc', label: '', render: (u) => `<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();modalAsignarAccesos(${DATA.usuarios.indexOf(u)})">${ICON('shield')} Asignar accesos</button>` },
  ];
  const u = DATA.usuarios[_usuarioSel];
  const roles = ['Operador', 'Reporteador', 'Administrador', 'Auditor'];
  // Matriz emisora × rol del usuario seleccionado
  const accesos = u.accesos || { '01': 'Administrador' };
  const matriz = DATA.emisoras.map(e => `<tr><td class="strong">${e.id} ${esc(e.nombre)}</td>${roles.map(r => `<td class="perm-cell"><input type="checkbox" ${accesos[e.id] === r ? 'checked' : ''}></td>`).join('')}</tr>`).join('');
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Usuarios y roles'], title: 'Usuarios y roles', sub: 'Los usuarios provienen de Microsoft Entra ID. Segmenta primero por emisora y luego por rol.' }) + `
  <div class="card users-card" style="margin-bottom:20px"><div class="card-head"><div><h3>Usuarios</h3><p class="card-subtitle">Directorio activo de la organización</p></div><span class="badge badge-actual">${ICON('microsoft')} Sincronizado con Entra ID</span></div>${dataTable({ cols, rows: DATA.usuarios })}</div>
  <div class="card"><div class="card-head"><h3>Accesos de ${esc(u.nombre)}</h3><span class="badge">${esc(u.rol)}</span></div><div class="card-body">
    <div class="alert alert-info" style="margin-bottom:14px">${ICON('info')} La segmentación es primero por emisora (a nivel de datos) y luego por rol. Usa <b>Asignar accesos</b> para editar a cada usuario.</div>
    <div class="permissions-table-wrap"><table class="tbl permissions-table"><thead><tr><th>Emisora</th>${roles.map(r => `<th class="text-center">${r}</th>`).join('')}</tr></thead><tbody>${matriz}</tbody></table></div>
    <div class="row" style="margin-top:14px"><button class="btn btn-primary" onclick="toastBitacora('Cambio de permisos','Permisos de ${esc(u.nombre)} actualizados')">Guardar permisos</button></div>
  </div></div>`;
}
function modalAsignarAccesos(i) {
  _usuarioSel = i;
  const u = DATA.usuarios[i];
  const accesos = u.accesos || { '01': 'Administrador' };
  const roles = ['Operador', 'Reporteador', 'Administrador'];
  const filas = DATA.emisoras.map(e => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)">
    <label class="check-item" style="min-width:220px"><input type="checkbox" ${accesos[e.id] ? 'checked' : ''}> <span>${e.id} ${esc(e.nombre)}</span></label>
    <select class="select" style="max-width:200px"><option value="">— Sin acceso —</option>${roles.map(r => `<option ${accesos[e.id] === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
  </div>`).join('');
  openModal(`<div class="modal-head"><h3>Asignar accesos · ${esc(u.nombre)}</h3><button class="icon-btn" onclick="closeModal()">${ICON('x')}</button></div>
    <div class="modal-body col gap-4">
      <div><div class="section-title" style="margin-bottom:6px">Paso 1 · Emisoras a las que tiene acceso</div><div class="section-title" style="margin-bottom:6px">Paso 2 · Rol en cada emisora</div>
        <div>${filas}</div>
      </div>
      <div class="alert alert-info">${ICON('info')} El rol <b>Auditor</b> se asigna como rol adicional para ver las bitácoras del sistema.</div>
      <label class="check-item"><input type="checkbox" ${u.rol === 'Auditor' ? 'checked' : ''}> <span>Rol adicional: Auditor (bitácoras del sistema)</span></label>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="closeModal();toastBitacora('Cambio de permisos','Accesos de ${esc(u.nombre)} asignados')">Guardar accesos</button></div>`, { size: 'lg' });
}

/* ---------- 21. Tenants Entra ID ---------- */
function screenTenants() {
  const cols = [
    { key: 'dominio', label: 'Dominio', render: t => `<span class="strong">${esc(t.dominio)}</span>` },
    { key: 'tenantId', label: 'Tenant ID' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'credencial', label: 'Método de credencial', render: t => t.credencial === 'Certificado' ? `<span class="badge badge-success">${ICON('shield')} Certificado (recomendado)</span>` : `<span class="badge">${ICON('key')} Client secret</span>` },
    { key: 'estado', label: 'Estado', render: t => t.estado === 'Principal' ? `<span class="badge badge-red">Principal</span>` : `<span class="badge badge-success">Activo</span>` },
  ];
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Tenants Entra ID'], title: 'Tenants Entra ID', sub: 'Tenants por dominio para autenticación multi-organización.', actions: `<button class="btn btn-primary" onclick="toastBitacora('Configuración','Tenant registrado')">${ICON('plus')} Registrar tenant</button>` })
    + `<div class="alert alert-info" style="margin-bottom:14px">${ICON('info')} El método predeterminado es <b>Client secret</b>. El <b>Certificado</b> se ofrece como opción recomendada. El tenant principal del administrador se registra al instalar.</div>`
    + dataTable({ cols, rows: DATA.tenants });
}

/* ---------- 22. Sesión ---------- */
function screenSesion() {
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Sesión'], title: 'Sesión', sub: 'Configura la duración de la sesión de los usuarios.' }) + `
  <div class="card" style="max-width:520px"><div class="card-body col gap-4">
    <div class="field"><label>Duración de sesión (minutos)</label><input class="input num" value="0"><span class="hint">0 = dura lo mismo que el token de Entra ID.</span></div>
    <div class="alert alert-info">${ICON('info')} Con 0, la sesión sigue la política de tu organización en Microsoft Entra ID.</div>
    <div class="row"><button class="btn btn-primary" onclick="toastBitacora('Configuración','Parámetros de sesión guardados')">Guardar</button></div>
  </div></div>`;
}

/* ---------- 23. Bitácora de auditoría ---------- */
let _bitTab = 'actual';
function screenAuditoria() {
  window._afterRender = () => renderBitTab();
  const eventos = ['Inicio de sesión', 'Exportación', 'Impresión', 'Cambio de permisos', 'Canje', 'Reembolso', 'Liquidación', 'Cheque'];
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Bitácora de auditoría'], title: 'Bitácora de auditoría', sub: 'Toda operación queda registrada. Filtra por evento, usuario, emisora y fecha.', actions: exportBar('Bitácora de auditoría') }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="grid grid-4">
      <div class="field"><label>Evento</label><select class="select"><option>Todos</option>${eventos.map(e => `<option>${e}</option>`).join('')}</select></div>
      <div class="field"><label>Usuario</label><select class="select"><option>Todos</option>${DATA.usuarios.map(u => `<option>${esc(u.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Emisora</label><select class="select"><option>Todas</option>${DATA.emisoras.map(e => `<option>${e.id} ${esc(e.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Fecha</label><input class="input" type="date" value="2026-09-30"></div>
    </div>
  </div></div>
  <div class="tabs" style="margin-bottom:16px">
    <div class="tab active" onclick="setBitTab('actual')">Sistema actual</div>
    <div class="tab" onclick="setBitTab('legacy')">Histórico del sistema anterior</div>
  </div>
  <div id="bitBody"></div>`;
}
function setBitTab(t) { _bitTab = t; renderBitTab(); document.querySelectorAll('.tabs .tab').forEach((el, i) => el.classList.toggle('active', ['actual', 'legacy'][i] === t)); }
function renderBitTab() {
  const b = document.getElementById('bitBody'); if (!b) return;
  const cols = [
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'emisora', label: 'Emisora' },
    { key: 'evento', label: 'Evento', render: r => `<span class="badge">${esc(r.evento)}</span>` },
    { key: 'detalle', label: 'Detalle' },
    { key: 'folio', label: 'Folio' },
  ];
  if (_bitTab === 'legacy') {
    const legacy = [
      { fecha: '12/03/2004 10:22', usuario: 'ADMIN (Access)', emisora: '01 SIGMA FOODS', evento: 'Canje', detalle: 'Canje 12 · migrado', folio: 'CJ-12' },
      { fecha: '08/07/2012 15:40', usuario: 'OPERADOR2 (Access)', emisora: '01 SIGMA FOODS', evento: 'Liquidación', detalle: 'Liquidación cupón 22 · migrado', folio: '10122008' },
    ];
    b.innerHTML = `<div class="alert alert-info" style="margin-bottom:12px">${ICON('info')} Registros de solo consulta importados del sistema en MS Access.</div>` + dataTable({ cols, rows: legacy, filters: true });
  } else {
    b.innerHTML = dataTable({ cols, rows: DATA.bitacora, filters: true });
  }
}

/* ---------- 24. Bitácora de impresión ---------- */
function screenImpresion() {
  const rows = [
    { fecha: '30/09/2026 09:13', tipo: 'Recibo', doc: 'Recibo de título nuevo', folio: 'T-103', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 10:07', tipo: 'Recibo', doc: 'Recibo de canje', folio: 'CJ-93', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 10:07', tipo: 'Recibo', doc: 'Recibo de liquidación', folio: '10144037', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 10:07', tipo: 'Recibo', doc: 'Recibo Hylsamex', folio: 'CJ-93', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 10:07', tipo: 'Recibo', doc: 'Pago de fracción', folio: 'CJ-93', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 10:08', tipo: 'Cheque', doc: 'Cheque', folio: 'CH-5290', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 11:20', tipo: 'Recibo', doc: 'Recibo de sustitución', folio: 'T-88', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '30/09/2026 12:02', tipo: 'Cheque', doc: 'Cheque', folio: 'CH-5285', accion: 'Reimpreso', motivo: 'Atasco de impresora', usuario: 'Ana Lucía Robles' },
    { fecha: '30/09/2026 12:10', tipo: 'Cheque', doc: 'Cheque', folio: 'CH-5291', accion: 'Sustituido', motivo: 'Cheque extraviado (sustituye CH-5285)', usuario: 'Ana Lucía Robles' },
  ];
  const cols = [
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'doc', label: 'Documento' },
    { key: 'folio', label: 'Folio' },
    { key: 'accion', label: 'Acción', render: r => r.accion === 'Impreso' ? `<span class="badge">${esc(r.accion)}</span>` : `<span class="badge badge-warning">${esc(r.accion)}</span>` },
    { key: 'motivo', label: 'Motivo' },
    { key: 'usuario', label: 'Usuario' },
  ];
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Bitácora de impresión'], title: 'Bitácora de impresión', sub: 'Cheques y recibos impresos, reimpresos y sustituidos, con folio, motivo y usuario.', actions: exportBar('Bitácora de impresión') })
    + dataTable({ cols, rows, filters: true });
}
