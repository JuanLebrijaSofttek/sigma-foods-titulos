/* ============================================================
   Pantallas 20-24 — Seguridad y Auditoría
   ============================================================ */

/* ---------- 20. Usuarios y roles ---------- */
function screenUsuarios() {
  const cols = [
    { key: 'nombre', label: 'Usuario', render: u => `<div class="user-cell"><span class="user-cell-avatar">${esc(u.nombre.split(' ').map(p => p[0]).slice(0, 2).join(''))}</span><div><div class="strong">${esc(u.nombre)}</div><div class="tiny muted">${esc(u.email)}</div></div></div>` },
    { key: 'origen', label: 'Origen', render: () => `<span class="badge badge-parity user-origin">${ICON('microsoft')} <span>Entra ID</span></span>` },
    { key: 'rol', label: 'Rol', render: u => `<span class="user-role">${esc(u.rol)}</span>` },
    { key: 'estado', label: 'Estado', render: u => `<span class="status-pill ${u.estado === 'Activo' ? 'is-active' : 'is-suspended'}"><span class="status-dot"></span>${esc(u.estado)}</span>` },
    { key: 'ultimo', label: 'Último acceso', render: u => `<span class="last-access">${esc(u.ultimo)}</span>` },
  ];
  const roles = ['Operador', 'Reporteador', 'Administrador', 'Auditor'];
  const matriz = DATA.emisoras.map(e => `<tr><td class="strong">${e.id} ${esc(e.nombre)}</td>${roles.map(() => `<td class="perm-cell"><input type="checkbox" ${e.id === '01' ? 'checked' : Math.random() > 0.6 ? 'checked' : ''}></td>`).join('')}</tr>`).join('');
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Usuarios y roles'], title: 'Usuarios y roles', sub: 'Los usuarios provienen de Microsoft Entra ID. Asigna emisoras y roles.' }) + `
  <div class="card users-card" style="margin-bottom:20px"><div class="card-head"><div><h3>Usuarios</h3><p class="card-subtitle">Directorio activo de la organización</p></div><span class="badge badge-parity">${ICON('microsoft')} Sincronizado con Entra ID</span></div>${dataTable({ cols, rows: DATA.usuarios })}</div>
  <div class="card"><div class="card-head"><h3>Matriz de permisos</h3></div><div class="card-body">
    <div class="alert alert-info" style="margin-bottom:14px">${ICON('info')} Primero defines a qué emisoras ve, luego qué puede hacer.</div>
    <div class="permissions-table-wrap"><table class="tbl permissions-table"><thead><tr><th>Emisora</th>${roles.map(r => `<th class="text-center">${r}</th>`).join('')}</tr></thead><tbody>${matriz}</tbody></table></div>
    <div class="row" style="margin-top:14px"><button class="btn btn-primary" onclick="toastBitacora('Cambio de permisos','Matriz de permisos actualizada')">Guardar permisos</button></div>
  </div></div>`;
}

/* ---------- 21. Tenants Entra ID ---------- */
function screenTenants() {
  const cols = [
    { key: 'dominio', label: 'Dominio', render: t => `<span class="strong">${esc(t.dominio)}</span>` },
    { key: 'tenantId', label: 'Tenant ID' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'credencial', label: 'Método de credencial', render: t => t.credencial === 'Certificado' ? `<span class="badge badge-success">${ICON('shield')} Certificado (recomendado)</span>` : `<span class="badge badge-warning">${ICON('key')} Secreto</span>` },
    { key: 'estado', label: 'Estado', render: t => t.estado === 'Principal' ? `<span class="badge badge-red">Principal</span>` : `<span class="badge badge-success">Activo</span>` },
  ];
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Tenants Entra ID'], title: 'Tenants Entra ID', sub: 'Tenants por dominio para autenticación multi-organización.', actions: `<button class="btn btn-primary" onclick="toastBitacora('Configuración','Tenant registrado')">${ICON('plus')} Registrar tenant</button>` })
    + `<div class="alert alert-info" style="margin-bottom:14px">${ICON('info')} El tenant principal del administrador se registra al instalar.</div>`
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
      <div class="field"><label>Fecha</label><input class="input" type="date" value="2026-09-29"></div>
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
    { fecha: '29/09/2026 08:15', tipo: 'Recibo', doc: 'Recibo de título nuevo', folio: 'T-103', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '28/09/2026 12:05', tipo: 'Cheque', doc: 'Cheque', folio: 'CH-5289', accion: 'Impreso', motivo: '—', usuario: 'Carlos Menéndez' },
    { fecha: '27/09/2026 16:30', tipo: 'Cheque', doc: 'Cheque', folio: 'CH-5280', accion: 'Reimpreso', motivo: 'Atasco de impresora', usuario: 'Ana Lucía Robles' },
  ];
  const cols = [
    { key: 'fecha', label: 'Fecha y hora' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'doc', label: 'Documento' },
    { key: 'folio', label: 'Folio' },
    { key: 'accion', label: 'Acción', render: r => r.accion === 'Reimpreso' ? `<span class="badge badge-warning">${esc(r.accion)}</span>` : `<span class="badge">${esc(r.accion)}</span>` },
    { key: 'motivo', label: 'Motivo' },
    { key: 'usuario', label: 'Usuario' },
  ];
  return pageHead({ crumbs: ['Seguridad y Auditoría', 'Bitácora de impresión'], title: 'Bitácora de impresión', sub: 'Cheques y recibos impresos y reimpresos, con folio, motivo y usuario.', actions: exportBar('Bitácora de impresión') })
    + dataTable({ cols, rows, filters: true });
}
