import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import Page from '../../../../models/Page'
import Gallery from '../../../../models/Gallery'
import { requireAuth } from '../../../../lib/middleware'

// GET - Get dashboard stats for a store
export async function GET(req: NextRequest) {
  const { error } = requireAuth(req)
  if (error) return error

  await dbConnect()

  const { searchParams } = new URL(req.url)
  const storeId = searchParams.get('storeId')

  if (!storeId) {
    return NextResponse.json({ success: false, message: 'Store ID required' }, { status: 400 })
  }

  // Get store
  const store = await Website.findById(storeId)
  if (!store) {
    return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })
  }

  // Get counts
  const pagesCount = await Page.countDocuments({ websiteId: storeId })
  const imagesCount = await Gallery.countDocuments({ websiteId: storeId })

  const stats = {
    visitors: store.views || 0,
    leads: store.leads || 0,
    pages: pagesCount,
    images: imagesCount
  }

  return NextResponse.json({ success: true, stats })
}
