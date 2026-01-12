# Session Token Flow Diagrams

## 1. Registration Flow

```
┌─────────────────────────────────────────────────────────┐
│ User fills registration form & clicks "Register"        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Register.jsx               │
    │ - Form validation          │
    │ - createUserWithEmailPass()│
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Firebase Authentication    │
    │ - User created             │
    │ - Email verification sent  │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ createSession(user)        │
    │ - Generate token           │
    │ - Store in localStorage    │
    │ - Update AuthContext       │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Navigate to /verify-email  │
    └────────────────────────────┘
```

## 2. Login Flow

```
┌─────────────────────────────────────────────────────────┐
│ User enters email/password & clicks "Login"             │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Login.jsx                  │
    │ - Email/password entry     │
    │ - OR Social login (Google) │
    └────────────┬───────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Firebase Authentication    │
    │ - Credentials verified     │
    │ - User object returned     │
    └────────────┬───────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Email Verified?            │
    └────────┬──────────────────┘
             │
     ┌───────┴───────┐
     │               │
    NO              YES
     │               │
     ▼               ▼
Redirect to    ┌────────────────────┐
/verify-email  │ createSession()     │
               │ - Generate token   │
               │ - Store in storage │
               │ - Update context   │
               └────────┬───────────┘
                        │
                        ▼
               ┌────────────────────┐
               │ Navigate to        │
               │ /app/home (or      │
               │ /admin/dashboard)  │
               └────────────────────┘
```

## 3. Protected Route Access Flow

```
┌─────────────────────────────────────────────────────────┐
│ User tries to access /app/home                          │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ ProtectedRoute checks:     │
    │ 1. Is loading? Show spinner│
    └────────────┬───────────────┘
             │
     ┌───────▼────────┐
     │   Loading done │
     └───────┬────────┘
             │
    ┌────────▼──────────────────┐
    │ Does token exist?          │
    └────────┬────────┬──────────┘
             │        │
           YES       NO
             │        │
             ▼        ▼
        ┌────────┐  ┌──────────────┐
        │ Allow  │  │ Redirect to  │
        │ Access │  │ /login       │
        │ /      │  │              │
        │ Render │  │ Clear session│
        │ Page   │  │ if needed    │
        └────────┘  └──────────────┘
```

## 4. Logout Flow

```
┌──────────────────────────────────────┐
│ User in Profile page clicks logout   │
└────────────┬───────────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ handleLogout() triggered      │
    │ in Profile.jsx                │
    └────────────┬──────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ logout() from AuthContext      │
    └────────────┬──────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ 1. Firebase signOut()         │
    │ 2. Clear localStorage:        │
    │    - authToken               │
    │    - userId                  │
    │ 3. Clear AuthContext state    │
    └────────────┬──────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ Navigate to /login            │
    └───────────────────────────────┘
```

## 5. Session Persistence Flow

```
┌──────────────────────────────────────┐
│ User closes app (token in storage)   │
└────────────┬───────────────────────┘
             │
             │ [TIME PASSES]
             │
             ▼
    ┌───────────────────────────────┐
    │ User reopens app              │
    │ App mounts, AuthContext init  │
    └────────────┬──────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ Check localStorage for token? │
    └────────────┬──────────────────┘
             │
     ┌───────┴───────┐
     │               │
   Found         Not Found
     │               │
     ▼               ▼
Check Firebase   ┌──────────────┐
Auth state       │ Keep logout  │
     │           │ state        │
     ▼           │ Show login   │
Firebase user    └──────────────┘
exists?
     │
  ┌──┴──┐
 YES   NO
  │     │
  ▼     ▼
Restore Stay
session  logged
from    out
token
  │
  ▼
Navigate to
last page
(from memory)
```

## 6. Data Flow in localStorage

```
Before Login:
┌─────────────────────────────────────┐
│ localStorage (empty or other data)  │
└─────────────────────────────────────┘

After Login (createSession):
┌─────────────────────────────────────────────────────────┐
│ localStorage                                             │
│ ┌──────────────────────────────────────────────────────┐│
│ │ authToken: "user123-1705070123456-abc9def2"         ││
│ │ userId: "user123"                                   ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘

After Logout:
┌─────────────────────────────────────┐
│ localStorage (cleared)               │
│ - authToken removed                 │
│ - userId removed                    │
└─────────────────────────────────────┘
```

## 7. Component Communication

```
                    ┌──────────────────┐
                    │  App.jsx         │
                    │  (with Provider) │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────────┐    ┌──────────────────┐
        │ AuthContext      │    │ Protected Pages  │
        │ (manages token)  │    │ (require token)  │
        └──────────────────┘    └──────────────────┘
             │                           │
    ┌────────┼──────┬───────────────────┤
    │        │      │                   │
    ▼        ▼      ▼                   ▼
  User     Token  Loading         ProtectedRoute
  State    State  State           (checks token)
    │        │      │                   │
    └────────┼──────┴───────────────────┘
             │
    Components access via useAuth()
    - Login.jsx
    - Register.jsx
    - Profile.jsx
    - Any protected component
```

## State Lifecycle

```
Initial State:
{
  user: null,
  token: null,
  loading: true
}
        │
        ▼
   [Checking localStorage & Firebase]
        │
   ┌────┴────┐
   │          │
 Token +   No token
 User OK    or user
   │        │
   ▼        ▼
{user, {user: null,
token,  token: null,
loading: false} loading: false}
        │        │
  Can access  Redirect
  protected   to login
  routes
```
