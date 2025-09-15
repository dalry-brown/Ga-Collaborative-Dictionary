// app/api/admin/contributions/route.ts - Admin Contributions API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import type { Prisma, ContributionStatus, ContributionType } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    // Build where clause
    const where: Prisma.WordContributionWhereInput = {}

    if (status && status !== "all") {
      const validStatuses: ContributionStatus[] = ["PENDING", "APPROVED", "REJECTED", "NEEDS_REVIEW"]
      if (validStatuses.includes(status as ContributionStatus)) {
        where.status = status as ContributionStatus
      }
    }

    if (type && type !== "all") {
      const validTypes: ContributionType[] = ["ADD_WORD", "UPDATE_WORD", "DELETE_WORD", "ADD_PHONEME", "ADD_MEANING", "ADD_USAGE", "CORRECT_ERROR"]
      if (validTypes.includes(type as ContributionType)) {
        where.type = type as ContributionType
      }
    }

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
          user: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    }

    // Get contributions
    const contributions = await db.wordContribution.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
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

    // Transform the data
    const transformedContributions = contributions.map(contribution => {
      let proposedData = {}
      let originalData = {}

      if (contribution.proposedData) {
        if (typeof contribution.proposedData === 'object') {
          proposedData = contribution.proposedData
        } else {
          try {
            proposedData = JSON.parse(contribution.proposedData as string)
          } catch {
            proposedData = {}
          }
        }
      }

      if (contribution.originalData) {
        if (typeof contribution.originalData === 'object') {
          originalData = contribution.originalData
        } else {
          try {
            originalData = JSON.parse(contribution.originalData as string)
          } catch {
            originalData = {}
          }
        }
      }

      return {
        id: contribution.id,
        type: contribution.type,
        status: contribution.status,
        createdAt: contribution.createdAt.toISOString(),
        user: contribution.user,
        word: contribution.word,
        proposedData,
        originalData
      }
    })

    return NextResponse.json({
      contributions: transformedContributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching admin contributions:", error)
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}