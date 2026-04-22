import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  isVerified: boolean
  isActive: boolean
  role: 'user' | 'admin' | 'superadmin'
  otp?: string
  otpExpiry?: Date
  otpResendCount?: number
  lastOtpResendAt?: Date
  oauthProvider?: string
  oauthId?: string
  lastLogin?: Date
  loginCount: number
  loginAttempts: number
  lockUntil?: Date
  plan: 'free' | 'pro' | 'business'
  createdAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false, minlength: 6, select: true },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
  otpResendCount: { type: Number, default: 0, select: false },
  lastOtpResendAt: { type: Date, select: false },
  oauthProvider: { type: String, default: '' },
  oauthId: { type: String, default: '' },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
  createdAt: { type: Date, default: Date.now },
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash if password is modified and exists
  if (!this.isModified('password')) return next()
  if (!this.password) return next()

  // Don't hash if password is already hashed (starts with $2a$ or $2b$)
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
