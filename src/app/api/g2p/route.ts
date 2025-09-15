// app/api/g2p/route.ts - G2P API Route

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    // Forward request to Python backend
    const response = await fetch('https://ga-phoneme-backend.onrender.com/api/g2p', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Backend request failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process G2P request',
        input_sentence: '',
        word_count: 0,
        total_phonemes: 0,
        sentence_phonemes: '',
        word_breakdown: []
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Ga G2P Frontend API',
    version: '1.0.0',
    backend: 'https://ga-phoneme-backend.onrender.com',
    endpoints: {
      'POST /api/g2p': 'Convert text to phonemes',
    }
  })
}