import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import { verifyToken } from '../../../../lib/auth'

async function getAuth(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return null
  return verifyToken(token)
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const decoded = await getAuth(req)
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const website = await Website.findOne({ _id: params.id, userId: decoded.id })
    if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

    return NextResponse.json({ success: true, website })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const decoded = await getAuth(req)
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { siteName, content } = await req.json()
    const website = await Website.findOneAndUpdate(
      { _id: params.id, userId: decoded.id },
      { $set: { siteName, content } },
      { new: true, runValidators: true }
    )

    if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

    return NextResponse.json({ success: true, website })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const decoded = await getAuth(req)
    if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const website = await Website.findOneAndDelete({ _id: params.id, userId: decoded.id })
    if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

    // Optionally delete products here
    // await Product.deleteMany({ websiteId: params.id })

    return NextResponse.json({ success: true, message: 'Store deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
