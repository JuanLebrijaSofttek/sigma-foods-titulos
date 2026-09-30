/* ============================================================
   Pantalla 1 — Login
   ============================================================ */
function screenLogin() {
  window._afterRender = () => {
    const input = document.getElementById('loginEmail');
    if (input) input.focus();
  };
  return `<div class="login-page">
    <div class="login-story">
      <div class="login-story-inner">
        <div class="row gap-3" style="margin-bottom:auto">${SIGMA_LOGO(38)}<div style="color:#fff;font-weight:800;font-size:17px">SIGMA FOODS</div></div>
        <div>
          <div class="login-badge">Sistema de Gestión y Canje de Títulos</div>
          <h1 class="login-title">22 años de historia accionaria, ahora en un solo lugar seguro.</h1>
          <p class="login-sub">Canjes, dividendos y accionistas de todas tus emisoras con la trazabilidad que exige la operación bursátil.</p>
          <ul class="login-points">
            <li>${ICON('checkCircle')} Cálculos automáticos de split, contra-split y fracciones sobrantes</li>
            <li>${ICON('checkCircle')} Cada operación explicada y registrada en bitácora</li>
          </ul>
        </div>
        <div class="login-foot">SIGMA FOODS, S.A.B. DE C.V. · Ambiente ${DATA.ambiente}</div>
      </div>
    </div>
    <div class="login-form">
      <div class="login-card">
        <h2>Iniciar sesión</h2>
        <p class="secondary" style="margin:6px 0 24px">Usa tu correo corporativo. Te autenticamos con tu organización.</p>
        <div class="field" style="margin-bottom:16px">
          <label>Correo corporativo</label>
          <div style="position:relative">
            <input id="loginEmail" class="input" placeholder="nombre@sigmafoods.com" value="carlos.menendez@sigmafoods.com" oninput="detectTenant(this.value)" style="padding-left:38px">
            <span style="position:absolute;left:11px;top:11px;color:var(--text-muted)">${ICON('mail')}</span>
          </div>
          <div id="tenantHint" class="tenant-hint show">${ICON('checkCircle')} Tenant detectado: <b>sigmafoods.com</b></div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="doLogin()">${ICON('microsoft')} Iniciar sesión con Microsoft</button>
        <div class="login-note">${ICON('lock')} Protegido con Microsoft Entra ID y MFA de tu organización.</div>
      </div>
    </div>
  </div>`;
}

function detectTenant(val) {
  const hint = document.getElementById('tenantHint');
  const m = val.match(/@([\w.-]+\.\w+)$/);
  if (m) { hint.className = 'tenant-hint show'; hint.innerHTML = `${ICON('checkCircle')} Tenant detectado: <b>${esc(m[1])}</b>`; }
  else { hint.className = 'tenant-hint'; hint.innerHTML = ''; }
}

function doLogin() {
  STATE.autenticado = true;
  DATA.bitacora.unshift({ fecha: nowStamp(), usuario: DATA.user.nombre, emisora: '01 SIGMA FOODS', evento: 'Inicio de sesión', detalle: 'Autenticado con Microsoft Entra ID + MFA', folio: '—' });
  location.hash = '#/inicio';
}
