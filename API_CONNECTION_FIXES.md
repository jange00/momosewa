# API Connection Setup - Verification & Fixes

## ✅ Current Status

All API connection components are properly configured and working:

### 1. **API Client** (`src/api/client.js`) ✅
- ✅ Axios instance configured with base URL
- ✅ Request interceptor adds Bearer token automatically
- ✅ Response interceptor handles token refresh on 401 errors
- ✅ Proper error handling for auth endpoints
- ✅ `withCredentials: true` for CORS support
- ✅ Timeout configured (30 seconds)

### 2. **API Configuration** (`src/api/config.js`) ✅
- ✅ Base URL from environment variable with fallback
- ✅ WebSocket URL configured (Socket.IO handles protocol conversion)
- ✅ All API endpoints defined
- ✅ Request timeout configured

### 3. **Authentication Service** (`src/services/authService.js`) ✅
- ✅ Register function handles vendor vs customer registration
- ✅ Login function with email/phone support
- ✅ Logout function
- ✅ Token refresh function
- ✅ Password reset functions
- ✅ Email/phone verification
- ✅ Health check function

### 4. **Token Manager** (`src/utils/tokenManager.js`) ✅
- ✅ Uses sessionStorage (more secure than localStorage)
- ✅ Access token management
- ✅ Refresh token management
- ✅ User data storage
- ✅ Clear auth data function

### 5. **Socket Client** (`src/socket/socketClient.js`) ✅
- ✅ Socket.IO client initialized
- ✅ Token-based authentication
- ✅ Reconnection logic
- ✅ Notification subscriptions
- ✅ Order update subscriptions

### 6. **Auth Hook** (`src/hooks/useAuth.js`) ✅
- ✅ Authentication state management
- ✅ Login/register/logout functions
- ✅ Socket initialization on auth
- ✅ User state updates

## 📝 Environment Variables

Create a `.env` file in the root directory with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api/v1
VITE_WS_URL=http://localhost:5001

# Optional: Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Note:** Socket.IO automatically converts `http://` to `ws://` and `https://` to `wss://`, so using `http://` in `VITE_WS_URL` is correct.

## 🔧 Key Features

### Automatic Token Refresh
- When a 401 error occurs (except on auth endpoints), the client automatically:
  1. Gets the refresh token
  2. Calls `/auth/refresh`
  3. Updates the access token
  4. Retries the original request
  5. Reconnects socket with new token

### Vendor Registration Handling
- Vendor registrations return `requiresApproval: true`
- No tokens are stored for pending vendors
- User must wait for admin approval before logging in

### Error Handling
- Network errors show user-friendly messages
- API errors include status codes and messages
- Auth errors are handled gracefully

## 🧪 Testing the Connection

### 1. Health Check
```javascript
import { healthCheck } from './services/authService';

const check = await healthCheck();
console.log('API Status:', check);
```

### 2. Test Login
```javascript
import { login } from './services/authService';

const result = await login({
  email: 'test@example.com',
  password: 'password123'
});
```

### 3. Test Socket Connection
The socket automatically connects when a user logs in. Check browser console for:
- `Socket connected: [socket-id]`

## ⚠️ Important Notes

1. **Token Storage**: Uses `sessionStorage` instead of `localStorage` for better security (tokens cleared on tab close)

2. **CORS**: Backend must allow credentials from `http://localhost:5173` (Vite default port)

3. **WebSocket URL**: Socket.IO handles protocol conversion, so `http://` is fine in the config

4. **Token Refresh**: Automatic refresh happens transparently - no manual intervention needed

5. **Vendor Approval**: Pending vendors cannot log in until admin approves their application

## 🚀 Production Setup

For production, update `.env`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_WS_URL=https://api.yourdomain.com
```

## ✅ All Systems Ready

The API connection is fully configured and ready to use. All components are properly integrated and working together.
