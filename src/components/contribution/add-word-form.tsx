// components/contribution/add-word-form.tsx - Add New Word Form

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Save, X } from "lucide-react"

interface AddWordFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddWordForm({ onClose, onSuccess }: AddWordFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    word: "",
    phoneme: "",
    meaning: "",
    partOfSpeech: "",
    exampleUsage: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.word.trim()) {
      newErrors.word = "Ga word is required"
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = "English meaning is required"
    }

    if (formData.phoneme && !/^\/.*\/$/.test(formData.phoneme.trim())) {
      newErrors.phoneme = "Phoneme should be wrapped in forward slashes (e.g., /a-kpɛ/)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ADD_WORD",
          proposedData: {
            word: formData.word.trim(),
            phoneme: formData.phoneme.trim() || undefined,
            meaning: formData.meaning.trim(),
            partOfSpeech: formData.partOfSpeech.trim() || undefined,
            exampleUsage: formData.exampleUsage.trim() || undefined
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || "Failed to submit word" })
        return
      }

      onSuccess()
    } catch (error) {
      console.error("Error submitting word:", error)
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Ga Word</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ga Word */}
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
                Ga Word <span className="text-red-500">*</span>
              </label>
              <input
                id="word"
                name="word"
                type="text"
                value={formData.word}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.word ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter the Ga word"
              />
              {errors.word && <p className="mt-1 text-sm text-red-600">{errors.word}</p>}
            </div>

            {/* Phoneme */}
            <div>
              <label htmlFor="phoneme" className="block text-sm font-medium text-gray-700 mb-1">
                Phoneme (Pronunciation)
              </label>
              <input
                id="phoneme"
                name="phoneme"
                type="text"
                value={formData.phoneme}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.phoneme ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="/a-kpɛ/"
              />
              {errors.phoneme && <p className="mt-1 text-sm text-red-600">{errors.phoneme}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Use phonetic notation with forward slashes. Example: /a-kpɛ/
              </p>
            </div>

            {/* Meaning */}
            <div>
              <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">
                English Meaning <span className="text-red-500">*</span>
              </label>
              <input
                id="meaning"
                name="meaning"
                type="text"
                value={formData.meaning}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.meaning ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter the English meaning"
              />
              {errors.meaning && <p className="mt-1 text-sm text-red-600">{errors.meaning}</p>}
            </div>

            {/* Part of Speech */}
            <div>
              <label htmlFor="partOfSpeech" className="block text-sm font-medium text-gray-700 mb-1">
                Part of Speech
              </label>
              <input
                id="partOfSpeech"
                name="partOfSpeech"
                type="text"
                value={formData.partOfSpeech}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="noun, verb, adjective, etc."
              />
            </div>

            {/* Example Usage */}
            <div>
              <label htmlFor="exampleUsage" className="block text-sm font-medium text-gray-700 mb-1">
                Example Usage
              </label>
              <textarea
                id="exampleUsage"
                name="exampleUsage"
                value={formData.exampleUsage}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                placeholder="Show how this word is used in a sentence"
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit Word
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Your submission will be reviewed by our language experts before being added to the dictionary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}