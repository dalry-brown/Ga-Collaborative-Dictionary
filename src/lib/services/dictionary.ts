import { GaWord, SearchFilters, DictionaryStats } from '@/lib/types/dictionary'

export interface SearchResponse {
  words: GaWord[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    limit: number
  }
  filters: SearchFilters
}

export interface StatsResponse {
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

class DictionaryService {
  private baseUrl = '/api/dictionary'

  async searchWords(filters: SearchFilters, page = 1, limit = 20): Promise<SearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      filterBy: filters.filterBy,
    })

    if (filters.query) params.append('query', filters.query)
    if (filters.startingWith) params.append('startingWith', filters.startingWith)
    if (filters.showOnlyVerified !== undefined) {
      params.append('showOnlyVerified', filters.showOnlyVerified.toString())
    }

    const response = await fetch(`${this.baseUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Search failed')
    }

    return result.data
  }

  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${this.baseUrl}/stats`)
    
    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Stats fetch failed')
    }

    return result.data
  }

  async createWord(wordData: Partial<GaWord>): Promise<GaWord> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create word')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create word')
    }

    return result.data
  }

  async updateWord(id: string, wordData: Partial<GaWord>): Promise<GaWord> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update word')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update word')
    }

    return result.data
  }

  async deleteWord(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete word')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete word')
    }
  }

  async flagWord(id: string, reason: string, details?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, details }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to flag word')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to flag word')
    }
  }
}

export const dictionaryService = new DictionaryService()