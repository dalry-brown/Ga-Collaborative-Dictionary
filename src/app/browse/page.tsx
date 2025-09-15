// app/browse/page.tsx - Fixed Type Issues

'use client'

import { useState, useEffect } from 'react'
import { Search, ArrowLeft, ArrowRight, Flag } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import WordCardWithFlag from '@/components/dictionary/word-card-with-flag'

interface DatabaseStats {
  totalWords: number
  verifiedWords: number
  incompleteEntries: number
  pendingReview: number
}

interface Word {
  id: string
  word: string
  phoneme: string | null
  meaning: string
  partOfSpeech?: string | null
  exampleUsage?: string | null
  completionStatus: "COMPLETE" | "INCOMPLETE" | string
}

interface SearchResponse {
  success: boolean
  words: Word[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('ALL')
  const [sortBy, setSortBy] = useState('alphabetical')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed')
  
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DatabaseStats | null>(null)

  // Fetch data function
  const fetchWords = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        search: searchTerm,
        page: currentPage.toString(),
        limit: '20',
        completionStatus: filterBy,
        sortBy
      })

      const response = await fetch(`/api/dictionary?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch words')
      }

      setSearchResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      
      if (data.success) {
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  // Fetch data when dependencies change
  useEffect(() => {
    fetchWords()
  }, [searchTerm, filterBy, sortBy, currentPage])

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchWords()
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleFilterChange = (filter: string) => {
    setFilterBy(filter)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLetterFilter = (letter: string) => {
    if (letter === 'ALL') {
      setSearchTerm('')
    } else {
      setSearchTerm(letter.toLowerCase())
    }
    setCurrentPage(1)
  }

  const handleEditWord = (word: Word) => {
    window.location.href = `/contribute?type=update&wordId=${word.id}`
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Make sure your PostgreSQL database is running and the DATABASE_URL is correct in your .env file.
            </p>
            <div className="space-y-4">
              <Link href="/api/test" target="_blank" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-block">
                Test Database
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats?.totalWords?.toLocaleString() || '...'}
              </div>
              <div className="text-gray-600 text-sm">Total Words</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.totalWords?.toLocaleString() || '...'}
              </div>
              <div className="text-gray-600 text-sm">Verified Words</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">0</div>
              <div className="text-gray-600 text-sm">Pending Review</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm">Complete</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for Ga words, meanings, or phonemes..."
              className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by</label>
              <select
                value={filterBy}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Words</option>
                <option value="COMPLETE">Complete Entries</option>
                <option value="INCOMPLETE">Incomplete Entries</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`flex-1 p-3 rounded-lg border ${
                    viewMode === 'detailed'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`flex-1 p-3 rounded-lg border ${
                    viewMode === 'compact'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Alphabet Navigation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Browse by Letter</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLetterFilter('ALL')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                All
              </button>
              {['A', 'B', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'S', 'T', 'W', 'Y'].map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterFilter(letter)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            {searchResults ? 
              `Showing ${((currentPage - 1) * 20) + 1}-${Math.min(currentPage * 20, searchResults.total)} of ${searchResults.total} results`
              : 'Loading...'
            }
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dictionary entries...</p>
            </div>
          ) : !searchResults?.words?.length ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No words found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                  : 'No words match your current filters.'
                }
              </p>
              <button 
                onClick={handleClearSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Word Grid - Now using WordCardWithFlag */}
              <div className={`
                ${viewMode === 'compact' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'space-y-6'
                }
              `}>
                {searchResults.words.map((word) => (
                  <WordCardWithFlag
                    key={word.id}
                    word={word}
                    onEdit={handleEditWord}
                    showActions={true}
                  />
                ))}
              </div>

              {/* Simple Pagination */}
              {searchResults.total > 20 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-gray-600">
                    Page {currentPage} of {searchResults.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= searchResults.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}