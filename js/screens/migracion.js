/* ============================================================
   Pantalla 25 — Migración de datos
   ============================================================ */
function screenMigracion() {
  const corridas = [
    { tipo: 'Total', ambiente: 'PROD', estado: 'Completada', dur: '00:42:18', fecha: '15/09/2026' },
    { tipo: 'Incremental', ambiente: 'QA', estado: 'Completada', dur: '00:03:05', fecha: '28/09/2026' },
    { tipo: 'Incremental', ambiente: 'DEV', estado: 'En proceso', dur: '00:01:12', fecha: '29/09/2026' },
  ];
  const validacion = [
    { ent: 'Accionistas', o: 14820, d: 14820, chk: 'a1f3…9c', ok: true },
    { ent: 'Títulos', o: 39104, d: 39104, chk: 'b7e2…04', ok: true },
    { ent: 'Emisiones', o: 5, d: 5, chk: 'c9d1…7a', ok: true },
    { ent: 'Cupones', o: 52, d: 52, chk: 'd3a8…1f', ok: true },
    { ent: 'Canjes', o: 92, d: 92, chk: 'e5b6…33', ok: true },
    { ent: 'Liquidaciones', o: 1284, d: 1284, chk: 'f2c0…8e', ok: true },
    { ent: 'Cheques', o: 5289, d: 5289, chk: '0a4d…b2', ok: true },
  ];
  const corridaCols = [
    { key: 'tipo', label: 'Tipo', render: c => `<span class="badge ${c.tipo === 'Total' ? 'badge-red' : ''}">${esc(c.tipo)}</span>` },
    { key: 'ambiente', label: 'Ambiente' },
    { key: 'estado', label: 'Estado', render: c => c.estado === 'Completada' ? `<span class="badge badge-success">${ICON('check')} ${esc(c.estado)}</span>` : `<span class="badge badge-warning">${esc(c.estado)}</span>` },
    { key: 'dur', label: 'Duración', num: true },
    { key: 'fecha', label: 'Fecha' },
  ];
  const valCols = [
    { key: 'ent', label: 'Entidad', render: v => `<span class="strong">${esc(v.ent)}</span>` },
    { key: 'o', label: 'Conteo origen', num: true, render: v => fmtNum(v.o) },
    { key: 'd', label: 'Conteo destino', num: true, render: v => fmtNum(v.d) },
    { key: 'chk', label: 'Checksum' },
    { key: 'ok', label: 'Estado', render: v => `<span class="mig-check">${ICON('checkCircle')} Coincide</span>` },
  ];
  return pageHead({ crumbs: ['Migración de datos'], title: 'Tu historia completa, verificada contra el sistema anterior.', sub: 'Corridas de ETL de MS Access a SQL Server, con validación por entidad y paridad de reportes.', actions: `<button class="btn btn-primary" onclick="ejecutarMigracion()">${ICON('play')} Ejecutar migración</button>` }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="row gap-3 wrap" style="margin-bottom:14px">
      <div class="segmented"><button class="active">Total</button><button>Incremental</button></div>
      <div class="segmented"><button>DEV</button><button class="active">QA</button><button>PROD</button></div>
      <span class="tiny muted">Bajo demanda · Access → SQL Server</span>
    </div>
    <div class="progress" id="migProgress"><div class="bar" style="width:100%"></div></div>
    <div class="tiny muted" style="margin-top:6px" id="migStatus">Última corrida QA completada · 28/09/2026</div>
  </div></div>

  <div class="card" style="margin-bottom:16px"><div class="card-head"><h3>Corridas de ETL</h3></div>${dataTable({ cols: corridaCols, rows: corridas })}</div>

  <div class="grid grid-side">
    <div class="card"><div class="card-head"><h3>Validación por entidad</h3><span class="badge badge-success">${ICON('checkCircle')} 7/7 coinciden</span></div>${dataTable({ cols: valCols, rows: validacion })}</div>
    <div class="card parity-card"><div class="card-head"><h3>Paridad de reportes</h3></div><div class="card-body col gap-3">
      <div class="tiny muted">Legacy vs. Nuevo</div>
      ${parityRow('Sábana de dividendos')}
      ${parityRow('Dividendos por mes')}
      <div class="alert alert-success" style="margin-top:6px">${ICON('checkCircle')} Diferencia total: <b>$0.00</b>. Todos los reportes cuadran contra el sistema anterior.</div>
    </div></div>
  </div>`;
}
function parityRow(nombre) {
  return `<div class="saldo-row" style="padding:10px 12px;border:1px solid var(--border);border-radius:8px"><div><div class="strong small">${esc(nombre)}</div><div class="tiny muted">Diferencia $0.00</div></div><span class="mig-check">${ICON('checkCircle')} Cuadra</span></div>`;
}
function ejecutarMigracion() {
  const bar = document.querySelector('#migProgress .bar');
  const st = document.getElementById('migStatus');
  bar.classList.add('red'); bar.style.width = '0%'; st.textContent = 'Ejecutando migración incremental (QA)…';
  let p = 0;
  const iv = setInterval(() => {
    p += 12; bar.style.width = Math.min(p, 100) + '%';
    if (p >= 100) { clearInterval(iv); bar.classList.remove('red'); st.textContent = 'Migración completada · ' + nowStamp(); toastBitacora('Migración', 'Corrida incremental QA completada'); }
  }, 180);
}
