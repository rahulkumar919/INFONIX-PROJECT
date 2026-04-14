# 🧪 Store Admin Panel - Feature Testing Checklist

## Test Environment
- **Server**: http://localhost:3001
- **Super Admin**: rahulkumar9508548671@gmail.com / rahul123
- **Database**: MongoDB connected
- **Status**: ✅ Server Running

---

## 1. ✅ Authentication & Access

### Super Admin Login
- [ ] Navigate to `/admin/login`
- [ ] Login with super admin credentials
- [ ] Verify redirect to admin panel
- [ ] Check admin panel UI (Purple + Cyan theme)

### User Dashboard Access
- [ ] Login as regular user
- [ ] Verify dashboard loads
- [ ] Check sidebar navigation
- [ ] Verify "Super Admin" link visible only for admin users

---

## 2. ✅ Store Setup Wizard

### Create New Store
- [ ] Navigate to `/dashboard/stores`
- [ ] Click "Create New Store" button
- [ ] **Step 1**: Select a template (15 templates available)
- [ ] **Step 2**: Choose category (6 categories)
- [ ] **Step 3**: Fill business info (Name, Description, Contact)
- [ ] **Step 4**: Publish store
- [ ] Verify store created successfully
- [ ] Check redirect to store dashboard

**Test Data:**
```
Store Name: Test Coffee Shop
Description: Best coffee in town
Category: Food & Beverage
Template: Coffee Shop (ID: 1)
```

---

## 3. ✅ Store Dashboard

### Dashboard Stats
- [ ] Navigate to `/dashboard/stores/[storeId]`
- [ ] Verify stats cards display:
  - Visitors Count
  - Leads / Orders
  - Pages Count
  - Images Count
- [ ] Check store status badge (Active/Inactive)
- [ ] Test "Activate/Deactivate" button
- [ ] Test "View Live" button (opens in new tab)

### Quick Actions
- [ ] Verify 4 quick action cards:
  - Branding & Identity
  - Manage Pages
  - Media Gallery
  - Site Settings
- [ ] Click each card to verify navigation

---

## 4. ✅ Branding & Identity

### Test Branding Features
- [ ] Navigate to `/dashboard/stores/[storeId]/branding`
- [ ] **Logo**: Enter image URL
- [ ] **Banner**: Enter hero image URL
- [ ] **Store Name**: Update name
- [ ] **Contact Details**:
  - Phone: +1234567890
  - Email: test@example.com
  - Address: 123 Main St
  - WhatsApp: +1234567890
- [ ] **Social Links**:
  - Facebook: https://facebook.com/test
  - Instagram: https://instagram.com/test
  - Twitter: https://twitter.com/test
  - LinkedIn: https://linkedin.com/test
  - YouTube: https://youtube.com/test
- [ ] **Footer Description**: Enter text
- [ ] **Primary Color**: Pick a color
- [ ] Click "Save Changes"
- [ ] Verify success toast notification

**Test URLs:**
```
Logo: https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Logo
Banner: https://via.placeholder.com/1200x400/22D3EE/FFFFFF?text=Banner
```

---

## 5. ✅ CMS Pages Management

### List Pages
- [ ] Navigate to `/dashboard/stores/[storeId]/pages`
- [ ] Verify empty state if no pages
- [ ] Click "Create Page" button

### Create New Page
- [ ] Navigate to `/dashboard/stores/[storeId]/pages/new`
- [ ] **Page Title**: About Us
- [ ] **URL Slug**: Auto-generated (about-us)
- [ ] **Content**: Enter page content (textarea)
- [ ] **SEO Settings**:
  - Meta Title: About Us - Test Store
  - Meta Description: Learn more about our store
- [ ] **Published**: Check/uncheck
- [ ] Click "Create Page"
- [ ] Verify success toast
- [ ] Check redirect to pages list

### Edit Page
- [ ] Click "Edit" button on a page
- [ ] Navigate to `/dashboard/stores/[storeId]/pages/[pageId]`
- [ ] Modify page title
- [ ] Update content
- [ ] Change SEO settings
- [ ] Click "Save Changes"
- [ ] Verify success toast

### Publish/Unpublish Page
- [ ] Click "Publish/Unpublish" button
- [ ] Verify status badge changes
- [ ] Check success toast

### Delete Page
- [ ] Click delete button (🗑️)
- [ ] Confirm deletion
- [ ] Verify page removed from list
- [ ] Check success toast

**Test Pages to Create:**
1. About Us
2. Contact Us
3. Services
4. FAQ

---

## 6. ✅ Media Gallery

### Upload Images
- [ ] Navigate to `/dashboard/stores/[storeId]/gallery`
- [ ] Verify max 5 images limit
- [ ] **Image URL**: Enter image URL
- [ ] **Title**: Enter image title
- [ ] **Description**: Enter description
- [ ] Click "Add Image"
- [ ] Verify image appears in gallery
- [ ] Check success toast

### View Gallery
- [ ] Verify images display in grid
- [ ] Check image preview
- [ ] Verify title and description display

### Delete Image
- [ ] Click delete button on an image
- [ ] Confirm deletion
- [ ] Verify image removed
- [ ] Check success toast
- [ ] Verify image count updates

**Test Images:**
```
1. https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Image+1
2. https://via.placeholder.com/800x600/22D3EE/FFFFFF?text=Image+2
3. https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Image+3
```

---

## 7. ✅ Site Settings

### Update Settings
- [ ] Navigate to `/dashboard/stores/[storeId]/settings`
- [ ] **URL Slug**: Change store URL
- [ ] **SEO Settings**:
  - Meta Title: Test Store - Best Coffee
  - Meta Description: Visit our coffee shop
  - Meta Keywords: coffee, cafe, drinks
