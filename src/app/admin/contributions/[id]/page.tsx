// src/app/admin/contributions/[id]/page.tsx - Fixed with proper React Hook dependencies

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
// import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save
} from "lucide-react"

interface ContributionPageProps {
  params: Promise<{ id: string }>
}

interface Contribution {
  id: string
  type: string
  status: string
  createdAt: string
  user: {
    name: string
    email: string
    role: string
  }
  word?: {
    word: string
    meaning: string
    phoneme: string
  }
  proposedData: {
    word?: string
    meaning?: string
    phoneme?: string
    partOfSpeech?: string
    exampleUsage?: string
    reason?: string
  }
  originalData?: {
    word?: string
    meaning?: string
    phoneme?: string
    partOfSpeech?: string
    exampleUsage?: string
  }
}

export default function ContributionDetailPage({ params }: ContributionPageProps) {
  // const { data: session } = useSession()
  const router = useRouter()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [contributionId, setContributionId] = useState<string>("")

  // Extract id from async params
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params
      setContributionId(resolvedParams.id)
    }
    getId()
  }, [params])

  // Memoized fetch function to satisfy React Hook dependencies
  const fetchContribution = useCallback(async () => {
    if (!contributionId) return
    
    try {
      const response = await fetch(`/api/admin/contributions/${contributionId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contribution')
      }

      setContribution(data.contribution)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load contribution')
    } finally {
      setLoading(false)
    }
  }, [contributionId])

  useEffect(() => {
    if (contributionId) {
      fetchContribution()
    }
  }, [contributionId, fetchContribution])

  const handleApprove = async () => {
    if (!contribution) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/contributions/${contribution.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      })

      if (!response.ok) {
        throw new Error('Failed to approve contribution')
      }

      router.push('/admin/contributions?message=approved')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to approve')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!contribution) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/contributions/${contribution.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' })
      })

      if (!response.ok) {
        throw new Error('Failed to reject contribution')
      }

      router.push('/admin/contributions?message=rejected')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reject')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error && !contribution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link href="/admin/contributions" className="text-blue-600 hover:text-blue-500">
            Back to Contributions
          </Link>
        </div>
      </div>
    )
  }

  if (!contribution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Contribution not found</div>
          <Link href="/admin/contributions" className="text-blue-600 hover:text-blue-500">
            Back to Contributions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/contributions" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Contributions
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Review Contribution</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contribution Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {contribution.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </h2>
                <p className="text-sm text-gray-600">
                  Submitted by {contribution.user.name} ({contribution.user.email})
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contribution.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  contribution.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {contribution.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                  {contribution.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {contribution.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                  {contribution.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Data */}
              {contribution.originalData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Data</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Word</label>
                      <p className="text-gray-900">{contribution.originalData.word || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phoneme</label>
                      <p className="text-gray-900">{contribution.originalData.phoneme || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meaning</label>
                      <p className="text-gray-900">{contribution.originalData.meaning || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Proposed Changes */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Proposed Changes</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Word</label>
                    <p className="text-gray-900">{contribution.proposedData.word || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phoneme</label>
                    <p className="text-gray-900">{contribution.proposedData.phoneme || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Meaning</label>
                    <p className="text-gray-900">{contribution.proposedData.meaning || 'N/A'}</p>
                  </div>
                  {contribution.proposedData.partOfSpeech && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Part of Speech</label>
                      <p className="text-gray-900">{contribution.proposedData.partOfSpeech}</p>
                    </div>
                  )}
                  {contribution.proposedData.exampleUsage && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Example Usage</label>
                      <p className="text-gray-900">{contribution.proposedData.exampleUsage}</p>
                    </div>
                  )}
                  {contribution.proposedData.reason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="text-gray-900">{contribution.proposedData.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Actions */}
            {contribution.status === "PENDING" && (
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {processing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}