# Portfolio Feature - Complete Implementation Guide

## Overview
The Portfolio feature allows users to create professional portfolios with auto-generated HTML/CSS/JS code. Users can customize sections, colors, and content, then view, edit, and share their portfolios.

## Features Implemented

### 1. Portfolio Model (`models/Portfolio.ts`)
- **User Information**: Full name, email, phone, location, bio, profile image
- **Sections**: Hero, About, Skills, Experience, Education, Projects, Testimonials, Contact
- **Design Customization**: Color scheme, accent color, font, layout options
- **Code Generation**: Auto-generated HTML, CSS, and JavaScript
- **Metadata**: Slug for public sharing, view count, publish status

### 2. Portfolio Generator (`lib/portfolioGenerator.ts`)
Generates complete, production-ready code:
- **HTML**: Semantic structure with all sections
- **CSS**: Responsive design, animations, dark mode support
- **JavaScript**: Smooth scrolling, navbar effects, interactivity

### 3. API Routes

#### `/api/portfolios` (GET, POST)
- **GET**: Fetch all user portfolios
- **POST**: Create new portfolio with auto-generated code

#### `/api/portfolios/[id]` (GET, PUT, DELETE)
- **GET**: Fetch specific portfolio
- **PUT**: Update portfolio
- **DELETE**: Delete portfolio

#### `/api/portfolios/slug/[slug]` (GET)
- Fetch public portfolio by slug
- Increment view counter

### 4. Dashboard Pages

#### `/dashboard/portfolios`
- List all user portfolios in card format
- Quick actions: Edit, View, Delete
- Create new portfolio button
- Shows skills preview

#### `/dashboard/portfolios/create`
- Comprehensive form for portfolio creation
- Sections: Basic Info, About, Skills, Experience, Education, Projects, Contact
- Design customization (colors, fonts)
- Toggle sections on/off
- Add/remove items dynamically

#### `/dashboard/portfolios/[id]`
- View portfolio with tabs: Preview, HTML, CSS, JS
- Copy code to clipboard
- Live preview in iframe
- Edit capabilities

### 5. Public Portfolio Page

#### `/portfolio/[slug]`
- Public view of portfolio
- Responsive iframe display
- View counter tracking
- Shareable URL

## File Structure

```
app/
├── api/
│   └── portfolios/
│       ├── route.ts (GET, POST)
│       ├── [id]/
│       │   └── route.ts (GET, PUT, DELETE)
│       └── slug/
│           └── [slug]/
│               └── route.ts (GET)
├── dashboard/
│   └── portfolios/
│       ├── page.tsx (List)
│       ├── create/
│       │   └── page.tsx (Create form)
│       └── [id]/
│           └── page.tsx (Detail/Edit)
└── portfolio/
    └── [slug]/
        └── page.tsx (Public view)

models/
└── Portfolio.ts

lib/
└── portfolioGenerator.ts
```

## Usage Guide

### For Users

#### Creating a Portfolio
1. Go to Dashboard → Portfolios
2. Click "Create Portfolio"
3. Fill in basic information (name, email, bio, etc.)
4. Add skills, experience, projects, education
5. Customize colors and design
6. Click "Create Portfolio"

#### Viewing Portfolio
1. From dashboard, click "View" on any portfolio
2. See live preview in browser
3. Switch between Preview, HTML, CSS, JS tabs
4. Copy code to use elsewhere

#### Sharing Portfolio
1. Portfolio gets unique slug (e.g., john-doe-1234567890)
2. Share URL: `yoursite.com/portfolio/john-doe-1234567890`
3. Public can view without login
4. View count tracked automatically

### For Developers

#### Adding New Sections
1. Update Portfolio model in `models/Portfolio.ts`
2. Add section to `generatePortfolioHTML()` in `lib/portfolioGenerator.ts`
3. Add form fields in `/dashboard/portfolios/create/page.tsx`
4. Update CSS in generator for styling

