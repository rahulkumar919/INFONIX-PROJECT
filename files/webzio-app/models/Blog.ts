import mongoose, { Schema, Document } from 'mongoose'

export interface IBlog extends Document {
    title: string
    slug: string
    excerpt: string
    content: string
    featuredImage: string
    category: string
    tags: string[]
    author: string
    isPublished: boolean
    views: number
    // SEO Fields
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    ogImage: string
    canonicalUrl: string
    createdAt: Date
    updatedAt: Date
}

const BlogSchema = new Schema<IBlog>({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    // SEO Fields
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: [String], default: [] },
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
}, { timestamps: true })

// Create indexes for SEO
BlogSchema.index({ slug: 1 })
BlogSchema.index({ isPublished: 1, createdAt: -1 })
BlogSchema.index({ category: 1 })
BlogSchema.index({ tags: 1 })

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)
