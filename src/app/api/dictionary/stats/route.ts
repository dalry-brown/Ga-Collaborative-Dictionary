import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get cached stats first
    let stats = await db.dictionaryStats.findUnique({
      where: { id: 'singleton' }
    })

    // If no cached stats or they're old, recalculate
    if (!stats || isStatsStale(stats.updatedAt)) {
      stats = await recalculateStats()
    }

    // Get recent activity
    const recentWords = await db.word.findMany({
      where: {
        isPublished: true,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        word: true,
        meaning: true,
        createdAt: true
      }
    })

    // Get pending contributions
    const pendingContributions = await db.contribution.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalWords: stats.totalWords,
          verifiedWords: stats.verifiedWords,
          incompleteEntries: stats.incompleteWords,
          pendingReview: stats.pendingContributions,
          activeContributors: stats.activeContributors,
          recentAdditions: recentWords.length
        },
        recentWords: recentWords.map(word => ({
          word: word.word,
          meaning: word.meaning,
          timeAgo: getTimeAgo(word.createdAt)
        })),
        pendingContributions: pendingContributions.map(contrib => ({
          word: contrib.proposedData ? JSON.parse(contrib.proposedData).word : 'Unknown',
          type: getContributionTypeLabel(contrib.type),
          contributor: contrib.user.name,
          timeAgo: getTimeAgo(contrib.createdAt)
        }))
      }
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

async function recalculateStats() {
  console.log('Recalculating dictionary statistics...')

  const [
    totalWords,
    verifiedWords,
    incompleteWords,
    pendingContributions,
    activeContributors
  ] = await Promise.all([
    db.word.count({ where: { isPublished: true } }),
    db.word.count({ where: { isPublished: true, isVerified: true } }),
    db.word.count({ where: { isPublished: true, completionStatus: 'INCOMPLETE' } }),
    db.contribution.count({ where: { status: 'PENDING' } }),
    db.user.count({
      where: {
        contributionCount: { gt: 0 },
        lastActive: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
        }
      }
    })
  ])

  const stats = await db.dictionaryStats.upsert({
    where: { id: 'singleton' },
    update: {
      totalWords,
      verifiedWords,
      incompleteWords,
      pendingContributions,
      activeContributors
    },
    create: {
      id: 'singleton',
      totalWords,
      verifiedWords,
      incompleteWords,
      pendingContributions,
      activeContributors
    }
  })

  return stats
}

function isStatsStale(updatedAt: Date): boolean {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return updatedAt < oneHourAgo
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`
}

function getContributionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'ADD_WORD': 'new word',
    'UPDATE_WORD': 'word update',
    'DELETE_WORD': 'word deletion',
    'ADD_PHONEME': 'phoneme addition',
    'ADD_MEANING': 'meaning addition',
    'ADD_USAGE': 'usage addition',
    'CORRECT_ERROR': 'error correction'
  }
  
  return labels[type] || 'contribution'
}