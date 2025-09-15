// app/api/user/profile/route.ts - User Profile API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  bio: z.string().max(500, "Bio too long").optional(),
  expertise: z.string().max(100, "Expertise too long").optional(),
  location: z.string().max(100, "Location too long").optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        expertise: true,
        location: true,
        contributionCount: true,
        approvalCount: true,
        reputation: true,
        createdAt: true,
        lastActive: true
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Update last active timestamp
    await db.user.update({
      where: { id: session.user.id },
      data: { lastActive: new Date() }
    })

    return NextResponse.json({ profile })

  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, expertise, location } = updateProfileSchema.parse(body)

    const updatedProfile = await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio: bio || null,
        expertise: expertise || null,
        location: location || null,
        lastActive: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        expertise: true,
        location: true,
        contributionCount: true,
        approvalCount: true,
        reputation: true,
        createdAt: true,
        lastActive: true
      }
    })

    return NextResponse.json({ 
      message: "Profile updated successfully",
      profile: updatedProfile 
    })

  } catch (error) {
    console.error("Error updating profile:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}