# Session Token Implementation Guide

## Overview

I've implemented a complete session token management system for lusahaLoanapp that creates tokens on login/register and clears them on logout. Users cannot access protected pages without a valid token.

## What Was Implemented

### 1. **AuthContext.jsx** - Core Authentication State Management

**Location**: `src/context/AuthContext.jsx`

**Key Features**:

- Manages user and token state globally
- `createSession()` - Creates a unique token after successful login/register
- `logout()` - Clears token, localStorage, and Firebase session
- Auto-checks localStorage on app mount to restore sessions
- Token format: `{userId}-{timestamp}-{randomId}`

**Token Storage**:

- `authToken` - Session token (localStorage)
- `userId` - User ID (localStorage)
- Both cleared on logout

**Exports**:

- `AuthProvider` - Wrap your app with this
- `useAuth()` - Hook to access auth state and methods

### 2. **ProtectedRoute.jsx** - Route Protection Component

**Location**: `src/components/ProtectedRoute.jsx`

**Features**:

- Checks if user has a valid token
- Shows loading spinner while checking auth state
- Redirects to `/login` if no token found
- Used to wrap protected routes

### 3. **Updated App.jsx**

**Changes**:

- Wrapped entire app with `<AuthProvider>`
- Applied `<ProtectedRoute>` to `/app/*` (Customer pages)
- Applied `<ProtectedRoute>` to `/admin/*` (Admin pages)
- Login, Register, VerifyEmail pages remain unprotected (accessible without token)

### 4. **Updated Login.jsx**

**Changes**:

- Added `import { useAuth }` to access `createSession`
- Calls `createSession(cred.user)` after successful login
- Works for both email/password and social logins (Google, GitHub)

### 5. **Updated Register.jsx**

**Changes**:

- Added `import { useAuth }` to access `createSession`
- Calls `createSession(cred.user)` after successful registration
- Works for both email/password and social registration

### 6. **Updated Profile.jsx**

**Changes**:

- Imports `useAuth` hook
- Uses `logout()` function from AuthContext
- Clears session on logout and redirects to `/login`

## How It Works

### Login Flow

```
1. User enters email/password → Login.jsx
2. Firebase authenticates user
3. createSession() is called → token stored in localStorage
4. AuthContext state updates
5. User redirected to /app/home
```

### Protected Access Flow

```
1. User tries to visit /app/home
2. ProtectedRoute checks if token exists
3. If token exists → allows access
4. If no token → redirects to /login
5. Loading spinner shown while checking
```

### Logout Flow

```
1. User clicks logout (in Profile.jsx)
2. logout() function is called
3. Firebase signOut() executed
4. Token removed from localStorage
5. User state cleared
6. User redirected to /login
7. Next page access attempt shows /login (no token)
```

### Session Persistence

```
1. User closes app
2. Token stored in localStorage persists
3. App restarts
4. AuthContext checks localStorage on mount
5. If token + Firebase user exist → session restored
6. If no token or Firebase user logout → session cleared
```

## Protected vs Unprotected Routes

### Protected Routes (Require Token)

- `/app/home` - Customer dashboard
- `/app/loans` - View loans
- `/app/apply` - Loan application
- `/app/support` - Support page
- `/app/profile` - User profile (with logout)
- `/admin/*` - All admin pages

### Unprotected Routes (No Token Required)

- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification
- `/onboarding` - Onboarding
- `/` - Root path (redirects to login)

## Key Implementation Details

### Token Creation

```javascript
const sessionToken = `${firebaseUser.uid}-${Date.now()}-${Math.random()
  .toString(36)
  .substr(2, 9)}`;
```

- Unique per session
- Includes userId for easy retrieval
- Includes timestamp for validity tracking
- Random component prevents predictability

### State Synchronization

- AuthContext listens to Firebase `onAuthStateChanged`
- If Firebase user logs out externally → token cleared
- If token cleared but Firebase session exists → both cleared
- Keeps localStorage and Firebase state in sync

