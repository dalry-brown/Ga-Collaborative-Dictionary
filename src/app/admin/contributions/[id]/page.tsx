// app/admin/contributions/[id]/page.tsx - Fixed TypeScript Issues

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye
} from "lucide-react"

interface ProposedData {
  word?: string
  phoneme?: string
  meaning?: string
  partOfSpeech?: string
  exampleUsage?: string
  reason?: string
}

interface OriginalData {
  word?: string
  phoneme?: string
  meaning?: string
  partOfSpeech?: string
  exampleUsage?: string
}

interface ContributionDetail {
  id: string
  type: string
  status: string
  proposedData: ProposedData
  originalData: OriginalData | null
  createdAt: string
  reviewedAt?: string
  reviewNotes?: string
  user: {
    name: string
    email: string
    role: string
    contributionCount: number
    approvalCount: number
  }
  word?: {
    word: string
    meaning: string
    phoneme: string
    partOfSpeech?: string
    exampleUsage?: string
  }
  reviewedBy?: {
    name: string
    role: string
  }
}

export default function ContributionReviewPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [contribution, setContribution] = useState<ContributionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      router.push("/")
      return
    }

    fetchContribution()
  }, [session, router, params.id])

  const fetchContribution = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/contributions/${params.id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch contribution")
      }

      const data = await response.json()
      setContribution(data.contribution)
    } catch (error) {
      console.error("Error fetching contribution:", error)
      setError("Failed to load contribution")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (action: "APPROVE" | "REJECT") => {
    if (!contribution || contribution.status !== "PENDING") {
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/contributions/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          notes: reviewNotes.trim() || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to review contribution")
      }

      // Refresh the contribution data
      await fetchContribution()
      
      // Show success message and redirect after delay
      setTimeout(() => {
        router.push("/admin/contributions")
      }, 2000)

    } catch (error) {
      console.error("Error reviewing contribution:", error)
      setError(error instanceof Error ? error.message : "Failed to review contribution")
    } finally {
      setSubmitting(false)
    }
  }

  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'ADD_WORD': 'Add New Word',
      'UPDATE_WORD': 'Update Word',
      'ADD_PHONEME': 'Add Phoneme',
      'ADD_MEANING': 'Add Meaning',
      'CORRECT_ERROR': 'Report Error'
    }
    return typeLabels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !contribution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || "Contribution not found"}</div>
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
        {/* Contribution Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getTypeLabel(contribution.type)}</h2>
              <p className="text-sm text-gray-500">Submitted {new Date(contribution.createdAt).toLocaleString()}</p>
            </div>
            {getStatusBadge(contribution.status)}
          </div>

          {/* Contributor Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Contributor</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium">{contribution.user.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{contribution.user.role}</span>
              </div>
              <div className="text-sm text-gray-500">
                {contribution.user.approvalCount}/{contribution.user.contributionCount} approved
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Current/Original Data */}
          {contribution.originalData && (
            <div className="bg-white shadow rounded-lg p-6">
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
                {contribution.originalData.partOfSpeech && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Part of Speech</label>
                    <p className="text-gray-900">{contribution.originalData.partOfSpeech}</p>
                  </div>
                )}
                {contribution.originalData.exampleUsage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Example Usage</label>
                    <p className="text-gray-900">{contribution.originalData.exampleUsage}</p>
                  </div>
                )}
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
        {contribution.status === "PENDING" ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review This Contribution</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about your decision..."
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => handleReview("APPROVE")}
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {submitting ? "Processing..." : "Approve"}
              </button>
              
              <button
                onClick={() => handleReview("REJECT")}
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {submitting ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review History</h3>
            <div className="space-y-2">
              <p><strong>Status:</strong> {contribution.status}</p>
              {contribution.reviewedAt && (
                <p><strong>Reviewed:</strong> {new Date(contribution.reviewedAt).toLocaleString()}</p>
              )}
              {contribution.reviewedBy && (
                <p><strong>Reviewed by:</strong> {contribution.reviewedBy.name} ({contribution.reviewedBy.role})</p>
              )}
              {contribution.reviewNotes && (
                <div>
                  <strong>Review Notes:</strong>
                  <p className="mt-1 text-gray-600">{contribution.reviewNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}