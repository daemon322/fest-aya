# reCAPTCHA Verification Checklist

## Your reCAPTCHA Credentials

### Frontend (.env.local)
```
✅ VITE_RECAPTCHA_SITE_KEY=6Le4uHEsAAAAAGdCQK-Lx5-8ihYXCqa1smmeVRrF
```

### Backend Vercel Environment Variables
**MUST VERIFY IN VERCEL DASHBOARD:**
```
✅ RECAPTCHA_SECRET=6Le4uHEsAAAAABF2-3CG3yerfRv6Bvq_N1VqLrG2
```

## Verification Checklist

### 1. Vercel Environment Variables ✓
- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Find `RECAPTCHA_SECRET`
- [ ] Value should be: `6Le4uHEsAAAAABF2-3CG3yerfRv6Bvq_N1VqLrG2`
- [ ] No extra spaces or characters
- [ ] Latest deployment is in "Ready" status (green checkmark)

### 2. Google Cloud Console reCAPTCHA Settings ✓
- [ ] Go to https://console.cloud.google.com/
- [ ] Select your project
- [ ] Navigate to reCAPTCHA → Keys
- [ ] Find your key (should show both Site and Secret keys)
- [ ] **Site Key**: `6Le4uHEsAAAAAGdCQK-Lx5-8ihYXCqa1smmeVRrF`
- [ ] **Secret Key**: `6Le4uHEsAAAAABF2-3CG3yerfRv6Bvq_N1VqLrG2`
- [ ] **Type**: reCAPTCHA v3
- [ ] **Domains**: Must include `fest-aya.vercel.app` (or your actual domain)

### 3. Add Domain if Missing ✓
- [ ] In Google Cloud Console → reCAPTCHA → Your Key → Settings
- [ ] Scroll to "Domains" section
- [ ] Click "Edit" if not showing your domain
- [ ] Add: `fest-aya.vercel.app`
- [ ] Save changes

### 4. Redeploy ✓
**After making ANY changes in Vercel or Google:**
1. Go to Vercel Dashboard → Your Project
2. Click three dots (⋯) on latest deployment
3. Select "Redeploy"
4. Wait for "Ready" status (green)
5. Test the form

## Testing After Redeploy

When you submit the form, open **Browser DevTools** (F12) and check the **Console** tab for:

### ✅ Success Flow
```
🔐 Generando token de reCAPTCHA...
✅ Token generado: 6Le4uHEsAA...
🔍 Enviando verificación a Google: { tokenPreview: "...", secretPreview: "..." }
📊 Respuesta de Google: { success: true, score: 0.8, hostname: "fest-aya.vercel.app" }
✅ reCAPTCHA verification passed with score: 0.8
📤 Respuesta de API: { status: 200, ok: true }
```

### ❌ Common Errors

**Error Code: `invalid-input-secret`**
- Meaning: Wrong secret key in Vercel
- Fix: Double-check the secret in Vercel env vars

**Error Code: `invalid-input-response`**
- Meaning: Token expired or Site Key doesn't match
- Fix: Make sure user's browser has correct Site Key loading

**Error Code: `bad-request`**
- Meaning: Domain not authorized
- Fix: Add your domain to reCAPTCHA settings in Google Cloud

**Error Code: `timeout-or-duplicate`**
- Meaning: Token already used or took too long
- Fix: Submit again, it should work on next attempt

## Debugging Steps

1. **Check console logs** for exact error code
2. **Hover over error message** on form to see full details
3. **Look for "hostname"** in response - should match your domain
4. **If still failing**: Copy the full console error message and check it mentions:
   - Token preview starts with actual token chars
   - Secret preview shows it's configured (not empty)
   - Google response shows `hostname` field

## Reset if Needed

If everything looks correct but still failing:

1. **Regen keys in Google Cloud**:
   - Delete current reCAPTCHA key
   - Create new reCAPTCHA v3 key
   - Add domain `fest-aya.vercel.app`
   - Copy new Secret and Site keys

2. **Update Vercel**:
   - Update `RECAPTCHA_SECRET` with new secret
   - Redeploy

3. **Update Frontend**:
   - Update `VITE_RECAPTCHA_SITE_KEY` in `.env.local`
   - Commit and push
   - Vercel will auto-redeploy

## Key Files

- **Frontend form**: `src/components/tickets/Checkout.jsx`
- **Backend API**: `api/send-reservation.js`
- **Frontend config**: `src/main.jsx`
- **Environment file**: `.env.local` (frontend only)
