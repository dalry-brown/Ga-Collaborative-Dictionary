// app/admin/contributions/page.tsx - Clean Admin Contributions Review

"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar
} from "lucide-react"

interface Contribution {
  id: string
  type: string
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
    role: string
  }
  word: {
    word: string
    meaning: string
    phoneme: string | null
  } | null
  proposedData: {
    word?: string
    meaning?: string
    phoneme?: string
    description?: string
  }
  originalData?: {
    word?: string
    meaning?: string
    phoneme?: string
  }
}

interface ContributionsResponse {
  contributions: Contribution[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminContributionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("PENDING")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchContributions = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20"
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (typeFilter !== "all") {
        params.append("type", typeFilter)
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim())
      }

      const response = await fetch(`/api/admin/contributions?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch contributions")
      }

      const data: ContributionsResponse = await response.json()
      setContributions(data.contributions)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching contributions:", error)
      setError("Failed to load contributions")
    } finally {
      setLoading(false)
    }
  }, [currentPage, statusFilter, typeFilter, searchQuery])

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      router.push("/")
      return
    }

    fetchContributions()
  }, [session, router, fetchContributions])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchContributions()
  }

  const getContributionTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'ADD_WORD': 'New Word',
      'UPDATE_WORD': 'Word Update',
      'DELETE_WORD': 'Word Deletion',
      'ADD_PHONEME': 'Add Phoneme',
      'ADD_MEANING': 'Add Meaning',
      'ADD_USAGE': 'Add Usage',
      'CORRECT_ERROR': 'Error Correction'
    }
    return typeLabels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
      NEEDS_REVIEW: { color: "bg-blue-100 text-blue-800", icon: Eye }
    }
    
    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    )
  }

  const getTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'ADD_WORD': 'text-green-600',
      'UPDATE_WORD': 'text-blue-600',
      'DELETE_WORD': 'text-red-600',
      'ADD_PHONEME': 'text-purple-600',
      'ADD_MEANING': 'text-orange-600',
      'ADD_USAGE': 'text-pink-600',
      'CORRECT_ERROR': 'text-yellow-600'
    }
    return colorMap[type] || 'text-gray-600'
  }

  if (loading && contributions.length === 0) {
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
            <h1 className="text-lg font-medium text-gray-900">Review Contributions</h1>
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
                    placeholder="Search by word or user..."
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
                <option value="PENDING">Pending Only</option>
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="ADD_WORD">New Word</option>
                <option value="UPDATE_WORD">Word Update</option>
                <option value="ADD_PHONEME">Add Phoneme</option>
                <option value="ADD_MEANING">Add Meaning</option>
                <option value="CORRECT_ERROR">Error Correction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contributions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {contributions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contribution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contributor
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
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-medium ${getTypeColor(contribution.type)}`}>
                            {getContributionTypeLabel(contribution.type)}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {contribution.proposedData.word || contribution.word?.word || 'Unknown Word'}
                          </div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {contribution.proposedData.meaning || contribution.word?.meaning}
                          </div>
                          {contribution.proposedData.phoneme && (
                            <div className="text-sm text-blue-600 italic">
                              /{contribution.proposedData.phoneme}/
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contribution.user.name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {contribution.user.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contribution.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/contributions/${contribution.id}`}
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
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No contributions have been submitted yet"}
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