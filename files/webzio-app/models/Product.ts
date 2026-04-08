import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  websiteId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  description: string
  price: number
  comparePrice?: number
  image: string
  images: string[]
  category: string
  badge?: string
  inStock: boolean
  featured: boolean
  slug: string
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>({
  websiteId:    { type: Schema.Types.ObjectId, ref: 'Website', required: true },
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:         { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  price:        { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: null },
  image:        { type: String, default: '' },
  images:       [{ type: String }],
  category:     { type: String, default: 'General' },
  badge:        { type: String, default: '' },
  inStock:      { type: Boolean, default: true },
  featured:     { type: Boolean, default: false },
  slug:         { type: String, required: true },
}, { timestamps: true })

ProductSchema.index({ websiteId: 1 })
ProductSchema.index({ userId: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
