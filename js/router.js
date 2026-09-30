/* ============================================================
   Router (hash-based)
   ============================================================ */
const ROUTES = {
  'login': () => screenLogin(),
  'inicio': () => screenInicio(),
  'titulos/generacion': () => screenGeneracion(),
  'titulos/canje': () => screenCanje(),
  'titulos/sustitucion': () => screenSustitucion(),
  'titulos/endoso': () => screenEndoso(),
  'titulos/reimpresion': () => screenReimpresion(),
  'titulos/pendientes': () => screenPendientes(),
  'liquidaciones/liquidaciones': () => screenLiquidaciones(),
  'liquidaciones/indeval': () => screenIndeval(),
  'liquidaciones/cheques': () => screenCheques(),
  'accionistas': () => screenAccionistas(),
  'consultas/titulos': () => screenConsulta('titulos'),
  'consultas/canjes': () => screenConsulta('canjes'),
  'consultas/liquidaciones': () => screenConsulta('liquidaciones'),
  'reportes': () => screenReportes(),
  'config/emisoras': () => screenEmisoras(),
  'config/emisiones': () => screenEmisiones(),
  'config/cupones': () => screenCupones(),
  'config/parametros': () => screenParametros(),
  'config/plantillas': () => screenPlantillas(),
  'config/catalogos': () => screenCatalogos(),
  'seguridad/usuarios': () => screenUsuarios(),
  'seguridad/tenants': () => screenTenants(),
  'seguridad/sesion': () => screenSesion(),
  'seguridad/auditoria': () => screenAuditoria(),
  'seguridad/impresion': () => screenImpresion(),
  'migracion': () => screenMigracion(),
  'dashboard': () => screenDashboard(),
};

let _currentRoute = 'inicio';
function currentRoute() { return _currentRoute; }

function go(route) { location.hash = '#/' + route; }

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '') || (STATE.autenticado ? 'inicio' : 'login');
  return raw;
}

function render(route) {
  _currentRoute = route;
  const app = document.getElementById('app');

  if (route === 'login' || !STATE.autenticado) {
    if (route !== 'login' && !STATE.autenticado) { location.hash = '#/login'; return; }
    app.innerHTML = screenLogin();
    if (window._afterRender) { window._afterRender(); window._afterRender = null; }
    return;
  }

  // Shell + vista
  app.innerHTML = renderShell(route);
  const view = document.getElementById('view');
  const fn = ROUTES[route];
  view.innerHTML = fn ? fn() : screenInicio();
  window.scrollTo(0, 0);
  const content = document.querySelector('.content');
  if (content) content.scrollTop = 0;
  if (window._afterRender) { window._afterRender(); window._afterRender = null; }
}

window.addEventListener('hashchange', () => render(parseHash()));
