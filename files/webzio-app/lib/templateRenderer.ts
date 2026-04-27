/**
 * Template Renderer - Replaces placeholders in template HTML with user data
 * Also fixes navigation links to work as hash anchors
 */

export interface StoreData {
    siteName: string
    slug: string
    content: {
        logo?: string
        heroTitle?: string
        heroSubtitle?: string
        heroImage?: string
        aboutTitle?: string
        aboutText?: string
        aboutImage?: string
        contactPhone?: string
        contactEmail?: string
        contactAddress?: string
        whatsappNumber?: string
        footerDesc?: string
        primaryColor?: string
        secondaryColor?: string
        buttonText?: string
        socialLinks?: {
            facebook?: string
            instagram?: string
            twitter?: string
            youtube?: string
            linkedin?: string
        }
    }
}

/**
 * Fixes navigation links in HTML to work as hash anchors
 */
function fixNavigationLinks(html: string): string {
    // Replace all href="/about", href="/gallery", href="/contact" etc with hash anchors
    html = html.replace(/href=["']\/about["']/gi, 'href="#about"')
    html = html.replace(/href=["']\/gallery["']/gi, 'href="#gallery"')
    html = html.replace(/href=["']\/contact["']/gi, 'href="#contact"')
    html = html.replace(/href=["']\/services["']/gi, 'href="#services"')
    html = html.replace(/href=["']\/team["']/gi, 'href="#team"')
    html = html.replace(/href=["']\/products["']/gi, 'href="#products"')
    html = html.replace(/href=["']\/pricing["']/gi, 'href="#pricing"')
    html = html.replace(/href=["']\/testimonials["']/gi, 'href="#testimonials"')
    html = html.replace(/href=["']\/faq["']/gi, 'href="#faq"')
    html = html.replace(/href=["']\/menu["']/gi, 'href="#menu"')

    // Also fix any links that might be using relative paths without slash
    html = html.replace(/href=["']about["']/gi, 'href="#about"')
    html = html.replace(/href=["']gallery["']/gi, 'href="#gallery"')
    html = html.replace(/href=["']contact["']/gi, 'href="#contact"')
    html = html.replace(/href=["']services["']/gi, 'href="#services"')
    html = html.replace(/href=["']team["']/gi, 'href="#team"')
    html = html.replace(/href=["']products["']/gi, 'href="#products"')
    html = html.replace(/href=["']menu["']/gi, 'href="#menu"')

    return html
}

/**
 * Adds smooth scroll behavior to the page
 */
function addSmoothScrollScript(): string {
    return `
    <script>
      // Smooth scroll for anchor links
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '#!') {
              e.preventDefault();
              const target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }
          });
        });
      });
    </script>
  `
}

/**
 * Renders template HTML with user's store data
 */
export function renderTemplate(templateHtml: string, store: StoreData): string {
    let rendered = templateHtml

    // Fix navigation links first - CRITICAL for preventing 404 errors
    rendered = fixNavigationLinks(rendered)

    // Replace site name
    rendered = rendered.replace(/{{siteName}}/g, store.siteName || 'My Store')
    rendered = rendered.replace(/{{storeName}}/g, store.siteName || 'My Store')

    // Replace logo
    if (store.content?.logo) {
        // Replace logo placeholder with actual logo image
        rendered = rendered.replace(
            /{{logo}}/g,
            `<img src="${store.content.logo}" alt="${store.siteName}" style="height: 40px; object-fit: contain;" />`
        )
        // Replace logo text with logo image in header
        rendered = rendered.replace(
            /<div class="logo">.*?<\/div>/g,
            `<div class="logo"><img src="${store.content.logo}" alt="${store.siteName}" style="height: 40px; object-fit: contain;" /></div>`
        )
    } else {
        rendered = rendered.replace(/{{logo}}/g, store.siteName || 'My Store')
    }

    // Replace hero section
    rendered = rendered.replace(/{{heroTitle}}/g, store.content?.heroTitle || `Welcome to ${store.siteName}`)
    rendered = rendered.replace(/{{heroSubtitle}}/g, store.content?.heroSubtitle || 'Discover our amazing collection')

    // Replace hero title in h1 tags
    rendered = rendered.replace(
        /<h1>(.*?)<\/h1>/g,
        `<h1>${store.content?.heroTitle || store.siteName}</h1>`
    )

    // Replace hero subtitle in hero section
    rendered = rendered.replace(
        /<div class="hero-content">[\s\S]*?<p>(.*?)<\/p>/,
        `<div class="hero-content">\n            <h1>${store.content?.heroTitle || store.siteName}</h1>\n            <p>${store.content?.heroSubtitle || 'Discover our amazing collection'}</p>`
    )

    // Replace about section
    rendered = rendered.replace(/{{aboutTitle}}/g, store.content?.aboutTitle || 'About Us')
    rendered = rendered.replace(/{{aboutText}}/g, store.content?.aboutText || 'We are passionate about quality.')

    // Replace about text in about section
    if (store.content?.aboutText) {
        rendered = rendered.replace(
            /<div class="about-text">[\s\S]*?<\/div>/,
            `<div class="about-text">
                <h2>${store.content?.aboutTitle || 'About Us'}</h2>
                <p>${store.content.aboutText}</p>
            </div>`
        )
    }

    // Replace contact information
    rendered = rendered.replace(/{{contactPhone}}/g, store.content?.contactPhone || '+1 (555) 123-4567')
    rendered = rendered.replace(/{{contactEmail}}/g, store.content?.contactEmail || 'info@store.com')
    rendered = rendered.replace(/{{contactAddress}}/g, store.content?.contactAddress || '123 Business Street, City')
    rendered = rendered.replace(/{{whatsappNumber}}/g, store.content?.whatsappNumber || '')

    // Replace contact section with actual data
    rendered = rendered.replace(
        /<div class="contact-item">[\s\S]*?<h4>📞 Phone<\/h4>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/div>/,
        `<div class="contact-item">
                    <h4>📞 Phone</h4>
                    <p>${store.content?.contactPhone || '+1 (555) 123-4567'}</p>
                </div>`
    )

    rendered = rendered.replace(
        /<div class="contact-item">[\s\S]*?<h4>📧 Email<\/h4>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/div>/,
        `<div class="contact-item">
                    <h4>📧 Email</h4>
                    <p>${store.content?.contactEmail || 'info@store.com'}</p>
                </div>`
    )

    rendered = rendered.replace(
        /<div class="contact-item">[\s\S]*?<h4>📍 Address<\/h4>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/div>/,
        `<div class="contact-item">
                    <h4>📍 Address</h4>
                    <p>${store.content?.contactAddress || '123 Business Street, City'}</p>
                </div>`
    )

    // Replace footer
    rendered = rendered.replace(/{{footerDesc}}/g, store.content?.footerDesc || `© 2026 ${store.siteName}. All rights reserved.`)
    rendered = rendered.replace(
        /<footer>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/footer>/,
        `<footer>
        <p>${store.content?.footerDesc || `© 2026 ${store.siteName}. All rights reserved.`}</p>
    </footer>`
    )

    // Replace colors
    if (store.content?.primaryColor) {
        // Replace gradient colors in CSS
        rendered = rendered.replace(
            /linear-gradient\(135deg, #[0-9a-fA-F]{6} 0%, #[0-9a-fA-F]{6} 100%\)/g,
            `linear-gradient(135deg, ${store.content.primaryColor} 0%, ${store.content.primaryColor}dd 100%)`
        )
    }

    // Replace button text
    if (store.content?.buttonText) {
        rendered = rendered.replace(
            /<button class="cta-button">(.*?)<\/button>/g,
            `<button class="cta-button">${store.content.buttonText}</button>`
        )
    }

    // Add WhatsApp button if number provided
    if (store.content?.whatsappNumber) {
        const whatsappButton = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
      <a href="https://wa.me/${store.content.whatsappNumber}" 
         target="_blank" 
         rel="noopener noreferrer"
         style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: #25D366; border-radius: 50%; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4); text-decoration: none; font-size: 30px;">
        💬
      </a>
    </div>`

        rendered = rendered.replace('</body>', `${whatsappButton}</body>`)
    }

    // Add smooth scroll script before closing body tag
    rendered = rendered.replace('</body>', `${addSmoothScrollScript()}</body>`)

    // Replace page title
    rendered = rendered.replace(/<title>.*?<\/title>/, `<title>${store.siteName}</title>`)

    return rendered
}

/**
 * Injects user data into template HTML for preview
 */
export function injectUserData(templateHtml: string, userData: Partial<StoreData>): string {
    return renderTemplate(templateHtml, {
        siteName: userData.siteName || 'My Store',
        slug: userData.slug || 'my-store',
        content: userData.content || {}
    })
}
