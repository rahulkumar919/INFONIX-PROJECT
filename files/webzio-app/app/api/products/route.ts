import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    await dbConnect()
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const products = await Product.find({ userId: decoded.id })
    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect()
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const data = await req.json()
    const product = await Product.create({ ...data, userId: decoded.id, slug: data.name.toLowerCase().replace(/\s+/g, '-') })
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
