#!/usr/bin/env python3
"""Update hero section to use admin-uploaded images and fix padding"""

import re

# Read the file
with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the hero section
# Pattern to match the hero section
hero_pattern = r'(      {/\* ── HERO ── \*/}\s+<section style=\{\{ padding: )["\']60px 4% 80px["\']'
replacement = r'\g<1>\'80px 4% 80px\''

content = re.sub(hero_pattern, replacement, content)

# Replace image sources with conditional rendering
# Top left image
content = content.replace(
    'src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"',
    'src={heroBanner?.topLeftImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"}'
)

# Bottom left image
content = content.replace(
    'src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"',
    'src={heroBanner?.bottomLeftImage || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"}'
)

# Top right image
content = content.replace(
    'src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"',
    'src={heroBanner?.topRightImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"}'
)

# Bottom right image
content = content.replace(
    'src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"',
    'src={heroBanner?.bottomRightImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"}'
)

# Write back
with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Hero section updated successfully!")
print("  - Changed padding from 60px to 80px (fixed top spacing)")
print("  - Updated all 4 images to use heroBanner data")
print("  - Images will fallback to Unsplash if no admin images uploaded")
