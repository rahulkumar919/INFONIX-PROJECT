# 🎯 Super Admin vs User Dashboard - Complete Guide

## 📊 Two Separate Systems

### 1. **Super Admin Panel** (`/admin`)
**Purpose**: Platform management and control
**Access**: Only for administrators (role: `admin` or `superadmin`)
**Login**: `/admin/login`

**Features**:
- ✅ Manage all users
- ✅ Manage all stores
- ✅ Create/edit templates
- ✅ Manage categories
- ✅ View analytics & reports
- ✅ Platform-wide control

**Who can access**:
- Users with `role: 'admin'`
- Users with `role: 'superadmin'`

---

### 2. **User Dashboard** (`/dashboard`)
**Purpose**: Personal store management
**Access**: For regular users (role: `user`)
**Login**: `/login`

**Features**:
- ✅ Create their own stores
- ✅ Manage their stores
- ✅ Edit store content
- ✅ Upload images
- ✅ View their statistics
- ✅ Manage subscription

**Who can access**:
- Users with `role: 'user'`
- Regular customers who sign up

---

## 🔐 Authentication Flow

### Super Admin Login:
```
1. Go to: http://localhost:3000/admin/login
2. Enter: rahulkumar9508548671@gmail.com
3. Password: rahul123
4. Redirects to: /admin (Super Admin Panel)
```

### User Login:
```
1. Go to: http://localhost:3000/login
2. Enter: user@example.com
3. Password: user-password
4. Redirects to: /dashboard (User Dashboard)
```

---

## 🗂️ Database Roles

### User Schema:
```javascript
{
  name: "User Name",
  email: "user@example.com",
  password: "hashed-password",
  role: "user" | "admin" | "superadmin",  // ← This determines access
  isVerified: true/false,
  isActive: true/false
}
```

### Role Types:

1. **`user`** (Default)
   - Can access `/dashboard`
   - Cannot access `/admin`
   - Can create and manage their own stores
   - Limited to their own data

2. **`admin`**
   - Can access `/admin`
   - Can access `/dashboard`
   - Can manage all users and stores
   - Platform administrator

3. **`superadmin`**
   - Can access `/admin`
   - Can access `/dashboard`
   - Full platform control
   - Cannot be deleted by other admins
   - Highest privilege level

---

## 🚀 How to Create Users

### Create Super Admin:
```bash
# Already created with:
Email: rahulkumar9508548671@gmail.com
Password: rahul123
Role: admin

# To create another admin:
node scripts/setup-admin.js
```

### Create Regular User:
```
1. Go to: http://localhost:3000/signup
2. Fill in details
3. Verify email with OTP
4. Login at: http://localhost:3000/login
5. Access dashboard at: /dashboard
```

---

## 🔧 Current Setup

### Your Super Admin:
```
Email: rahulkumar9508548671@gmail.com
Password: rahul123
Role: admin
Access: /admin panel
```

### Test User (if needed):
```
Create via signup page
Role: user (automatic)
Access: /dashboard only
```

---

## 🎨 UI Differences

### Super Admin Panel (`/admin`):
- Dark theme with purple/cyan gradients
- Sidebar with admin navigation
- Dashboard shows platform-wide stats
- Can see all users, stores, templates
- Analytics and reports
- User management tools

### User Dashboard (`/dashboard`):
- Light/dark theme toggle
- Sidebar with user navigation
- Dashboard shows personal stats
- Can only see their own stores
- Store creation wizard
- Personal profile settings

---

## 🔒 Security & Middleware

### Admin Routes Protection:
```typescript
// middleware.ts
if (path.startsWith('/admin') && path !== '/admin/login') {
  // Check token
  // Verify role is 'admin' or 'superadmin'
  // Redirect to /admin/login if not authorized
}
```

### User Routes Protection:
```typescript
// Client-side check in layouts
if (!user || !token) {
  router.push('/login')
}
```

---

## 📝 API Endpoints

### Admin APIs:
```
GET  /api/admin/stats          - Platform statistics
GET  /api/admin/users          - All users
GET  /api/admin/stores         - All stores
GET  /api/admin/templates      - All templates
POST /api/admin/users          - Create user
```

### User APIs:
```
GET  /api/websites             - User's stores only
POST /api/websites             - Create store
GET  /api/products             - User's products
POST /api/products             - Create product
```

---

## ✅ Testing Both Systems

### Test Super Admin:
1. Open: `http://localhost:3000/admin/login`
2. Login with: `rahulkumar9508548671@gmail.com` / `rahul123`
3. Should see: Super Admin Dashboard
4. Check: Can see all users, stores, templates
5. Navigate: All admin menu items work

### Test User Dashboard:
1. Open: `http://localhost:3000/signup`
2. Create account: `testuser@example.com` / `password123`
3. Verify OTP
4. Login at: `http://localhost:3000/login`
5. Should see: User Dashboard
6. Check: Can create stores, manage own content
7. Verify: Cannot access `/admin` routes

---

## 🐛 Troubleshooting

### Issue: Super Admin not working
**Solution**:
```bash
# Re-run setup script
cd INFONIX-PROJECT/files/webzio-app
node scripts/setup-admin.js

# Then login at /admin/login
```

### Issue: User can't access dashboard
**Solution**:
1. Check user role in database (should be 'user')
2. Verify email is verified
3. Check isActive is true
4. Clear browser cookies and localStorage
5. Login again

### Issue: Admin redirects to login
**Solution**:
1. Check JWT_SECRET in .env.local
2. Clear browser cookies
3. Login again
4. Check browser console for errors

### Issue: Can't tell which panel I'm in
**Solution**:
- Admin panel: Dark theme, "Super Admin" logo, purple/cyan colors
- User dashboard: Light theme, "Dashboard" title, blue colors
- Check URL: `/admin/*` vs `/dashboard/*`

---

## 🎯 Summary

| Feature | Super Admin (`/admin`) | User Dashboard (`/dashboard`) |
|---------|----------------------|------------------------------|
| **Login URL** | `/admin/login` | `/login` |
| **Role Required** | `admin` or `superadmin` | `user` |
| **Access Level** | Platform-wide | Personal only |
| **Can Manage** | All users & stores | Own stores only |
| **Theme** | Dark (purple/cyan) | Light/Dark toggle |
| **Navigation** | Admin menu | User menu |
| **Statistics** | Platform stats | Personal stats |
| **User Management** | ✅ Yes | ❌ No |
| **Template Creation** | ✅ Yes | ❌ No |
| **Store Creation** | ✅ View all | ✅ Create own |

---

## 🚀 Quick Start

### As Super Admin:
```bash
1. Visit: http://localhost:3000/admin/login
2. Email: rahulkumar9508548671@gmail.com
3. Password: rahul123
4. Manage platform
```

### As Regular User:
```bash
1. Visit: http://localhost:3000/signup
2. Create account
3. Verify email
4. Login at: http://localhost:3000/login
5. Create stores
```

---

**Both systems are completely separate and work independently!** ✅
