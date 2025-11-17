# Passkey Setup Guide for Local Development

## The Problem

Getting "Unknown registration error" when trying to set up passkeys locally? Here's why and how to fix it.

## Root Causes

### 1. Origin Mismatch ⚠️

**WebAuthn requires exact origin matching.**

- Frontend runs on: `http://localhost:3001`
- API expects: `http://localhost:3000` (default)
- Result: ❌ Origin mismatch error

### 2. Missing Cookie Credentials

Axios needs to send cookies with requests for authentication.

### 3. Session Storage

The API stores the WebAuthn challenge in the session, which requires cookies.

---

## Fix #1: Update condo-api Environment

In your **condo-api** repository, set the correct origin:

```bash
# Add to condo-api/.env
WEBAUTHN_ORIGIN=http://localhost:3001
```

Then restart condo-api:
```bash
cd ../condo-api
rails s
```

**Verify it's working:**
```bash
# In condo-api directory
rails console
> Rails.configuration.webauthn.allowed_origins
# Should include "http://localhost:3001"
```

---

## Fix #2: Configure Axios in condo-brain

The PasskeyManager in condo-brain needs to send cookies. 

**Option A: Update condo-brain (Recommended)**

Add to `condo-brain/src/managers/passkey.ts`:

```typescript
import axios from "axios";

// Configure axios to send cookies
const api = axios.create({
  withCredentials: true,
});

// Then use `api` instead of `axios` in all methods
const response = await api.get<PasskeyRegistrationOptions>(
  "/api/webauthn/registration_options"
);
```

**Option B: Quick Local Fix**

If you can't update condo-brain immediately, add this to your frontend's axios setup:

```typescript
// In condo-web, add to index.tsx or App.tsx
import axios from 'axios';
axios.defaults.withCredentials = true;
```

---

## Fix #3: Ensure Session Middleware

In condo-api, make sure sessions are configured (should already be set up):

```ruby
# config/initializers/session_store.rb should have:
Rails.application.config.session_store :cookie_store, 
  key: '_condo_api_session',
  same_site: :lax,
  secure: Rails.env.production?
```

---

## Complete Setup Checklist

- [ ] **condo-api**: Set `WEBAUTHN_ORIGIN=http://localhost:3001` in .env
- [ ] **condo-api**: Restart server
- [ ] **condo-brain**: Add `withCredentials: true` to axios (or set globally)
- [ ] **condo-web**: Ensure running on `http://localhost:3001`
- [ ] **Browser**: Use modern browser (Chrome, Safari, Edge, Firefox)
- [ ] **Device**: Supports biometrics or has PIN/password authentication

---

## Testing the Fix

1. **Start services:**
   ```bash
   # Terminal 1 - API
   cd ../condo-api
   rails s
   
   # Terminal 2 - Frontend
   cd ../condo-web
   npm run dev
   ```

2. **Test passkey registration:**
   - Visit http://localhost:3001
   - Login with email (magic link)
   - When prompted to set up passkey, click "Set Up Passkey"
   - You should see your device's biometric prompt
   - Success! ✅

3. **Test passkey authentication:**
   - Logout
   - On login page, enter your email
   - "Sign in with Passkey" button should appear
   - Click it → Biometric prompt → Instant login! ✅

---

## Debugging

### Check Network Requests

Open DevTools → Network tab when setting up passkey:

1. **GET `/api/webauthn/registration_options`**
   - Should include `Cookie: token=...`
   - Response should have `challenge`, `user`, `rp` fields
   - Status: 200 ✅

2. **POST `/api/webauthn/register`**
   - Should include `Cookie: token=...`
   - Body should have `credential` and `nickname`
   - Status: 200 ✅

### Common Errors

**"User not found"**
→ Token cookie not being sent. Add `withCredentials: true`

**"Invalid origin"**
→ `WEBAUTHN_ORIGIN` doesn't match frontend URL

**"Challenge mismatch"**
→ Session not persisting. Check session middleware

**"Unknown registration error"**
→ One of the above issues, check Network tab for details

### Console Debugging

```javascript
// In browser console on localhost:3001
document.cookie
// Should show: token=...

// Test axios credentials
axios.defaults.withCredentials
// Should be: true
```

---

## Production Deployment

For production, update environment variables:

```bash
# Production condo-api
WEBAUTHN_ORIGIN=https://your-domain.com
WEBAUTHN_RP_NAME=Your App Name
```

**Important:** 
- WebAuthn requires HTTPS in production (localhost works with HTTP)
- Origin must match exactly (no trailing slashes)
- Each environment needs its own configuration

---

## Quick Reference

| Environment | Frontend URL | API WEBAUTHN_ORIGIN |
|-------------|--------------|---------------------|
| Development | http://localhost:3001 | http://localhost:3001 |
| Staging | https://staging.example.com | https://staging.example.com |
| Production | https://app.example.com | https://app.example.com |

---

## Still Having Issues?

1. Check condo-api logs for detailed error messages
2. Check browser DevTools → Console for JavaScript errors
3. Verify your device/browser supports WebAuthn: https://webauthn.io/
4. Try in a different browser
5. Make sure you're logged in (have a valid token cookie)

---

## Related Files

- **API Config**: `condo-api/config/initializers/webauthn.rb`
- **API Controller**: `condo-api/app/controllers/webauthn_credentials_controller.rb`
- **Brain Manager**: `condo-brain/src/managers/passkey.ts`
- **Frontend Setup**: `condo-web/src/PasskeySetupPrompt.tsx`
- **Frontend Settings**: `condo-web/src/PasskeySettings.tsx`
