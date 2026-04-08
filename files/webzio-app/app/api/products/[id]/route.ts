import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Product from '../../../../models/Product'
import { verifyToken } from '../../../../lib/auth'

async function getAuth(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return null
  return verifyToken(token)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const decoded = await getAuth(req)
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId: decoded.id },
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const decoded = await getAuth(req)
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const product = await Product.findOneAndDelete({ _id: params.id, userId: decoded.id })
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
