/* ============================================================
   Pantalla 2 — Inicio
   ============================================================ */
function screenInicio() {
  const vig = emisionVigente();
  const em = emisoraById(STATE.emisoraActual);
  const pendientes = DATA.titulos.filter(t => t.pendienteCanje).length;

  const kpis = [
    { label: 'Acciones en circulación', value: fmtNum(vig ? vig.acciones : 0), icon: 'coins', delta: 'Emisión ' + (vig ? vig.corto : '—'), kind: 'up' },
    { label: 'Títulos vigentes', value: fmtNum(DATA.titulos.filter(t => t.estatus === 'Vigente').length + 98), icon: 'files', delta: '+3 esta semana', kind: 'up' },
    { label: 'Títulos pendientes de canje', value: fmtNum(pendientes), icon: 'swap', delta: 'Requieren atención', kind: 'warn' },
    { label: 'Dividendos por pagar (cupón 44)', value: fmtMoney(1801748), icon: 'dollar', delta: 'Factor 0.32500000', kind: 'up' },
    { label: 'Cheques emitidos este mes', value: fmtNum(37), icon: 'check', delta: 'Último: CH 5289', kind: 'up' },
  ];

  const kpiCards = kpis.map(k => `<div class="kpi">
    <div class="row between"><span class="kpi-label">${esc(k.label)}</span><span class="kpi-icon">${ICON(k.icon)}</span></div>
    <div class="kpi-value">${k.value}</div>
    <div class="kpi-delta ${k.kind}">${k.kind === 'warn' ? ICON('alertTri') : ICON('trendUp')} ${esc(k.delta)}</div>
  </div>`).join('');

  const actividad = DATA.bitacora.slice(0, 5).map(b => `<div class="act-item">
    <span class="act-ic">${ICON('activity')}</span>
    <div class="grow"><div class="strong small">${esc(b.evento)}</div><div class="tiny muted">${esc(b.detalle)}</div></div>
    <div class="tiny muted nowrap">${esc(b.fecha.split(' ')[1] || b.fecha)}</div>
  </div>`).join('');

  return `${pageHead({
    title: `Buenos días, ${DATA.user.nombre.split(' ')[0] === 'Carlos' ? 'Carlos' : DATA.user.nombre.split(' ')[0]}.`,
    sub: `Esto es lo que pasa hoy en ${em.nombre}.`,
    actions: `<button class="btn btn-secondary" onclick="go('reportes')">${ICON('report')} Reportes</button><button class="btn btn-primary" onclick="go('titulos/canje')">${ICON('swap')} Nuevo canje</button>`
  })}

  <div class="grid grid-5" style="margin-bottom:20px">${kpiCards}</div>

  <div class="grid grid-side">
    <div class="col gap-4">
      <div class="card caso-card">
        <div class="caso-accent"></div>
        <div class="card-body">
          <div class="row gap-2" style="margin-bottom:10px"><span class="badge badge-red">${ICON('user')} Caso del día</span><span class="badge badge-warning">${ICON('alertTri')} Pendiente de canje</span></div>
          <h2 style="margin-bottom:8px">Don Rogelio Treviño Leal llegó a ventanilla con el Título 17 de 1996.</h2>
          <p class="secondary" style="max-width:560px">Nunca ha canjeado, hubo un split y tiene cupones sin cobrar. El sistema ya calculó su equivalencia, sus fracciones y sus dividendos acumulados.</p>
          <div class="caso-facts">
            <div><div class="tiny muted">Título presentado</div><div class="strong">Título 17 · ${'T.D. Serie \'A\' Junio-96'}</div></div>
            <div><div class="tiny muted">Acciones originales</div><div class="strong num">2,450</div></div>
            <div><div class="tiny muted">Último cupón cobrado</div><div class="strong num">38</div></div>
            <div><div class="tiny muted">Dividendos estimados</div><div class="strong num">${fmtMoney(5883.62)}</div></div>
          </div>
          <div class="row gap-2" style="margin-top:16px">
            <button class="btn btn-primary" onclick="go('titulos/canje')">${ICON('swap')} Atender canje</button>
            <button class="btn btn-ghost" onclick="go('accionistas')">Ver ficha del accionista ${ICON('arrowRight')}</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Accesos rápidos</h3></div>
        <div class="card-body"><div class="grid grid-4 quick-grid">
          ${quick('Generar título', 'file', 'titulos/generacion')}
          ${quick('Liquidaciones', 'bank', 'liquidaciones/liquidaciones')}
          ${quick('Cheques', 'check', 'liquidaciones/cheques')}
          ${quick('Accionistas', 'users', 'accionistas')}
          ${quick('Reportes', 'report', 'reportes')}
          ${quick('Pendientes de canje', 'swap', 'titulos/pendientes')}
          ${quick('Bitácora', 'activity', 'seguridad/auditoria')}
          ${quick('Dashboard', 'dashboard', 'dashboard')}
        </div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Actividad reciente</h3><span class="badge">${ICON('activity')} Bitácora</span></div>
      <div class="card-body" style="padding:8px 12px">${actividad}</div>
      <div class="card-foot"><button class="btn btn-ghost btn-sm btn-block" onclick="go('seguridad/auditoria')">Ver bitácora completa ${ICON('arrowRight')}</button></div>
    </div>
  </div>`;
}

function quick(label, icon, route) {
  return `<button class="quick-item" onclick="go('${route}')"><span class="qi-ic">${ICON(icon)}</span><span>${esc(label)}</span></button>`;
}
