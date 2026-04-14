import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateOTP, sendOTPEmail } from '../../../../lib/email'

export async function POST(req: Request) {
  try {
    console.log('📝 Signup request received')
    await dbConnect()
    console.log('✅ Database connected')

    const { name, email, password } = await req.json()
    console.log('📧 Signup data:', { name, email, passwordLength: password?.length })

    if (!name || !email || !password) {
      console.log('❌ Missing fields')
      return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 })
    }

    // Check if user already exists
    console.log('🔍 Checking existing user...')
    const existingUser = await User.findOne({ email })
    console.log('👤 Existing user:', existingUser ? 'Found' : 'Not found')

    if (existingUser && existingUser.isVerified) {
      console.log('❌ User already verified')
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }

    // Generate OTP
    console.log('🔢 Generating OTP...')
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    console.log('✅ OTP generated:', otp)

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      console.log('🔄 Updating existing unverified user...')
      existingUser.name = name
      existingUser.password = password
      existingUser.otp = otp
      existingUser.otpExpiry = otpExpiry
      await existingUser.save()
      console.log('✅ User updated')
    } else {
      // Create new user (unverified)
      console.log('➕ Creating new user...')
      await User.create({
        name,
        email,
        password,
        isVerified: false,
        otp,
        otpExpiry
      })
      console.log('✅ User created')
    }

    // Send OTP email
    console.log('📧 Sending OTP email...')
    try {
      await sendOTPEmail(email, otp, name)
      console.log('✅ OTP email sent successfully')
    } catch (emailError: any) {
      console.error('⚠️ Email sending failed:', emailError.message)
      // Continue anyway - user can still use OTP if they have it
      console.log('⚠️ Continuing without email (OTP:', otp, ')')
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email,
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ Signup error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ success: false, message: error.message || 'Signup failed' }, { status: 500 })
  }
}
