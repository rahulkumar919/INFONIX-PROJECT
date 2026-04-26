import mongoose, { Schema, Document } from 'mongoose'

export interface IHeroBanner extends Document {
    topLeftImage: string
    bottomLeftImage: string
    topRightImage: string
    bottomRightImage: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const HeroBannerSchema = new Schema<IHeroBanner>({
    topLeftImage: { type: String, required: true },
    bottomLeftImage: { type: String, required: true },
    topRightImage: { type: String, required: true },
    bottomRightImage: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.HeroBanner || mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema)
