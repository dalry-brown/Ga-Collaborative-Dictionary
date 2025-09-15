// app/api/words/[id]/flag/route.ts - Word Flagging System

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const flagSchema = z.object({
  reason: z.enum(["INCORRECT_MEANING", "INCORRECT_PHONEME", "INAPPROPRIATE_CONTENT", "DUPLICATE_ENTRY", "SPAM", "OTHER"]),
  description: z.string().min(10, "Please provide a detailed description")
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { reason, description } = flagSchema.parse(body)

    // Check if word exists
    const word = await db.word.findUnique({
      where: { id: params.id }
    })

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    // Check if user already flagged this word
    const existingFlag = await db.wordFlag.findFirst({
      where: {
        wordId: params.id,
        userId: session.user.id,
        status: "OPEN"
      }
    })

    if (existingFlag) {
      return NextResponse.json({ 
        error: "You have already flagged this word" 
      }, { status: 400 })
    }

    // Create flag
    const flag = await db.wordFlag.create({
      data: {
        wordId: params.id,
        userId: session.user.id,
        reason,
        description,
        status: "OPEN"
      },
      include: {
        word: {
          select: { word: true, meaning: true }
        },
        user: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({
      message: "Flag submitted successfully",
      flag
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    console.error("Error creating flag:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}