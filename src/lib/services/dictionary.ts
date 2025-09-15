// src/lib/services/dictionary.ts - Fixed Dictionary Service

import { SearchFilters, SearchResponse, StatsResponse, GaWord } from '@/lib/types/dictionary'

export class DictionaryService {
  private baseUrl = '/api'

  async searchWords(filters: SearchFilters, page = 1): Promise<SearchResponse> {
    const params = new URLSearchParams()
    
    // Add parameters conditionally to avoid undefined values
    params.append('page', page.toString())
    params.append('limit', '20')
    
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    
    if (filters.filterBy) {
      params.append('filterBy', filters.filterBy)
    }
    
    if (filters.query) {
      params.append('search', filters.query)
    }
    
    if (filters.startingWith) {
      params.append('startsWith', filters.startingWith)
    }

    const response = await fetch(`${this.baseUrl}/dictionary?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${this.baseUrl}/dictionary/stats`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`)
    }
    
    return response.json()
  }

  async createWord(wordData: Partial<GaWord>): Promise<GaWord> {
    const response = await fetch(`${this.baseUrl}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wordData)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create word: ${response.statusText}`)
    }
    
    return response.json()
  }

  async updateWord(id: string, wordData: Partial<GaWord>): Promise<GaWord> {
    const response = await fetch(`${this.baseUrl}/words/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wordData)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update word: ${response.statusText}`)
    }
    
    return response.json()
  }

  async deleteWord(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/words/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete word: ${response.statusText}`)
    }
  }

  async flagWord(id: string, reason: string, details?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/words/${id}/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason,
        description: details || ''
      })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to flag word: ${response.statusText}`)
    }
  }
}

// Export singleton instance
export const dictionaryService = new DictionaryService()

// Export individual functions for compatibility
export const searchWords = (filters: SearchFilters, page?: number) => 
  dictionaryService.searchWords(filters, page)

export const getStats = () => 
  dictionaryService.getStats()

export const createWord = (wordData: Partial<GaWord>) => 
  dictionaryService.createWord(wordData)

export const updateWord = (id: string, wordData: Partial<GaWord>) => 
  dictionaryService.updateWord(id, wordData)

export const deleteWord = (id: string) => 
  dictionaryService.deleteWord(id)

export const flagWord = (id: string, reason: string, details?: string) => 
  dictionaryService.flagWord(id, reason, details)

// Re-export types for convenience
export type { SearchFilters, SearchResponse, StatsResponse, GaWord }