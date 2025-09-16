// app/api/contributions/route.ts - Fixed to use auth-simple.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-simple" // Fixed: Use auth-simple instead of auth
import { db } from "@/lib/db"
import { z } from "zod"
import { ContributionType, ContributionStatus, Prisma } from "@prisma/client"

const contributionSchema = z.object({
  type: z.enum(["ADD_WORD", "UPDATE_WORD", "DELETE_WORD", "ADD_PHONEME", "ADD_MEANING", "ADD_USAGE", "CORRECT_ERROR"]),
  wordId: z.string().optional(),
  proposedData: z.object({
    word: z.string().optional(),
    phoneme: z.string().optional(),
    meaning: z.string().optional(),
    partOfSpeech: z.string().optional(),
    exampleUsage: z.string().optional(),
    reason: z.string().optional(),
  })
})

// Define proper types for the where clause
type ContributionWhereInput = {
  userId: string
  status?: ContributionStatus
  type?: ContributionType
}

// Define type for original data
type OriginalWordData = {
  word: string
  phoneme: string
  meaning: string
  partOfSpeech: string | null
  exampleUsage: string | null
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database using email since that's what we have in session
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const statusParam = searchParams.get("status")
    const typeParam = searchParams.get("type")

    // Build where clause with proper typing
    const where: ContributionWhereInput = {
      userId: user.id,
    }

    if (statusParam && Object.values(ContributionStatus).includes(statusParam as ContributionStatus)) {
      where.status = statusParam as ContributionStatus
    }

    if (typeParam && Object.values(ContributionType).includes(typeParam as ContributionType)) {
      where.type = typeParam as ContributionType
    }

    const contributions = await db.wordContribution.findMany({
      where,
      include: {
        word: {
          select: { word: true, meaning: true, phoneme: true }
        },
        reviewedBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.wordContribution.count({ where })

    return NextResponse.json({
      contributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching contributions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database using email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { type, wordId, proposedData } = contributionSchema.parse(body)

    let originalData: OriginalWordData | null = null
    let targetWordId: string

    if (type === "ADD_WORD") {
      // Check if word already exists
      if (proposedData.word) {
        const existingWord = await db.word.findFirst({
          where: { 
            word: {
              equals: proposedData.word,
              mode: 'insensitive'
            }
          }
        })

        if (existingWord) {
          return NextResponse.json({ 
            error: "This word already exists in the dictionary" 
          }, { status: 409 })
        }
      }

      // For ADD_WORD, we need to create a temporary word first or use a special handling
      // Since your schema requires wordId, we'll create a placeholder word
      const placeholderWord = await db.word.create({
        data: {
          word: proposedData.word || "PENDING",
          phoneme: proposedData.phoneme || "",
          meaning: proposedData.meaning || "PENDING",
          partOfSpeech: proposedData.partOfSpeech,
          exampleUsage: proposedData.exampleUsage,
          completionStatus: "INCOMPLETE"
        }
      })
      targetWordId = placeholderWord.id
    } else {
      // For updates/corrections, find the existing word
      if (wordId) {
        const existingWord = await db.word.findUnique({
          where: { id: wordId }
        })
        
        if (!existingWord) {
          return NextResponse.json({ error: "Word not found" }, { status: 404 })
        }
        
        targetWordId = existingWord.id
        originalData = {
          word: existingWord.word,
          phoneme: existingWord.phoneme,
          meaning: existingWord.meaning,
          partOfSpeech: existingWord.partOfSpeech,
          exampleUsage: existingWord.exampleUsage
        }
      } else if (proposedData.word) {
        // Try to find word by name
        const existingWord = await db.word.findFirst({
          where: { 
            word: {
              equals: proposedData.word,
              mode: 'insensitive'
            }
          }
        })
        
        if (!existingWord) {
          return NextResponse.json({ 
            error: "Word not found. Please select an existing word to update." 
          }, { status: 404 })
        }
        
        targetWordId = existingWord.id
        originalData = {
          word: existingWord.word,
          phoneme: existingWord.phoneme,
          meaning: existingWord.meaning,
          partOfSpeech: existingWord.partOfSpeech,
          exampleUsage: existingWord.exampleUsage
        }
      } else {
        return NextResponse.json({ 
          error: "Word ID or word name is required for updates" 
        }, { status: 400 })
      }
    }

    // Create contribution with required wordId
    const contributionData: Prisma.WordContributionUncheckedCreateInput = {
      type: type as ContributionType,
      userId: user.id,
      wordId: targetWordId, // Now always has a value
      status: "PENDING" as ContributionStatus,
      proposedData: proposedData as Prisma.InputJsonValue,
      originalData: originalData ? (originalData as Prisma.InputJsonValue) : Prisma.DbNull
    }

    const contribution = await db.wordContribution.create({
      data: contributionData
    })

    // Fetch the contribution with relationships
    const fullContribution = await db.wordContribution.findUnique({
      where: { id: contribution.id },
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
      message: "Contribution submitted successfully",
      contribution: fullContribution
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    console.error("Error creating contribution:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}