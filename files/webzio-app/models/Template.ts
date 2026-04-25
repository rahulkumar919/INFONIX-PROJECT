import mongoose, { Schema, Document } from 'mongoose'

export interface ITemplate extends Document {
  name: string
  category: string
  icon: string
  desc: string
  color: string
  accentColor: string
  tags: string[]
  popular: boolean
  isActive: boolean
  previewImage: string
  files: string[]
  usageCount: number
  templateType: 'general' | 'portfolio'
  htmlCode?: string // Optional HTML code for custom templates
  // Full design config
  config: {
    // Typography
    headingFont: string
    bodyFont: string
    baseFontSize: number
    // Navbar
    navbarStyle: 'sticky' | 'transparent' | 'minimal'
    showNavCTA: boolean
    navCTAText: string
    // Colors
    primaryColor: string
    secondaryColor: string
    bgLight: string
    bgDark: string
    cardBg: string
    textColor: string
    // Sections
    sections: {
      hero: boolean
      features: boolean
      services: boolean
      testimonials: boolean
      gallery: boolean
      faq: boolean
      contactForm: boolean
      footer: boolean
    }
    // Footer
    footerColumns: number
    footerCopyright: string
    socialLinks: {
      facebook: string
      instagram: string
      twitter: string
      youtube: string
      linkedin: string
    }
    // Branding
    logoUrl: string
    faviconUrl: string
    // Hero
    heroLayout: 'centered' | 'split' | 'fullscreen'
    heroTitle: string
    heroSubtitle: string
    heroBgImage: string
    heroCTAText: string
  }
  createdAt: Date
  updatedAt: Date
}

const TemplateSchema = new Schema<ITemplate>({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  icon: { type: String, default: '🌐' },
  desc: { type: String, default: '' },
  color: { type: String, default: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
  accentColor: { type: String, default: '#3B82F6' },
  tags: { type: [String], default: [] },
  popular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  previewImage: { type: String, default: '' },
  files: { type: [String], default: [] },
  usageCount: { type: Number, default: 0 },
  templateType: { type: String, enum: ['general', 'portfolio'], default: 'general' },
  htmlCode: { type: String, default: '' },
  config: {
    // Typography
    headingFont: { type: String, default: 'Playfair Display' },
    bodyFont: { type: String, default: 'Inter' },
    baseFontSize: { type: Number, default: 16 },
    // Navbar
    navbarStyle: { type: String, enum: ['sticky', 'transparent', 'minimal'], default: 'sticky' },
    showNavCTA: { type: Boolean, default: true },
    navCTAText: { type: String, default: 'Get Started' },
    // Colors
    primaryColor: { type: String, default: '#4F46E5' },
    secondaryColor: { type: String, default: '#7C3AED' },
    bgLight: { type: String, default: '#FFFFFF' },
    bgDark: { type: String, default: '#0F172A' },
    cardBg: { type: String, default: '#F8FAFF' },
    textColor: { type: String, default: '#111827' },
    // Sections
    sections: {
      hero: { type: Boolean, default: true },
      features: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      gallery: { type: Boolean, default: false },
      faq: { type: Boolean, default: true },
      contactForm: { type: Boolean, default: true },
      footer: { type: Boolean, default: true },
    },
    // Footer
    footerColumns: { type: Number, default: 3, min: 1, max: 4 },
    footerCopyright: { type: String, default: '© 2026 All rights reserved.' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    // Branding
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    // Hero
    heroLayout: { type: String, enum: ['centered', 'split', 'fullscreen'], default: 'centered' },
    heroTitle: { type: String, default: 'Welcome to Our Store' },
    heroSubtitle: { type: String, default: 'Discover amazing products and services.' },
    heroBgImage: { type: String, default: '' },
    heroCTAText: { type: String, default: 'Explore Now' },
  },
}, { timestamps: true })

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema)
