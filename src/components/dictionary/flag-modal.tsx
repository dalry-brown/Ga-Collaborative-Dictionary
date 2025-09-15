// components/dictionary/flag-modal.tsx - Fixed Flag Modal with Better Error Handling

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { X, Flag, AlertTriangle } from "lucide-react"

interface FlagModalProps {
  isOpen: boolean
  onClose: () => void
  word: {
    id: string
    word: string
    meaning: string
    phoneme: string
  }
  onFlagSubmitted: () => void
}

interface FlagFormData {
  reason: string
  description: string
}

export default function FlagModal({ isOpen, onClose, word, onFlagSubmitted }: FlagModalProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FlagFormData>({
    reason: "",
    description: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const flagReasons = [
    { value: "INCORRECT_MEANING", label: "Incorrect Meaning", description: "The English translation is wrong or misleading" },
    { value: "INCORRECT_PHONEME", label: "Incorrect Pronunciation", description: "The phoneme/pronunciation is incorrect" },
    { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content", description: "Contains offensive or inappropriate content" },
    { value: "DUPLICATE_ENTRY", label: "Duplicate Entry", description: "This word already exists in the dictionary" },
    { value: "SPAM", label: "Spam", description: "This appears to be spam or nonsensical content" },
    { value: "OTHER", label: "Other", description: "Another issue not listed above" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      setError("You must be signed in to flag words")
      return
    }

    if (!formData.reason || !formData.description.trim()) {
      setError("Please select a reason and provide a description")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const response = await fetch("/api/flags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wordId: word.id,
          reason: formData.reason,
          description: formData.description.trim()
        })
      })

      const responseText = await response.text()
      console.log("Flag submission response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error("Server returned invalid response. Please try again.")
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setSuccess(true)
      onFlagSubmitted()
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ reason: "", description: "" })
      }, 2000)

    } catch (error) {
      console.error("Flag submission error:", error)
      setError(error instanceof Error ? error.message : "Failed to submit flag")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
      setError("")
      setSuccess(false)
      setFormData({ reason: "", description: "" })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Flag Word</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Word Info */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-1">{word.word}</h3>
          <p className="text-sm text-gray-600 mb-1">{word.phoneme}</p>
          <p className="text-sm text-gray-700">{word.meaning}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flag className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Flag Submitted</h3>
              <p className="text-gray-600">Thank you for helping us improve the dictionary. Our moderators will review this flag.</p>
            </div>
          ) : (
            <>
              {/* Reason Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {`What's wrong with this word? `}<span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {flagReasons.map((reason) => (
                    <label key={reason.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={formData.reason === reason.value}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reason.label}</div>
                        <div className="text-xs text-gray-600">{reason.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please explain the issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  maxLength={500}
                  placeholder="Provide specific details about the problem..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.description.length}/500
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.reason || !formData.description.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Flag"}
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Guidelines for flagging:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Only flag content that violates our guidelines</li>
                      <li>Provide specific and constructive feedback</li>
                      <li>Avoid flagging content simply because you disagree</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}