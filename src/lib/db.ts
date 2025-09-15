import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Export as both 'prisma' and 'db' for compatibility
export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma