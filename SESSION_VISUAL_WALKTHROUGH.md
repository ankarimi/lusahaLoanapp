# Session Token System - Visual Walkthrough

## User Journey with Session Token System

```
BEFORE IMPLEMENTATION (No Protection):
────────────────────────────────────
❌ User without account could access /app/home
❌ No session tracking
❌ No automatic logout on browser close
❌ Anyone could manually navigate to protected pages


AFTER IMPLEMENTATION (Fully Protected):
────────────────────────────────────

Scenario 1: New User Registration
─────────────────────────────────
User opens app
    ↓
Sees /login page
    ↓
Clicks "Register"
    ↓
Fills form (name, email, phone, password)
    ↓
Clicks "Register" button
    ↓
Firebase creates user account
    ↓
✅ createSession(user) called
    └─→ Token generated: "user123-1705070123456-abc9def"
    └─→ Stored in localStorage
    └─→ AuthContext state updated
    ↓
Email verification page shown
    ↓
User can now visit /app pages (has token!)
    ↓
OR close app and come back
    ↓
Closes browser
    ↓
localStorage still has token
    ↓
Reopens app
    ↓
AuthContext checks localStorage on mount
    ↓
✅ Session restored automatically!
    ↓
User logged back in


Scenario 2: Returning User Login
─────────────────────────────────
User opens app
    ↓
Sees /login page
    ↓
Enters email & password
    ↓
Clicks "Login"
    ↓
Firebase authenticates
    ↓
Email verified? → If NO: show verify email page
               → If YES: continue
    ↓
✅ createSession(user) called
    └─→ Token stored: localStorage
    ↓
Redirected to /app/home
    ↓
AuthContext has token → Allow access ✅
    ↓
Can now visit all /app pages:
    • /app/home (dashboard)
    • /app/loans (view loans)
    • /app/apply (apply for loan)
    • /app/support (support)
    • /app/profile (profile with logout)


Scenario 3: Social Login (Google/GitHub)
──────────────────────────────────────
User on /login page
    ↓
Clicks "Sign in with Google" button
    ↓
Google auth popup opens
    ↓
User logs in with Google
    ↓
Firebase handles OAuth
    ↓
✅ createSession(user) called
    └─→ Token created
    └─→ localStorage updated
    ↓
Redirected to /app/home
    ↓
Full access to app ✅


Scenario 4: Accessing Protected Route
──────────────────────────────────────
User types /app/home in URL (without logging in)
    ↓
ProtectedRoute component loads
    ↓
Check 1: Is loading?
    → YES: Show loading spinner ⟳
    → NO: Continue
    ↓
Check 2: Does token exist?
    → YES: Show page ✅
    → NO: Redirect to /login ↩️
    ↓
If token exists: Page renders normally
If token missing: User sees /login page


Scenario 5: Logout
──────────────────
User on /app/profile page
    ↓
Clicks "Logout" button
    ↓
handleLogout() triggered
    ↓
✅ logout() from AuthContext called
    └─→ Firebase signOut()
    └─→ localStorage cleared (authToken removed)
    └─→ localStorage cleared (userId removed)
    └─→ AuthContext state reset to null
    ↓
Redirect to /login
    ↓
User tries to visit /app/home
    ↓
ProtectedRoute checks for token
    ↓
No token found → Redirect to /login ✅
    ↓
User is fully logged out!


Scenario 6: Try to Access Protected Route Without Token
─────────────────────────────────────────────────────────
User opens DevTools
    ↓
Goes to Application → LocalStorage
    ↓
Deletes 'authToken' manually
    ↓
Refreshes /app/home
    ↓
ProtectedRoute checks for token
    ↓
Token is gone!
    ↓
Redirects to /login ✅
    ↓
User can't bypass protection


Scenario 7: Multi-Tab Session Sync
──────────────────────────────────
Tab A: User logs in
    ├─→ Token created
    ├─→ localStorage updated
    ↓
Tab B: User refreshes
    ├─→ AuthContext checks localStorage
    ├─→ Sees token from Tab A
    ├─→ Session restored
    ↓
Both tabs show user as logged in ✅


Scenario 8: Session Persistence
────────────────────────────────
Monday 10:00 AM:
    ├─→ User logs in on app
    ├─→ Token created and stored
    ├─→ Navigates to /app/home
    ↓
Monday 10:05 AM:
    ├─→ User closes browser completely
    ├─→ localStorage still has token
    ↓
Tuesday 8:00 AM:
    ├─→ User opens app again
    ├─→ App loads, AuthContext checks localStorage
    ├─→ Token still there!
    ├─→ Firebase validates user is still logged in
    ├─→ Session restored ✅
    ├─→ User doesn't need to login again
```

## Access Control Matrix

```
┌─────────────────────┬──────────────────┬──────────────────┐
│ Route               │ Without Token    │ With Token       │
├─────────────────────┼──────────────────┼──────────────────┤
│ /login              │ ✅ Can access    │ ✅ Can access    │
│ /register           │ ✅ Can access    │ ✅ Can access    │
│ /verify-email       │ ✅ Can access    │ ✅ Can access    │
│ /                   │ ✅ Can access    │ ✅ Can access    │
│                     │                  │                  │
│ /app/home           │ ❌ Redirects     │ ✅ Can access    │
│ /app/loans          │ ❌ Redirects     │ ✅ Can access    │
│ /app/apply          │ ❌ Redirects     │ ✅ Can access    │
│ /app/support        │ ❌ Redirects     │ ✅ Can access    │
│ /app/profile        │ ❌ Redirects     │ ✅ Can access    │
│                     │                  │                  │
│ /admin/dashboard    │ ❌ Redirects     │ ✅ Can access    │
│ /admin/applications │ ❌ Redirects     │ ✅ Can access    │
│ /admin/customers    │ ❌ Redirects     │ ✅ Can access    │
│ /admin/loans        │ ❌ Redirects     │ ✅ Can access    │
│ /admin/settings     │ ❌ Redirects     │ ✅ Can access    │
└─────────────────────┴──────────────────┴──────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│                  (with AuthProvider)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴──────────────┐
            │                           │
            ▼                           ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  AuthContext     │      │  Routes          │
    │                  │      │                  │
    │ • user           │      │ • /login         │
    │ • token          │      │ • /register      │
    │ • loading        │      │ • /verify-email  │
    │ • createSession()│      │ • /app/* ⟵ Protected
    │ • logout()       │      │ • /admin/* ⟵ Protected
    └──────────────────┘      └──────────────────┘
            │                           │
            │         ┌─────────────────┤
            │         │                 │
            ▼         ▼                 ▼
    ┌─────────────┐ ┌────────────────────────┐
    │ localStorage│ │ ProtectedRoute         │
    │             │ │                        │
    │ authToken   │ │ Check token?           │
    │ userId      │ │ ├─ YES → Allow ✅      │
    │             │ │ └─ NO → Redirect ❌   │
    └─────────────┘ └────────────────────────┘
            │                 │
            │    ┌────────────┴────┐
            │    │                 │
            ▼    ▼                 ▼
    ┌──────────────┐  ┌─────────────────────┐
    │ Firebase     │  │ Protected Pages     │
    │ Auth Session │  │                     │
    │              │  │ • Home              │
    │ Validates:   │  │ • Loans             │
    │ • User OK?   │  │ • Apply             │
    │ • Email OK?  │  │ • Profile (logout)  │
    └──────────────┘  └─────────────────────┘
```

## State Timeline Example

```
10:00 - User Opens App
    └─→ State: { user: null, token: null, loading: true }
       AuthContext checks localStorage (empty)
       ↓
10:00 - AuthContext Initialized
    └─→ State: { user: null, token: null, loading: false }
       User sees /login page
       ↓
10:02 - User Logs In
    └─→ State: { user: { uid, email }, token: "xyz", loading: false }
       localStorage: { authToken: "xyz", userId: "uid" }
       ↓
10:03 - User in /app/home
    └─→ ProtectedRoute sees token → Allows access ✅
       ↓
10:05 - User Closes Browser
    └─→ State cleared from memory
       localStorage: { authToken: "xyz", userId: "uid" } (persisted!)
       ↓
11:00 - User Opens App Again
    └─→ State: { user: null, token: null, loading: true }
       AuthContext checks localStorage (found!)
       AuthContext checks Firebase (user still exists!)
       ↓
11:00 - Session Restored
    └─→ State: { user: { uid, email }, token: "xyz", loading: false }
       User automatically logged back in!
       ↓
11:05 - User Clicks Logout
    └─→ AuthContext calls logout()
       Firebase signOut()
       localStorage cleared
       State: { user: null, token: null, loading: false }
       User redirected to /login
       ↓
11:05 - User Sees /login
    └─→ Token gone, no access to protected routes
       User must login again to proceed
```

## Data Flow: Token Creation

```
User submits login form
    ↓
Login.jsx validates input
    ↓
Firebase.signInWithEmailAndPassword(email, password)
    ↓
Firebase returns credentialUser object
    ↓
Login.jsx calls: createSession(credentialUser)
    ↓
AuthContext.createSession():
    ├─ Generate: sessionToken = "{uid}-{timestamp}-{random}"
    ├─ Store: localStorage.setItem('authToken', sessionToken)
    ├─ Store: localStorage.setItem('userId', uid)
    └─ Update: setToken(sessionToken)
    ↓
AuthContext state updated
    ├─ user: credentialUser
    ├─ token: sessionToken
    └─ loading: false
    ↓
ProtectedRoute now sees token
    └─→ Can access /app pages ✅
```

## Data Flow: Token Clearance

```
User clicks logout button
    ↓
Profile.jsx calls: handleLogout()
    ↓
handleLogout() calls: logout()
    ↓
AuthContext.logout():
    ├─ Call: Firebase.signOut()
    ├─ Clear: localStorage.removeItem('authToken')
    ├─ Clear: localStorage.removeItem('userId')
    └─ Update: setToken(null), setUser(null)
    ↓
AuthContext state updated
    ├─ user: null
    ├─ token: null
    └─ loading: false
    ↓
ProtectedRoute now sees NO token
    └─→ Redirects to /login ✅
    ↓
User cannot access protected routes
    └─→ Must login again
```
