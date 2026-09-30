/* ============================================================
   Componentes reutilizables (helpers de render + comportamiento)
   ============================================================ */
const h = (s) => s; // passthrough para legibilidad
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- Toast ----
function toast(title, sub = 'Registrado en bitácora', kind = 'success') {
  const layer = document.getElementById('toast-layer');
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `${ICON('checkCircle')}<div><div class="t-title">${esc(title)}</div>${sub ? `<div class="t-sub">${esc(sub)}</div>` : ''}</div>`;
  layer.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s, transform .3s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 320); }, 3200);
}
// Toast estándar con registro en bitácora
function toastBitacora(evento, detalle, folio = '—') {
  DATA.bitacora.unshift({
    fecha: nowStamp(), usuario: DATA.user.nombre,
    emisora: `${STATE.emisoraActual} ${emisoraById(STATE.emisoraActual).nombre}`,
    evento, detalle, folio,
  });
  toast(evento + ' registrado', 'Registrado en bitácora · ' + detalle);
}
function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// ---- Modal ----
function openModal(html, { size = '' } = {}) {
  const layer = document.getElementById('overlay-layer');
  layer.innerHTML = `<div class="overlay-bg" data-close-modal><div class="modal ${size}" onclick="event.stopPropagation()">${html}</div></div>`;
  layer.querySelector('[data-close-modal]').addEventListener('click', closeModal);
  document.addEventListener('keydown', escClose);
}
function closeModal() { document.getElementById('overlay-layer').innerHTML = ''; document.removeEventListener('keydown', escClose); }
function escClose(e) { if (e.key === 'Escape') closeModal(); }

// ---- Badges neutros (Bloque 0) ----
// "Formato actual": reportes/pantallas que existen hoy.
// "Mejora": lo nuevo. Ya no se usan etiquetas de paridad.
function badgeNew() { return `<span class="badge badge-new">${ICON('plus')} Mejora</span>`; }
function badgeActual() { return `<span class="badge badge-actual">${ICON('file')} Formato actual</span>`; }
// Alias de compatibilidad: badgeParity ahora rinde "Formato actual".
function badgeParity() { return badgeActual(); }

// ---- Campo de nacionalidad (lista con búsqueda + "Otra") ----
// Dropdown con búsqueda (input + datalist). Si se elige "Otra",
// aparece un campo de texto para especificarla.
function nacionalidadField(value = 'Mexicana') {
  const uid = 'nac_' + Math.random().toString(36).slice(2, 8);
  const lista = DATA.nacionalidades;
  const esConocida = lista.includes(value);
  // Si el valor guardado no está en la lista (texto libre previo), se trata como "Otra".
  const seleccion = esConocida ? value : 'Otra';
  const otraValor = esConocida ? '' : value;
  const mostrarOtra = seleccion === 'Otra';
  return `<div class="nac-field">
      <div class="field"><label>Nacionalidad</label>
        <input class="input nac-input" list="${uid}_list" id="${uid}_sel" value="${esc(seleccion)}" placeholder="Buscar nacionalidad…" autocomplete="off" oninput="nacionalidadChange('${uid}')">
        <datalist id="${uid}_list">${lista.map(n => `<option value="${esc(n)}"></option>`).join('')}</datalist>
      </div>
      <div class="field nac-otra ${mostrarOtra ? '' : 'is-hidden'}" id="${uid}_otraWrap" style="margin-top:10px"><label>Especifica la nacionalidad</label>
        <input class="input" id="${uid}_otra" value="${esc(otraValor)}" placeholder="Escribe la nacionalidad"></div>
    </div>`;
}
function nacionalidadChange(uid) {
  const sel = document.getElementById(uid + '_sel');
  const wrap = document.getElementById(uid + '_otraWrap');
  if (!sel || !wrap) return;
  wrap.classList.toggle('is-hidden', sel.value.trim().toLowerCase() !== 'otra');
}

// ---- Campo enmascarado ----
function maskedField(value, kind = 'rfc') {
  const id = 'mask_' + Math.random().toString(36).slice(2, 8);
  let masked;
  if (kind === 'rfc') masked = value.slice(0, 4) + '••••••' + value.slice(-2);
  else if (kind === 'curp') masked = value.slice(0, 4) + '••••••••••' + value.slice(-4);
  else masked = value.slice(0, 3) + '••••••';
  return `<span class="masked-field"><span class="val" id="${id}" data-real="${esc(value)}" data-masked="${esc(masked)}" data-shown="0">${masked}</span>
    <button class="reveal-btn" onclick="toggleMask('${id}')">Mostrar</button></span>`;
}
function toggleMask(id) {
  const el = document.getElementById(id); const btn = el.nextElementSibling;
  if (el.dataset.shown === '0') { el.textContent = el.dataset.real; el.dataset.shown = '1'; btn.textContent = 'Ocultar'; }
  else { el.textContent = el.dataset.masked; el.dataset.shown = '0'; btn.textContent = 'Mostrar'; }
}

