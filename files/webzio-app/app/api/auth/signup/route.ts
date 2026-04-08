import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken({ id: user._id, email: user.email })

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token
    }, { status: 201 })

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
