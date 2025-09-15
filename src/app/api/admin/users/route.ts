// app/api/admin/users/route.ts - Users Management API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"

interface UserWhereInput {
  role?: Role
  email?: {
    contains: string
    mode: 'insensitive'
  }
  name?: {
    contains: string
    mode: 'insensitive'
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    const where: UserWhereInput = {}
    
    if (role && Object.values(Role).includes(role as Role)) {
      where.role = role as Role
    }

    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        location: true,
        contributionCount: true,
        approvalCount: true,
        reputation: true,
        createdAt: true,
        lastActive: true,
        _count: {
          select: {
            contributions: {
              where: {
                status: "PENDING"
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.user.count({ where })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}