// ---- Barra de exportación ----
function exportBar(nombre = 'documento') {
  return `<div class="export-bar">
    <button onclick="doExport('PDF','${esc(nombre)}')">${ICON('file')} PDF</button>
    <button onclick="doExport('Excel','${esc(nombre)}')">${ICON('excel')} Excel</button>
    <span class="sep"></span>
    <button onclick="doExport('PNG','${esc(nombre)}')">${ICON('image')} PNG</button>
    <button onclick="doExport('JPG','${esc(nombre)}')">${ICON('image')} JPG</button>
  </div>`;
}
function doExport(fmt, nombre) { toastBitacora('Exportación', `${nombre} exportado a ${fmt}`); }
function doPrint(nombre) { toastBitacora('Impresión', `${nombre} enviado a impresora local`); }

// ---- Stepper ----
function stepper(steps, current) {
  return `<div class="stepper">` + steps.map((s, i) => {
    const n = i + 1;
    const cls = n < current ? 'done' : n === current ? 'active' : '';
    const dot = n < current ? ICON('check') : n;
    return `<div class="step ${cls}"><span class="dot">${dot}</span><span class="lbl">${esc(s)}</span></div>` +
      (i < steps.length - 1 ? `<span class="bar"></span>` : '');
  }).join('') + `</div>`;
}

// ---- Desglose del cálculo ----
function calcCard(title, rows) {
  return `<div class="calc-card">
    <div class="calc-head">${ICON('calc')}<h3>${esc(title)}</h3></div>
    ${rows.map(r => `<div class="calc-row ${r.cls || ''}">
      <div><div class="desc">${r.desc}</div>${r.op ? `<div class="op">${r.op}</div>` : ''}</div>
      <div class="amt">${r.amt}</div>
    </div>`).join('')}
  </div>`;
}

// ---- Documentos generados ----
function docPanel(docs) {
  const items = docs.map((d, i) => `<div class="doc-item ${i === 0 ? 'active' : ''}" onclick="selectDoc(this, ${i})">
      ${ICON('file')}<div><div>${esc(d.nombre)}</div><div class="meta">${esc(d.meta || 'PDF')}</div></div>
    </div>`).join('');
  return `<div class="doc-panel" id="docPanel">
    <div class="doc-list">
      <div style="padding:8px 10px 4px;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em">Documentos generados</div>
      ${items}
    </div>
    <div class="doc-preview">
      <div class="doc-actions">
        <button class="btn btn-primary btn-sm" onclick="doPrint('${esc(docs[0].nombre)}')">${ICON('print')} Imprimir</button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('PDF','${esc(docs[0].nombre)}')">${ICON('download')} Descargar PDF</button>
      </div>
      <div id="docPreviewBody">${docs[0].preview}</div>
    </div>
  </div>`;
  // docs preview stored globally for switching
}
let _docStore = [];
function renderDocPanel(docs) { _docStore = docs; return docPanel(docs); }
function selectDoc(el, i) {
  el.parentElement.querySelectorAll('.doc-item').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('docPreviewBody').innerHTML = _docStore[i].preview;
  const actions = document.querySelector('#docPanel .doc-actions');
  actions.innerHTML = `<button class="btn btn-primary btn-sm" onclick="doPrint('${esc(_docStore[i].nombre)}')">${ICON('print')} Imprimir</button>
    <button class="btn btn-secondary btn-sm" onclick="doExport('PDF','${esc(_docStore[i].nombre)}')">${ICON('download')} Descargar PDF</button>`;
}

