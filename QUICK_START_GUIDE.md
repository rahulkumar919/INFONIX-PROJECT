# 🚀 Quick Start Guide - Super Admin & User Dashboard

## 🎯 Two Systems, Two Purposes

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔐 SUPER ADMIN SYSTEM                                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Login: /admin/login                                  │ │
│  │  Email: rahulkumar9508548671@gmail.com                │ │
│  │  Password: rahul123                                   │ │
│  │                                                       │ │
│  │  Features:                                            │ │
│  │  • Manage ALL users                                   │ │
│  │  • Manage ALL stores                                  │ │
│  │  • Create/edit templates                              │ │
│  │  • Platform analytics                                 │ │
│  │  • Full control                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  👤 USER DASHBOARD SYSTEM                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Login: /login                                        │ │
│  │  Signup: /signup                                      │ │
│  │                                                       │ │
│  │  Features:                                            │ │
│  │  • Create personal stores                             │ │
│  │  • Edit own content                                   │ │
│  │  • Upload media                                       │ │
│  │  • Personal analytics                                 │ │
│  │  • Limited to own data                                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Super Admin Login (YOU)

### Step-by-Step

```
1️⃣  Open Browser
    → http://localhost:3000/admin/login

2️⃣  Enter Email
    → rahulkumar9508548671@gmail.com

3️⃣  Enter Password
    → rahul123

4️⃣  Click Button
    → "⚡ Access Control Panel"

5️⃣  Success!
    → Redirected to /admin dashboard
```

### What You'll See

```
┌─────────────────────────────────────────────────────────┐
│  ⚡ SuperAdmin                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📊 Dashboard                                    │   │
│  │  👥 Users                                        │   │
│  │  🏪 Stores                                       │   │
│  │  🎨 Templates                                    │   │
│  │  📁 Categories                                   │   │
│  │  🖼️ Portfolio                                     │   │
│  │  📈 Reports                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Master Dashboard                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ 👥 Users│ │🏪 Stores│ │⛔ Inact.│ │🎨 Templ.│     │
│  │   150   │ │   45    │ │   12   │ │   8     │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                         │
│  📊 User Growth Chart                                   │
│  📊 Store Creation Chart                                │
│  ⚡ Recent Activities                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 👤 User Dashboard (Regular Users)

### How Users Sign Up

```
1️⃣  Open Browser
    → http://localhost:3000/signup

2️⃣  Fill Form
    → Name, Email, Password

3️⃣  Verify Email
    → Enter OTP sent to email

4️⃣  Login
    → http://localhost:3000/login

5️⃣  Create Store
    → Click "Deploy New Hub"
```

### What Users See

```
┌─────────────────────────────────────────────────────────┐
│  Executive Dashboard                                    │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │🏨 Hubs  │ │🍽️ Menu  │ │📈 Traffic│ │💎 Interest│   │
│  │   3     │ │   24    │ │   1.2K  │ │  3.4%   │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                         │
│  📊 Global Traffic Velocity                             │
│  🏪 Top Performing Hubs                                 │
│                                                         │
│  My Stores:                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🍴 Restaurant Elite                             │   │
│  │ /store/my-restaurant • 245 views                │   │
│  │ [🔧 Edit]                                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Differences

| Feature | Super Admin | User Dashboard |
|---------|-------------|----------------|
| **Login URL** | `/admin/login` | `/login` |
| **Your Access** | ✅ YES | ✅ YES |
| **User Access** | ❌ NO | ✅ YES |
| **Manage All Users** | ✅ YES | ❌ NO |
| **Manage All Stores** | ✅ YES | ❌ NO |
| **Create Templates** | ✅ YES | ❌ NO |
| **Create Own Store** | ✅ YES | ✅ YES |
| **Platform Stats** | ✅ YES | ❌ NO |
| **Personal Stats** | ✅ YES | ✅ YES |

---

## 🎯 Use Cases

### As Super Admin (You)

```
✅ View all users in the system
✅ Activate/deactivate user accounts
✅ Delete problematic users
✅ View all stores created by all users
✅ Enable/disable any store
✅ Delete any store
✅ Create new templates for users to choose
✅ Edit existing templates
✅ Manage template categories
✅ View platform-wide analytics
✅ Generate reports
✅ Monitor system health
```

