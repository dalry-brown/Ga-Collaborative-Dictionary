'use client'

import { useState, useEffect, useCallback } from 'react'
import { SearchFilters, GaWord, SearchResponse, StatsResponse } from '@/lib/types/dictionary'

// Define proper service interfaces
interface DictionaryService {
  searchWords: (filters: SearchFilters, page?: number) => Promise<SearchResponse>
  getStats: () => Promise<StatsResponse>
  createWord: (wordData: Partial<GaWord>) => Promise<GaWord>
  updateWord: (id: string, wordData: Partial<GaWord>) => Promise<GaWord>
  deleteWord: (id: string) => Promise<void>
  flagWord: (id: string, reason: string, details?: string) => Promise<void>
}

// Mock dictionary service for now
const dictionaryService: DictionaryService = {
  searchWords: async (filters: SearchFilters, page = 1) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    })

    if (filters.query) params.append('search', filters.query)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.filterBy) params.append('filterBy', filters.filterBy)
    if (filters.startingWith) params.append('startsWith', filters.startingWith)

    const response = await fetch(`/api/dictionary?${params}`)
    if (!response.ok) throw new Error('Search failed')
    return response.json()
  },

  getStats: async () => {
    const response = await fetch('/api/dictionary/stats')
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  },

  createWord: async (wordData: Partial<GaWord>) => {
    const response = await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    })
    if (!response.ok) throw new Error('Failed to create word')
    return response.json()
  },

  updateWord: async (id: string, wordData: Partial<GaWord>) => {
    const response = await fetch(`/api/words/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    })
    if (!response.ok) throw new Error('Failed to update word')
    return response.json()
  },

  deleteWord: async (id: string) => {
    const response = await fetch(`/api/words/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete word')
  },

  flagWord: async (id: string, reason: string, details?: string) => {
    const response = await fetch(`/api/words/${id}/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, description: details })
    })
    if (!response.ok) throw new Error('Failed to flag word')
  }
}

export function useDictionarySearch(initialFilters: SearchFilters) {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)

  const search = useCallback(async (newFilters?: SearchFilters, page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const searchFilters = newFilters || filters
      const response = await dictionaryService.searchWords(searchFilters, page)
      setData(response)
      setFilters(searchFilters)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const refetch = useCallback(() => {
    search(filters, currentPage)
  }, [search, filters, currentPage])

  // Initial search on mount only
  useEffect(() => {
    search()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty - only run on mount

  return {
    data,
    loading,
    error,
    filters,
    currentPage,
    search,
    refetch,
    setFilters: (newFilters: SearchFilters) => search(newFilters, 1),
    setPage: (page: number) => search(filters, page)
  }
}

export function useDictionaryStats() {
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await dictionaryService.getStats()
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    data,
    loading,
    error,
    refetch: fetchStats
  }
}

export function useWordOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createWord = useCallback(async (wordData: Partial<GaWord>) => {
    setLoading(true)
    setError(null)

    try {
      const newWord = await dictionaryService.createWord(wordData)
      return newWord
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create word'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWord = useCallback(async (id: string, wordData: Partial<GaWord>) => {
    setLoading(true)
    setError(null)

    try {
      const updatedWord = await dictionaryService.updateWord(id, wordData)
      return updatedWord
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update word'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWord = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await dictionaryService.deleteWord(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete word'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const flagWord = useCallback(async (id: string, reason: string, details?: string) => {
    setLoading(true)
    setError(null)

    try {
      await dictionaryService.flagWord(id, reason, details)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to flag word'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createWord,
    updateWord,
    deleteWord,
    flagWord,
    clearError: () => setError(null)
  }
}

// Hook for debounced search with proper typing
interface DebouncedSearchReturn {
  value: string
  debouncedValue: string
  setValue: (value: string) => void
}

export function useDebouncedSearch(delay = 300): DebouncedSearchReturn {
  const [debouncedValue, setDebouncedValue] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return {
    value,
    debouncedValue,
    setValue
  }
}