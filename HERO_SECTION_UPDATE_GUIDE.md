# Hero Section Update Guide - Businesso Style

## Summary
The user wants the hero section to match the Businesso template style with template previews on left and right sides, while keeping the existing laptop live preview in the center.

## Current Hero Section
- Location: `files/webzio-app/app/page.tsx` lines 682-860
- Style: Two-column layout with content on left, laptop showcase on right
- Background: Gradient with animated particles
- Features: Tagline, heading with TypeWriter effect, feature pills, CTA buttons

## Desired Hero Section (Businesso Style)
- Layout: Three-column grid
  - Left: 2 template preview cards (Corporate Law Firms, Professional Business Guidance)
  - Center: Laptop showcase with live preview (KEEP EXISTING)
  - Right: 2 template preview cards (Perfect Agency, Making Difference Growth)
- Header: Centered "Build Your Dream Website With Businesso"
- Subtext: "We are elite author at envato, We help you to build your own booking website easy way"
- CTAs: "Build Your Website" (pink gradient) and "View Demo" (white with pink border)
- Background: Light pink gradient (#fef5f8 to #fff)
- Decorative: Soft pink blur circles instead of particles

## Template Preview Cards Design

### Left Column

1. **Corporate Law Firms Card**
   - Dark background (#1a1a2e)
   - Centered heading in white
   - Pink "Learn More" button
   - 5 service icons in grid below (📊 📈 📋 ⚖️ 📁)

2. **Professional Business Guidance Agency Card**
   - Horizontal layout
   - Dark circle placeholder on left
   - Title and progress bars on right
   - Pink "Learn More" button

### Right Column

3. **Perfect Agency Card**
   - Light pink gradient background
   - Business person emoji (👨‍💼)
   - "For Innovative Business" subtitle
   - 4 service icons grid below (🎯 💼 📊 🚀)

4. **Making Difference Growth Card**
   - Pink gradient header with white text
   - "Making Difference Growth Your Business With Modern Ideas"
   - White "Learn More" button
   - Small preview card below

## Implementation Steps

1. Replace the hero section background from multi-color gradient to pink gradient
2. Change layout from 2-column to 3-column grid
3. Move heading and CTAs to center top (above the grid)
4. Remove the tagline pill and feature pills
5. Remove animated particles, add soft blur circles
6. Add 4 template preview cards (2 left, 2 right)
7. Keep LaptopShowcase component in center column
8. Update button styles to pink theme
9. Adjust spacing and responsive behavior

## Key Changes

- **Heading**: "Turn your business into a stunning website" → "Build Your Dream Website With Businesso"
- **Subtext**: Professional website description → Envato author description
- **Colors**: Purple/blue theme → Pink theme (#ff6b9d, #ff8fab)
- **Layout**: Side-by-side → Centered header + 3-column grid
- **Features**: Remove feature pills, add template previews
- **Background**: Multi-gradient → Simple pink gradient

## Files to Modify

1. `files/webzio-app/app/page.tsx` - Main landing page
   - Lines 682-860: Complete hero section replacement

## Notes

- The LaptopShowcase component should remain unchanged
- All template preview cards should have hover effects (translateY and shadow)
- Maintain responsive design with media queries
- Keep the Reveal animation wrapper for fade-in effects
- Use inline styles to match existing code pattern

## Testing Checklist

- [ ] Hero section displays correctly on desktop
- [ ] Template cards have proper hover effects
- [ ] Laptop showcase still works in center
- [ ] CTAs link to correct pages
- [ ] Responsive design works on mobile
- [ ] Pink color theme is consistent
- [ ] No console errors or warnings
