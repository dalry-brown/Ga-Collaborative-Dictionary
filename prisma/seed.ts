import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

interface CSVRow {
  word: string
  phoneme: string
  meaning: string
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Read and parse CSV file
  const csvPath = path.join(process.cwd(), 'ga_data.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath)
    console.log('Please ensure ga_data.csv is in the project root')
    return
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CSVRow[]

  console.log(`📖 Found ${records.length} words in CSV`)

  // Create admin user first
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ga-dictionary.org' },
    update: {},
    create: {
      email: 'admin@ga-dictionary.org',
      name: 'Dictionary Admin',
      role: 'ADMIN',
      reputation: 1000,
      contributionCount: records.length
    }
  })

  console.log('👤 Created admin user')

  // Clear existing words (for development)
  await prisma.word.deleteMany()
  console.log('🗑️  Cleared existing words')

  // Batch insert words
  const batchSize = 100
  let processed = 0
  const totalBatches = Math.ceil(records.length / batchSize)

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    
    const wordsData = batch.map((record, index) => {
      const word = record.word?.trim() || ''
      const phoneme = record.phoneme?.trim() || ''
      const meaning = record.meaning?.trim() || ''
      
      // Determine completion status
      const isComplete = word && phoneme && meaning
      const completionStatus = isComplete ? 'COMPLETE' : 'INCOMPLETE'
      
      return {
        word,
        phoneme,
        meaning,
        isVerified: true, // CSV data is considered verified
        isPublished: true,
        completionStatus: completionStatus as 'COMPLETE' | 'INCOMPLETE',
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
      }
    }).filter(w => w.word) // Only include entries with actual words

    await prisma.word.createMany({
      data: wordsData,
      skipDuplicates: true
    })

    processed += batch.length
    const currentBatch = Math.floor(i / batchSize) + 1
    console.log(`📝 Processed batch ${currentBatch}/${totalBatches} (${processed}/${records.length} words)`)
  }

  // Update dictionary statistics
  const totalWords = await prisma.word.count()
  const verifiedWords = await prisma.word.count({ where: { isVerified: true } })
  const incompleteWords = await prisma.word.count({ where: { completionStatus: 'INCOMPLETE' } })

  await prisma.dictionaryStats.upsert({
    where: { id: 'singleton' },
    update: {
      totalWords,
      verifiedWords,
      incompleteWords,
      pendingContributions: 0,
      activeContributors: 1
    },
    create: {
      id: 'singleton',
      totalWords,
      verifiedWords,
      incompleteWords,
      pendingContributions: 0,
      activeContributors: 1
    }
  })

  console.log('📊 Updated dictionary statistics:')
  console.log(`   Total words: ${totalWords}`)
  console.log(`   Verified words: ${verifiedWords}`)
  console.log(`   Incomplete words: ${incompleteWords}`)

  // Create some sample contributions for testing
  const sampleWords = await prisma.word.findMany({ take: 5 })
  
  for (const word of sampleWords.slice(0, 3)) {
    await prisma.contribution.create({
      data: {
        type: 'UPDATE_WORD',
        status: 'PENDING',
        wordId: word.id,
        userId: adminUser.id,
        originalData: {
          word: word.word,
          phoneme: word.phoneme,
          meaning: word.meaning
        },
        proposedData: {
          word: word.word,
          phoneme: word.phoneme,
          meaning: word.meaning,
          usageExample: `Sample usage for ${word.word}`
        },
        reason: 'Adding usage example'
      }
    })
  }

  console.log('📝 Created sample contributions')

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: 'DATABASE_SEEDED',
      entityType: 'SYSTEM',
      entityId: 'seed',
      userId: adminUser.id,
      details: {
        totalWords,
        verifiedWords,
        incompleteWords,
        timestamp: new Date().toISOString()
      }
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })