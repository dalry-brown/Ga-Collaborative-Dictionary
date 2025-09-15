import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db"

// Optimized OAuth configuration without PrismaAdapter
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.role = "USER"
        
        try {
          if (account.provider === "google") {
            // Check if user exists in our database
            const existingUser = await db.user.findUnique({
              where: { email: user.email! },
              select: { id: true, role: true }
            })
            
            if (!existingUser) {
              // Create new user manually
              const newUser = await db.user.create({
                data: {
                  email: user.email!,
                  name: user.name || "New User",
                  role: "USER",
                  bio: null,
                  expertise: null,
                  location: null,
                  contributionCount: 0,
                  approvalCount: 0,
                  reputation: 0,
                  lastActive: new Date(),
                },
                select: { id: true, role: true }
              })
              token.role = newUser.role
              token.userId = newUser.id
              console.log(`✅ New user created: ${user.email}`)
            } else {
              token.role = existingUser.role
              token.userId = existingUser.id
              // Update last active
              await db.user.update({
                where: { id: existingUser.id },
                data: { lastActive: new Date() }
              })
              console.log(`✅ User signed in: ${user.email}`)
            }
          }
        } catch (error) {
          console.error("❌ Database error:", error)
          // Continue with authentication even if database fails
          token.role = "USER"
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string || token.sub!
        session.user.role = token.role as string || "USER"
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // Additional validation
        if (account?.provider === "google") {
          if (!user.email) {
            console.error("❌ No email provided by Google")
            return false
          }
          console.log(`🔐 Google sign in: ${user.email}`)
          return true
        }
        return true
      } catch (error) {
        console.error("❌ SignIn callback error:", error)
        return false
      }
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`🔐 Sign in successful: ${user.email} via ${account?.provider}`)
    },
    async signOut({ session }) {
      console.log(`👋 Sign out: ${session?.user?.email}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
}