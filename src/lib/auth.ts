// lib/auth.ts - Fixed TypeScript Errors

import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "./db"

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
    // Google OAuth Provider
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
    
    // Email/Password Credentials Provider
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "your@email.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          // Find user in database (select only necessary fields)
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          // Verify password
          const isValidPassword = await compare(credentials.password, user.password)

          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }

          // Update last active
          await db.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() }
          })

          // Return user object for session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar,
          }
        } catch (error) {
          console.error("❌ Credentials authorization error:", error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.role = user.role || "USER"
        
        try {
          if (account.provider === "google") {
            // Handle Google OAuth user creation/update
            const existingUser = await db.user.findUnique({
              where: { email: user.email! },
              select: { id: true, role: true }
            })
            
            if (!existingUser) {
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
              console.log(`✅ New Google user created: ${user.email}`)
            } else {
              token.role = existingUser.role
              token.userId = existingUser.id
              await db.user.update({
                where: { id: existingUser.id },
                data: { lastActive: new Date() }
              })
              console.log(`✅ Google user signed in: ${user.email}`)
            }
          } else if (account.provider === "credentials") {
            // For credentials login, user data is already validated
            token.role = user.role
            token.userId = user.id
            console.log(`✅ Credentials user signed in: ${user.email}`)
          }
        } catch (error) {
          console.error("❌ Database error:", error)
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
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          if (!user.email) {
            console.error("❌ No email provided by Google")
            return false
          }
          console.log(`🔐 Google sign in: ${user.email}`)
          return true
        } else if (account?.provider === "credentials") {
          if (!user.email) {
            console.error("❌ No email provided by credentials")
            return false
          }
          console.log(`🔐 Credentials sign in: ${user.email}`)
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