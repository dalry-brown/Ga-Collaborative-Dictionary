// Fix for src/app/api/dictionary/route.ts - Works with non-nullable schema

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'word'
    const filterBy = searchParams.get('filterBy') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const letter = searchParams.get('letter')

    // Build where clause with proper typing
    const where: Prisma.WordWhereInput = {}

    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { phoneme: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (letter) {
      where.word = { startsWith: letter, mode: 'insensitive' }
    }

    // Filter by completeness (based on having meaningful content)
    if (filterBy === 'complete') {
      where.AND = [
        { phoneme: { not: '' } },
        { meaning: { not: '' } }
      ]
    } else if (filterBy === 'incomplete') {
      where.OR = [
        { phoneme: '' },
        { meaning: '' }
      ]
    }

    // Build orderBy clause with proper typing
    const orderBy: Prisma.WordOrderByWithRelationInput = 
      sortBy === 'word' ? { word: 'asc' } :
      sortBy === 'meaning' ? { meaning: 'asc' } :
      sortBy === 'newest' ? { createdAt: 'desc' } :
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
          createdAt: true
        }
      }),
      db.word.count({ where })
    ])

    // Add isComplete field dynamically (check for non-empty strings)
    const wordsWithComplete = words.map(word => ({
      ...word,
      isComplete: !!(word.phoneme && word.phoneme.trim() && word.meaning && word.meaning.trim())
    }))

    return NextResponse.json({
      words: wordsWithComplete,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Dictionary API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    )
  }
}