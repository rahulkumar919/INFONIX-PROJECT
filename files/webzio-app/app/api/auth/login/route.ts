import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken({ id: user._id, email: user.email })

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
