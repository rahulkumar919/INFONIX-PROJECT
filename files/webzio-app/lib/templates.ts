export interface Template {
  id: number
  name: string
  category: string
  icon: string
  desc: string
  color: string        // gradient for card preview
  accentColor: string  // primary brand color
  tags: string[]
  popular: boolean
}

export const ALL_TEMPLATES: Template[] = [
  // ── FOOD & HOSPITALITY ──
  { id: 1, name: 'Restaurant Elite', category: 'Food & Dining', icon: '🍴', desc: 'Fine dining menu with categories, photos & WhatsApp reservations.', color: 'linear-gradient(135deg,#c2410c,#ea580c)', accentColor: '#c2410c', tags: ['Menu', 'WhatsApp', 'Booking'], popular: true },
  { id: 2, name: 'Cafe & Bakery', category: 'Food & Dining', icon: '☕', desc: 'Cozy cafe template with daily specials, gallery & order button.', color: 'linear-gradient(135deg,#92400e,#d97706)', accentColor: '#92400e', tags: ['Menu', 'Gallery', 'Orders'], popular: true },
  { id: 3, name: 'Fast Food & Takeaway', category: 'Food & Dining', icon: '🍔', desc: 'Bold, colorful menu for quick-service restaurants & cloud kitchens.', color: 'linear-gradient(135deg,#dc2626,#f97316)', accentColor: '#dc2626', tags: ['Menu', 'Delivery', 'Quick'], popular: false },
  { id: 4, name: 'Luxury Hotel', category: 'Hotels & Stays', icon: '🏨', desc: 'Premium hotel showcase with rooms, amenities & booking enquiry.', color: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', accentColor: '#1e3a8a', tags: ['Rooms', 'Booking', 'Luxury'], popular: true },
  { id: 5, name: 'Homestay & BnB', category: 'Hotels & Stays', icon: '🏡', desc: 'Warm, inviting template for homestays, guesthouses & BnBs.', color: 'linear-gradient(135deg,#065f46,#10b981)', accentColor: '#065f46', tags: ['Rooms', 'Cozy', 'Booking'], popular: false },

  // ── BUSINESS & PROFESSIONAL ──
  { id: 6, name: 'Startup Landing', category: 'Business', icon: '🚀', desc: 'Modern SaaS-style landing page with features, pricing & CTA.', color: 'linear-gradient(135deg,#4f46e5,#7c3aed)', accentColor: '#4f46e5', tags: ['SaaS', 'Pricing', 'CTA'], popular: true },
  { id: 7, name: 'Digital Agency', category: 'Business', icon: '💡', desc: 'Creative agency page with services, portfolio & contact form.', color: 'linear-gradient(135deg,#0f172a,#334155)', accentColor: '#6366f1', tags: ['Agency', 'Portfolio', 'Services'], popular: true },
  { id: 8, name: 'Freelancer Portfolio', category: 'Business', icon: '🧑‍💻', desc: 'Clean portfolio for freelancers with skills, projects & hire CTA.', color: 'linear-gradient(135deg,#0369a1,#0ea5e9)', accentColor: '#0369a1', tags: ['Portfolio', 'Skills', 'Hire'], popular: true },
  { id: 9, name: 'Consultant / Coach', category: 'Business', icon: '🎯', desc: 'Authority-building page for coaches with testimonials & booking.', color: 'linear-gradient(135deg,#7c3aed,#a855f7)', accentColor: '#7c3aed', tags: ['Coaching', 'Booking', 'Trust'], popular: false },
  { id: 10, name: 'Corporate Business', category: 'Business', icon: '🏢', desc: 'Professional corporate site with about, services & team section.', color: 'linear-gradient(135deg,#1e293b,#475569)', accentColor: '#1e293b', tags: ['Corporate', 'Team', 'Services'], popular: false },

  // ── E-COMMERCE ──
  { id: 11, name: 'Single Product Store', category: 'E-commerce', icon: '📦', desc: 'Laser-focused product page with features, reviews & buy button.', color: 'linear-gradient(135deg,#be185d,#ec4899)', accentColor: '#be185d', tags: ['Product', 'Reviews', 'Buy'], popular: true },
  { id: 12, name: 'Clothing Brand', category: 'E-commerce', icon: '👗', desc: 'Fashion-forward store with lookbook, collections & WhatsApp order.', color: 'linear-gradient(135deg,#111827,#374151)', accentColor: '#f59e0b', tags: ['Fashion', 'Lookbook', 'Shop'], popular: true },
  { id: 13, name: 'Gadget & Electronics', category: 'E-commerce', icon: '📱', desc: 'Tech product showcase with specs, comparison & enquiry form.', color: 'linear-gradient(135deg,#0f172a,#1e40af)', accentColor: '#3b82f6', tags: ['Tech', 'Specs', 'Enquiry'], popular: false },
  { id: 14, name: 'Handmade & Crafts', category: 'E-commerce', icon: '🎨', desc: 'Artisan shop with product gallery, story & WhatsApp ordering.', color: 'linear-gradient(135deg,#92400e,#f59e0b)', accentColor: '#d97706', tags: ['Crafts', 'Gallery', 'Story'], popular: false },
  { id: 15, name: 'Grocery & Kirana', category: 'E-commerce', icon: '🛒', desc: 'Local store catalog with categories, prices & WhatsApp delivery.', color: 'linear-gradient(135deg,#166534,#22c55e)', accentColor: '#16a34a', tags: ['Grocery', 'Delivery', 'Local'], popular: true },

  // ── PERSONAL BRANDING ──
  { id: 16, name: 'Developer Portfolio', category: 'Personal', icon: '👨‍💻', desc: 'Minimal dev portfolio with skills, GitHub projects & contact.', color: 'linear-gradient(135deg,#0f172a,#1e293b)', accentColor: '#22d3ee', tags: ['Dev', 'GitHub', 'Skills'], popular: true },
  { id: 17, name: 'Photographer Portfolio', category: 'Personal', icon: '📸', desc: 'Full-screen photo gallery with about, packages & booking.', color: 'linear-gradient(135deg,#1c1917,#44403c)', accentColor: '#f59e0b', tags: ['Photos', 'Gallery', 'Book'], popular: true },
  { id: 18, name: 'Resume / CV Website', category: 'Personal', icon: '📄', desc: 'Interactive resume with timeline, skills & download PDF button.', color: 'linear-gradient(135deg,#1e3a8a,#2563eb)', accentColor: '#2563eb', tags: ['Resume', 'Skills', 'PDF'], popular: false },
  { id: 19, name: 'Personal Blog', category: 'Personal', icon: '✍️', desc: 'Clean blog homepage with featured posts, categories & newsletter.', color: 'linear-gradient(135deg,#4f46e5,#818cf8)', accentColor: '#4f46e5', tags: ['Blog', 'Posts', 'Newsletter'], popular: false },
  { id: 20, name: 'Influencer / Creator', category: 'Personal', icon: '⭐', desc: 'Link-in-bio style page with social links, content & brand deals.', color: 'linear-gradient(135deg,#db2777,#f472b6)', accentColor: '#db2777', tags: ['Social', 'Links', 'Creator'], popular: true },

  // ── LOCAL BUSINESS ──
  { id: 21, name: 'Gym & Fitness Center', category: 'Local Business', icon: '💪', desc: 'High-energy gym page with classes, trainers, pricing & trial CTA.', color: 'linear-gradient(135deg,#dc2626,#b91c1c)', accentColor: '#dc2626', tags: ['Gym', 'Classes', 'Pricing'], popular: true },
  { id: 22, name: 'Salon & Spa', category: 'Local Business', icon: '💅', desc: 'Elegant salon page with services, gallery, pricing & appointment.', color: 'linear-gradient(135deg,#9d174d,#ec4899)', accentColor: '#9d174d', tags: ['Salon', 'Booking', 'Services'], popular: true },
  { id: 23, name: 'Medical Clinic', category: 'Local Business', icon: '🏥', desc: 'Trustworthy clinic page with doctors, services & appointment booking.', color: 'linear-gradient(135deg,#0369a1,#0284c7)', accentColor: '#0369a1', tags: ['Medical', 'Doctors', 'Book'], popular: true },
  { id: 24, name: 'Real Estate', category: 'Local Business', icon: '🏠', desc: 'Property listing page with photos, features, map & enquiry form.', color: 'linear-gradient(135deg,#065f46,#059669)', accentColor: '#059669', tags: ['Property', 'Listing', 'Enquiry'], popular: false },
  { id: 25, name: 'Pharmacy / Medical Shop', category: 'Local Business', icon: '💊', desc: 'Medicine shop catalog with categories, offers & WhatsApp order.', color: 'linear-gradient(135deg,#0f766e,#14b8a6)', accentColor: '#0f766e', tags: ['Pharmacy', 'Catalog', 'Order'], popular: true },
]

export const TEMPLATE_CATEGORIES: string[] = Array.from(new Set(ALL_TEMPLATES.map(t => t.category)))
