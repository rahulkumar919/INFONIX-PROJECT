import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email, otp, newPassword } = await req.json()

        console.log('🔐 Reset password request for:', email)

        if (!email || !otp || !newPassword) {
            return NextResponse.json({
                success: false,
                message: 'Please provide email, OTP, and new password'
            }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({
                success: false,
                message: 'Password must be at least 6 characters'
            }, { status: 400 })
        }

        // Find user with OTP
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select('+otp +otpExpiry')

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid email or OTP'
            }, { status: 401 })
        }

        // Check if OTP exists
        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json({
                success: false,
                message: 'No OTP found. Please request a new one.'
            }, { status: 401 })
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            console.log('❌ OTP expired')
            return NextResponse.json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            }, { status: 401 })
        }

        // Verify OTP
        if (user.otp !== otp) {
            console.log('❌ Invalid OTP')
            return NextResponse.json({
                success: false,
                message: 'Invalid OTP. Please check and try again.'
            }, { status: 401 })
        }

        console.log('✅ OTP verified successfully')

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update password and clear OTP (using updateOne to avoid pre-save hook issues)
        await User.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { otp: 1, otpExpiry: 1 }
            }
        )

        console.log('✅ Password reset successful for:', user.email)

        return NextResponse.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        }, { status: 200 })

    } catch (error: any) {
        console.error('❌ Reset password error:', error)
        return NextResponse.json({
            success: false,
            message: 'Server error. Please try again.'
        }, { status: 500 })
    }
}
