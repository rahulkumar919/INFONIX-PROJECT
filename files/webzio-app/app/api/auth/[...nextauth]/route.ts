import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account }) {
      console.log('🔐 NextAuth signIn callback:', { provider: account?.provider, email: user.email })

      if (account?.provider === 'google') {
        try {
          await dbConnect()
          const existingUser = await User.findOne({ email: user.email })

          if (existingUser) {
            console.log('✅ Existing user found, updating OAuth info')
            // User exists — update oauth info and mark verified
            existingUser.oauthProvider = 'google'
            existingUser.oauthId = account.providerAccountId
            existingUser.isVerified = true
            existingUser.avatar = user.image || existingUser.avatar
            existingUser.lastLogin = new Date()
            existingUser.loginCount = (existingUser.loginCount || 0) + 1
            await existingUser.save()
          } else {
            console.log('✅ Creating new user via Google OAuth')
            // New user via Google — create and auto-verify
            await User.create({
              name: user.name,
              email: user.email,
              password: null,
              avatar: user.image || '',
              isVerified: true,
              isActive: true,
              role: 'user',
              oauthProvider: 'google',
              oauthId: account.providerAccountId,
              lastLogin: new Date(),
              loginCount: 1
            })
          }
          return true
        } catch (err) {
          console.error('❌ Google signIn error:', err)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user?.email) {
        console.log('🔐 NextAuth JWT callback for Google user')
        try {
          await dbConnect()
          const dbUser = await User.findOne({ email: user.email })
          if (dbUser) {
            console.log('✅ User found in DB, adding to token:', { id: dbUser._id, role: dbUser.role })
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.customToken = generateToken({
              id: dbUser._id,
              email: dbUser.email,
              role: dbUser.role
            })
          } else {
            console.warn('⚠️ User not found in DB after Google login')
          }
        } catch (error) {
          console.error('❌ JWT callback error:', error)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        console.log('🔐 NextAuth session callback, adding user data')
          ; (session.user as any).id = token.id
          ; (session.user as any).role = token.role
          ; (session.user as any).customToken = token.customToken
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