// ---- Hoja PDF (documento) ----
// landscape: usa hoja horizontal que nunca excede el contenedor; el scroll
// horizontal de la tabla ocurre dentro de la hoja (no en la página).
// stickyFirst: fija la primera columna de la tabla principal al hacer scroll.
function pdfSheet({ title, kv = [], table = null, note = '', signs = null, extra = '', landscape = false, stickyFirst = false }) {
  const kvHtml = kv.length ? `<dl class="pdf-kv">${kv.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>` : '';
  let tableHtml = '';
  if (table) {
    const nums = table.nums || [];
    const inner = `<table class="${stickyFirst ? 'pdf-tbl-sticky' : ''}"><thead><tr>${table.head.map((hh, ci) => `<th class="${nums.includes(ci) ? 'num' : ''}">${esc(hh)}</th>`).join('')}</tr></thead>
      <tbody>${table.rows.map(r => `<tr>${r.map((c, ci) => `<td class="${nums.includes(ci) ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    tableHtml = landscape ? `<div class="pdf-tbl-scroll">${inner}</div>` : inner;
  }
  const signsHtml = signs ? `<div class="pdf-sign">${signs.map(s => `<div>${esc(s)}</div>`).join('')}</div>` : '';
  return `<div class="pdf-sheet ${landscape ? 'pdf-sheet--landscape' : ''}">
    <div class="pdf-brand"><span class="co">SIGMA FOODS, S.A.B. DE C.V.</span>${SIGMA_LOGO(24)}</div>
    <h4 class="pdf-title">${esc(title)}</h4>
    ${kvHtml}${tableHtml}${extra}
    ${note ? `<p style="font-size:11px;color:#666;margin-top:12px">${note}</p>` : ''}
    ${signsHtml}
  </div>`;
}

// ---- Cheque PDF ----
function chequeSheet({ folio, beneficiario, importe, concepto, fecha }) {
  return `<div class="pdf-check">
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid #ccc;padding-bottom:8px;margin-bottom:12px">
      <div><b>BANCO SIGMA</b><div style="font-size:10px;color:#777">Cheque nominativo · No negociable</div></div>
      <div style="text-align:right"><div style="font-size:10px;color:#777">Folio</div><b>CH ${folio}</b></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr auto;gap:8px 16px">
      <div><div style="font-size:10px;color:#777">Páguese a</div><b>${esc(beneficiario)}</b></div>
      <div style="text-align:right"><div style="font-size:10px;color:#777">Importe</div><b style="font-size:16px;font-variant-numeric:tabular-nums">${fmtMoney(importe)}</b></div>
      <div><div style="font-size:10px;color:#777">Concepto</div>${esc(concepto)}</div>
      <div style="text-align:right"><div style="font-size:10px;color:#777">Fecha</div>${esc(fecha)}</div>
    </div>
    <div style="border-top:1px solid #333;margin-top:34px;padding-top:6px;width:200px;text-align:center;font-size:10px;color:#555">Firma autorizada</div>
  </div>`;
}

// ---- Tabla genérica ----
function dataTable({ cols, rows, foot = null, filters = false, onRowClick = null, selectable = false, id = '' }) {
  const tid = id || 't' + Math.random().toString(36).slice(2, 7);
  const head = cols.map((c, i) => `<th class="${c.num ? 'num' : ''}">${esc(c.label)}${filters ? `<input class="col-filter" placeholder="Filtrar…" oninput="filterTable('${tid}',${i},this.value)" onclick="event.stopPropagation()">` : ''}</th>`).join('');
  const body = rows.map((r, ri) => {
    const tds = cols.map(c => `<td class="${c.num ? 'num' : ''}">${c.render ? c.render(r) : esc(r[c.key])}</td>`).join('');
    return `<tr class="${onRowClick ? 'row-click' : ''}" ${onRowClick ? `onclick="(${onRowClick})(${ri})"` : ''} data-ri="${ri}">${tds}</tr>`;
  }).join('');
  const footHtml = foot ? `<tfoot><tr>${foot.map(f => `<td class="${f.num ? 'num' : ''}" ${f.span ? `colspan="${f.span}"` : ''}>${f.value}</td>`).join('')}</tr></tfoot>` : '';
  return `<div class="table-wrap"><div class="tbl-scroll"><table class="tbl" id="${tid}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody>${footHtml}</table></div></div>`;
}
function filterTable(tid, colIdx, val) {
  const t = document.getElementById(tid); if (!t) return;
  const v = val.toLowerCase();
  t.querySelectorAll('tbody tr').forEach(tr => {
    const cell = tr.children[colIdx];
    tr.style.display = cell && cell.textContent.toLowerCase().includes(v) ? '' : 'none';
  });
}

// ---- Estado vacío ----
function emptyState(icon, title, text, action = '') {
  return `<div class="empty-state"><div class="es-icon">${ICON(icon)}</div><h3>${esc(title)}</h3><p>${esc(text)}</p>${action ? `<div style="margin-top:16px">${action}</div>` : ''}</div>`;
}

// ---- Atajos en asistente ----
function shortcutHints() {
  return `<div class="row gap-3 small muted" style="margin-top:2px"><span><span class="kbd">Enter</span> continuar</span><span><span class="kbd">Esc</span> cancelar</span></div>`;
}

// ---- Page head ----
function pageHead({ crumbs = [], title, sub = '', badge = '', actions = '' }) {
  const cb = crumbs.length ? `<div class="breadcrumb">${crumbs.map((c, i) => `${i ? '<span class="sep">/</span>' : ''}<span>${esc(c)}</span>`).join('')}</div>` : '';
  return `<div class="page-head"><div class="ph-left">${cb}<h1>${esc(title)} ${badge}</h1>${sub ? `<p class="ph-sub">${sub}</p>` : ''}</div><div class="page-actions">${actions}</div></div>`;
}
