/* ============================================================
   Shell: header fijo + sidebar colapsable
   ============================================================ */
const NAV = [
  { id: 'inicio', label: 'Inicio', icon: 'home', route: 'inicio' },
  {
    id: 'titulos', label: 'Títulos', icon: 'files', children: [
      { label: 'Generación', route: 'titulos/generacion' },
      { label: 'Canje', route: 'titulos/canje' },
      { label: 'Sustitución', route: 'titulos/sustitucion' },
      { label: 'Endoso', route: 'titulos/endoso' },
      { label: 'Reimpresión y anulación', route: 'titulos/reimpresion' },
      { label: 'Pendientes de canje', route: 'titulos/pendientes', badge: 'nav-count' },
    ]
  },
  {
    id: 'liquidaciones', label: 'Liquidaciones y Cheques', icon: 'bank', children: [
      { label: 'Liquidaciones', route: 'liquidaciones/liquidaciones' },
      { label: 'Liquidaciones Indeval', route: 'liquidaciones/indeval' },
      { label: 'Cheques', route: 'liquidaciones/cheques' },
    ]
  },
  { id: 'accionistas', label: 'Accionistas', icon: 'users', route: 'accionistas' },
  {
    id: 'consultas', label: 'Consultas', icon: 'search', children: [
      { label: 'Títulos', route: 'consultas/titulos' },
      { label: 'Canjes', route: 'consultas/canjes' },
      { label: 'Liquidaciones', route: 'consultas/liquidaciones' },
    ]
  },
  { id: 'reportes', label: 'Reportes', icon: 'report', route: 'reportes' },
  {
    id: 'config', label: 'Configuración', icon: 'settings', children: [
      { label: 'Emisoras', route: 'config/emisoras' },
      { label: 'Emisiones', route: 'config/emisiones' },
      { label: 'Cupones y eventos corporativos', route: 'config/cupones' },
      { label: 'Parámetros de emisora', route: 'config/parametros' },
      { label: 'Catálogos geográficos', route: 'config/catalogos' },
    ]
  },
  {
    id: 'seguridad', label: 'Seguridad y Auditoría', icon: 'shield', children: [
      { label: 'Usuarios y roles', route: 'seguridad/usuarios' },
      { label: 'Tenants Entra ID', route: 'seguridad/tenants' },
      { label: 'Sesión', route: 'seguridad/sesion' },
      { label: 'Bitácora de auditoría', route: 'seguridad/auditoria' },
      { label: 'Bitácora de impresión', route: 'seguridad/impresion' },
    ]
  },
  { id: 'migracion', label: 'Migración de datos', icon: 'database', route: 'migracion' },
  { id: 'dashboard', label: 'Dashboard ejecutivo', icon: 'dashboard', route: 'dashboard' },
];

function renderShell(activeRoute) {
  const collapsed = STATE.sidebarCollapsed ? 'collapsed' : '';
  return `<div class="app-shell">
    ${renderSidebar(activeRoute, collapsed)}
    <div class="main">
      ${renderHeader()}
      <div class="content"><div class="content-inner" id="view"></div></div>
    </div>
  </div>`;
}

function renderSidebar(activeRoute, collapsed) {
  const top = activeRoute.split('/')[0];
  const nav = NAV.map(item => {
    if (item.children) {
      const openCls = top === item.id ? 'open' : '';
      const subOpen = top === item.id ? 'open' : '';
      const kids = item.children.map(c => {
        const active = activeRoute === c.route ? 'active' : '';
        let badge = '';
        if (c.badge === 'nav-count') { const n = DATA.titulos.filter(t => t.pendienteCanje).length; badge = `<span class="badge badge-red nav-badge">${n}</span>`; }
        return `<div class="nav-item ${active}" onclick="go('${c.route}')"><span class="label">${esc(c.label)}</span>${badge}</div>`;
      }).join('');
      return `<div class="nav-group">
        <div class="nav-item ${openCls} ${top === item.id ? '' : ''}" onclick="toggleGroup(this)">${ICON(item.icon)}<span class="label">${esc(item.label)}</span><span class="chev">${ICON('chevron')}</span></div>
        <div class="nav-sub ${subOpen}">${kids}</div>
      </div>`;
    }
    const active = activeRoute === item.route ? 'active' : '';
    return `<div class="nav-item ${active}" onclick="go('${item.route}')">${ICON(item.icon)}<span class="label">${esc(item.label)}</span></div>`;
  }).join('');

  return `<aside class="sidebar ${collapsed}" id="sidebar">
    <div class="sidebar-brand">${SIGMA_LOGO(30)}<div class="brand-txt">SIGMA FOODS<small>Gestión de Títulos</small></div></div>
    <nav class="sidebar-nav">${nav}</nav>
    <div class="sidebar-foot">
      <button class="collapse-btn" onclick="toggleSidebar()">${ICON('panelLeft')}<span class="label">Colapsar menú</span></button>
    </div>
  </aside>`;
}

