import mongoose, { Schema, Document } from 'mongoose'

export interface IWebsite extends Document {
  userId: mongoose.Types.ObjectId
  siteName: string
  slug: string
  templateId: number
  content: {
    logo: string
    heroTitle: string
    heroSubtitle: string
    heroImage: string
    aboutTitle: string
    aboutText: string
    aboutImage: string
    contactPhone: string
    contactEmail: string
    contactAddress: string
    whatsappNumber: string
    footerDesc: string
    primaryColor: string
    seoTitle: string
    seoDescription: string
  }
  isActive: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

const WebsiteSchema = new Schema<IWebsite>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  siteName:   { type: String, required: true, trim: true },
  slug:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  templateId: { type: Number, required: true, min: 1, max: 5 },
  content: {
    logo:           { type: String, default: '' },
    heroTitle:      { type: String, default: 'Welcome to Our Store' },
    heroSubtitle:   { type: String, default: 'Discover our amazing collection' },
    heroImage:      { type: String, default: '' },
    aboutTitle:     { type: String, default: 'About Us' },
    aboutText:      { type: String, default: 'We are passionate about quality.' },
    aboutImage:     { type: String, default: '' },
    contactPhone:   { type: String, default: '' },
    contactEmail:   { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    footerDesc:     { type: String, default: 'Quality products delivered to you.' },
    primaryColor:   { type: String, default: '#6366f1' },
    seoTitle:       { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  isActive:  { type: Boolean, default: true },
  views:     { type: Number, default: 0 },
}, { timestamps: true })

WebsiteSchema.index({ userId: 1 })
WebsiteSchema.index({ slug: 1 })

export default mongoose.models.Website || mongoose.model<IWebsite>('Website', WebsiteSchema)
