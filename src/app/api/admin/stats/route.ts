// app/api/admin/stats/route.ts - Admin Statistics API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get current date for recent activity calculations
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Fetch all statistics in parallel
    const [
      totalWords,
      totalUsers,
      pendingContributions,
      openFlags,
      newUsersLastWeek,
      newContributionsLastWeek,
      resolvedFlagsLastWeek,
      usersByRole
    ] = await Promise.all([
      // Total words count
      db.word.count(),
      
      // Total users count
      db.user.count(),
      
      // Pending contributions count
      db.wordContribution.count({
        where: { status: "PENDING" }
      }),
      
      // Open flags count
      db.wordFlag.count({
        where: { status: "OPEN" }
      }),
      
      // New users in last 7 days
      db.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      
      // New contributions in last 7 days
      db.wordContribution.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      
      // Resolved flags in last 7 days
      db.wordFlag.count({
        where: {
          status: "RESOLVED",
          resolvedAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      
      // Users by role
      db.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      })
    ])

    // Transform usersByRole into a more usable format
    const userRoleDistribution = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id
      return acc
    }, {} as Record<string, number>)

    const stats = {
      totalWords,
      totalUsers,
      pendingContributions,
      openFlags,
      recentActivity: {
        newUsers: newUsersLastWeek,
        newContributions: newContributionsLastWeek,
        resolvedFlags: resolvedFlagsLastWeek
      },
      usersByRole: userRoleDistribution
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}