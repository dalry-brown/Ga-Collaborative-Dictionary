// app/api/user/contributions/route.ts - Fixed Without Any Types

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import type { Prisma, ContributionStatus, ContributionType } from "@prisma/client"

type ProposedDataType = {
  word?: string
  meaning?: string
  phoneme?: string
  description?: string
  [key: string]: unknown
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
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    // Build where clause with proper Prisma typing
    const where: Prisma.WordContributionWhereInput = {
      userId: session.user.id
    }

    // Use proper enum values for status
    if (status && status !== "all") {
      const validStatuses: ContributionStatus[] = ["PENDING", "APPROVED", "REJECTED", "NEEDS_REVIEW"]
      if (validStatuses.includes(status as ContributionStatus)) {
        where.status = status as ContributionStatus
      }
    }

    // Use proper enum values for type
    if (type && type !== "all") {
      const validTypes: ContributionType[] = ["ADD_WORD", "UPDATE_WORD", "DELETE_WORD", "ADD_PHONEME", "ADD_MEANING", "ADD_USAGE", "CORRECT_ERROR"]
      if (validTypes.includes(type as ContributionType)) {
        where.type = type as ContributionType
      }
    }

    // Search in the related word fields or review notes
    if (search) {
      where.OR = [
        {
          word: {
            word: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          word: {
            meaning: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          reviewNotes: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }

    // Get contributions
    const contributions = await db.wordContribution.findMany({
      where,
      include: {
        reviewedBy: {
          select: {
            name: true,
            role: true
          }
        },
        word: {
          select: {
            word: true,
            meaning: true,
            phoneme: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.wordContribution.count({ where })

    // Get stats
    const baseWhere = { userId: session.user.id }
    
    const stats = {
      total: await db.wordContribution.count({
        where: baseWhere
      }),
      approved: await db.wordContribution.count({
        where: { ...baseWhere, status: "APPROVED" }
      }),
      pending: await db.wordContribution.count({
        where: { ...baseWhere, status: "PENDING" }
      }),
      rejected: await db.wordContribution.count({
        where: { ...baseWhere, status: "REJECTED" }
      })
    }

    // Transform the data to match the expected interface
    const transformedContributions = contributions.map(contribution => {
      // Extract data from proposedData JSON field with proper typing
      let proposedData: ProposedDataType = {}
      
      if (contribution.proposedData) {
        if (typeof contribution.proposedData === 'object') {
          proposedData = contribution.proposedData as ProposedDataType
        } else {
          try {
            proposedData = JSON.parse(contribution.proposedData as string) as ProposedDataType
          } catch {
            proposedData = {}
          }
        }
      }

      return {
        id: contribution.id,
        type: contribution.type,
        status: contribution.status,
        createdAt: contribution.createdAt.toISOString(),
        reviewedAt: contribution.reviewedAt?.toISOString() || null,
        reviewNotes: contribution.reviewNotes,
        data: {
          word: contribution.word?.word || proposedData.word || "",
          meaning: contribution.word?.meaning || proposedData.meaning || "",
          phoneme: contribution.word?.phoneme || proposedData.phoneme || "",
          description: proposedData.description || contribution.reviewNotes || ""
        },
        reviewedBy: contribution.reviewedBy ? {
          name: contribution.reviewedBy.name,
          role: contribution.reviewedBy.role
        } : null
      }
    })

    return NextResponse.json({
      contributions: transformedContributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    })

  } catch (error) {
    console.error("Error fetching user contributions:", error)
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}