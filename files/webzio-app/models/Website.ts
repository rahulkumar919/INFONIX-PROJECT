import mongoose, { Schema, Document } from 'mongoose'

export interface IPage {
  title: string
  slug: string
  content: string
  isPublished: boolean
}

export interface IWebsite extends Document {
  userId: mongoose.Types.ObjectId
  siteName: string
  slug: string
  templateId: mongoose.Types.ObjectId
  templateCategory: string
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
    buttonText: string
    footerDesc: string
    primaryColor: string
    seoTitle: string
    seoDescription: string
    favicon: string
    socialLinks: {
      facebook?: string
      instagram?: string
      twitter?: string
      youtube?: string
      linkedin?: string
    }
  }
  gallery: string[]
  pages: IPage[]
  isActive: boolean
  isEnabled: boolean
  isPublished: boolean
  views: number
  leads: number
  orders: number
  createdAt: Date
  updatedAt: Date
}

const PageSchema = new Schema<IPage>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
})

const WebsiteSchema = new Schema<IWebsite>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  siteName: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
    // Custom validator to ensure it's a valid ObjectId
    validate: {
      validator: function (v: any) {
        return mongoose.Types.ObjectId.isValid(v)
      },
      message: 'Invalid template ID format'
    }
  },
  templateCategory: { type: String, default: '' },
  content: {
    logo: { type: String, default: '' },
    heroTitle: { type: String, default: 'Welcome to Our Store' },
    heroSubtitle: { type: String, default: 'Discover our amazing collection' },
    heroImage: { type: String, default: '' },
    aboutTitle: { type: String, default: 'About Us' },
    aboutText: { type: String, default: 'We are passionate about quality.' },
    aboutImage: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    buttonText: { type: String, default: 'Get Started' },
    footerDesc: { type: String, default: 'Quality products delivered to you.' },
    primaryColor: { type: String, default: '#6366f1' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    favicon: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  gallery: { type: [String], default: [] },
  pages: { type: [PageSchema], default: [] },
  isActive: { type: Boolean, default: true },
  isEnabled: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
}, { timestamps: true })

WebsiteSchema.index({ userId: 1 })
WebsiteSchema.index({ slug: 1 })

// Pre-save hook to ensure templateId is ObjectId
WebsiteSchema.pre('save', function (next) {
  if (this.templateId && typeof this.templateId === 'string') {
    try {
      this.templateId = new mongoose.Types.ObjectId(this.templateId as any)
    } catch (err) {
      return next(new Error('Invalid template ID'))
    }
  }
  next()
})

export default mongoose.models.Website || mongoose.model<IWebsite>('Website', WebsiteSchema)
