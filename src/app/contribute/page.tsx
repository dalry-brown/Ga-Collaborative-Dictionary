// app/contribute/page.tsx - Enhanced with G2P Auto-generation (Fixed)

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
// import { Plus, Edit3, Flag, CheckCircle, Clock, AlertTriangle, Heart, BookOpen, Users, Wand2, Loader2 } from 'lucide-react'
import { Plus, Edit3, CheckCircle, AlertTriangle, Wand2, Loader2 } from 'lucide-react'
import { useG2P } from '@/lib/hooks/useG2P'
import Link from 'next/link'

interface Word {
  id: string
  word: string
  meaning: string
  phoneme: string
  partOfSpeech?: string | null
  exampleUsage?: string | null
}

export default function ContributePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { generatePhoneme, isGenerating, error: g2pError, clearError } = useG2P()
  
  const [selectedOption, setSelectedOption] = useState<string>('ADD_WORD')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [searchResults, setSearchResults] = useState<Word[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  
  // Form data for adding new words
  const [newWordData, setNewWordData] = useState({
    word: '',
    phoneme: '',
    meaning: '',
    partOfSpeech: '',
    exampleUsage: '',
    notes: ''
  })
  
  // Form data for improving existing words
  const [improveData, setImproveData] = useState({
    meaning: '',
    phoneme: '',
    partOfSpeech: '',
    exampleUsage: '',
    notes: ''
  })

  // Auto-generate phoneme when Ga word changes
// Auto-generate phoneme when Ga word changes
useEffect(() => {
  const generatePhonemeForNewWord = async () => {
    if (newWordData.word.trim() && !newWordData.phoneme.trim() && !isGenerating) {
      const phoneme = await generatePhoneme(newWordData.word.trim())
      if (phoneme) {
        setNewWordData(prev => ({ ...prev, phoneme }))
      }
    }
  }

  const debounceTimer = setTimeout(generatePhonemeForNewWord, 500)
  return () => clearTimeout(debounceTimer)
}, [newWordData.word, newWordData.phoneme, generatePhoneme, isGenerating])

  // Search for existing words
  const searchWords = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/words/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.words || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle manual phoneme generation
  const handleManualGenerate = async (word: string, isNewWord: boolean = true) => {
    if (!word.trim()) return
    
    clearError()
    const phoneme = await generatePhoneme(word.trim())
    
    if (phoneme) {
      if (isNewWord) {
        setNewWordData(prev => ({ ...prev, phoneme }))
      } else {
        setImproveData(prev => ({ ...prev, phoneme }))
      }
    }
  }

  // Submit new word contribution
  const submitNewWord = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const newErrors: Record<string, string> = {}
    
    if (!newWordData.word.trim()) newErrors.word = 'Ga word is required'
    if (!newWordData.meaning.trim()) newErrors.meaning = 'English meaning is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ADD_WORD',
          proposedData: newWordData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contribution')
      }

      setSuccess(true)
      setNewWordData({
        word: '',
        phoneme: '',
        meaning: '',
        partOfSpeech: '',
        exampleUsage: '',
        notes: ''
      })

      setTimeout(() => setSuccess(false), 5000)
      
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to submit contribution' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Submit improvement contribution
  const submitImprovement = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session || !selectedWord) return

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPDATE_WORD',
          wordId: selectedWord.id,
          proposedData: {
            word: selectedWord.word,
            meaning: improveData.meaning || selectedWord.meaning,
            phoneme: improveData.phoneme || selectedWord.phoneme,
            partOfSpeech: improveData.partOfSpeech || selectedWord.partOfSpeech,
            exampleUsage: improveData.exampleUsage || selectedWord.exampleUsage,
            reason: improveData.notes
          }
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit improvement')
      }

      setSuccess(true)
      setImproveData({
        meaning: '',
        phoneme: '',
        partOfSpeech: '',
        exampleUsage: '',
        notes: ''
      })
      setSelectedWord(null)

      setTimeout(() => setSuccess(false), 5000)
      
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to submit improvement' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contribute to the Ga Dictionary
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help preserve and expand the Ga language by contributing new words, improving existing entries, or reporting issues. 
            <span className="text-yellow-600 font-semibold"> Phonemes are auto-generated!</span>
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Your contribution has been submitted successfully and is pending review!
            </div>
          </div>
        )}

        {/* Contribution Type Selection */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setSelectedOption('ADD_WORD')
                setSelectedWord(null)
                setErrors({})
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedOption === 'ADD_WORD'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-300'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add New Word
            </button>
            <button
              onClick={() => {
                setSelectedOption('UPDATE_WORD')
                setNewWordData({
                  word: '',
                  phoneme: '',
                  meaning: '',
                  partOfSpeech: '',
                  exampleUsage: '',
                  notes: ''
                })
                setErrors({})
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedOption === 'UPDATE_WORD'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-300'
              }`}
            >
              <Edit3 className="w-5 h-5 inline mr-2" />
              Improve Existing
            </button>
          </div>
        </div>

        {/* Add New Word Form */}
        {selectedOption === 'ADD_WORD' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Ga Word</h2>
                <p className="text-gray-600">The phoneme will be automatically generated when you type the Ga word.</p>
              </div>

              <form onSubmit={submitNewWord} className="space-y-6">
                {/* Ga Word Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ga Word <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newWordData.word}
                    onChange={(e) => setNewWordData(prev => ({ ...prev, word: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.word ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter the Ga word"
                  />
                  {errors.word && <p className="text-red-500 text-sm mt-1">{errors.word}</p>}
                </div>

                {/* Auto-generated Phoneme Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phoneme (Auto-generated)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newWordData.phoneme}
                      onChange={(e) => setNewWordData(prev => ({ ...prev, phoneme: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Will be auto-generated..."
                    />
                    <button
                      type="button"
                      onClick={() => handleManualGenerate(newWordData.word, true)}
                      disabled={!newWordData.word.trim() || isGenerating}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-yellow-600 disabled:opacity-50"
                      title="Generate phoneme"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Wand2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Status Messages */}
                  {isGenerating && (
                    <p className="text-blue-600 text-sm mt-1 flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      Generating phoneme...
                    </p>
                  )}
                  {g2pError && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {g2pError}
                    </p>
                  )}
                  {newWordData.phoneme && !isGenerating && !g2pError && (
                    <p className="text-green-600 text-sm mt-1 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Phoneme auto-generated (you can edit it)
                    </p>
                  )}
                  
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Example:</span> {`"duade" → "d ù à d è" `}| 
                      <a 
                        href="https://ipa.typeit.org/full/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-900 ml-1"
                      >
                        IPA TypeIt
                      </a>
                      {' '}for special characters
                    </p>
                  </div>
                </div>

                {/* English Meaning */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Meaning <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newWordData.meaning}
                    onChange={(e) => setNewWordData(prev => ({ ...prev, meaning: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.meaning ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="What does this word mean in English?"
                  />
                  {errors.meaning && <p className="text-red-500 text-sm mt-1">{errors.meaning}</p>}
                </div>

                {/* Part of Speech */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part of Speech
                  </label>
                  <select
                    value={newWordData.partOfSpeech}
                    onChange={(e) => setNewWordData(prev => ({ ...prev, partOfSpeech: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example Usage
                  </label>
                  <textarea
                    value={newWordData.exampleUsage}
                    onChange={(e) => setNewWordData(prev => ({ ...prev, exampleUsage: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Show how this word is used in a sentence"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={newWordData.notes}
                    onChange={(e) => setNewWordData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Any additional context or notes"
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit New Word'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Improve Existing Word Form */}
        {selectedOption === 'UPDATE_WORD' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Improve Existing Word</h2>
                <p className="text-gray-600">Search for a word and add missing information.</p>
              </div>

              {!selectedWord ? (
                // Word Search
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for word to improve
                  </label>
                  <input
                    type="text"
                    onChange={(e) => searchWords(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Type a Ga word to search..."
                  />
                  
                  {searchLoading && (
                    <div className="mt-2 text-center">
                      <Loader2 className="w-5 h-5 animate-spin inline" />
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-lg divide-y">
                      {searchResults.map((word) => (
                        <button
                          key={word.id}
                          onClick={() => setSelectedWord(word)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{word.word}</div>
                          <div className="text-sm text-gray-600">
                            {word.meaning} | {word.phoneme || 'No phoneme'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Improvement Form
                <form onSubmit={submitImprovement} className="space-y-6">
                  {/* Selected Word Display */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Selected Word: {selectedWord.word}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Current meaning: {selectedWord.meaning}</div>
                      <div>Current phoneme: {selectedWord.phoneme || 'None'}</div>
                      {selectedWord.partOfSpeech && <div>Part of speech: {selectedWord.partOfSpeech}</div>}
                      {selectedWord.exampleUsage && <div>Example: {selectedWord.exampleUsage}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedWord(null)}
                      className="mt-2 text-sm text-yellow-600 hover:text-yellow-800"
                    >
                      Choose different word
                    </button>
                  </div>

                  {/* Improvement Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Improve Meaning
                    </label>
                    <input
                      type="text"
                      value={improveData.meaning}
                      onChange={(e) => setImproveData(prev => ({ ...prev, meaning: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Provide better or additional meaning"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Improve Phoneme
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={improveData.phoneme}
                        onChange={(e) => setImproveData(prev => ({ ...prev, phoneme: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Provide or correct phoneme"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualGenerate(selectedWord.word, false)}
                        disabled={isGenerating}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-yellow-600 disabled:opacity-50"
                        title="Generate phoneme"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Wand2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Part of Speech
                    </label>
                    <select
                      value={improveData.partOfSpeech}
                      onChange={(e) => setImproveData(prev => ({ ...prev, partOfSpeech: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Select part of speech</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Example Usage
                    </label>
                    <textarea
                      value={improveData.exampleUsage}
                      onChange={(e) => setImproveData(prev => ({ ...prev, exampleUsage: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Show how this word is used in a sentence"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={improveData.notes}
                      onChange={(e) => setImproveData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Explain your improvements"
                    />
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {errors.submit}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Improvement'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Authentication Message */}
        {!session && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg text-center">
              <p className="mb-3">You need to be signed in to contribute to the dictionary.</p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Sign In to Contribute
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How G2P Auto-generation Works</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">🤖 Automatic Generation</h4>
                <p>When you type a Ga word, our AI model automatically generates the phoneme pronunciation. This saves time and ensures consistency.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✏️ Edit Capability</h4>
                <p>You can always edit the auto-generated phoneme. The AI is smart but human expertise is invaluable for accuracy.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 Manual Regeneration</h4>
                <p>Click the magic wand icon to regenerate the phoneme anytime, or clear the field to trigger auto-generation again.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">👨‍🏫 Expert Review</h4>
                <p>All contributions go through expert linguistic review before being published to ensure quality and accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}