- [ ] **Favicon**: Enter favicon URL
- [ ] **Theme Color**: Pick a color (#7C3AED)
- [ ] Click "Save Settings"
- [ ] Verify success toast

**Test Data:**
```
Slug: test-coffee-shop
Meta Title: Test Coffee Shop - Best Coffee in Town
Meta Description: Visit our coffee shop for the best coffee experience
Meta Keywords: coffee, cafe, espresso, latte, cappuccino
Favicon: https://via.placeholder.com/32x32/7C3AED/FFFFFF?text=F
Theme Color: #7C3AED
```

---

## 8. ✅ Profile Settings

### Update Profile
- [ ] Navigate to `/dashboard/settings`
- [ ] **Full Name**: Update name
- [ ] **Email**: Update email (check uniqueness validation)
- [ ] Click "Save Changes"
- [ ] Verify success toast
- [ ] Check if email already exists error works

### Change Password
- [ ] **Current Password**: Enter current password
- [ ] **New Password**: Enter new password (min 6 chars)
- [ ] **Confirm Password**: Re-enter new password
- [ ] Click "Change Password"
- [ ] Verify success toast
- [ ] Test validation:
  - Empty fields
  - Password mismatch
  - Password too short
  - Wrong current password

**Test Data:**
```
Name: Test User Updated
Email: testuser@example.com
Current Password: [user's current password]
New Password: newpass123
```

---

## 9. ✅ API Endpoints Testing

### Pages API
```bash
# Get all pages
GET /api/store/[id]/pages

# Create page
POST /api/store/[id]/pages
Body: { title, slug, content, metaTitle, metaDescription, isPublished }

# Get single page
GET /api/store/[id]/pages/[pageId]

# Update page
PATCH /api/store/[id]/pages/[pageId]
Body: { title, slug, content, metaTitle, metaDescription, isPublished }

# Delete page
DELETE /api/store/[id]/pages/[pageId]
```

### Gallery API
```bash
# Get all images
GET /api/store/[id]/gallery

# Add image
POST /api/store/[id]/gallery
Body: { imageUrl, title, description }

# Delete image
DELETE /api/store/[id]/gallery/[imageId]
```

### User Profile API
```bash
# Update profile
PATCH /api/user/profile
Body: { name, email }

# Change password
PATCH /api/user/password
Body: { currentPassword, newPassword }
```

### Store Dashboard API
```bash
# Get dashboard stats
GET /api/store/dashboard?storeId=[id]
```

---

## 10. ✅ UI/UX Testing

### Color Scheme
- [ ] Verify Purple (#7C3AED) + Cyan (#22D3EE) theme
- [ ] Check gradient buttons
- [ ] Verify dark card backgrounds (#0F172A)
- [ ] Check text colors (light/muted)

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)

### Interactions
- [ ] Hover effects on buttons
- [ ] Smooth transitions
- [ ] Toast notifications
- [ ] Loading states
- [ ] Form validations

---

## 11. ✅ Error Handling

### Test Error Scenarios
- [ ] Invalid JWT token
- [ ] Unauthorized access
- [ ] Duplicate slug creation
- [ ] Max 5 images limit
- [ ] Email already exists
- [ ] Wrong password
- [ ] Network errors
- [ ] Database connection errors

---

## 12. ✅ Security Testing

### Authentication
- [ ] JWT token verification
- [ ] User ownership validation
- [ ] Admin role checking
- [ ] Password hashing (bcrypt)

### Validation
- [ ] Required field validation
- [ ] Email format validation
- [ ] Password strength (min 6 chars)
- [ ] Slug uniqueness per website
- [ ] Max image limit (5)

---

## 13. ✅ Database Verification

### Check MongoDB Collections
```javascript
// Pages collection
db.pages.find({ websiteId: ObjectId("...") })

// Gallery collection
db.galleries.find({ websiteId: ObjectId("...") })

// Websites collection
db.websites.findOne({ _id: ObjectId("...") })

// Users collection
db.users.findOne({ email: "test@example.com" })
```

---

## 14. ✅ Integration Testing

### Complete User Flow
1. [ ] Login as user
2. [ ] Create new store via wizard
3. [ ] Update branding & identity
4. [ ] Create 3 pages (About, Contact, Services)
5. [ ] Upload 5 images to gallery
6. [ ] Update site settings (SEO, slug)
7. [ ] Update profile name/email
8. [ ] Change password
9. [ ] View live store
10. [ ] Logout

---

## 15. ✅ Performance Testing

### Load Times
- [ ] Dashboard load time < 2s
- [ ] Page creation < 1s
- [ ] Image upload < 1s
- [ ] Settings save < 1s

### Database Queries
- [ ] Indexed queries (websiteId, slug)
- [ ] Efficient pagination
- [ ] Proper sorting

---

## Test Results Summary

### ✅ Passed Features
- [ ] Store Setup Wizard
- [ ] Store Dashboard
- [ ] Branding & Identity
- [ ] CMS Pages Management
- [ ] Media Gallery
- [ ] Site Settings
- [ ] Profile Settings
- [ ] API Endpoints
- [ ] Authentication & Security
- [ ] UI/UX Design

### ❌ Failed Features
- None (to be updated during testing)

### 🐛 Bugs Found
- None (to be updated during testing)

### 📝 Notes
- All features implemented as per requirements
- Code compiles successfully
- Server running on port 3001
- Database connected

---

## Next Steps After Testing

1. Fix any bugs found
2. Optimize performance issues
3. Add additional features if needed
4. Deploy to production
5. User acceptance testing

---

**Testing Date**: [To be filled]
**Tester**: [To be filled]
**Environment**: Development (localhost:3001)
**Status**: Ready for Testing ✅
