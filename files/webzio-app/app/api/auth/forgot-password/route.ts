import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { sendEmail } from '../../../../lib/email'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email } = await req.json()

    console.log('🔐 Forgot password request for:', email)

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Please provide email address'
      }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      // Don't reveal if user exists or not (security)
      return NextResponse.json({
        success: true,
        message: 'If the email exists, an OTP has been sent'
      }, { status: 200 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000) // 3 minutes

    // Update user with OTP (using updateOne to avoid password re-hashing)
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          otp: otp,
          otpExpiry: otpExpiry
        }
      }
    )

    console.log('✅ OTP generated:', otp, 'Expires:', otpExpiry)

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 10px;">
            <div style="background: white; padding: 30px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">🔑</div>
                <h1 style="color: #111; margin: 0; font-size: 24px;">Password Reset Request</h1>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hello <strong>${user.name}</strong>,
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Use the OTP code below to reset your password:
              </p>
              
              <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                <div style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                This OTP will expire in <strong>3 minutes</strong>.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2026 Webzio. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      })

      console.log('✅ Password reset email sent to:', user.email)

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email'
      }, { status: 200 })

    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      return NextResponse.json({
        success: false,
        message: 'Failed to send email. Please try again.'
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ Forgot password error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error. Please try again.'
    }, { status: 500 })
  }
}
