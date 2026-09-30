/* ============================================================
   Pantalla 2 — Inicio
   Panel "Atender a un accionista" + accesos rápidos + actividad de hoy
   ============================================================ */
function screenInicio() {
  const em = emisoraById(STATE.emisoraActual);

  // Actividad de hoy tomada de la bitácora (30/09/2026)
  const hoy = '30/09/2026';
  const actividad = DATA.bitacora.filter(b => b.fecha.startsWith(hoy)).slice(0, 8).map(b => `<div class="act-item">
    <span class="act-ic">${ICON('activity')}</span>
    <div class="grow"><div class="strong small">${esc(b.evento)}</div><div class="tiny muted">${esc(b.detalle)}</div></div>
    <div class="tiny muted nowrap">${esc(b.fecha.split(' ')[1] || b.fecha)}</div>
  </div>`).join('');

  return `${pageHead({
    title: `Buenos días, ${DATA.user.nombre.split(' ')[0]}.`,
    sub: `Atiende a un accionista en el contexto de ${em.nombre}.`,
    actions: `<button class="btn btn-secondary" onclick="go('reportes')">${ICON('report')} Reportes</button>`
  })}

  <div class="grid grid-side">
    <div class="col gap-4">
      <div class="card"><div class="card-head"><h3>Atender a un accionista</h3><span class="badge">${ICON('user')} Ventanilla</span></div>
        <div class="card-body col gap-4">
          <p class="secondary" style="max-width:620px">Captura la emisión y el número del título que presenta el accionista. Si el título no está en la emisión vigente, el sistema abre el canje precargado.</p>
          <div class="grid grid-3">
            <div class="field" style="grid-column:span 2"><label>Emisión del título presentado</label>
              <select class="select" id="inicioEmision">${emisionesDe().map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join('')}</select>
            </div>
            <div class="field"><label>Número de título</label><input class="input num" id="inicioTitulo" placeholder="17" onkeydown="if(event.key==='Enter')inicioBuscar()"></div>
          </div>
          <div class="row gap-2">
            <button class="btn btn-primary" onclick="inicioBuscar()">${ICON('search')} Buscar</button>
            <span class="tiny muted" style="align-self:center">Ej.: emisión Junio-96 + título 17 → Canje 93</span>
          </div>
          <div id="inicioResult"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Accesos rápidos</h3></div>
        <div class="card-body"><div class="grid grid-3 quick-grid">
          ${quick('Generación', 'file', 'titulos/generacion')}
          ${quick('Canje', 'swap', 'titulos/canje')}
          ${quick('Sustitución', 'replace', 'titulos/sustitucion')}
          ${quick('Endoso', 'endorse', 'titulos/endoso')}
          ${quick('Liquidaciones', 'bank', 'liquidaciones/liquidaciones')}
          ${quick('Cheques', 'check', 'liquidaciones/cheques')}
        </div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Actividad de hoy</h3><span class="badge">${ICON('activity')} Bitácora</span></div>
      <div class="card-body" style="padding:8px 12px">${actividad || '<div class="tiny muted" style="padding:12px">Sin movimientos registrados hoy.</div>'}</div>
      <div class="card-foot"><button class="btn btn-ghost btn-sm btn-block" onclick="go('seguridad/auditoria')">Ver bitácora completa ${ICON('arrowRight')}</button></div>
    </div>
  </div>`;
}

function quick(label, icon, route) {
  return `<button class="quick-item" onclick="go('${route}')"><span class="qi-ic">${ICON(icon)}</span><span>${esc(label)}</span></button>`;
}

function inicioBuscar() {
  const emId = document.getElementById('inicioEmision').value;
  const num = (document.getElementById('inicioTitulo').value || '').trim();
  const em = DATA.emisiones.find(e => e.id === emId);
  const res = document.getElementById('inicioResult');
  // Caso Junio-96 + Título 17 → Canje precargado
  if (emId === 'e1' && num === '17') {
    res.innerHTML = `<div class="alert alert-info">${ICON('info')} Título 17 de <b>${esc(em.nombre)}</b> · Rogelio Treviño Leal. No está en la emisión vigente: procede canje.</div>
      <div class="row gap-2" style="margin-top:10px"><button class="btn btn-primary" onclick="go('titulos/canje')">${ICON('swap')} Abrir canje precargado</button></div>`;
    return;
  }
  const t = DATA.titulos.find(x => String(x.num) === num && x.emision === emId);
  if (t) {
    res.innerHTML = `<div class="alert alert-info">${ICON('info')} Título ${t.num} · ${esc(t.accionistaNombre)} · ${esc(t.emisionNombre)} · estatus ${esc(t.estatus)}.</div>`;
  } else {
    res.innerHTML = `<div class="alert alert-warning">${ICON('alertTri')} No se encontró el título ${esc(num || '—')} en esa emisión.</div>`;
  }
}
