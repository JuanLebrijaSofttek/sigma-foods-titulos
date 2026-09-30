/* ============================================================
   Pantalla 26 — Dashboard ejecutivo
   ============================================================ */
function screenDashboard() {
  const meses = [['Ene', 0], ['Feb', 0], ['Mar', 182400], ['Abr', 0], ['May', 0], ['Jun', 0], ['Jul', 0], ['Ago', 0], ['Sep', 5033]];
  const maxV = Math.max(...meses.map(m => m[1]), 1);
  const bars = meses.map(([m, v]) => `<div class="chart-bar"><div class="bar-fill" style="height:${(v / maxV) * 100}%"></div><span class="bar-lbl">${m}</span></div>`).join('');
  const canjes = [['SIGMA FOODS', 1], ['HYLSAMEX', 0], ['ALPEK', 0], ['NEMAK', 0]];
  const maxC = Math.max(...canjes.map(c => c[1]), 1);
  const cbars = canjes.map(([m, v]) => `<div class="chart-bar"><div class="bar-fill alt" style="height:${(v / maxC) * 100}%"></div><span class="bar-lbl">${m}</span></div>`).join('');

  return pageHead({ crumbs: ['Dashboard ejecutivo'], title: 'Dashboard ejecutivo en Power BI (propuesta opcional)', sub: 'Conexión directa a SQL Server.', actions: `<span class="badge badge-success">${ICON('database')} Conexión directa a SQL Server</span>` }) + `
  <div class="alert alert-info" style="margin-bottom:16px">${ICON('info')} Propuesta opcional: tablero en Power BI conectado directo a SQL Server. Las cifras coinciden con los reportes del sistema.</div>
  <div class="grid grid-4" style="margin-bottom:16px">
    ${dashKpi('Dividendos pagados 2026', fmtMoney(187433.28), 'coins')}
    ${dashKpi('Reembolsos pagados 2026', fmtMoney(391810.00), 'dollar')}
    ${dashKpi('Canjes del año', '93', 'swap')}
    ${dashKpi('Fracciones pagadas', fmtMoney(9.75), 'scissors')}
  </div>
  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card"><div class="card-head"><h3>Dividendos pagados por mes</h3><span class="badge">2026</span></div><div class="card-body"><div class="chart-bars">${bars}</div></div></div>
    <div class="card"><div class="card-head"><h3>Canjes por emisora</h3></div><div class="card-body"><div class="chart-bars">${cbars}</div></div></div>
  </div>
  <div class="grid grid-2">
    <div class="card"><div class="card-head"><h3>Títulos pendientes por antigüedad</h3></div><div class="card-body">
      ${dashBar('Nov-23 (2 títulos)', 100, 'red')}
    </div></div>
    <div class="card"><div class="card-head"><h3>Fracciones pagadas por año</h3></div><div class="card-body">
      ${dashBar('2025', 33, '')}
      ${dashBar('2026', 67, 'red')}
    </div></div>
  </div>`;
}
function dashKpi(label, value, icon) {
  return `<div class="kpi"><div class="row between"><span class="kpi-label">${esc(label)}</span><span class="kpi-icon">${ICON(icon)}</span></div><div class="kpi-value">${value}</div></div>`;
}
function dashBar(label, pct, cls) {
  return `<div style="margin-bottom:12px"><div class="row between small" style="margin-bottom:4px"><span class="secondary">${esc(label)}</span><span class="strong">${pct}%</span></div><div class="progress"><div class="bar ${cls}" style="width:${pct}%"></div></div></div>`;
}