### As Regular User

```
✅ Create personal account
✅ Create multiple stores (based on plan)
✅ Choose from available templates
✅ Customize store branding
✅ Add pages (About, Contact, etc.)
✅ Upload images (max 5)
✅ Configure SEO settings
✅ Set custom URL/slug
✅ View personal store analytics
✅ Manage subscription plan
```

---

## 🚀 Getting Started

### For You (Admin)

```bash
# 1. Make sure dev server is running
cd INFONIX-PROJECT/files/webzio-app
npm run dev

# 2. Open admin login
# Browser → http://localhost:3000/admin/login

# 3. Login with:
# Email: rahulkumar9508548671@gmail.com
# Password: rahul123

# 4. Start managing!
```

### For Testing User Flow

```bash
# 1. Open signup page
# Browser → http://localhost:3000/signup

# 2. Create test account
# Name: Test User
# Email: test@example.com
# Password: test123

# 3. Verify email with OTP

# 4. Login at /login

# 5. Create a store
```

---

## 🔧 Maintenance Commands

### Reset Admin Password
```bash
cd INFONIX-PROJECT/files/webzio-app
node scripts/setup-admin.js
```

### Test Admin Login
```bash
cd INFONIX-PROJECT/files/webzio-app
node scripts/test-admin-login.js
```

### Check Configuration
```bash
# View .env.local
cat .env.local

# Should show:
# ADMIN_EMAIL=rahulkumar9508548671@gmail.com
# ADMIN_PASSWORD=rahul123
```

---

## 🐛 Troubleshooting

### Problem: Can't login as admin

**Solution**:
```bash
# 1. Clear browser cookies
# Press Ctrl+Shift+Delete → Clear cookies

# 2. Reset admin user
cd INFONIX-PROJECT/files/webzio-app
node scripts/setup-admin.js

# 3. Restart server
# Stop server (Ctrl+C)
npm run dev

# 4. Try again
# http://localhost:3000/admin/login
```

### Problem: Redirects to login page

**Check**:
- ✅ Using `/admin/login` not `/login`
- ✅ Credentials are correct
- ✅ Cookie is set (F12 → Application → Cookies)
- ✅ MongoDB is connected
- ✅ JWT_SECRET is set in .env.local

### Problem: User can't create store

**Check**:
- ✅ User is verified (check email for OTP)
- ✅ User is active
- ✅ User hasn't exceeded plan limit
- ✅ Templates exist in database

---

## 📊 System Flow

### Admin Login Flow
```
User → /admin/login
  ↓
Enter credentials
  ↓
POST /api/auth/login
  ↓
Validate: email + password + role
  ↓
Generate JWT token
  ↓
Set HTTP-only cookie
  ↓
Store in Zustand
  ↓
Redirect to /admin
  ↓
Middleware verifies token
  ↓
Access granted ✅
```

### User Login Flow
```
User → /login
  ↓
Enter credentials
  ↓
POST /api/auth/login
  ↓
Validate: email + password
  ↓
Generate JWT token
  ↓
Store in localStorage
  ↓
Redirect to /dashboard
  ↓
Access personal data ✅
```

---

## ✅ Checklist

### Admin System
- [x] Admin user created
- [x] Login page working
- [x] Authentication working
- [x] Middleware protecting routes
- [x] Dashboard loading
- [x] All features accessible
- [x] Logout working

### User System
- [x] Signup page working
- [x] Email verification working
- [x] Login working
- [x] Dashboard accessible
- [x] Store creation working
- [x] Store editing working
- [x] Media upload working

---

## 🎉 You're All Set!

Everything is working and ready to use!

### Quick Links

- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin
- **User Signup**: http://localhost:3000/signup
- **User Login**: http://localhost:3000/login
- **User Dashboard**: http://localhost:3000/dashboard

### Your Credentials

```
Email:    rahulkumar9508548671@gmail.com
Password: rahul123
```

**Start managing your platform now!** 🚀
