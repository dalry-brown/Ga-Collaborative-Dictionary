'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  searchTerm: string
  onSearch: (term: string) => void
  onClear: () => void
  placeholder?: string
}

export function SearchBar({
  searchTerm,
  onSearch,
  onClear,
  placeholder = "Search for Ga words..."
}: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localSearchTerm)
  }

  const handleClear = () => {
    setLocalSearchTerm('')
    onClear()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    
    // Debounced search - search as user types
    const timeoutId = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
          />
          {localSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Search Tips */}
      <div className="mt-3 text-sm text-gray-600 text-center">
        <p>
          <span className="font-medium">Tips:</span> Search by word, meaning, or phoneme. 
          Use special characters: <code className="bg-gray-100 px-1 rounded">ɛ ŋ ɔ</code>
        </p>
      </div>
    </div>
  )
}