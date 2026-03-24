# Migración a Cloudflare Pages

## ✅ Cambios realizados

### 1. **functions/send-reservation.js** — Sintaxis convertida a Cloudflare Pages
- **Antes (Vercel):** `export default async function handler(req, res)`
- **Ahora (Cloudflare):** `export default { onRequest: async (context) => ... }`
- Cambio de API: `res.setHeader()` → `new Response()` con headers
- Las variables de entorno ahora vienen de `context.env` en lugar de `process.env`
- IP detection: `cf-connecting-ip` header (nativo de Cloudflare)

### 2. **wrangler.toml** — Creado
Configuración necesaria para Cloudflare Pages con Node.js.

---

## 🚀 Próximos pasos

### 1. **Instalar Wrangler CLI**
```bash
npm install -g @cloudflare/wrangler
# o
npm install --save-dev @cloudflare/wrangler
```

### 2. **Configurar variables de entorno en Cloudflare Dashboard**
Ve a tu proyecto en [Cloudflare Dashboard](https://dash.cloudflare.com):
- Settings → Environment Variables
- Añade estas variables:
  - `SENDGRID_API_KEY` — API key de SendGrid
  - `ADMIN_EMAIL` — Tu correo (donde recibirás reservas)
  - `FROM_EMAIL` — Email verificado en SendGrid
  - `RECAPTCHA_SECRET` — Secret de Google reCAPTCHA v2
  - (Opcional) `RATE_LIMIT_WINDOW_MS` (default: 60000)
  - (Opcional) `RATE_LIMIT_MAX` (default: 5)

### 3. **Desarrollo local**
Para probar localmente con Cloudflare Pages:
```bash
wrangler pages dev --local
```

O usa el desarrollo de Vite (como antes):
```bash
npm run dev
```
*Nota:* El plugin en `vite.config.js` simula la función en desarrollo.

### 4. **Build y Deploy**
```bash
npm run build
wrangler pages deploy dist/
```

O si configuras GitHub integration en Cloudflare Dashboard, 
solo necesitas hacer push a tu rama.

---

## ⚠️ Cambios importantes

1. **El endpoint sigue siendo `/functions/send-reservation`** (sin cambios desde el frontend)
2. **Puedes eliminar la carpeta `api/`** – no se necesita más
3. **`vercel.json` ya no se usa** – puedes eliminarlo después de confirmar que todo funciona

---

## ✨ Verificación final

En producción, tus reservas deberían:
1. ✅ Enviarse sin errores
2. ✅ Generar emails al admin con el comprobante
3. ✅ Enviar confirmación al cliente
4. ✅ Aplicar rate limiting
5. ✅ Validar reCAPTCHA correctamente

Si aún hay errores, revisa:
- Console de Cloudflare Pages (Real-time logs)
- Headers en DevTools del navegador (Network tab)
- Variables de entorno configuradas correctamente