#### Customizing Generated Code
Edit `lib/portfolioGenerator.ts`:
- Modify HTML structure in `htmlCode` template
- Update CSS in `cssCode` template
- Add JavaScript in `jsCode` template

#### Styling Customization
The generator uses CSS variables for theming:
```css
:root {
  --primary-color: #4f46e5;
  --accent-color: #FF6B7A;
  --text-color: #1a1a1a;
}
```

## Database Schema

```typescript
Portfolio {
  userId: ObjectId (ref: User)
  title: String
  category: String
  description: String
  
  // Basic Info
  fullName: String
  email: String
  phone: String
  location: String
  bio: String
  profileImage: String
  
  // Sections (each with enabled flag)
  sections: {
    hero: { enabled, title, subtitle, backgroundImage }
    about: { enabled, content, image }
    skills: { enabled, items: [{ name, level }] }
    experience: { enabled, items: [{ title, company, duration, description }] }
    education: { enabled, items: [{ degree, school, year, details }] }
    projects: { enabled, items: [{ name, description, image, link, technologies }] }
    testimonials: { enabled, items: [{ name, role, text, image }] }
    contact: { enabled, email, phone, social: { linkedin, github, twitter, instagram } }
  }
  
  // Design
  design: {
    colorScheme: String
    accentColor: String
    font: String
    layout: String
  }
  
  // Generated Code
  htmlCode: String
  cssCode: String
  jsCode: String
  
  // Metadata
  slug: String (unique)
  isPublished: Boolean
  viewCount: Number
  createdAt: Date
  updatedAt: Date
}
```

## Features

✅ **Form-based Creation**: Easy-to-use form with multiple sections
✅ **Auto Code Generation**: HTML, CSS, JS generated automatically
✅ **Responsive Design**: Works on all devices
✅ **Color Customization**: Choose primary and accent colors
✅ **Multiple Sections**: Hero, About, Skills, Experience, Projects, etc.
✅ **Code Preview**: View and copy generated code
✅ **Public Sharing**: Unique slug for sharing
✅ **View Tracking**: Track portfolio views
✅ **Dashboard Display**: Beautiful card-based interface
✅ **Edit/Delete**: Full CRUD operations
✅ **Professional Styling**: Modern, clean design

## Future Enhancements

- [ ] Portfolio templates
- [ ] Drag-and-drop section ordering
- [ ] Image upload for projects
- [ ] Analytics dashboard
- [ ] Export as PDF
- [ ] Custom domain support
- [ ] SEO optimization
- [ ] Social media integration
- [ ] Testimonials section
- [ ] Blog integration

## API Examples

### Create Portfolio
```bash
POST /api/portfolios
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "bio": "Full Stack Developer",
  "sections": {
    "skills": {
      "enabled": true,
      "items": [
        { "name": "React", "level": "Expert" },
        { "name": "Node.js", "level": "Advanced" }
      ]
    }
  },
  "design": {
    "colorScheme": "#4f46e5",
    "accentColor": "#FF6B7A"
  }
}
```

### Get Portfolio
```bash
GET /api/portfolios/[id]
Authorization: Bearer [token]
```

### Update Portfolio
```bash
PUT /api/portfolios/[id]
Authorization: Bearer [token]
Content-Type: application/json

{
  "bio": "Updated bio"
}
```

### Delete Portfolio
```bash
DELETE /api/portfolios/[id]
Authorization: Bearer [token]
```

### Get Public Portfolio
```bash
GET /api/portfolios/slug/john-doe-1234567890
```

## Troubleshooting

### Portfolio not showing in dashboard
- Check if user is logged in
- Verify portfolio is associated with correct user ID
- Check database connection

### Code not generating
- Ensure all required fields are filled
- Check `portfolioGenerator.ts` for errors
- Verify template syntax

### Public portfolio not accessible
- Check if portfolio is published
- Verify slug is correct
- Check URL format

## Support

For issues or questions, contact the development team or check the documentation.
