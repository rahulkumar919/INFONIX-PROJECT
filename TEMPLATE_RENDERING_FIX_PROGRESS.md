# Template Rendering & Domain Management - IN PROGRESS

## Issues to Fix

### 1. ✅ Template Not Applied to Created Website
**Problem**: When user creates a store with a template, the website shows generic design instead of the selected template
**Solution**: 
- Changed `templateId` from Number to ObjectId in Website model
- Updated API to store template reference properly
- Modified store API to fetch and return template data
- Next: Update store page to render based on template

### 2. ✅ Domain Availability Check API
**Problem**: No real-time domain availability checking
**Solution**:
- Created `/api/websites/check-domain` endpoint
- Returns `{ available: true/false }` for given slug
- Next: Integrate with frontend form

### 3. ⏳ Separate Domain Name Field (IN PROGRESS)
**Problem**: Domain name auto-generates from store name
**Solution Needed**:
- Add separate "Domain Name" input field
- Implement real-time availability checking
- Show visual feedback (green/red border)
- Display toast messages for availability

### 4. ⏳ Template Rendering on Store Page (TODO)
**Problem**: Store page uses generic template
**Solution Needed**:
- Fetch template data with store
- Render HTML templates using iframe
- Render visual templates using VisualTemplatePreview component
- Apply template colors, fonts, and configuration

## Changes Made So Far

### API Changes

#### 1. Domain Check Endpoint (`app/api/websites/check-domain/route.ts`)
```typescript
// New endpoint to check domain availability
GET /api/websites/check-domain?slug=my-store
// Returns: { success: true, available: boolean, slug: string }
```

#### 2. Website Model (`models/Website.ts`)
```typescript
// Changed from:
templateId: { type: Number, required: true, min: 1 }

// To:
templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }
```

#### 3. Store API (`app/api/store/slug/[slug]/route.ts`)
```typescript
// Now fetches template data along with store
let template = null
if (website.templateId) {
  const Template = (await import('@/models/Template')).default
  template = await Template.findById(website.templateId).lean()
}

return NextResponse.json({
  success: true,
  store: website,
  template: template  // ← New: includes template data
})
```

#### 4. Websites API (`app/api/websites/route.ts`)
```typescript
// Simplified templateId handling
templateId: templateId, // Now accepts ObjectId string directly
```

## Next Steps

### Frontend Changes Needed

#### 1. Update Templates Page Form
- [ ] Add separate "Domain Name" field
- [ ] Remove auto-generation from store name
- [ ] Add real-time availability checking
- [ ] Show visual feedback (green/red borders)
- [ ] Display toast messages

#### 2. Update Store Display Page
- [ ] Fetch template data from API
- [ ] Check if template is HTML or Visual
- [ ] Render HTML templates in iframe
- [ ] Render Visual templates with VisualTemplatePreview
- [ ] Apply template configuration (colors, fonts, sections)

### Form Structure Needed

```typescript
// Store Creation Form
{
  siteName: string,        // Store Name (separate from domain)
  slug: string,            // Domain Name (user enters manually)
  templateId: string,      // Selected template ObjectId
  content: {
    heroTitle: string,
    heroSubtitle: string,
    // ... other content fields
  }
}
```

### Domain Availability UI

```typescript
// Real-time checking as user types
onChange={async (e) => {
  const slug = e.target.value
  const response = await fetch(`/api/websites/check-domain?slug=${slug}`)
  const data = await response.json()
  
  if (data.available) {
    // Show green border + "Available" message
    showToast('✅ Domain available!', 'success')
  } else {
    // Show red border + "Taken" message
    showToast('❌ Domain already taken', 'error')
  }
}}
```

## Template Rendering Logic

### For HTML Templates:
```typescript
if (template.htmlCode) {
  return (
    <iframe
      srcDoc={template.htmlCode}
      style={{ width: '100%', minHeight: '100vh', border: 'none' }}
      title={store.siteName}
    />
  )
}
```

### For Visual Templates:
```typescript
return (
  <VisualTemplatePreview 
    template={template}
    store={store}
    content={store.content}
  />
)
```

## Database Migration Note

⚠️ **Important**: Since we changed `templateId` from Number to ObjectId, existing stores in the database will have issues. You may need to:

1. **Option A**: Clear existing stores and start fresh
2. **Option B**: Run a migration script to convert Number IDs to Template ObjectIds
3. **Option C**: Handle both types in the code temporarily

## Testing Checklist

- [ ] Domain availability check works in real-time
- [ ] Domain taken shows error message
- [ ] Domain available shows success message
- [ ] Store creation uses correct templateId
- [ ] Store page fetches template data
- [ ] HTML templates render correctly
- [ ] Visual templates render correctly
- [ ] Template colors and fonts apply properly
- [ ] Email notification includes correct domain

## Files Modified

✅ `app/api/websites/check-domain/route.ts` - New file  
✅ `models/Website.ts` - Changed templateId type  
✅ `app/api/store/slug/[slug]/route.ts` - Added template fetching  
✅ `app/api/websites/route.ts` - Simplified templateId handling  
⏳ `app/dashboard/templates/page.tsx` - Needs domain field update  
⏳ `app/store/[slug]/page.tsx` - Needs template rendering  

## Current Status

**Completed**: Backend infrastructure for template rendering and domain checking  
**In Progress**: Frontend form updates and template rendering logic  
**Next**: Implement domain availability UI and template-based rendering