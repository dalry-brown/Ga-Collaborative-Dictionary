'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit3, Flag } from 'lucide-react'
import type { Word } from '@/lib/types/stats'

interface WordCardProps {
  word: Word & {
    createdAt?: string
    updatedAt?: string
  }
  viewMode: 'detailed' | 'compact'
  onEdit: (id: string) => void
  onFlag: (id: string) => void
}

export function WordCard({ word, viewMode, onEdit, onFlag }: WordCardProps) {
  const getStatusBadge = () => {
    switch (word.completionStatus) {
      case 'COMPLETE':
        return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>
      case 'INCOMPLETE':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) {
      return 'Recently added'
    }
    return date.toLocaleDateString()
  }

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${
      viewMode === 'compact' ? 'h-fit' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {word.word}
          </h3>
          {word.phoneme && (
            <div className="text-blue-600 italic text-lg mb-2">
              /{word.phoneme}/
            </div>
          )}
          <div className="text-gray-800 mb-3">
            {word.meaning}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {getStatusBadge()}
            {word.createdAt && formatDate(word.createdAt) === 'Recently added' && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Recently Added
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(word.id)}
            className="text-yellow-600 hover:bg-yellow-50"
            title="Suggest improvement"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFlag(word.id)}
            className="text-red-600 hover:bg-red-50"
            title="Report issue"
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {viewMode === 'detailed' && word.updatedAt && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(word.updatedAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </Card>
  )
}