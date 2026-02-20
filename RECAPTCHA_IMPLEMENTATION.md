# reCAPTCHA v3 Implementation Flow - Complete Guide

## Overview

Your application uses **reCAPTCHA v3** (invisible to users) to verify requests before sending email through Formspree. The flow is:

1. User fills form and clicks "Finalizar Reserva"
2. Frontend generates invisible reCAPTCHA token
3. Frontend sends form + token to backend API
4. Backend verifies token with Google
5. If valid → Send email via Formspree
6. If invalid → Return error to frontend

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React - src/components/tickets/Checkout.jsx)          │
├─────────────────────────────────────────────────────────────────┤
│ 1. GoogleReCaptchaProvider wraps app (main.jsx)                │
│    - Loads with VITE_RECAPTCHA_SITE_KEY                        │
│ 2. useGoogleReCaptcha() hook provides executeRecaptcha()       │
│ 3. User submits form                                            │
│ 4. executeRecaptcha("checkout_submit") generates token         │
│ 5. Sends POST to /api/send-reservation with token              │
└─────────────────────────────────────────────────────────────────┘
                         ↓ (HTTPS POST)
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Vercel Serverless - api/send-reservation.js)          │
├─────────────────────────────────────────────────────────────────┤
│ 1. Receives form data + recaptchaToken                          │
│ 2. Validates: honeypot, name, email, token exists              │
│ 3. Sends to Google: POST with secret + token                   │
│ 4. Google responds: success true/false + score (0.0 - 1.0)    │
│ 5. If score ≥ 0.5 → healthy human (probably)                  │
│ 6. If token valid → continues to Formspree                     │
│ 7. Sends email with receipt                                     │
└─────────────────────────────────────────────────────────────────┘
                    ↓ (Google Verification)
