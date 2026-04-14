# 🏪 Store Admin Panel - Implementation Plan

## 📋 Features Overview

### 1. Dashboard (Overview)
- ✅ Visitors Count
- ✅ Leads / Orders Count
- ✅ Store Status (Active/Inactive)
- ✅ Quick Actions (Edit Store, View Live, Settings)
- ✅ Recent Activity

### 2. Store Setup Wizard
- ✅ Step 1: Select Template (from 15 templates)
- ✅ Step 2: Choose Category
- ✅ Step 3: Add Business Info (Name, Description, Contact)
- ✅ Step 4: Publish Store

### 3. Branding & Identity
- ✅ Upload Logo
- ✅ Store Name
- ✅ Contact Details (Phone, Email, Address)
- ✅ Banner / Hero Image
- ✅ Social Media Links (Facebook, Instagram, Twitter, LinkedIn)

### 4. CMS Management
- ✅ Create/Edit Pages
- ✅ Pages List View
- ✅ Custom Pages (unlimited)
- ✅ Page Editor with SEO
- ✅ Publish/Unpublish Pages

### 5. Media / Gallery
- ✅ Upload Images (Max: 5 per store)
- ✅ Image Preview
- ✅ Delete Images
- ✅ Image Gallery Display

### 6. Site Settings
- ✅ Change Username / URL (slug)
- ✅ SEO Settings (Title, Meta Description, Keywords)
- ✅ Favicon Upload
- ✅ Basic Configurations (Theme, Colors)

### 7. Profile Settings
- ✅ Name / Email Update
- ✅ Password Change
- ✅ Account Settings
- ✅ Profile API Routes

---

## 🗂️ File Structure

```
app/
├── dashboard/
│   ├── page.tsx                    # Main dashboard
│   ├── layout.tsx                  # Dashboard layout (existing)
│   ├── stores/
│   │   ├── page.tsx               # My Stores list
│   │   ├── new/
│   │   │   └── page.tsx           # Store Setup Wizard
│   │   └── [storeId]/
│   │       ├── page.tsx           # Store Dashboard
│   │       ├── branding/
│   │       │   └── page.tsx       # Branding & Identity
│   │       ├── pages/
│   │       │   ├── page.tsx       # CMS Pages List
│   │       │   ├── new/
│   │       │   │   └── page.tsx   # Create New Page
│   │       │   └── [pageId]/
│   │       │       └── page.tsx   # Edit Page
│   │       ├── gallery/
│   │       │   └── page.tsx       # Media Gallery
│   │       └── settings/
│   │           └── page.tsx       # Site Settings
│   ├── settings/
│   │   └── page.tsx               # Profile Settings
│   └── templates/
│       └── page.tsx               # Browse Templates

api/
├── store/
│   ├── [id]/
│   │   ├── route.ts              # Get/Update Store
│   │   ├── pages/
│   │   │   └── route.ts          # CMS Pages CRUD
│   │   ├── gallery/
│   │   │   └── route.ts          # Gallery CRUD
│   │   └── settings/
│   │       └── route.ts          # Store Settings
│   └── dashboard/
│       └── route.ts              # Dashboard Stats

models/
├── Website.ts                     # Store Model (existing)
├── Page.ts                        # CMS Page Model (new)
└── Gallery.ts                     # Gallery Model (new)
```

---

## 🎨 UI Components Needed

### 1. Dashboard Components
- StatsCard (Visitors, Orders, Status)
- QuickActionButton
- RecentActivityList
- StoreStatusBadge

### 2. Wizard Components
- WizardSteps (Progress indicator)
- TemplateSelector (Grid of templates)
- CategorySelector (Dropdown/Cards)
- BusinessInfoForm
- PublishConfirmation

### 3. Branding Components
- ImageUploader (Logo, Banner, Favicon)
- SocialLinksForm
- ContactDetailsForm
- ColorPicker

### 4. CMS Components
- PageList (Table/Cards)
- RichTextEditor (TinyMCE or similar)
- PagePreview
- PageSettings

### 5. Gallery Components
- ImageUploadZone (Drag & Drop)
- ImageGrid (Max 5 images)
- ImageCard (with delete button)
- ImageLightbox

### 6. Settings Components
- SlugEditor (URL customization)
- SEOForm (Title, Meta, Keywords)
- FaviconUploader
- ThemeSelector

---

## 🔧 Implementation Steps

### Phase 1: Database Models (30 min)
1. Create Page model for CMS
2. Create Gallery model
3. Update Website model with new fields

### Phase 2: API Routes (1 hour)
1. Store Dashboard API (stats)
2. CMS Pages CRUD API
3. Gallery CRUD API
4. Store Settings API

### Phase 3: Store Setup Wizard (1 hour)
1. Step 1: Template Selection
2. Step 2: Category Selection
3. Step 3: Business Info Form
4. Step 4: Publish & Redirect

### Phase 4: Store Dashboard (30 min)
1. Stats display
2. Quick actions
3. Recent activity

### Phase 5: Branding & Identity (45 min)
1. Logo upload
2. Banner upload
3. Social links form
4. Contact details

### Phase 6: CMS Management (1 hour)
1. Pages list
2. Create page
3. Edit page
4. Delete page
5. Rich text editor

### Phase 7: Media Gallery (45 min)
1. Upload images (max 5)
2. Display gallery
3. Delete images
4. Image preview

### Phase 8: Site Settings (45 min)
1. URL/Slug editor
2. SEO settings
3. Favicon upload
4. Theme settings

### Phase 9: Profile Settings (30 min)
1. Update name/email
2. Change password
3. Avatar upload

---

## 🎯 Priority Order

1. **High Priority** (Must Have):
   - Store Setup Wizard
   - Store Dashboard
   - Branding & Identity
   - Site Settings

2. **Medium Priority** (Should Have):
   - CMS Management
   - Media Gallery
   - Profile Settings

3. **Low Priority** (Nice to Have):
   - Advanced Analytics
   - Custom Themes
   - Export/Import

---

## 📦 Dependencies Needed

```json
{
  "react-quill": "^2.0.0",           // Rich text editor
  "react-dropzone": "^14.2.3",       // File upload
  "react-color": "^2.19.3",          // Color picker
  "recharts": "^2.10.0",             // Charts for analytics
  "date-fns": "^3.0.0"               // Date formatting
}
```

---

## 🚀 Let's Start!

I'll implement this in phases. Starting with:

1. **Database Models** - Page & Gallery
2. **Store Setup Wizard** - Complete 4-step process
3. **Store Dashboard** - Stats & Quick Actions

Then we'll continue with other features.

Ready to start? 🎉
