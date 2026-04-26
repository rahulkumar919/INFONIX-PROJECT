import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import { verifyToken } from '../../../../lib/auth'
import mongoose from 'mongoose'

/**
 * Admin endpoint to fix templateId validation issues
 * Only accessible by admin users
 * POST /api/admin/fix-templateid
 */
export async function POST(req: Request) {
    try {
        await dbConnect()

        // Verify admin token
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 })
        }

        // Get all websites
        const websites = await Website.find({})

        let fixed = 0
        let errors = 0
        const errorDetails: any[] = []

        for (const website of websites) {
            try {
                // Check if templateId needs fixing
                if (website.templateId) {
                    let needsUpdate = false
                    let newTemplateId = website.templateId

                    // If it's a string, convert to ObjectId
                    if (typeof website.templateId === 'string') {
                        try {
                            newTemplateId = new mongoose.Types.ObjectId(website.templateId)
                            needsUpdate = true
                        } catch (err) {
                            errorDetails.push({
                                websiteId: website._id,
                                siteName: website.siteName,
                                error: 'Invalid ObjectId string'
                            })
                            errors++
                            continue
                        }
                    }
                    // If it's a number, we can't fix it - need to delete or set default
                    else if (typeof website.templateId === 'number') {
                        errorDetails.push({
                            websiteId: website._id,
                            siteName: website.siteName,
                            error: 'Numeric templateId - cannot auto-fix'
                        })
                        errors++
                        continue
                    }

                    // Update if needed
                    if (needsUpdate) {
                        await Website.updateOne(
                            { _id: website._id },
                            { $set: { templateId: newTemplateId } }
                        )
                        fixed++
                    }
                }
            } catch (err: any) {
                errorDetails.push({
                    websiteId: website._id,
                    siteName: website.siteName,
                    error: err.message
                })
                errors++
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fixed ${fixed} websites, ${errors} errors`,
            stats: {
                total: websites.length,
                fixed,
                errors,
                errorDetails: errors > 0 ? errorDetails : undefined
            }
        })
    } catch (error: any) {
        console.error('Fix templateId error:', error)
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fix templateId issues'
        }, { status: 500 })
    }
}
