// lib/hooks/useG2P.ts - G2P Auto-generation Hook

"use client"

import { useState, useCallback } from 'react'

interface G2PResult {
  success: boolean
  input_sentence: string
  word_count: number
  total_phonemes: number
  sentence_phonemes: string
  word_breakdown: Array<{
    word: string
    phonemes: string
  }>
  error?: string
}

interface UseG2PReturn {
  generatePhoneme: (word: string) => Promise<string | null>
  isGenerating: boolean
  error: string | null
  clearError: () => void
}

export function useG2P(): UseG2PReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePhoneme = useCallback(async (word: string): Promise<string | null> => {
    if (!word.trim()) return null

    setIsGenerating(true)
    setError(null)

    try {
      // Use the internal API route that forwards to the backend
      const response = await fetch('/api/g2p', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: word.trim() }),
      })

      const data: G2PResult = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate phoneme')
      }

      // Return the phoneme for the word
      if (data.word_breakdown && data.word_breakdown.length > 0) {
        return data.word_breakdown[0].phonemes
      }

      return data.sentence_phonemes || null

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate phoneme'
      setError(errorMessage)
      console.error('G2P generation error:', err)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    generatePhoneme,
    isGenerating,
    error,
    clearError
  }
}