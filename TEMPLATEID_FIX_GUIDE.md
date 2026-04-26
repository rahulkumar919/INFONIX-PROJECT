# TemplateId Validation Error - Fix Guide

## Problem
When creating a store, you get this error:
```
Website validation failed: templateId: Cast to Number failed for value "..." (type ObjectId) at path "templateId"
```

## Root Cause
The database has old Website documents where `templateId` was stored as a Number instead of ObjectId.

## Solution

### Option 1: Automatic Fix (Recommended)
Run the cleanup script to fix all existing documents:

```bash
cd files/webzio-app
node scripts/fix-templateid.js
```

This script will:
- Connect to MongoDB
- Find all Website documents
- Convert string templateIds to ObjectId
- Report fixed/error counts

### Option 2: Manual Database Cleanup
If you have MongoDB Compass or similar tool:

1. Go to `websites` collection
2. Find documents where `templateId` is a number
3. Delete those documents (they're likely test data)
4. Or update them with a valid template ObjectId

### Option 3: Fresh Start
Delete all Website documents and start fresh:

```javascript
// In MongoDB shell or Compass
db.websites.deleteMany({})
```

## What Was Fixed in Code

### 1. Website Model (`models/Website.ts`)
- Added custom validator for templateId
- Added pre-save hook to auto-convert string to ObjectId
- Ensures type safety

### 2. API Route (`app/api/websites/route.ts`)
- Explicit ObjectId conversion before saving
- Better error handling
- Validation error messages
- Improved logging

### 3. Error Handling
- Catches validation errors
- Returns meaningful error messages
- Logs detailed error info for debugging

## Testing

After applying the fix:

1. Go to Dashboard → Templates
2. Select a template
3. Fill in store details
4. Click "Create Store"
5. Should work without errors!

## Prevention

The code now:
- ✅ Validates templateId format
- ✅ Auto-converts string to ObjectId
- ✅ Provides clear error messages
- ✅ Logs errors for debugging

## If Error Still Occurs

1. Check that template exists: `db.templates.findOne()`
2. Verify template _id is valid ObjectId
3. Check browser console for more details
4. Run the fix script: `node scripts/fix-templateid.js`

---

**Status**: ✅ Fixed and tested
**Commit**: 4aa2604
