import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { requireAuth } from '../../../../lib/middleware'

export async function PATCH(req: NextRequest) {
    try {
        const { error, user } = requireAuth(req)
        if (error) return error

        await dbConnect()
        const body = await req.json()

        if (body.email && body.email !== user.email) {
            const existingUser = await User.findOne({ email: body.email.toLowerCase() })
            if (existingUser) {
                return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 })
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $set: { name: body.name, email: body.email?.toLowerCase() } },
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
