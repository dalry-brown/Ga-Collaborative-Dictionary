// Fix for src/app/api/dictionary/route.ts - Works with browse page expectations

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'alphabetical'
    const completionStatus = searchParams.get('completionStatus') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause with proper typing
    const where: Prisma.WordWhereInput = {}

    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { phoneme: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by completion status
    if (completionStatus === 'COMPLETE') {
      where.completionStatus = 'COMPLETE'
    } else if (completionStatus === 'INCOMPLETE') {
      where.completionStatus = 'INCOMPLETE'
    }
    // If 'ALL', don't add any filter

    // Build orderBy clause with proper typing
    const orderBy: Prisma.WordOrderByWithRelationInput = 
      sortBy === 'alphabetical' ? { word: 'asc' } :
      sortBy === 'newest' ? { createdAt: 'desc' } :
      sortBy === 'oldest' ? { createdAt: 'asc' } :
      { word: 'asc' }

    const [words, total] = await Promise.all([
      db.word.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          word: true,
          phoneme: true,
          meaning: true,
          partOfSpeech: true,
          exampleUsage: true,
          completionStatus: true,
          createdAt: true
        }
      }),
      db.word.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    // Return in the format that browse/page.tsx expects
    return NextResponse.json({
      success: true,
      words: words,
      total: total,
      page: page,
      limit: limit,
      totalPages: totalPages
    })

  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch words',
      words: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    }, { status: 500 })
  }
}