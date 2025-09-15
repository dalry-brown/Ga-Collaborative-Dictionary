// app/api/words/search/route.ts - Word Search for Updates

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    
    if (!query || query.length < 2) {
      return NextResponse.json({ words: [] })
    }

    const words = await db.word.findMany({
      where: {
        word: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        word: true,
        meaning: true,
        phoneme: true,
        partOfSpeech: true,
        exampleUsage: true
      },
      take: 10,
      orderBy: {
        word: 'asc'
      }
    })

    return NextResponse.json({ words })

  } catch (error) {
    console.error("Error searching words:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}