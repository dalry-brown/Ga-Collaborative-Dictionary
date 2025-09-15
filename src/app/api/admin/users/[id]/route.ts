// app/api/admin/users/[id]/route.ts - Individual User Management

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Role } from "@prisma/client"

const updateUserSchema = z.object({
  role: z.enum(["USER", "CONTRIBUTOR", "MODERATOR", "EXPERT", "ADMIN"]).optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  location: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        contributions: {
          select: {
            id: true,
            type: true,
            status: true,
            createdAt: true,
            proposedData: true
          },
          orderBy: { createdAt: "desc" },
          take: 10
        },
        flags: {
          select: {
            id: true,
            reason: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent non-admins from promoting users to admin
    if (session.user.role !== "ADMIN" && validatedData.role === "ADMIN") {
      return NextResponse.json({ error: "Cannot promote user to admin" }, { status: 403 })
    }

    // Prevent users from modifying themselves unless they're admin
    if (params.id === session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Cannot modify your own account" }, { status: 403 })
    }

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        ...(validatedData.role && { role: validatedData.role as Role }),
        ...(validatedData.bio !== undefined && { bio: validatedData.bio }),
        ...(validatedData.expertise !== undefined && { expertise: validatedData.expertise }),
        ...(validatedData.location !== undefined && { location: validatedData.location })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        expertise: true,
        location: true,
        contributionCount: true,
        approvalCount: true,
        reputation: true
      }
    })

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Prevent self-deletion
    if (params.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 403 })
    }

    const user = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user and related data
    await db.$transaction(async (tx) => {
      // Delete user's contributions
      await tx.wordContribution.deleteMany({
        where: { userId: params.id }
      })

      // Delete user's flags
      await tx.wordFlag.deleteMany({
        where: { userId: params.id }
      })

      // Delete the user
      await tx.user.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json({
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}