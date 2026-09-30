/* ============================================================
   Pantalla 25 — Migración bajo demanda (Access a SQL Server)
   ============================================================ */
function screenMigracion() {
  const corridas = [
    { tipo: 'Total', ambiente: 'DEV', estado: 'Completada', dur: '00:41:02', fecha: '22/09/2026' },
    { tipo: 'Incremental', ambiente: 'QA', estado: 'Completada', dur: '00:03:05', fecha: '28/09/2026' },
    { tipo: 'Incremental', ambiente: 'QA', estado: 'En validación', dur: '00:01:12', fecha: '30/09/2026' },
  ];
  const validacion = [
    { ent: 'Accionistas', o: 14820, d: 14820, ok: true },
    { ent: 'Títulos', o: 39104, d: 39104, ok: true },
    { ent: 'Emisiones', o: 5, d: 5, ok: true },
    { ent: 'Cupones', o: 44, d: 44, ok: true },
    { ent: 'Canjes', o: 93, d: 93, ok: true },
    { ent: 'Liquidaciones', o: 1284, d: 1281, ok: false },
    { ent: 'Cheques', o: 5290, d: 5290, ok: true },
  ];
  const corridaCols = [
    { key: 'tipo', label: 'Tipo', render: c => `<span class="badge ${c.tipo === 'Total' ? 'badge-red' : ''}">${esc(c.tipo)}</span>` },
    { key: 'ambiente', label: 'Ambiente' },
    { key: 'estado', label: 'Estado', render: c => c.estado === 'Completada' ? `<span class="badge badge-success">${ICON('check')} ${esc(c.estado)}</span>` : `<span class="badge badge-warning">${esc(c.estado)}</span>` },
    { key: 'dur', label: 'Duración', num: true },
    { key: 'fecha', label: 'Fecha' },
  ];
  const valCols = [
    { key: 'ent', label: 'Entidad', render: v => `<span class="strong">${esc(v.ent)}</span>` },
    { key: 'o', label: 'Conteo origen', num: true, render: v => fmtNum(v.o) },
    { key: 'd', label: 'Conteo destino', num: true, render: v => fmtNum(v.d) },
    { key: 'ok', label: 'Estado', render: v => v.ok ? `<span class="mig-check">${ICON('checkCircle')} Conteos coinciden</span>` : `<span class="badge badge-warning">${ICON('alertTri')} Pendiente de revisión</span>` },
  ];
  return pageHead({ crumbs: ['Migración de datos'], title: 'Migración bajo demanda (Access a SQL Server)', sub: 'Corridas de ETL de MS Access a SQL Server, con validación por entidad.', actions: `<button class="btn btn-primary" onclick="ejecutarMigracion()">${ICON('play')} Ejecutar migración</button>` }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="row gap-3 wrap" style="margin-bottom:14px">
      <div class="segmented"><button class="active">Total</button><button>Incremental</button></div>
      <div class="segmented"><button>DEV</button><button class="active">QA</button></div>
      <span class="tiny muted">Bajo demanda · Access → SQL Server · sin PROD</span>
    </div>
    <div class="progress" id="migProgress"><div class="bar" style="width:100%"></div></div>
    <div class="tiny muted" style="margin-top:6px" id="migStatus">Última corrida QA en validación · 30/09/2026</div>
  </div></div>

  <div class="card" style="margin-bottom:16px"><div class="card-head"><h3>Corridas de ETL</h3></div>${dataTable({ cols: corridaCols, rows: corridas })}</div>

  <div class="grid grid-side">
    <div class="card"><div class="card-head"><h3>Validación por entidad</h3><span class="badge badge-warning">${ICON('alertTri')} 1 pendiente</span></div>${dataTable({ cols: valCols, rows: validacion })}</div>
    <div class="card"><div class="card-head"><h3>Validación con reportes idénticos (UAT)</h3></div><div class="card-body col gap-3">
      <div class="tiny muted">Se validan contra el sistema anterior con el usuario clave.</div>
      ${uatRow('Resumen de pago de dividendos')}
      ${uatRow('Dividendos pagados por mes')}
      <div class="alert alert-info" style="margin-top:6px">${ICON('info')} Estado: <b>Por validar con el usuario clave</b>.</div>
    </div></div>
  </div>`;
}
function uatRow(nombre) {
  return `<div class="saldo-row" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px"><div><div class="strong small">${esc(nombre)}</div><div class="tiny muted">Comparación legacy vs. nuevo</div></div><span class="badge badge-warning">Por validar</span></div>`;
}
function ejecutarMigracion() {
  const bar = document.querySelector('#migProgress .bar');
  const st = document.getElementById('migStatus');
  bar.classList.add('red'); bar.style.width = '0%'; st.textContent = 'Ejecutando migración incremental (QA)…';
  let p = 0;
  const iv = setInterval(() => {
    p += 12; bar.style.width = Math.min(p, 100) + '%';
    if (p >= 100) { clearInterval(iv); bar.classList.remove('red'); st.textContent = 'Migración completada · ' + nowStamp(); toastBitacora('Migración', 'Corrida incremental QA completada'); }
  }, 180);
}
