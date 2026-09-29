# Sistema de Gestión y Canje de Títulos — SIGMA FOODS

Prototipo navegable de alta fidelidad para la licitación del reemplazo del
sistema de escritorio en MS Access (22 años de operación). Demuestra el 100%
de la funcionalidad actual, con cálculos automáticos, explicación de cada
cálculo y trazabilidad completa en bitácora.

## Cómo ejecutarlo

No requiere build ni dependencias. Dos opciones:

1. **Doble clic** en `index.html` (o ábrelo en el navegador).
2. **Servidor local** (recomendado, evita restricciones de `file://`):
   ```bash
   python3 -m http.server 8734
   # luego abre http://localhost:8734/index.html
   ```

Navegadores: Chrome / Edge / Safari recientes. Diseñado para desktop 1440 px,
responsive hasta tablet.

## Recorrido sugerido para la demo (caso Don Rogelio)

1. **Login** → detecta el tenant `sigmafoods.com` → *Iniciar sesión con Microsoft*.
2. **Inicio** → tarjeta **Caso del día** → botón **Atender canje**.
3. **Canje** (asistente de 5 pasos, precargado):
   - Paso 1 Identificar (aviso del Recibo Hylsamex).
   - Paso 2 Calcular: split 1:1.35 + certificado provisional + fracción sobrante.
   - Paso 3 Distribuir en Títulos 104 y 105 (validación en vivo = 3,487).
   - Paso 4 Dividendos cupones 39–44 = **$5,883.62**, folio **10144037**.
   - Paso 5 Confirmar → documentos (Recibo de canje, liquidación, Cheque CH 5290,
     Recibo Hylsamex, pago de fracción) + toast *Registrado en bitácora*.
4. **Seguridad y Auditoría → Bitácora de auditoría**: aparece el registro del canje.

Atajos en asistentes: **Enter** continuar, **Esc** cancelar.
Cambiar de emisora en el header actualiza el contexto de toda la app.

## Estructura

```
index.html
css/     tokens · base · components · layout · screens
js/
  data.js         datos de ejemplo (ficticios) + motor de cálculo (CALC)
  icons.js        set de iconos lineales + logo
  components.js   helpers reutilizables (stepper, calcCard, docPanel, tablas,
                  toast, badges, campo enmascarado, barra de exportación, PDF…)
  shell.js        header + sidebar + selector de emisora
  router.js       ruteo por hash · app.js  bootstrap
  screens/        una pantalla por dominio (26 pantallas)
shots/            capturas de referencia
```

## Notas

- Todos los nombres de accionistas son **ficticios**.
- Números con cifras tabulares, formato `$1,234.56` y `5,543,839,944`.
- Los cálculos (split, contra-split, certificados provisionales, fracciones,
  dividendos acumulados) los realiza el prototipo; ver `CALC` en `js/data.js`.
