// app/admin/flags/page.tsx - Fixed Admin Flags Page

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  User
} from "lucide-react"

interface WordFlag {
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
    phoneme: string | null
  }
  user: {
    name: string | null
    email: string | null
    role: string
  } | null
  resolvedBy?: {
    name: string | null
    role: string
  } | null
}

interface FlagsResponse {
  flags: WordFlag[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminFlagsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [flags, setFlags] = useState<WordFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [reasonFilter, setReasonFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      router.push("/")
      return
    }

    const fetchFlags = async () => {
      try {
        setLoading(true)
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20"
        })

        if (statusFilter !== "all") {
          params.append("status", statusFilter)
        }
        if (reasonFilter !== "all") {
          params.append("reason", reasonFilter)
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim())
        }

        const response = await fetch(`/api/admin/flags?${params}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch flags")
        }

        const data: FlagsResponse = await response.json()
        setFlags(data.flags)
        setTotalPages(data.pagination.pages)
      } catch (error) {
        console.error("Error fetching flags:", error)
        setError("Failed to load flags")
      } finally {
        setLoading(false)
      }
    }

    fetchFlags()
  }, [session, router, currentPage, statusFilter, reasonFilter, searchQuery])

  const handleSearch = () => {
    setCurrentPage(1)
    // Trigger re-fetch by updating searchQuery dependency
  }

  const getReasonLabel = (reason: string): string => {
    const reasonLabels: Record<string, string> = {
      'INCORRECT_MEANING': 'Incorrect Meaning',
      'INCORRECT_PHONEME': 'Incorrect Phoneme',
      'INAPPROPRIATE_CONTENT': 'Inappropriate Content',
      'DUPLICATE_ENTRY': 'Duplicate Entry',
      'SPAM': 'Spam',
      'OTHER': 'Other'
    }
    return reasonLabels[reason] || reason
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
      OPEN: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
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
      'INCORRECT_MEANING': 'text-yellow-600',
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
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Manage Flags</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by word or meaning..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>

            {/* Reason Filter */}
            <div className="sm:w-48">
              <select
                value={reasonFilter}
                onChange={(e) => {
                  setReasonFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reasons</option>
                <option value="INCORRECT_MEANING">Incorrect Meaning</option>
                <option value="INCORRECT_PHONEME">Incorrect Phoneme</option>
                <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                <option value="DUPLICATE_ENTRY">Duplicate Entry</option>
                <option value="SPAM">Spam</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flags Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {flags.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Word
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flags.map((flag) => (
                    <tr key={flag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {flag.word.word}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {flag.word.meaning}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getReasonColor(flag.reason)}`}>
                          {getReasonLabel(flag.reason)}
                        </div>
                        {flag.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {flag.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {flag.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {flag.user?.role || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(flag.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(flag.createdAt).toLocaleDateString()}
                        {flag.resolvedAt && (
                          <div className="text-xs text-gray-400">
                            Resolved {new Date(flag.resolvedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/flags/${flag.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Flag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No flags found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== "all" || reasonFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No flags have been reported yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}