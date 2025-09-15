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
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Contribution types
export interface WordContribution {
  id: string
  wordId: string
  userId: string
  type: ContributionType
  status: ContributionStatus
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

// User types
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

// Updated statistics types with all required properties
export interface DictionaryStats {
  totalWords: number
  verifiedWords: number        // For complete words count
  completeWords: number       // Alias for verifiedWords
  incompleteWords: number
  incompleteEntries: number   // Alias for incompleteWords
  pendingContributions: number
  pendingReview: number       // Alias for pendingContributions
  totalContributors: number
  activeContributors: number  // Alias for totalContributors
  recentAdditions: number     // For recently added words
  recentActivity: {
    newWords: number
    updatedWords: number
    flaggedWords: number
  }
}

// Stats API response interface
export interface StatsResponse {
  success: boolean
  data: {
    stats: DictionaryStats
    recentWords: Array<{
      word: string
      meaning: string
      timeAgo: string
    }>
    pendingContributions: Array<{
      word: string
      type: string
      contributor: string
      timeAgo: string
    }>
  }
}

// CSV import types
export interface CsvWord {
  word: string
  phoneme: string
  meaning: string
}

// Compatibility aliases for existing hooks (with meaningful extensions)
export interface SearchFilters extends SearchParams {
  // Additional search-specific properties can be added here in the future
  includePartialMatches?: boolean
}

// Legacy Word interface for backward compatibility (with meaningful extensions)
export interface Word extends GaWord {
  // Additional legacy properties can be added here if needed
  displayName?: string
}

// Additional pagination interface
export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// Completion status type alias
export type CompletionStatus = 'COMPLETE' | 'INCOMPLETE'