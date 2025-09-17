// app/flags/page.tsx - User Flag History Page

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Flag, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Calendar
} from "lucide-react"

interface UserFlag {
  id: string
  reason: string
  description: string
  status: string
  createdAt: string
  resolvedAt: string | null
  resolution: string | null
  word: {
    word: string
    meaning: string
    phoneme: string
  }
  resolvedBy?: {
    name: string
  }
}

interface FlagsResponse {
  flags: UserFlag[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function UserFlagsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [flags, setFlags] = useState<UserFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin?callbackUrl=/flags")
      return
    }

    fetchFlags()
  }, [session, status, router, currentPage])

  const fetchFlags = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10"
      })

      const response = await fetch(`/api/flags?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch flags")
      }

      const data: FlagsResponse = await response.json()
      setFlags(data.flags)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching flags:", error)
      setError("Failed to load your flags")
    } finally {
      setLoading(false)
    }
  }

  const getReasonLabel = (reason: string): string => {
    const reasonLabels: Record<string, string> = {
      'INCORRECT_MEANING': 'Incorrect Meaning',
      'INCORRECT_PHONEME': 'Incorrect Pronunciation',
      'INAPPROPRIATE_CONTENT': 'Inappropriate Content',
      'DUPLICATE_ENTRY': 'Duplicate Entry',
      'SPAM': 'Spam',
      'OTHER': 'Other'
    }
    return reasonLabels[reason] || reason
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
      OPEN: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      REVIEWED: { color: "bg-blue-100 text-blue-800", icon: Eye },
      RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      DISMISSED: { color: "bg-gray-100 text-gray-800", icon: XCircle }
    }
    
    const config = statusConfig[status] || statusConfig.OPEN
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    )
  }

  const getReasonColor = (reason: string): string => {
    const colorMap: Record<string, string> = {
      'INCORRECT_MEANING': 'text-amber-600',
      'INCORRECT_PHONEME': 'text-blue-600',
      'INAPPROPRIATE_CONTENT': 'text-red-600',
      'DUPLICATE_ENTRY': 'text-purple-600',
      'SPAM': 'text-orange-600',
      'OTHER': 'text-gray-600'
    }
    return colorMap[reason] || 'text-gray-600'
  }

  if (loading && flags.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dictionary
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">My Flags</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Flagged Words</h2>
          <p className="text-gray-600">
            {`Track the status of words you've reported for review by our moderation team.`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}

        {/* Flags List */}
        {flags.length > 0 ? (
          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Flag Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{flag.word.word}</h3>
                      {getStatusBadge(flag.status)}
                    </div>
                    <p className="text-sm text-blue-600 italic mb-1">/{flag.word.phoneme}/</p>
                    <p className="text-gray-700 mb-2">{flag.word.meaning}</p>
                  </div>
                </div>

                {/* Flag Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Flag Reason</h4>
                      <p className={`text-sm font-medium ${getReasonColor(flag.reason)}`}>
                        {getReasonLabel(flag.reason)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Date Reported</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Your Description</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                      {flag.description}
                    </p>
                  </div>

                  {/* Resolution Info */}
                  {flag.status !== "OPEN" && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Resolution</h4>
                      <div className="space-y-2">
                        {flag.resolvedAt && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Resolved:</span> {new Date(flag.resolvedAt).toLocaleDateString()}
                            {flag.resolvedBy && (
                              <span className="ml-2">by {flag.resolvedBy.name}</span>
                            )}
                          </p>
                        )}
                        {flag.resolution && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-900">{flag.resolution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flags submitted</h3>
            <p className="text-gray-500 mb-6">
              {`You haven't flagged any words yet. Help us improve the dictionary by reporting issues you find.`}
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Dictionary
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">About Flagging</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Open:</strong> Your flag is waiting for moderator review.
            </p>
            <p>
              <strong>Resolved:</strong> The moderator found the issue valid and took action.
            </p>
            <p>
              <strong>Dismissed:</strong> The moderator determined the content is acceptable.
            </p>
            <p className="mt-3">
              Thank you for helping us maintain the quality of the Ga Dictionary!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}