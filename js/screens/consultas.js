/* ============================================================
   Pantalla 13 — Consultas (Títulos, Canjes, Liquidaciones)
   ============================================================ */
function screenConsulta(tipo) {
  const titulos = { titulos: 'Consulta de títulos', canjes: 'Consulta de canjes', liquidaciones: 'Consulta de liquidaciones' };
  const chipsExtra = {
    titulos: ['Títulos endosados'],
    canjes: [],
    liquidaciones: ['Rango de cheques'],
  }[tipo];
  const chips = ['Rango de número', 'Por accionista', 'Rango de fechas', ...chipsExtra];
  return pageHead({ crumbs: ['Consultas', titulos[tipo].replace('Consulta de ', '')], title: titulos[tipo], sub: 'Filtra con criterios en chips y revisa el detalle. Exporta el resultado.', actions: exportBar(titulos[tipo]) }) + `
  <div class="card" style="margin-bottom:16px"><div class="card-body">
    <div class="chip-row">${chips.map((c, i) => `<button class="chip ${i < 2 ? 'active' : ''}">${ICON('filter', 'query-filter-icon')} ${esc(c)} ${i < 2 ? `<span class="x">${ICON('x')}</span>` : ''}</button>`).join('')}<button class="chip">${ICON('plus')} Agregar criterio</button></div>
    <div class="grid grid-3" style="margin-top:14px">
      <div class="field"><label>Número (del)</label><input class="input num" placeholder="1"></div>
      <div class="field"><label>Número (al)</label><input class="input num" placeholder="200"></div>
      <div class="field"><label>Accionista</label><input class="input" placeholder="Nombre o RFC"></div>
    </div>
    <div class="row" style="margin-top:14px"><button class="btn btn-primary" onclick="toastBitacora('Exportación','Consulta ejecutada: ${tipo}')">${ICON('search')} Buscar</button></div>
  </div></div>
  ${consultaResult(tipo)}`;
}
function consultaResult(tipo) {
  if (tipo === 'canjes') {
    // maestro-detalle: canje arriba, títulos resultantes abajo
    return `<div class="grid" style="gap:16px">
      <div class="card"><div class="card-head"><h3>Canjes</h3></div>${dataTable({
        cols: [{ key: 'c', label: 'Canje' }, { key: 'acc', label: 'Accionista' }, { key: 'o', label: 'Título origen' }, { key: 'f', label: 'Fecha' }, { key: 'a', label: 'Acciones al día', num: true }],
        rows: [{ c: 'Canje 93', acc: 'Rogelio Treviño Leal', o: 'Título 17', f: '30/09/2026', a: '3,487' }],
        onRowClick: 'function(){}', selectable: true,
      })}</div>
      <div class="card"><div class="card-head"><h3>Títulos resultantes · Canje 93</h3><span class="badge">Detalle</span></div>${dataTable({
        cols: [{ key: 't', label: 'Título', render: r => 'Título ' + r.t }, { key: 'acc', label: 'Titular' }, { key: 'a', label: 'Acciones', num: true }],
        rows: [{ t: 104, acc: 'Rogelio Treviño Leal', a: '2,000' }, { t: 105, acc: 'Rogelio Treviño Leal', a: '1,487' }],
      })}</div>
    </div>`;
  }
  if (tipo === 'liquidaciones') {
    return dataTable({
      cols: [{ key: 'l', label: 'Liquidación' }, { key: 'acc', label: 'Accionista' }, { key: 'cup', label: 'Cupón', num: true }, { key: 'ch', label: 'Cheque' }, { key: 'i', label: 'Importe', num: true }],
      rows: [{ l: '10144037', acc: 'Rogelio Treviño Leal', cup: 44, ch: 'CH 5290', i: fmtMoney(5883.62) }, { l: '10144001', acc: 'María Fernanda Salinas Cantú', cup: 44, ch: 'CH 5291', i: fmtMoney(1625.00) }],
      foot: [{ value: 'Total', span: 4 }, { value: fmtMoney(7508.62), num: true }], filters: true,
    });
  }
  // titulos
  return dataTable({
    cols: [
      { key: 'num', label: 'Título', num: true, render: t => 'Título ' + t.num },
      { key: 'accionistaNombre', label: 'Accionista' },
      { key: 'emisionNombre', label: 'Emisión' },
      { key: 'acciones', label: 'Acciones', num: true, render: t => fmtNum(t.acciones) },
      { key: 'ultimoCupon', label: 'Último cupón', num: true },
      { key: 'estatus', label: 'Estatus', render: t => t.estatus === 'Vigente' ? `<span class="badge badge-success">${esc(t.estatus)}</span>` : t.estatus === 'Canjeado' ? `<span class="badge badge-warning">${esc(t.estatus)}</span>` : `<span class="badge">${esc(t.estatus)}</span>` },
    ],
    rows: DATA.titulos, filters: true,
  });
}
