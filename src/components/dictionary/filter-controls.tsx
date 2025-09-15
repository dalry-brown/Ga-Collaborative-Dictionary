'use client'

import { Button } from '@/components/ui/button'

interface FilterControlsProps {
  filterBy: string
  sortBy: string
  viewMode: 'detailed' | 'compact'
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
  onViewModeChange: (mode: 'detailed' | 'compact') => void
  onLetterFilter: (letter: string) => void
}

export function FilterControls({
  filterBy,
  sortBy,
  viewMode,
  onFilterChange,
  onSortChange,
  onViewModeChange,
  onLetterFilter
}: FilterControlsProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const gaLetters = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'S', 'T', 'W', 'Y']

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="alphabetical">Alphabetical</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by
          </label>
          <select
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Words</option>
            <option value="COMPLETE">Complete Entries</option>
            <option value="INCOMPLETE">Incomplete Entries</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            View Mode
          </label>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              onClick={() => onViewModeChange('detailed')}
              className="flex-1"
            >
              Detailed
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'outline'}
              onClick={() => onViewModeChange('compact')}
              className="flex-1"
            >
              Compact
            </Button>
          </div>
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Browse by Letter
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLetterFilter('ALL')}
            className="min-w-[40px]"
          >
            All
          </Button>
          {alphabet.map((letter) => (
            <Button
              key={letter}
              variant="outline"
              size="sm"
              onClick={() => onLetterFilter(letter)}
              disabled={!gaLetters.includes(letter)}
              className={`min-w-[40px] ${
                !gaLetters.includes(letter) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50'
              }`}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}