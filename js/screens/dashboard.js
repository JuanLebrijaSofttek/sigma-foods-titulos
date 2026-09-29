/* ============================================================
   Pantalla 26 — Dashboard ejecutivo
   ============================================================ */
function screenDashboard() {
  const meses = [['Ene', 40], ['Feb', 55], ['Mar', 70], ['Abr', 100], ['May', 62], ['Jun', 48], ['Jul', 52], ['Ago', 58], ['Sep', 45]];
  const maxV = Math.max(...meses.map(m => m[1]));
  const bars = meses.map(([m, v]) => `<div class="chart-bar"><div class="bar-fill" style="height:${(v / maxV) * 100}%"></div><span class="bar-lbl">${m}</span></div>`).join('');
  const canjes = [['SIGMA FOODS', 88], ['HYLSAMEX', 42], ['ALPEK', 30], ['NEMAK', 18]];
  const maxC = Math.max(...canjes.map(c => c[1]));
  const cbars = canjes.map(([m, v]) => `<div class="chart-bar"><div class="bar-fill alt" style="height:${(v / maxC) * 100}%"></div><span class="bar-lbl">${m}</span></div>`).join('');

  return pageHead({ crumbs: ['Dashboard ejecutivo'], title: 'Dashboard ejecutivo', sub: 'Vista embebida conectada directo a SQL Server.', actions: `<span class="badge badge-success">${ICON('database')} Conectado directo a SQL Server</span>` }) + `
  <div class="grid grid-4" style="margin-bottom:16px">
    ${dashKpi('Dividendos pagados 2026', fmtMoney(1204880), 'coins')}
    ${dashKpi('Canjes del año', '178', 'swap')}
    ${dashKpi('Títulos pendientes', String(DATA.titulos.filter(t => t.pendienteCanje).length), 'files')}
    ${dashKpi('Fracciones pagadas', fmtMoney(1069.50), 'scissors')}
  </div>
  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card"><div class="card-head"><h3>Dividendos pagados por mes</h3><span class="badge">2026</span></div><div class="card-body"><div class="chart-bars">${bars}</div></div></div>
    <div class="card"><div class="card-head"><h3>Canjes por emisora</h3></div><div class="card-body"><div class="chart-bars">${cbars}</div></div></div>
  </div>
  <div class="grid grid-2">
    <div class="card"><div class="card-head"><h3>Títulos pendientes por antigüedad</h3></div><div class="card-body">
      ${dashBar('1996-2004', 62, 'red')}
      ${dashBar('2004-2023', 28, '')}
      ${dashBar('2023-2025', 10, '')}
    </div></div>
    <div class="card"><div class="card-head"><h3>Fracciones pagadas por año</h3></div><div class="card-body">
      ${dashBar('2024', 45, '')}
      ${dashBar('2025', 68, '')}
      ${dashBar('2026', 82, 'red')}
    </div></div>
  </div>`;
}
function dashKpi(label, value, icon) {
  return `<div class="kpi"><div class="row between"><span class="kpi-label">${esc(label)}</span><span class="kpi-icon">${ICON(icon)}</span></div><div class="kpi-value">${value}</div></div>`;
}
function dashBar(label, pct, cls) {
  return `<div style="margin-bottom:12px"><div class="row between small" style="margin-bottom:4px"><span class="secondary">${esc(label)}</span><span class="strong">${pct}%</span></div><div class="progress"><div class="bar ${cls}" style="width:${pct}%"></div></div></div>`;
}
