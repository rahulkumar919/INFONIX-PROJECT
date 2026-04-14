import mongoose, { Schema, Document } from 'mongoose'

export interface IGallery extends Document {
    websiteId: mongoose.Types.ObjectId
    imageUrl: string
    title?: string
    description?: string
    order: number
    createdAt: Date
}

const GallerySchema = new Schema<IGallery>({
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
}, {
    timestamps: true
})

GallerySchema.index({ websiteId: 1 })

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)
