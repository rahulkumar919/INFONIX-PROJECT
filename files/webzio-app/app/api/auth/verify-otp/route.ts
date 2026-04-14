import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email, otp } = await req.json()

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Please provide email and OTP' }, { status: 400 })
        }

        // Find user with OTP
        const user = await User.findOne({ email }).select('+otp +otpExpiry')

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: 'Email already verified. Please login.' }, { status: 400 })
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 })
        }

        // Check if OTP is expired
        if (user.otpExpiry && user.otpExpiry < new Date()) {
            return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new one.' }, { status: 400 })
        }

        // Verify user
        user.isVerified = true
        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()

        // Generate JWT token with role
        const token = generateToken({ id: user._id, email: user.email, role: user.role })

        const response = NextResponse.json({
            success: true,
            message: 'Email verified successfully! You can now login.',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        }, { status: 200 })

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        })

        return response

    } catch (error: any) {
        console.error('OTP verification error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
