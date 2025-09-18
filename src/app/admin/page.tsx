// app/admin/page.tsx - Fixed Admin Dashboard with Navigation

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Users, 
  Flag, 
  BookOpen, 
  Eye, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Settings,
  FileText,
  Shield,
  ArrowLeft,
  ChevronLeft
} from "lucide-react"

interface AdminStats {
  totalWords: number
  totalUsers: number
  pendingContributions: number
  openFlags: number
  recentActivity: {
    newUsers: number
    newContributions: number
    resolvedFlags: number
  }
  usersByRole: {
    [key: string]: number
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
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

    fetchStats()
  }, [session, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      
      if (!response.ok) {
        throw new Error("Failed to fetch admin stats")
      }

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
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
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation for Error State */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Professional Corner Placement */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <nav className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronLeft className="w-4 h-4 mx-1 rotate-180 text-gray-300" />
                <span className="text-gray-900 font-medium">Admin</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage the Ga Dictionary platform</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Welcome back, {session?.user?.name || session?.user?.email}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Words</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalWords?.toLocaleString() || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalUsers?.toLocaleString() || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.pendingContributions || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Flag className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Flags</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.openFlags || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/contributions" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Review Contributions</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.pendingContributions || 0} pending review
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/flags" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <Flag className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Handle Flags</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.openFlags || 0} open flags
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.totalUsers || 0} total users
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/words" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Dictionary Management</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.totalWords?.toLocaleString() || 0} words
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/analytics" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-indigo-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      View detailed statistics
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/settings" className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-gray-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure application
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity & User Roles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity (Last 7 Days)</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">New Users</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {stats?.recentActivity?.newUsers || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">New Contributions</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {stats?.recentActivity?.newContributions || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Resolved Flags</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">
                      {stats?.recentActivity?.resolvedFlags || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Roles Distribution */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Roles Distribution</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats?.usersByRole && Object.entries(stats.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {role.toLowerCase()}
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (count / (stats.totalUsers || 1)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Banner */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Admin Quick Actions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Manage the Ga Dictionary platform efficiently
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/admin/contributions"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Queue
                </Link>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}