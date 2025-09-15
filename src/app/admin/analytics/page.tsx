// app/admin/analytics/page.tsx - Analytics Dashboard

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalWords: number
    totalUsers: number
    totalContributions: number
    totalFlags: number
    completionRate: number
    approvalRate: number
  }
  timeSeriesData: {
    date: string
    newWords: number
    newUsers: number
    contributions: number
    flags: number
  }[]
  contributionsByType: {
    type: string
    count: number
    percentage: number
  }[]
  topContributors: {
    name: string
    contributionCount: number
    approvalRate: number
    role: string
  }[]
  languageCompletion: {
    totalWords: number
    completeWords: number
    incompleteWords: number
    missingPhoneme: number
    missingMeaning: number
    missingUsage: number
  }
  userGrowth: {
    period: string
    newUsers: number
    activeUsers: number
    retentionRate: number
  }[]
  flagAnalytics: {
    reasonBreakdown: {
      reason: string
      count: number
    }[]
    resolutionTime: {
      average: number
      median: number
    }
    resolutionRate: number
  }
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("30") // days
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role)) {
      router.push("/")
      return
    }

    fetchAnalytics()
  }, [session, router, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?timeRange=${timeRange}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ga-dictionary-analytics-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting analytics:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
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
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={exportAnalytics}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Words</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics?.overview.totalWords?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics?.overview.totalUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Contributions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics?.overview.totalContributions?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics?.overview.completionRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Approval Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics?.overview.approvalRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Over Time</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              {analytics?.timeSeriesData && analytics.timeSeriesData.length > 0 ? (
                <div className="w-full">
                  <div className="space-y-2">
                    {analytics.timeSeriesData.slice(-7).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <div className="flex space-x-4">
                          <span className="text-blue-600">{item.newWords} words</span>
                          <span className="text-green-600">{item.newUsers} users</span>
                          <span className="text-purple-600">{item.contributions} contributions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                "Chart visualization would be implemented with a charting library"
              )}
            </div>
          </div>

          {/* Contribution Types */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contributions by Type</h3>
            <div className="space-y-3">
              {analytics?.contributionsByType?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{item.count}</span>
                  </div>
                </div>
              )) || <div className="text-gray-500 text-center">No data available</div>}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {analytics?.topContributors?.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                    <p className="text-xs text-gray-500">{contributor.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{contributor.contributionCount}</p>
                    <p className="text-xs text-green-600">{contributor.approvalRate}% approved</p>
                  </div>
                </div>
              )) || <div className="text-gray-500 text-center">No data available</div>}
            </div>
          </div>

          {/* Language Completion */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dictionary Completion</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Complete Entries</span>
                <span className="text-sm font-medium text-green-600">
                  {analytics?.languageCompletion?.completeWords || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Missing Phoneme</span>
                <span className="text-sm font-medium text-yellow-600">
                  {analytics?.languageCompletion?.missingPhoneme || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Missing Usage</span>
                <span className="text-sm font-medium text-red-600">
                  {analytics?.languageCompletion?.missingUsage || 0}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                  <span className="text-sm font-bold text-blue-600">
                    {analytics?.overview.completionRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analytics?.overview.completionRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Flag Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flag Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {analytics?.flagAnalytics?.resolutionRate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Resolution Time</span>
                <span className="text-sm font-medium text-blue-600">
                  {analytics?.flagAnalytics?.resolutionTime?.average?.toFixed(1) || 0} days
                </span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-gray-900 mb-2">Common Issues:</p>
                {analytics?.flagAnalytics?.reasonBreakdown?.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{reason.reason}</span>
                    <span className="font-medium">{reason.count}</span>
                  </div>
                )) || <div className="text-gray-500 text-xs">No data available</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Dictionary Growth</p>
              <p className="text-blue-700">
                The dictionary has grown by {analytics?.timeSeriesData?.reduce((sum, item) => sum + item.newWords, 0) || 0} words 
                in the last {timeRange} days.
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">User Engagement</p>
              <p className="text-blue-700">
                {analytics?.overview.approvalRate && analytics.overview.approvalRate > 80 
                  ? "High quality contributions with excellent approval rate."
                  : "Consider improving contribution guidelines for better quality."
                }
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Content Quality</p>
              <p className="text-blue-700">
                {analytics?.overview.completionRate && analytics.overview.completionRate > 70
                  ? "Dictionary entries are well-documented."
                  : "Focus on completing missing phonemes and usage examples."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}