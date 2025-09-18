// app/my-contributions/page.tsx - User Contribution History with Smart Back Navigation

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Plus,
  Edit3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  Home
} from "lucide-react"

interface Contribution {
  id: string
  type: string
  status: string
  createdAt: string
  reviewedAt: string | null
  reviewNotes: string | null
  data: {
    word?: string
    meaning?: string
    phoneme?: string
    description?: string
  }
  reviewedBy?: {
    name: string | null
    role: string
  } | null
}

interface ContributionsResponse {
  contributions: Contribution[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    total: number
    approved: number
    pending: number
    rejected: number
  }
}

export default function MyContributionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  })

  // Smart back navigation
  const getBackButtonConfig = () => {
    const from = searchParams.get('from')
    const referer = searchParams.get('ref')
    
    // Priority order: from param > referer param > browser history > home
    if (from) {
      const routes: Record<string, { path: string; label: string }> = {
        'profile': { path: '/profile', label: 'Back to Profile' },
        'dashboard': { path: '/dashboard', label: 'Back to Dashboard' },
        'admin': { path: '/admin', label: 'Back to Admin' },
        'browse': { path: '/browse', label: 'Back to Browse' },
        'contribute': { path: '/contribute', label: 'Back to Contribute' },
        'home': { path: '/', label: 'Back to Home' }
      }
      return routes[from] || { path: '/', label: 'Back to Home' }
    }
    
    if (referer) {
      return { path: referer, label: 'Go Back' }
    }
    
    // Default fallback
    return { path: '/', label: 'Back to Home' }
  }

  const handleBackNavigation = () => {
    const backConfig = getBackButtonConfig()
    
    // Try browser back first if no specific route is set
    if (!searchParams.get('from') && !searchParams.get('ref')) {
      if (window.history.length > 1) {
        router.back()
        return
      }
    }
    
    // Otherwise use the configured path
    router.push(backConfig.path)
  }

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/my-contributions")
      return
    }
    
    fetchContributions()
  }, [session, router, currentPage, statusFilter, typeFilter])

  const fetchContributions = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10"
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

      const response = await fetch(`/api/user/contributions?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch contributions")
      }

      const data: ContributionsResponse = await response.json()
      setContributions(data.contributions)
      setTotalPages(data.pagination.pages)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching contributions:", error)
      setError("Failed to load contributions")
    } finally {
      setLoading(false)
    }
  }

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

  const backConfig = getBackButtonConfig()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackNavigation}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {backConfig.label}
              </button>
            </div>
            <h1 className="text-lg font-medium text-gray-900">My Contributions</h1>
            <Link
              href="/contribute"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Contribution
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

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
                    placeholder="Search by word or description..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
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
                <option value="PENDING">Pending</option>
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

        {/* Contributions List */}
        <div className="bg-white shadow rounded-lg">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {contributions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-sm font-medium ${getTypeColor(contribution.type)}`}>
                          {getContributionTypeLabel(contribution.type)}
                        </span>
                        {getStatusBadge(contribution.status)}
                      </div>
                      
                      {/* Contribution Content */}
                      <div className="mb-3">
                        {contribution.data.word && (
                          <div className="mb-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {contribution.data.word}
                            </span>
                            {contribution.data.phoneme && (
                              <span className="ml-2 text-blue-600 italic">
                                /{contribution.data.phoneme}/
                              </span>
                            )}
                          </div>
                        )}
                        
                        {contribution.data.meaning && (
                          <p className="text-gray-700 mb-2">{contribution.data.meaning}</p>
                        )}
                        
                        {contribution.data.description && (
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                            {contribution.data.description}
                          </p>
                        )}
                      </div>

                      {/* Review Information */}
                      {contribution.status !== "PENDING" && (
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                Submitted: {new Date(contribution.createdAt).toLocaleDateString()}
                              </div>
                              {contribution.reviewedAt && (
                                <div className="flex items-center text-gray-500">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Reviewed: {new Date(contribution.reviewedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            {contribution.reviewedBy && (
                              <div className="text-gray-500">
                                by {contribution.reviewedBy.name || 'Admin'} ({contribution.reviewedBy.role})
                              </div>
                            )}
                          </div>
                          
                          {contribution.reviewNotes && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="text-sm font-medium text-blue-900 mb-1">Review Notes:</div>
                              <div className="text-sm text-blue-800">{contribution.reviewNotes}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Menu */}
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any contributions yet"}
              </p>
              <Link
                href="/contribute"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Make Your First Contribution
              </Link>
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
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">About Contributions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Pending:</strong> Your contribution is waiting for review by our moderation team.</p>
            <p><strong>Approved:</strong> Your contribution has been accepted and published to the dictionary.</p>
            <p><strong>Rejected:</strong> Your contribution needs revision. Check the review notes for details.</p>
            <p><strong>Needs Review:</strong> Your contribution requires additional verification from language experts.</p>
            <p className="mt-4">Thank you for helping us build the most comprehensive Ga dictionary!</p>
          </div>
        </div>
      </div>
    </div>
  )
}