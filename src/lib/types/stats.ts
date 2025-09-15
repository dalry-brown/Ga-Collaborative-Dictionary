export interface Word {
  id: string
  word: string
  phoneme: string | null
  meaning: string
  completionStatus: 'COMPLETE' | 'INCOMPLETE'
}

export interface CompletionStatusStats {
  completionStatus: 'COMPLETE' | 'INCOMPLETE'
  _count: {
    _all: number
  }
}

export interface DatabaseStats {
  success: boolean
  message: string
  totalWords: number
  sampleWords: Word[]
  stats: CompletionStatusStats[]
  timestamp: string
}

export interface DictionaryStats {
  totalWords: number
  completeWords: number
  incompleteWords: number
  recentlyAdded: number
  completionPercentage: number
}