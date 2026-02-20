# Verificación del reCAPTCHA - Guía de Configuración

## Estado Actual

Tu sistema de reCAPTCHA v3 ya está correctamente implementado. Aquí está lo que se ha mejorado:

### ✅ Cambios Realizados

#### 1. **Frontend (Checkout.jsx)**
- ✅ Agregado estado `isVerifyingCaptcha` para mostrar al usuario que se está verificando
- ✅ Validación robusta del token de reCAPTCHA antes de enviar
- ✅ Mensajes de error específicos para fallos del captcha
- ✅ Dos estados visibles en el botón:
  - "Verificando Seguridad..." (mientras se verifica el captcha)
  - "Enviando..." (mientras se envía la reserva)

#### 2. **Backend en Desarrollo (vite.config.js)**
- ✅ Validación del token de reCAPTCHA requerido
- ✅ Validación del honeypot anti-bot
- ✅ Logs detallados mostrando el proceso de verificación

#### 3. **API en Producción (send-reservation.js)**
- ✅ Validación mejorada de reCAPTCHA con Google
- ✅ Verificación del score en reCAPTCHA v3
- ✅ Logs detallados del proceso de verificación
- ✅ Mensajes de error claros al usuario

---

## Configuración Requerida en Vercel

Tu `.env.local` local tiene:
```
VITE_RECAPTCHA_SITE_KEY=6Le4uHEsAAAAAGdCQK-Lx5-8ihYXCqa1smmeVRrF
```

**En Vercel, necesitas estas variables de entorno:**

```
# Variables ya configuradas (según tu mensaje):
FORMSPREE_ID=xd23d2d2
RECAPTCHA_SECRET=tu_secret_privada
ALLOWED_ORIGIN=https://tudominio.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5

# Variable ADICIONAL requerida:
VITE_RECAPTCHA_SITE_KEY=6Le4uHEsAAAAAGdCQK-Lx5-8ihYXCqa1smmeVRrF
```

---

## Cómo Verificar que Funciona

### En Desarrollo (npm run dev)
1. Abre http://localhost:5173
2. Agrega entradas al carrito
3. Procede al checkout
4. Completa todos los formularios
5. En el paso 4, haz clic en "Finalizar Reserva Luxury"
6. **Verás: "Verificando Seguridad..." (2-3 segundos)**
7. Luego: "Enviando..." (1-2 segundos)
8. **Espera a ver "¡Reserva Exitosa!"**

### Revisa la Consola del Navegador
En DevTools (F12), verás:
- El token de reCAPTCHA siendo generado
- Confirmación de que se envió correctamente

### Revisa la Consola del Terminal (npm run dev)
Deberías ver algo como:

```
🔐 Verificando token de reCAPTCHA en desarrollo...
   Token: eyJhbGciOiJSUzI1NiIs...
✅ Token de reCAPTCHA válido (desarrollo)
📧 Reserva recibida en desarrollo: {
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  referencia: 'ABC1234567',
  captchaVerificado: true
}
```

---

## Errores Comunes y Soluciones

### ❌ Error: "Error de seguridad: reCAPTCHA no disponible"
**Causa:** El proveedor de reCAPTCHA no se cargó
**Solución:**
- Recarga la página
- Verifica que `VITE_RECAPTCHA_SITE_KEY` esté configurado en `.env.local`
- Verifica tu conexión a internet

### ❌ Error: "Verificación de seguridad fallida"
**Causa:** Google rechazó el token
**Solución:**
- El usuario fue detectado como posible bot (score bajo)
- Intenta desde otra red
- Verifica que en Vercel esté correcta la `RECAPTCHA_SECRET`

### ❌ Error: "No se pudo generar el token de seguridad"
**Causa:** El captcha no generó token
**Solución:**
- Recarga la página
- Espera 2-3 segundos antes de hacer clic en confirmar

---

## Flujo del reCAPTCHA v3

```
1. Usuario completa formulario
   ↓
2. Usuario hace clic en "Finalizar Reserva"
   ↓
3. Se genera token de reCAPTCHA (invisible)
   ↓
4. Se envía token al backend
   ↓
5. Backend verifica token con Google
   ↓
6. Si puntuación > 0.5 → Aceptado ✅
7. Si puntuación < 0.5 → Rechazado ❌
   ↓
8. Se envía email a Formspree
```

---

## Verificación Final en Vercel

Después de desplegar en Vercel:

1. Haz una prueba de reserva
2. Revisa los Logs de Vercel en: https://vercel.com/dashboard
3. Busca mensajes con "reCAPTCHA"
4. Verifica el correo en la bandeja de entrada

---

## Resumen de Seguridad

Tu sistema ahora tiene:

✅ **reCAPTCHA v3**: Verifica automáticamente que no sea un bot
✅ **Honeypot**: Campo oculto para detectar bots
✅ **Rate Limiting**: Máximo 5 solicitudes por minuto por IP
✅ **Sanitización**: Todos los datos se limpian antes de enviar
✅ **HTTPS**: Cuando esté en producción
✅ **CORS Restringido**: Solo acepta solicitudes de tu dominio

---

**¿Preguntas? Revisa la consola del navegador (F12) para mensajes de error específicos.**
