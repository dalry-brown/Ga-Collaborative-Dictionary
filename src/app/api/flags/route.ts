// app/api/flags/route.ts - Fixed User Flag Submission API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const flagSchema = z.object({
  wordId: z.string().min(1, "Word ID is required"),
  reason: z.enum([
    "INCORRECT_MEANING",
    "INCORRECT_PHONEME", 
    "INAPPROPRIATE_CONTENT",
    "DUPLICATE_ENTRY",
    "SPAM",
    "OTHER"
  ]),
  description: z.string().min(1, "Description is required").max(500, "Description too long")
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be signed in to flag words" }, { status: 401 })
    }

    const body = await request.json()
    const { wordId, reason, description } = flagSchema.parse(body)

    // Check if word exists
    const word = await db.word.findUnique({
      where: { id: wordId },
      select: { id: true, word: true }
    })

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    // Check if user already flagged this word
    const existingFlag = await db.wordFlag.findFirst({
      where: {
        wordId,
        userId: session.user.id,
        status: "OPEN"
      }
    })

    if (existingFlag) {
      return NextResponse.json({ 
        error: "You have already flagged this word" 
      }, { status: 400 })
    }

    // Create the flag
    const flag = await db.wordFlag.create({
      data: {
        wordId,
        userId: session.user.id,
        reason,
        description,
        status: "OPEN"
      },
      include: {
        word: {
          select: {
            word: true,
            meaning: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Word flagged successfully. Our moderators will review it soon.",
      flag: {
        id: flag.id,
        reason: flag.reason,
        word: flag.word.word,
        status: flag.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating flag:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to submit flag" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get user's flags
    const flags = await db.wordFlag.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        word: {
          select: {
            word: true,
            meaning: true,
            phoneme: true
          }
        },
        resolvedBy: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.wordFlag.count({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      flags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching user flags:", error)
    return NextResponse.json({ error: "Failed to fetch flags" }, { status: 500 })
  }
}