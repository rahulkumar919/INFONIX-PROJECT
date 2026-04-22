import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length })

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Please provide email and password',
        debug: 'Missing credentials'
      }, { status: 400 })
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()
    console.log('🔍 Searching for user:', normalizedEmail)

    // Always check database first
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      console.log('❌ User not found:', normalizedEmail)
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
        debug: 'User not found. Please check your email address.'
      }, { status: 401 })
    }

    console.log('✅ User found:', { id: user._id, email: user.email, role: user.role })

    // Check if password exists (OAuth users might not have password)
    if (!user.password) {
      console.log('⚠️ User has no password (OAuth user)')
      return NextResponse.json({
        success: false,
        message: 'Please login with Google',
        debug: 'This account uses Google login'
      }, { status: 401 })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('🔐 Password match:', isMatch)

    if (!isMatch) {
      console.log('❌ Password mismatch')
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
        debug: 'Incorrect password. Please try again.'
      }, { status: 401 })
    }

    // Check email verification — skip for admin/superadmin
    if (!user.isVerified && user.role === 'user') {
      console.log('⚠️ Email not verified')
      return NextResponse.json({
        success: false,
        message: 'Please verify your email first.',
        needsVerification: true,
        email: user.email,
        debug: 'Email verification required'
      }, { status: 403 })
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('⚠️ Account is inactive')
      return NextResponse.json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        debug: 'Account inactive'
      }, { status: 403 })
    }

    // Update last login
    user.lastLogin = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    await user.save()

    // Generate token
    const token = generateToken({ id: user._id, email: user.email, role: user.role })
    console.log('✅ Login successful:', { id: user._id, email: user.email, role: user.role })
    console.log('🎫 Token generated:', token.substring(0, 20) + '...')

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    }, { status: 200 })

    // Set cookie with explicit settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax' as const
    }

    response.cookies.set('token', token, cookieOptions)
    console.log('🍪 Cookie set with options:', cookieOptions)

    return response
  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error. Please try again.',
      debug: error.message
    }, { status: 500 })
  }
}