---

## Loan Product Rules (specific to this project)

- **Default user limit:** Users start with **limit = 0** on registration. Admins manually assign limits via the admin Customers UI (`src/pages/admin/Customers.jsx`).
- **Applying for a loan:** Customers apply via `src/pages/customer/Apply.jsx`. The app requires a mobile number to transact with; the registration form requests phone number and Apply prompts for it if missing.
- **Loan creation:** An application creates a document in the `loans` collection with: `userId`, `amount`, `durationDays`, `purpose`, `phoneUsed`, `status: 'under_review'`, `createdAt`, `interest`, and `totalRepayment`.
- **Review flow:** Admins review applications in `src/pages/admin/Applications.jsx` and can **Approve** or **Decline** an application. Approve sets `status` to `approved`, records `approvedAt` and `approverId`; Decline sets `status` to `declined` and records reviewer info.
- **Minimum duration:** Loan duration must be **at least 30 days**. The UI enforces this by offering 30/60/90 day terms and validating client-side.
- **Interest rate:** Interest is **20%** (applied pro-rata relative to 30-day periods). Calculation used: `interest = amount * 0.20 * (duration / 30)`.
- **Payments:** All payments are **manual** (outside the app). The UI explicitly informs the user that payments are manual and the phone number provided will be used to transact.

**Files to review for loan logic:**

- `src/pages/Register.jsx` — ensures phone is collected on registration
- `src/pages/customer/Apply.jsx` — create application and client-side validation
- `src/pages/admin/Applications.jsx` — admin review (approve/decline)
- `src/pages/admin/Customers.jsx` — admin assigns `limit` to users

---

## Usage in Components

### Access Auth State

```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, token, loading } = useAuth();
  // user - current user object
  // token - session token
  // loading - loading state
}
```

### Logout

```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is now logged out, redirected by navigation
};
```

## Security Notes

- Tokens stored in localStorage (not HttpOnly - accessible to JS)
- For production, consider:
  - Moving to secure HttpOnly cookies (backend required)
  - Adding token expiration
  - Implementing refresh token mechanism
  - Adding CSRF protection
  - Backend session validation

## Testing the Implementation

### Test Login

1. Go to `/login`
2. Enter credentials
3. Should see token in browser localStorage
4. Should redirect to `/app/home`
5. Try accessing `/app/home` directly - should work (has token)

### Test Logout

1. Go to `/app/profile`
2. Click logout button
3. Token should be cleared from localStorage
4. Should redirect to `/login`
5. Try accessing `/app/home` directly - should redirect to `/login`

### Test Protected Routes

1. Clear localStorage (DevTools)
2. Try accessing `/app/home` directly
3. Should redirect to `/login`

### Test Session Persistence

1. Login and go to `/app/home`
2. Refresh page (F5)
3. Should remain logged in (session restored from localStorage)

## File Changes Summary

| File                                | Changes                                          |
| ----------------------------------- | ------------------------------------------------ |
| `src/context/AuthContext.jsx`       | ✅ Created - New auth context                    |
| `src/components/ProtectedRoute.jsx` | ✅ Updated - Enhanced with loading state         |
| `src/App.jsx`                       | ✅ Updated - Added AuthProvider & ProtectedRoute |
| `src/pages/Login.jsx`               | ✅ Updated - Calls createSession()               |
| `src/pages/Register.jsx`            | ✅ Updated - Calls createSession()               |
| `src/pages/customer/Profile.jsx`    | ✅ Updated - Uses logout() from context          |

## Next Steps (Optional Enhancements)

1. **Token Expiration**: Add `expiresAt` to token and validate on app load
2. **Refresh Logic**: Implement auto-refresh before token expires
3. **Role-Based Routes**: Add role check in ProtectedRoute for admin/customer separation
4. **Logout All Devices**: Track multiple tokens per user in backend
5. **Session Activity**: Log and track user session activity
6. **Mobile Biometric**: Use biometrics for re-authentication