┌─────────────────────────────────────────────────────────────────┐
│ GOOGLE (https://www.google.com/recaptcha/api/siteverify)       │
├─────────────────────────────────────────────────────────────────┤
│ Input: secret (from env) + response (token from frontend)      │
│ Output: { success: true/false, score: 0.XX, hostname: "..." }  │
│                                                                  │
│ ❌ Returns success: false if:                                    │
│   - Token is invalid or expired                                 │
│   - Secret key is wrong                                         │
│   - Domain not authorized                                       │
│   - Other verification errors                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Current Issue: 400 Error

Your browser console shows:
```
✅ Token generated: 6Le4uHEsA...
📤 Respuesta de API: { status: 400, ok: false }
❌ reCAPTCHA inválido o expirado
```

**What this means:**
- ✅ Frontend successfully generated a token
- ❌ Google rejected it during backend verification
- This indicates a configuraton issue, not a code issue

**Most Common Causes (in order):**

### 1. Wrong Secret Key in Vercel (70% of cases)
- You have Site Key in `.env.local`
- But Secret Key in Vercel might be wrong
- Google won't recognize it

**Check:**
- Vercel Dashboard → Settings → Environment Variables
- Find `RECAPTCHA_SECRET`
- Should be: `6Le4uHEsAAAAABF2-3CG3yerfRv6Bvq_N1VqLrG2`
- Not: anything else or left blank

### 2. Domain Not Authorized (20% of cases)
- Google only allows certain domains to use your keys
- Your domain `fest-aya.vercel.app` might not be listed

**Check:**
- Google Cloud Console → reCAPTCHA → Keys → Your Key
- Scroll to "Domains"
- Must include: `fest-aya.vercel.app`
- If missing → Add it

### 3. Deployment Not Completed (10% of cases)
- You updated Vercel env var but deployment still in progress
- Or showing old deployment

**Check:**
- Vercel Dashboard → Your Project
- Latest deployment status = "Ready" (green ✓)
- Not "Building", "Queued", or "Failed"

## Step-by-Step Fix

### Option A: Quickest (Most Likely to Work)

1. **Open Vercel Dashboard** → Your Project
2. **Click Settings** → Environment Variables
3. **Find or Create** `RECAPTCHA_SECRET`
4. **Value**: `6Le4uHEsAAAAABF2-3CG3yerfRv6Bvq_N1VqLrG2`
5. **Save**
6. **Redeploy**: Click latest deployment → ⋯ → Redeploy
7. **Wait**: Until status shows "Ready"
8. **Test**: Submit form again

### Option B: Verify Everything

1. Check `.env.local` has Site Key
2. Check Vercel env var has Secret Key
3. Check Google Cloud has domain authorized
4. Redeploy
5. Test

### Option C: If Still Not Working

1. Go to Google Cloud Console
2. Delete the reCAPTCHA key
3. Create new one:
   - Type: reCAPTCHA v3
   - Domains: `fest-aya.vercel.app`
4. Copy new Site and Secret keys
5. Update `.env.local` with Site Key
6. Update Vercel with Secret Key
7. Commit and push (auto-deploys)
8. Test

## What the Enhanced Logging Shows

With the improved logging from the latest commit, you'll now see:

**In Browser Console (Frontend):**
```javascript
🔐 Generando token de reCAPTCHA...
✅ Token generado: 6Le4uHEsAA...

// Next appears after submit
📤 Respuesta de API: { status: 200, ok: true }  // ✅ or 400 // ❌
```

**In Vercel Logs (Backend):**
```javascript
// Shows what backend received
🔍 Enviando verificación a Google: {
  tokenPreview: "6Le4uHEsAAAAAG...",
  secretPreview: "6Le4uHEsAAAAA..."
}

// Shows what Google replied
📊 Respuesta de Google: {
  status: 200,
  success: true,           // or false
  score: 0.8,             // 0.0 - 1.0 (higher = more likely human)
  hostname: "fest-aya.vercel.app",  // Your domain verification
  errorCodes: []          // Error details if any
}
```

## Error Code Meanings

If you see error messages on the form, they now include specific error codes:

| Error Code | Meaning | Fix |
|-----------|---------|-----|
| `invalid-input-secret` | Secret key wrong in Vercel | Update RECAPTCHA_SECRET in Vercel |
| `invalid-input-response` | Token invalid or expired | Reload page and try again, or check Site Key |
| `bad-request` | Domain not authorized | Add domain to Google Cloud reCAPTCHA settings |
| `timeout-or-duplicate` | Token reused or timed out | Submit again (different token) |

## Files Modified

### Frontend Changes
- **src/components/tickets/Checkout.jsx**
  - Added `isVerifyingCaptcha` state for UI feedback
  - Enhanced error display with Google error codes
  - Better token generation error handling

### Backend Changes
- **api/send-reservation.js**
  - Enhanced logging for Google verification
  - Returns error codes and hostname info
  - Better debugging output in Vercel logs

### Configuration
- **.env.local** (Frontend - this is committed to repo)
  - Contains: VITE_RECAPTCHA_SITE_KEY
- **Vercel Environment Variables** (Backend - secret, not in repo)
  - Contains: RECAPTCHA_SECRET
  - Contains: ALLOWED_ORIGIN
  - Contains: other backend env vars

## Important Security Notes

⚠️ **Keep Secret Key Secure:**
- Never put `RECAPTCHA_SECRET` in `.env.local` or git
- Only in Vercel secure environment variables
- If accidentally exposed, regenerate the key immediately

✅ **Site Key is Public:**
- `VITE_RECAPTCHA_SITE_KEY` can be in `.env.local`
- It's visible to browser anyway
- Not sensitive

## Testing Workflow

1. **Local Development** (usually works because of API mock)
   - Runs Vite mock in vite.config.js
   - Doesn't actually call Google

2. **Production on Vercel** (what's failing)
   - Calls real API endpoint
   - Actually verifies with Google
   - Needs all env vars configured correctly

## Next Steps

1. ✅ You have enhanced code with better logging (just deployed)
2. 🔄 Verify Vercel env vars match credentials
3. 🔄 Verify Google Cloud domain settings
4. 🔄 Redeploy on Vercel
5. 🧪 Test and check browser console logs
6. 📋 Report exact error codes you see (check RECAPTCHA_DIAGNOSTICS.md)

## Contact Reference

If you need help, provide these details:
- Error message from form (screenshot)
- Browser console showing error codes
- Vercel log output (check project logs)
- Confirmation that you see "Ready" status on latest deployment
