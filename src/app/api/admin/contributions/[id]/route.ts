// app/api/admin/contributions/[id]/route.ts - Fixed TypeScript Issues

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { ContributionStatus } from "@prisma/client"

const reviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  notes: z.string().optional()
})

interface ProposedData {
  word?: string
  phoneme?: string
  meaning?: string
  partOfSpeech?: string
  exampleUsage?: string
  reason?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const contribution = await db.wordContribution.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            contributionCount: true,
            approvalCount: true
          }
        },
        word: true,
        reviewedBy: {
          select: {
            name: true,
            role: true
          }
        }
      }
    })

    if (!contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    return NextResponse.json({ contribution })

  } catch (error) {
    console.error("Error fetching contribution:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const { action, notes } = reviewSchema.parse(body)

    // Get the contribution
    const contribution = await db.wordContribution.findUnique({
      where: { id: params.id },
      include: {
        word: true,
        user: true
      }
    })

    if (!contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    if (contribution.status !== "PENDING") {
      return NextResponse.json({ error: "Contribution already reviewed" }, { status: 400 })
    }

    // Start transaction
    const result = await db.$transaction(async (tx) => {
      // Update contribution status
      const updatedContribution = await tx.wordContribution.update({
        where: { id: params.id },
        data: {
          status: action === "APPROVE" ? "APPROVED" : "REJECTED",
          reviewedById: session.user.id,
          reviewedAt: new Date(),
          reviewNotes: notes
        }
      })

      if (action === "APPROVE") {
        // Apply the changes to the word
        const proposedData = contribution.proposedData as ProposedData

        if (contribution.type === "ADD_WORD") {
          // Update the placeholder word with approved data
          await tx.word.update({
            where: { id: contribution.wordId },
            data: {
              word: proposedData.word || contribution.word?.word || "",
              phoneme: proposedData.phoneme || "",
              meaning: proposedData.meaning || "",
              partOfSpeech: proposedData.partOfSpeech,
              exampleUsage: proposedData.exampleUsage,
              completionStatus: "COMPLETE"
            }
          })
        } else if (contribution.type === "UPDATE_WORD" && contribution.wordId) {
          // Update existing word with proposed changes
          const updateData: Record<string, string> = {}
          if (proposedData.phoneme) updateData.phoneme = proposedData.phoneme
          if (proposedData.meaning) updateData.meaning = proposedData.meaning
          if (proposedData.partOfSpeech) updateData.partOfSpeech = proposedData.partOfSpeech
          if (proposedData.exampleUsage) updateData.exampleUsage = proposedData.exampleUsage
          
          await tx.word.update({
            where: { id: contribution.wordId },
            data: {
              ...updateData,
              completionStatus: "COMPLETE"
            }
          })
        }

        // Update user stats
        await tx.user.update({
          where: { id: contribution.userId },
          data: {
            approvalCount: { increment: 1 },
            reputation: { increment: 10 }
          }
        })
      } else {
        // If rejected and it was a new word, delete the placeholder
        if (contribution.type === "ADD_WORD" && contribution.wordId) {
          await tx.word.delete({
            where: { id: contribution.wordId }
          })
        }
      }

      return updatedContribution
    })

    return NextResponse.json({
      message: `Contribution ${action.toLowerCase()}ed successfully`,
      contribution: result
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    console.error("Error reviewing contribution:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}