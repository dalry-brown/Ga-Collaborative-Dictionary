import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Check if Prisma client is initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }
    console.log('✅ Prisma client initialized')

    // Test 2: Test basic database connection
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected')

    // Test 3: Check if we can query raw SQL
    console.log('🔍 Testing raw query...')
    const rawResult = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Raw query successful:', rawResult)

    // Test 4: Check if Word table exists
    console.log('🔍 Checking if Word table exists...')
    const tableExists = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Word'
    `
    console.log('✅ Table check result:', tableExists)

    // Test 5: Try to count words
    console.log('🔍 Counting words...')
    const totalWords = await prisma.word.count()
    console.log('✅ Word count successful:', totalWords)
    
    // Test 6: Get a few sample words
    console.log('🔍 Getting sample words...')
    const sampleWords = await prisma.word.findMany({
      take: 3,
      select: {
        id: true,
        word: true,
        phoneme: true,
        meaning: true,
        completionStatus: true
      }
    })
    console.log('✅ Sample words retrieved:', sampleWords)

    // Test 7: Get statistics
    console.log('🔍 Getting statistics...')
    const stats = await prisma.word.groupBy({
      by: ['completionStatus'],
      _count: {
        _all: true
      }
    })
    console.log('✅ Statistics retrieved:', stats)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      totalWords,
      sampleWords,
      stats,
      timestamp: new Date().toISOString(),
      debug: {
        prismaConnected: true,
        rawQueryWorks: true,
        tableExists: Array.isArray(tableExists) ? tableExists.length > 0 : false
      }
    })

  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    // Detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: errorDetails.message,
        fullError: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    // Clean up connection
    await prisma.$disconnect()
  }
}