function toggleGroup(el) {
  el.classList.toggle('open');
  const sub = el.nextElementSibling;
  sub.classList.toggle('open');
}
function toggleSidebar() {
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function renderHeader() {
  const em = emisoraById(STATE.emisoraActual);
  const vig = emisionVigente(STATE.emisoraActual);
  const showSelector = DATA.emisoras.length >= 2;
  const selector = showSelector ? `
    <div class="emisora-selector" onclick="openEmisoraDropdown(event)">
      <span class="es-logo">${em.id}</span>
      <div><div class="es-name">${esc(em.nombre)}</div>${vig ? `<div class="es-sub">Emisión vigente: ${esc(vig.corto)}</div>` : ''}</div>
      <span class="chev">${ICON('chevronDown')}</span>
    </div>` : '';
  return `<header class="header">
    <button class="icon-btn" onclick="toggleSidebar()" title="Menú">${ICON('panelLeft')}</button>
    ${selector}
    <div class="header-search">${ICON('search')}<input placeholder="Busca accionista, título o folio" onkeydown="if(event.key==='Enter')globalSearch(this.value)"></div>
    <span class="env-badge">${DATA.ambiente}</span>
    <button class="icon-btn" title="Notificaciones">${ICON('bell')}</button>
    <div class="avatar-btn" onclick="openUserMenu(event)">
      <span class="avatar">${DATA.user.iniciales}</span>
      <div><div class="u-name">${esc(DATA.user.nombre)}</div><div class="u-role">${esc(DATA.user.rol)}</div></div>
      <span class="chev muted">${ICON('chevronDown')}</span>
    </div>
  </header>`;
}

function openEmisoraDropdown(e) {
  e.stopPropagation();
  closeDropdowns();
  const rect = e.currentTarget.getBoundingClientRect();
  const items = DATA.emisoras.map(em => {
    const vig = DATA.emisiones.find(x => x.emisora === em.id && x.vigente);
    const active = em.id === STATE.emisoraActual ? 'active' : '';
    return `<div class="dd-item ${active}" onclick="switchEmisora('${em.id}')">
      <span class="es-logo">${em.id}</span>
      <div><div class="strong">${esc(em.nombre)}</div><div class="tiny muted">${vig ? 'Emisión vigente: ' + esc(vig.corto) : 'Sin emisión vigente'}</div></div>
      ${active ? ICON('check', '') : ''}
    </div>`;
  }).join('');
  showDropdown(rect.left, rect.bottom + 6, `<div style="padding:6px 8px;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Cambiar emisora</div>${items}`, 340);
}

function switchEmisora(id) {
  STATE.emisoraActual = id;
  closeDropdowns();
  toast('Contexto actualizado', `Emisora ${id} · ${emisoraById(id).nombre}`);
  render(currentRoute());
}

function openUserMenu(e) {
  e.stopPropagation(); closeDropdowns();
  const rect = e.currentTarget.getBoundingClientRect();
  const html = `<div style="padding:10px 12px"><div class="strong">${esc(DATA.user.nombre)}</div><div class="tiny muted">${esc(DATA.user.email)}</div><div class="badge badge-parity" style="margin-top:6px">${esc(DATA.user.rol)}</div></div>
    <div class="dd-sep"></div>
    <div class="dd-item" onclick="closeDropdowns();go('seguridad/sesion')">${ICON('clock')} Sesión</div>
    <div class="dd-item" onclick="logout()">${ICON('logout')} Cerrar sesión</div>`;
  showDropdown(rect.right - 260, rect.bottom + 6, html, 260);
}

function showDropdown(x, y, html, w = 260) {
  const layer = document.getElementById('overlay-layer');
  layer.innerHTML = `<div id="dd-backdrop" style="position:fixed;inset:0;z-index:150" onclick="closeDropdowns()"></div>
    <div class="dropdown" style="left:${x}px;top:${y}px;min-width:${w}px" onclick="event.stopPropagation()">${html}</div>`;
}
function closeDropdowns() { document.getElementById('overlay-layer').innerHTML = ''; }

function globalSearch(q) {
  if (!q.trim()) return;
  toast('Búsqueda', `Resultados para “${q}”`);
  // Heurística: si menciona a Rogelio o Título 17, va al canje
  if (/rogelio|17/i.test(q)) go('titulos/canje');
  else if (/accionista|garza|salinas|elizondo/i.test(q)) go('accionistas');
}

function logout() { STATE.autenticado = false; closeDropdowns(); location.hash = '#/login'; }
