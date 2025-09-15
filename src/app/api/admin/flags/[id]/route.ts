// app/api/admin/flags/[id]/route.ts - Individual Flag Management

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const resolveFlagSchema = z.object({
  action: z.enum(["RESOLVE", "DISMISS"]),
  resolution: z.string().min(1, "Resolution notes are required")
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const resolvedParams = await params

    const flag = await db.wordFlag.findUnique({
      where: { id: resolvedParams.id },
      include: {
        word: true,
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            contributionCount: true,
            approvalCount: true
          }
        },
        resolvedBy: {
          select: {
            name: true,
            role: true
          }
        }
      }
    })

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 })
    }

    return NextResponse.json({ flag })

  } catch (error) {
    console.error("Error fetching flag:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { action, resolution } = resolveFlagSchema.parse(body)
    const resolvedParams = await params

    const flag = await db.wordFlag.findUnique({
      where: { id: resolvedParams.id },
      include: { word: true }
    })

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 })
    }

    if (flag.status !== "OPEN") {
      return NextResponse.json({ error: "Flag already resolved" }, { status: 400 })
    }

    // Update flag status
    const updatedFlag = await db.$transaction(async (tx) => {
      const updated = await tx.wordFlag.update({
        where: { id: resolvedParams.id },
        data: {
          status: action === "RESOLVE" ? "RESOLVED" : "DISMISSED",
          resolvedById: session.user.id,
          resolvedAt: new Date(),
          resolution
        }
      })

      // If resolving a flag for inappropriate content, we might want to take action on the word
      if (action === "RESOLVE" && flag.reason === "INAPPROPRIATE_CONTENT") {
        // Could add logic here to hide or mark the word as problematic
        // For now, we'll just log the action
        console.log(`Word ${flag.word.word} flagged for inappropriate content and resolved`)
      }

      return updated
    })

    return NextResponse.json({
      message: `Flag ${action.toLowerCase()}ed successfully`,
      flag: updatedFlag
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    console.error("Error resolving flag:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}