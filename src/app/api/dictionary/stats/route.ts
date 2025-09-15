import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Calculate stats directly since there's no DictionaryStats model
    const [
      totalWords,
      completeWords,
      incompleteWords,
      pendingContributions,
      activeContributors,
      recentWords
    ] = await Promise.all([
      db.word.count(),
      db.word.count({ where: { completionStatus: 'COMPLETE' } }),
      db.word.count({ where: { completionStatus: 'INCOMPLETE' } }),
      db.wordContribution.count({ where: { status: 'PENDING' } }),
      db.user.count({
        where: {
          contributionCount: { gt: 0 },
          lastActive: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
          }
        }
      }),
      db.word.findMany({
        where: {
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
    ])

    // Get pending contributions
    const pendingContributionsList = await db.wordContribution.findMany({
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
          totalWords,
          verifiedWords: completeWords, // Using complete words as "verified"
          incompleteEntries: incompleteWords,
          pendingReview: pendingContributions,
          activeContributors,
          recentAdditions: recentWords.length
        },
        recentWords: recentWords.map(word => ({
          word: word.word,
          meaning: word.meaning,
          timeAgo: getTimeAgo(word.createdAt)
        })),
        pendingContributions: pendingContributionsList.map(contrib => ({
          word: getWordFromProposedData(contrib.proposedData),
          type: getContributionTypeLabel(contrib.type),
          contributor: contrib.user.name || 'Unknown',
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

function getWordFromProposedData(proposedData: unknown): string {
  try {
    if (typeof proposedData === 'string') {
      const parsed = JSON.parse(proposedData)
      return (parsed as { word?: string }).word || 'Unknown'
    } else if (typeof proposedData === 'object' && proposedData !== null) {
      return (proposedData as { word?: string }).word || 'Unknown'
    }
    return 'Unknown'
  } catch {
    return 'Unknown'
  }
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