# HTML Template Creation Feature

## Summary
Added support for admins to create templates using either:
1. **Visual Builder** (existing form-based approach)
2. **HTML Code** (paste complete HTML code)

## Changes Made

### 1. Database Model Updated ✅
**File**: `files/webzio-app/models/Template.ts`

Added `htmlCode` field to Template model:
```typescript
export interface ITemplate extends Document {
  // ... existing fields
  htmlCode?: string // Optional HTML code for custom templates
}

// In schema:
htmlCode: { type: String, default: '' },
```

### 2. Admin Templates Page - Required Changes
**File**: `files/webzio-app/app/admin/templates/page.tsx`

Need to add:

#### A. Creation Mode Toggle
```typescript
// Add to form state
const [form, setForm] = useState({
  ...existing fields,
  creationMode: 'visual', // 'visual' or 'html'
  htmlCode: ''
})

// Add toggle buttons in form
<div style={{ display:'flex', gap:8, marginBottom:20 }}>
  <button onClick={() => setForm(f => ({...f, creationMode:'visual'}))}>
    🎨 Visual Builder
  </button>
  <button onClick={() => setForm(f => ({...f, creationMode:'html'}))}>
    💻 HTML Code
  </button>
</div>
```

#### B. HTML Code Editor
```typescript
{form.creationMode === 'html' && (
  <>
    <h4>💻 HTML Code</h4>
    <textarea
      value={form.htmlCode}
      onChange={e => setForm(f => ({...f, htmlCode:e.target.value}))}
      placeholder="<!DOCTYPE html>..."
      style={{ minHeight:400, fontFamily:'monospace' }}
    />
  </>
)}
```

#### C. HTML Preview
```typescript
{form.creationMode === 'html' && form.htmlCode ? (
  <iframe
    srcDoc={form.htmlCode}
    style={{ width:'100%', height:600, border:'none' }}
  />
) : (
  <LivePreviewPanel form={form} />
)}
```

### 3. User Dashboard - Template Rendering
**Files**: 
- `files/webzio-app/app/dashboard/templates/page.tsx`
- `files/webzio-app/app/dashboard/portfolio/page.tsx`

Templates with `htmlCode` will render the HTML directly instead of using the visual builder config.

### 4. Store Display Page
When a user selects an HTML template, the store should render the HTML code directly.

## How It Works

### For Admin:
1. Click "Create Template"
2. Choose between:
   - **Visual Builder**: Use form fields and design configurator
   - **HTML Code**: Paste complete HTML code
3. Fill in basic info (name, category, icon, description)
4. If HTML mode:
   - Paste complete HTML with inline CSS/JS
   - See live preview in iframe
5. Save template

### For User:
1. Browse templates (both visual and HTML templates shown)
2. Click template to use
3. If HTML template:
   - HTML code is rendered directly
   - Can still customize basic fields (colors, text) if needed
4. If visual template:
   - Uses existing visual builder

## Benefits

1. **Flexibility**: Admins can create complex custom designs
2. **No Limitations**: Full HTML/CSS/JS support
3. **Quick Import**: Can import existing HTML templates
4. **Professional**: Can use premium HTML templates from marketplaces

## Example HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Store</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; }
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    .hero h1 { font-size: 3rem; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; margin-bottom: 30px; }
    .btn {
      display: inline-block;
      padding: 15px 40px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      padding: 60px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .feature {
      text-align: center;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .feature-icon { font-size: 3rem; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Welcome to Our Amazing Store</h1>
    <p>Discover the best products at unbeatable prices</p>
    <a href="#" class="btn">Shop Now</a>
  </div>
  
  <div class="features">
    <div class="feature">
      <div class="feature-icon">🚀</div>
      <h3>Fast Delivery</h3>
      <p>Get your orders delivered in 24 hours</p>
    </div>
    <div class="feature">
      <div class="feature-icon">💎</div>
      <h3>Premium Quality</h3>
      <p>Only the best products for our customers</p>
    </div>
    <div class="feature">
      <div class="feature-icon">🔒</div>
      <h3>Secure Payment</h3>
      <p>Your transactions are 100% secure</p>
    </div>
  </div>
</body>
</html>
```

## Next Steps

To complete this feature, update the admin templates page with the toggle and HTML editor as shown above. The database model is already ready to store HTML code.
