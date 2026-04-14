import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { requireAuth } from '../../../../lib/middleware'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
    try {
        const { error, user } = requireAuth(req)
        if (error) return error

        await dbConnect()
        const body = await req.json()

        if (!body.currentPassword || !body.newPassword) {
            return NextResponse.json({ success: false, error: 'Current and new password required' }, { status: 400 })
        }

        if (body.newPassword.length < 6) {
            return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const dbUser = await User.findById(user.id)
        if (!dbUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        const isMatch = await bcrypt.compare(body.currentPassword, dbUser.password)
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(body.newPassword, 10)
        await User.findByIdAndUpdate(user.id, { password: hashedPassword })

        return NextResponse.json({ success: true, message: 'Password changed successfully' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
