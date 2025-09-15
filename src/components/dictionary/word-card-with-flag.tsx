// components/dictionary/word-card-with-flag.tsx - Fixed TypeScript Issues

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Flag, Eye, Edit3 } from "lucide-react"
import FlagModal from "./flag-modal"

interface Word {
  id: string
  word: string
  phoneme: string | null
  meaning: string
  partOfSpeech?: string | null
  exampleUsage?: string | null
  completionStatus: "COMPLETE" | "INCOMPLETE" | string
}

interface WordCardProps {
  word: Word
  onEdit?: (word: Word) => void
  showActions?: boolean
}

export default function WordCardWithFlag({ word, onEdit, showActions = true }: WordCardProps) {
  const { data: session } = useSession()
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [flagSubmitted, setFlagSubmitted] = useState(false)

  const handleFlagSubmitted = () => {
    setFlagSubmitted(true)
    // Reset after 5 seconds
    setTimeout(() => setFlagSubmitted(false), 5000)
  }

  const getCompletionBadge = (status: string) => {
    if (status === "COMPLETE") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Complete
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Incomplete
      </span>
    )
  }

  // Create word object for flag modal that matches expected interface
  const flagModalWord = {
    id: word.id,
    word: word.word,
    phoneme: word.phoneme || "",
    meaning: word.meaning
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{word.word}</h3>
            {word.phoneme && (
              <p className="text-sm text-blue-600 italic mb-2">/{word.phoneme}/</p>
            )}
            <p className="text-gray-700 mb-3">{word.meaning}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getCompletionBadge(word.completionStatus)}
            {flagSubmitted && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Flagged
              </span>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {(word.partOfSpeech || word.exampleUsage) && (
          <div className="border-t pt-3 mb-4">
            {word.partOfSpeech && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Part of speech:</span> {word.partOfSpeech}
              </p>
            )}
            {word.exampleUsage && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Example:</span> {word.exampleUsage}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(word)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Improve
                </button>
              )}
              
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                <Eye className="w-3 h-3 mr-1" />
                Details
              </button>
            </div>

            {/* Flag Button */}
            {session && (
              <button
                onClick={() => setShowFlagModal(true)}
                disabled={flagSubmitted}
                className={`inline-flex items-center px-3 py-1 border rounded-md text-sm transition-colors ${
                  flagSubmitted
                    ? "border-blue-300 text-blue-700 bg-blue-50 cursor-not-allowed"
                    : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                }`}
                title={flagSubmitted ? "Already flagged" : "Report an issue with this word"}
              >
                <Flag className="w-3 h-3 mr-1" />
                {flagSubmitted ? "Flagged" : "Flag"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        word={flagModalWord}
        onFlagSubmitted={handleFlagSubmitted}
      />
    </>
  )
}