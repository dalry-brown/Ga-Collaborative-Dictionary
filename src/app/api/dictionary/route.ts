// First, let me verify the existing API route structure
// Since you mentioned there's already an app/api/dictionary/route.ts
// Let me create a simple test to see if we can connect to the database

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const count = await prisma.word.count()
    console.log(`Database connected! Found ${count} words`)
    
    // Get search parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const completionStatus = searchParams.get('completionStatus')
    const sortBy = searchParams.get('sortBy') || 'alphabetical'

    const skip = (page - 1) * limit

    // Build where clause
    let where: any = {}

    // Search functionality
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { phoneme: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by completion status
    if (completionStatus && completionStatus !== 'ALL') {
      where.completionStatus = completionStatus
    }

    // Build orderBy
    let orderBy: any = { word: 'asc' }
    
    if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' }
    }

    // Get words and total count
    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          word: true,
          phoneme: true,
          meaning: true,
          completionStatus: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.word.count({ where })
    ])

    return NextResponse.json({
      success: true,
      words,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch words',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}