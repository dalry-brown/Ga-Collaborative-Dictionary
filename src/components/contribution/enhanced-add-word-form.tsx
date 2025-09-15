// components/contribution/enhanced-add-word-form.tsx - Enhanced Add Word Form with G2P

"use client"

import { useState } from "react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
import { Save, X, Sparkles, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PhonemeInput from "@/components/ui/phoneme-input"

interface EnhancedAddWordFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function EnhancedAddWordForm({ 
  onClose, 
  onSuccess 
}: EnhancedAddWordFormProps) {
//   const { data: session } = useSession()
//   const router = useRouter()
  
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ADD_WORD',
          proposedData: formData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contribution')
      }

      onSuccess()
      
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to submit contribution' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                Add New Ga Word
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                The phoneme will be auto-generated from your Ga word
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ga Word Input */}
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
                Ga Word <span className="text-red-500">*</span>
              </label>
              <Input
                id="word"
                value={formData.word}
                onChange={(e) => handleInputChange('word', e.target.value)}
                placeholder="Enter the Ga word"
                className={errors.word ? 'border-red-500' : ''}
              />
              {errors.word && (
                <p className="text-red-500 text-sm mt-1">{errors.word}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Type the Ga word exactly as it should appear in the dictionary
              </p>
            </div>

            {/* Auto-generating Phoneme Input */}
            <div>
              <label htmlFor="phoneme" className="block text-sm font-medium text-gray-700 mb-2">
                Phoneme (Pronunciation)
              </label>
              <PhonemeInput
                value={formData.phoneme}
                onChange={(value) => handleInputChange('phoneme', value)}
                gaWord={formData.word}
                placeholder="Will be auto-generated..."
              />
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Auto-generation in action:</p>
                    <p className="mt-1">
                      When you type a Ga word above, the phoneme will be automatically generated using our AI model. 
                      You can always edit the generated phoneme if needed.
                    </p>
                    <p className="mt-1 font-mono text-xs bg-blue-100 px-2 py-1 rounded inline-block">
                      {`Example: "duade" → "d ù à d è"`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* English Meaning */}
            <div>
              <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
                English Meaning <span className="text-red-500">*</span>
              </label>
              <Input
                id="meaning"
                value={formData.meaning}
                onChange={(e) => handleInputChange('meaning', e.target.value)}
                placeholder="What does this word mean in English?"
                className={errors.meaning ? 'border-red-500' : ''}
              />
              {errors.meaning && (
                <p className="text-red-500 text-sm mt-1">{errors.meaning}</p>
              )}
            </div>

            {/* Part of Speech */}
            <div>
              <label htmlFor="partOfSpeech" className="block text-sm font-medium text-gray-700 mb-2">
                Part of Speech
              </label>
              <select
                id="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('partOfSpeech', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select part of speech (optional)</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="pronoun">Pronoun</option>
                <option value="preposition">Preposition</option>
                <option value="conjunction">Conjunction</option>
                <option value="interjection">Interjection</option>
              </select>
            </div>

            {/* Example Usage */}
            <div>
              <label htmlFor="exampleUsage" className="block text-sm font-medium text-gray-700 mb-2">
                Example Usage
              </label>
              <Textarea
                id="exampleUsage"
                value={formData.exampleUsage}
                onChange={(e) => handleInputChange('exampleUsage', e.target.value)}
                rows={3}
                placeholder="Show how this word is used in a sentence"
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a sentence in Ga that demonstrates how to use this word
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Submit Word
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Info Footer */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Review Process:</span> {`Your submission will be reviewed by our language experts before being added to the dictionary. You'll be notified of the decision.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}