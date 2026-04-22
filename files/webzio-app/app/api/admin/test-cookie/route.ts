import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'MySECRETKEY9142517255'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value

    let decoded = null
    if (token) {
        try {
            decoded = jwt.verify(token, JWT_SECRET)
        } catch (error: any) {
            decoded = { error: error.message }
        }
    }

    return NextResponse.json({
        hasCookie: !!token,
        token: token ? token.substring(0, 20) + '...' : null,
        decoded,
        allCookies: req.cookies.getAll()
    })
}
