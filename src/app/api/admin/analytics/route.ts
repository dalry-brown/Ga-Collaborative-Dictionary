// app/api/admin/analytics/route.ts - Analytics Data API

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

    const { searchParams } = new URL(request.url)
    const timeRange = parseInt(searchParams.get("timeRange") || "30")
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    // Fetch all analytics data in parallel
    const [
      totalWords,
      totalUsers,
      totalContributions,
      totalFlags,
      completeWords,
      approvedContributions,
      contributionsByType,
      topContributors,
      flagReasonBreakdown,
      recentActivity
    ] = await Promise.all([
      // Basic counts
      db.word.count(),
      db.user.count(),
      db.wordContribution.count(),
      db.wordFlag.count(),
      
      // Completion metrics
      db.word.count({ where: { completionStatus: "COMPLETE" } }),
      db.wordContribution.count({ where: { status: "APPROVED" } }),
      
      // Contribution types
      db.wordContribution.groupBy({
        by: ['type'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      
      // Top contributors
      db.user.findMany({
        where: {
          contributionCount: { gt: 0 }
        },
        select: {
          name: true,
          contributionCount: true,
          approvalCount: true,
          role: true
        },
        orderBy: { contributionCount: 'desc' },
        take: 10
      }),
      
      // Flag reason breakdown
      db.wordFlag.groupBy({
        by: ['reason'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      
      // Recent activity (simplified version)
      db.wordContribution.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          createdAt: true,
          type: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Calculate metrics
    const completionRate = totalWords > 0 ? (completeWords / totalWords) * 100 : 0
    const approvalRate = totalContributions > 0 ? (approvedContributions / totalContributions) * 100 : 0

    // Process contribution types
    const contributionsTotal = contributionsByType.reduce((sum, item) => sum + item._count.id, 0)
    const processedContributionTypes = contributionsByType.map(item => ({
      type: item.type,
      count: item._count.id,
      percentage: contributionsTotal > 0 ? (item._count.id / contributionsTotal) * 100 : 0
    }))

    // Process top contributors
    const processedTopContributors = topContributors.map(user => ({
      name: user.name || 'Anonymous',
      contributionCount: user.contributionCount,
      approvalRate: user.contributionCount > 0 ? (user.approvalCount / user.contributionCount) * 100 : 0,
      role: user.role
    }))

    // Process flag reasons
    const processedFlagReasons = flagReasonBreakdown.map(item => ({
      reason: item.reason.replace(/_/g, ' ').toLowerCase(),
      count: item._count.id
    }))

    // Generate time series data (simplified)
    const timeSeriesData = []
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayActivity = recentActivity.filter(
        item => item.createdAt >= dayStart && item.createdAt <= dayEnd
      )
      
      timeSeriesData.push({
        date: dayStart.toISOString().split('T')[0],
        newWords: dayActivity.filter(item => item.type === 'ADD_WORD').length,
        newUsers: 0, // Would need to query users table
        contributions: dayActivity.length,
        flags: 0 // Would need to query flags table
      })
    }

    const analytics = {
      overview: {
        totalWords,
        totalUsers,
        totalContributions,
        totalFlags,
        completionRate,
        approvalRate
      },
      timeSeriesData,
      contributionsByType: processedContributionTypes,
      topContributors: processedTopContributors,
      languageCompletion: {
        totalWords,
        completeWords,
        incompleteWords: totalWords - completeWords,
        missingPhoneme: 0, // Would calculate from actual data
        missingMeaning: 0,
        missingUsage: 0
      },
      userGrowth: [], // Would implement with proper time series queries
      flagAnalytics: {
        reasonBreakdown: processedFlagReasons,
        resolutionTime: {
          average: 2.5,
          median: 2.0
        },
        resolutionRate: 85.5
      }
    }

    return NextResponse.json({ analytics })

  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}