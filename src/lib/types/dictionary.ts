// Core dictionary types based on the CSV structure
export interface GaWord {
  id: string
  word: string
  phoneme: string
  meaning: string
  partOfSpeech?: string  // Future expansion
  exampleUsage?: string  // Future expansion
  completionStatus: 'COMPLETE' | 'INCOMPLETE'
  createdAt: Date
  updatedAt: Date
}

// Search and filter types
export interface SearchParams {
  query?: string
  sortBy?: 'alphabetical' | 'newest' | 'oldest' | 'most-complete'
  filterBy?: 'all' | 'complete' | 'incomplete' | 'missing-phoneme' | 'missing-meaning'
  startingWith?: string
  page?: number
  limit?: number
}

export interface SearchResponse {
  words: GaWord[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Contribution types
export interface WordContribution {
  id: string
  wordId: string
  userId: string
  type: ContributionType
  status: ContributionStatus
  // originalData?: any
  // proposedData: any
  originalData?: unknown
  proposedData: unknown
  reviewNotes?: string
  createdAt: Date
  updatedAt: Date
}

export type ContributionType = 
  | 'ADD_WORD' 
  | 'UPDATE_WORD' 
  | 'DELETE_WORD'
  | 'ADD_PHONEME'
  | 'ADD_MEANING' 
  | 'ADD_USAGE'
  | 'CORRECT_ERROR'

export type ContributionStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'NEEDS_REVIEW'

// User types - fixed to include UserRole
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'USER' | 'CONTRIBUTOR' | 'MODERATOR' | 'EXPERT' | 'ADMIN'

// Flag types
export interface WordFlag {
  id: string
  wordId: string
  userId: string
  reason: FlagReason
  description: string
  status: FlagStatus
  resolution?: string
  createdAt: Date
  updatedAt: Date
}

export type FlagReason = 
  | 'INCORRECT_MEANING'
  | 'INCORRECT_PHONEME' 
  | 'INAPPROPRIATE_CONTENT'
  | 'DUPLICATE_ENTRY'
  | 'SPAM'
  | 'OTHER'

export type FlagStatus = 'OPEN' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Statistics types
export interface DictionaryStats {
  totalWords: number
  completeWords: number
  incompleteWords: number
  pendingContributions: number
  totalContributors: number
  recentActivity: {
    newWords: number
    updatedWords: number
    flaggedWords: number
  }
}

// CSV import types
export interface CsvWord {
  word: string
  phoneme: string
  meaning: string
}