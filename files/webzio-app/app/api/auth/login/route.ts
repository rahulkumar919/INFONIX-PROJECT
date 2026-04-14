import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

const MAX_LOGIN_ATTEMPTS = 3
const LOCK_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length })

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 })
    }

    // Always check database first
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60)
      return NextResponse.json({
        success: false,
        message: `Too many failed login attempts. Please try again in ${remainingTime} minute(s).`,
        locked: true,
        remainingTime
      }, { status: 429 })
    }

    // Reset lock if time has passed
    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.loginAttempts = 0
      user.lockUntil = undefined
      await user.save()
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        message: 'Please verify your email first. Check your inbox for the OTP.',
        needsVerification: true,
        email: user.email
      }, { status: 403 })
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      }, { status: 403 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1

      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME)
        await user.save()

        return NextResponse.json({
          success: false,
          message: `Too many failed login attempts. Your account has been locked for 5 minutes.`,
          locked: true,
          remainingTime: 5
        }, { status: 429 })
      }

      await user.save()

      const attemptsLeft = MAX_LOGIN_ATTEMPTS - user.loginAttempts
      return NextResponse.json({
        success: false,
        message: `Invalid credentials. ${attemptsLeft} attempt(s) remaining before account lock.`,
        attemptsLeft
      }, { status: 401 })
    }

    // Successful login - reset attempts
    user.loginAttempts = 0
    user.lockUntil = undefined
    user.lastLogin = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    await user.save()

    const token = generateToken({ id: user._id, email: user.email, role: user.role })

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    }, { status: 200 })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 })
  }
}
