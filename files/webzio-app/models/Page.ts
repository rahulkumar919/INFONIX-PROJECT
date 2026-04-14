import mongoose, { Schema, Document } from 'mongoose'

export interface IPage extends Document {
    websiteId: mongoose.Types.ObjectId
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    isPublished: boolean
    order: number
    createdAt: Date
    updatedAt: Date
}

const PageSchema = new Schema<IPage>({
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, {
    timestamps: true
})

// Compound index for unique slug per website
PageSchema.index({ websiteId: 1, slug: 1 }, { unique: true })

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema)
