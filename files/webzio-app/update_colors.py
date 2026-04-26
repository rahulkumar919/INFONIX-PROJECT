#!/usr/bin/env python3
"""Update landing page colors to Blush Pink (#FDF1F1)"""

import re

# Read the file
with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the blush pink color
BLUSH_PINK = '#FDF1F1'

# List of background colors to replace with blush pink
replacements = [
    # Hero section
    (r"<section style=\{\{ padding: '80px 4% 80px', background: '#fff'", 
     f"<section style={{{{ padding: '80px 4% 80px', background: '{BLUSH_PINK}'"),
    
    # CTA Banner after hero
    (r"<section style=\{\{ padding: '20px 6%', background: '#f8f7ff'",
     f"<section style={{{{ padding: '20px 6%', background: '{BLUSH_PINK}'"),
    
    # Stats section
    (r"<div ref=\{statsRef\} style=\{\{ background: 'linear-gradient\(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%\)'",
     f"<div ref={{statsRef}} style={{{{ background: '{BLUSH_PINK}'"),
    
    # Templates section
    (r"<section id=\"templates\" style=\{\{ padding: '88px 0', background: '#fafafa'",
     f"<section id=\"templates\" style={{{{ padding: '88px 0', background: '{BLUSH_PINK}'"),
    
    # How it works section
    (r"<section style=\{\{ padding: '88px 6%', background: '#fff5f5'",
     f"<section style={{{{ padding: '88px 6%', background: '{BLUSH_PINK}'"),
    
    # Testimonials section
    (r"<section style=\{\{ padding: '88px 0', background: '#f8f7ff'",
     f"<section style={{{{ padding: '88px 0', background: '{BLUSH_PINK}'"),
    
    # CTA Banner 1
    (r"<section style=\{\{ padding: '28px 6%', background: '#fff' \}\}>",
     f"<section style={{{{ padding: '28px 6%', background: '{BLUSH_PINK}' }}>"),
    
    # CTA Banner 2
    (r"<section style=\{\{ padding: '28px 6% 56px', background: '#fff'",
     f"<section style={{{{ padding: '28px 6% 56px', background: '{BLUSH_PINK}'"),
    
    # Pricing section
    (r"<section id=\"pricing\" style=\{\{ padding: '88px 6%', background: '#fff'",
     f"<section id=\"pricing\" style={{{{ padding: '88px 6%', background: '{BLUSH_PINK}'"),
    
    # FAQ section
    (r"<section id=\"faq\" style=\{\{ padding: '88px 6%', background: '#fafafa'",
     f"<section id=\"faq\" style={{{{ padding: '88px 6%', background: '{BLUSH_PINK}'"),
    
    # Blog section
    (r"<section style=\{\{ padding: '88px 6%', background: '#fff' \}\}>",
     f"<section style={{{{ padding: '88px 6%', background: '{BLUSH_PINK}' }}>"),
]

# Apply replacements
for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Also update the CTA gradient section to use a softer pink gradient
content = re.sub(
    r"background: 'linear-gradient\(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 70%,#1e1b4b 100%\)'",
    f"background: 'linear-gradient(135deg,#FDF1F1 0%,#FFE5E5 50%,#FDF1F1 100%)'",
    content
)

# Write back
with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Landing page colors updated to Blush Pink (#FDF1F1)")
print("  - Hero section")
print("  - CTA banners")
print("  - Stats section")
print("  - Templates section")
print("  - How it works section")
print("  - Testimonials section")
print("  - Pricing section")
print("  - FAQ section")
print("  - Blog section")
print("  - Final CTA section (soft pink gradient)")
