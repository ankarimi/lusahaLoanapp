# Session Token - Quick Reference & Troubleshooting

## Quick Start

### Step 1: AuthProvider is Already Wrapped

The `App.jsx` already has:

```jsx
<BrowserRouter>
  <AuthProvider>
    {" "}
    // ← All routes have auth context access
    <Routes>...</Routes>
  </AuthProvider>
</BrowserRouter>
```

### Step 2: Protected Routes Already Setup

Customer and admin routes are wrapped:

```jsx
<Route path="/app/*" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>} />
<Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
```

### Step 3: Token Created on Login/Register

Both pages call `createSession()` after successful authentication.

### Step 4: Logout Available in Profile

Profile page has logout button that clears everything.

## Quick Reference

### Access Auth Anywhere

```javascript
import { useAuth } from "../context/AuthContext";

const { user, token, loading, createSession, logout } = useAuth();
```

### Properties

- `user` - Current user object (uid, email, displayName, emailVerified)
- `token` - Session token string or null
- `loading` - Boolean, true while checking auth state
- `createSession()` - Function to create token (called by Login/Register)
- `logout()` - Function to clear session (called by Profile)

### Check if User is Logged In

```javascript
const { token } = useAuth();
if (token) {
  // User is logged in
}
```

### Conditional Rendering

```javascript
const { token, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!token) return <LoginRequired />;
return <UserContent />;
```

## Troubleshooting

### Issue: User Gets Logged Out Unexpectedly

**Possible Causes:**

1. Firebase session expired
2. User logged out from another tab
3. localStorage cleared by browser cleanup
4. Browser privacy mode clears storage on close

**Solution:**

- Check browser console for errors
- Verify localStorage still has `authToken`
- Test Firebase connection
- For production, implement token refresh

```javascript
// Check in browser DevTools:
localStorage.getItem("authToken"); // Should have token
localStorage.getItem("userId"); // Should have userId
```

### Issue: Can't Login - Always Redirects to /login

**Possible Causes:**

1. `createSession()` not called in Login.jsx
2. Firebase authentication failed silently
3. Token not stored in localStorage

**Solution:**

1. Check browser console for Firebase errors
2. Verify Login.jsx has:
   ```javascript
   const { createSession } = useAuth();
   // After successful auth:
   createSession(cred.user);
   ```
3. Check localStorage after login attempt

### Issue: Protected Routes Not Working - Can Access Without Token

**Possible Causes:**

1. Routes not wrapped with ProtectedRoute
2. ProtectedRoute component has bug
3. Token exists but is null/empty

**Solution:**

1. Verify App.jsx has ProtectedRoute wrapper:
   ```jsx
   <Route
     path="/app/*"
     element={
       <ProtectedRoute>
         <CustomerLayout />
       </ProtectedRoute>
     }
   />
   ```
2. Test by manually clearing localStorage and refreshing
3. Check ProtectedRoute.jsx logic

### Issue: "useAuth must be used within AuthProvider" Error

**Cause:** Using `useAuth()` in component not wrapped by AuthProvider

**Solution:**

- Verify component is inside App.jsx (wrapped by AuthProvider)
- This should already be working since AuthProvider wraps all routes

### Issue: Token Persists After Logout

**Possible Causes:**

1. logout() not fully executed
2. localStorage.removeItem() failed
3. Component still has old token in state

**Solution:**

1. Check browser console during logout
2. Verify localStorage is actually cleared:
   ```javascript
   // In DevTools console after logout:
   localStorage.getItem("authToken"); // Should be null
   ```
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Session Not Restoring After Page Refresh

**Possible Causes:**

1. Token was never stored in localStorage
2. Firebase session expired
3. AuthContext not checking localStorage on mount

**Solution:**

1. Verify AuthContext.jsx has the localStorage check:
   ```javascript
   const storedToken = localStorage.getItem("authToken");
   ```
2. Check if token exists in localStorage before refresh
3. If using private/incognito mode, localStorage might not persist

## Testing Checklist

### ✅ Login Flow

- [ ] User can login with email/password
- [ ] User redirected to /app/home after login
- [ ] authToken appears in localStorage
- [ ] `console.log(useAuth().token)` shows token
- [ ] Page refresh keeps user logged in

### ✅ Register Flow

- [ ] User can register with email
- [ ] Token created immediately after registration
- [ ] Email verification page shown
- [ ] Can still access /app pages (has token)

### ✅ Protected Routes

- [ ] Can access /app/home when logged in
- [ ] Can access /app/profile when logged in
- [ ] Can access /admin/\* when logged in
- [ ] Redirected to /login when token cleared

### ✅ Logout Flow

- [ ] Logout button in profile works
- [ ] authToken removed from localStorage
- [ ] User redirected to /login
- [ ] Can't access /app pages after logout (redirects to /login)

### ✅ Session Persistence

- [ ] Login and go to /app/home
- [ ] Refresh page (F5)
- [ ] Still logged in and on /app/home
- [ ] localStorage still has token

### ✅ Edge Cases

- [ ] Manually delete localStorage token → redirected to login
- [ ] Login in one tab, check another tab → both have token
- [ ] Logout in one tab, check another tab → both logout
- [ ] Open in incognito → token not persisted after close

## Browser DevTools Verification

### Check Token Storage

```javascript
// In DevTools Console:
localStorage;
// Look for authToken and userId keys

// Or directly:
localStorage.getItem("authToken");
localStorage.getItem("userId");
```

### Check Auth State

```javascript
// In any React component console:
// First, add temporary log to any component using useAuth()
import { useAuth } from "../context/AuthContext";

function DebugComponent() {
  const auth = useAuth();
  console.log("Auth State:", auth);
  return null;
}
```

### Monitor LocalStorage Changes

```javascript
// Add this to App.jsx temporarily for debugging:
useEffect(() => {
  const handleStorageChange = (e) => {
    console.log("Storage changed:", e.key, e.newValue);
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
```

## Common Patterns

### Create Custom Protected Component

```javascript
export function RequireAuth({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!token) return <Navigate to="/login" />;
  return children;
}
```

### Conditional UI Based on Auth

```javascript
export function Header() {
  const { token, logout } = useAuth();

  return (
    <header>
      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
```

### Get Current User

```javascript
export function UserGreeting() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return <h1>Welcome, {user?.email}</h1>;
}
```

## File Locations Quick Ref

| File                                | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `src/context/AuthContext.jsx`       | Auth state & token management     |
| `src/components/ProtectedRoute.jsx` | Route protection wrapper          |
| `src/App.jsx`                       | Provider setup + route protection |
| `src/pages/Login.jsx`               | Session creation on login         |
| `src/pages/Register.jsx`            | Session creation on register      |
| `src/pages/customer/Profile.jsx`    | Logout functionality              |

## Production Considerations

Before deploying to production:

1. **Token Security**

   - [ ] Move to HttpOnly cookies (requires backend)
   - [ ] Add token expiration (1-24 hours)
   - [ ] Implement token refresh mechanism
   - [ ] Add CSRF token validation

2. **Logging & Monitoring**

   - [ ] Log login/logout events
   - [ ] Track failed login attempts
   - [ ] Monitor unusual account activity

3. **Error Handling**

   - [ ] User-friendly error messages
   - [ ] Automatic logout on 401 errors
   - [ ] Retry logic for transient failures

4. **Testing**

   - [ ] Unit tests for AuthContext
   - [ ] Integration tests for login flow
   - [ ] E2E tests for protected routes

5. **Performance**
   - [ ] Minimize re-renders with useMemo
   - [ ] Lazy load protected components
   - [ ] Consider service worker for offline support
