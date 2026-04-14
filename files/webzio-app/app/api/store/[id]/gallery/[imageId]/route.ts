import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../../lib/db'
import Gallery from '../../../../../../models/Gallery'
import { requireAuth } from '../../../../../../lib/middleware'

// DELETE - Delete gallery image
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string; imageId: string } }
) {
    const { error } = requireAuth(req)
    if (error) return error

    await dbConnect()

    const image = await Gallery.findOneAndDelete({
        _id: params.imageId,
        websiteId: params.id
    })

    if (!image) {
        return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Image deleted' })
}
