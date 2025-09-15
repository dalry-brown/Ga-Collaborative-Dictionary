// app/admin/users/[id]/page.tsx - User Management Detail Page

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  FileText,
  AlertTriangle,
  Shield,
  Save,
  Trash2,
  Eye
} from "lucide-react"

interface UserContribution {
  id: string
  type: string
  status: string
  createdAt: string
  proposedData: {
    word?: string
    meaning?: string
    phoneme?: string
  }
}

interface UserFlag {
  id: string
  reason: string
  status: string
  createdAt: string
}

interface UserDetail {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  bio: string | null
  expertise: string | null
  location: string | null
  contributionCount: number
  approvalCount: number
  reputation: number
  createdAt: string
  lastActive: string
  contributions: UserContribution[]
  flags: UserFlag[]
}

export default function UserManagementPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [selectedRole, setSelectedRole] = useState("")
  const [bio, setBio] = useState("")
  const [expertise, setExpertise] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      router.push("/")
      return
    }

    fetchUser()
  }, [session, router, params.id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch user")
      }

      const data = await response.json()
      const userData = data.user
      setUser(userData)
      
      // Initialize form state
      setSelectedRole(userData.role)
      setBio(userData.bio || "")
      setExpertise(userData.expertise || "")
      setLocation(userData.location || "")
      
    } catch (error) {
      console.error("Error fetching user:", error)
      setError("Failed to load user")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!user) return

    try {
      setSaving(true)
      setError("")
      
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: selectedRole,
          bio: bio.trim() || null,
          expertise: expertise.trim() || null,
          location: location.trim() || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      setSuccess("User updated successfully")
      await fetchUser() // Refresh user data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)

    } catch (error) {
      console.error("Error updating user:", error)
      setError(error instanceof Error ? error.message : "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!user) return

    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(true)
      setError("")
      
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      // Redirect to users list after successful deletion
      router.push("/admin/users")

    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setDeleting(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string }> = {
      USER: { color: "bg-gray-100 text-gray-800", label: "User" },
      CONTRIBUTOR: { color: "bg-blue-100 text-blue-800", label: "Contributor" },
      MODERATOR: { color: "bg-purple-100 text-purple-800", label: "Moderator" },
      EXPERT: { color: "bg-green-100 text-green-800", label: "Expert" },
      ADMIN: { color: "bg-red-100 text-red-800", label: "Admin" }
    }
    
    const config = roleConfig[role] || roleConfig.USER
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Shield className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
      OPEN: { color: "bg-red-100 text-red-800", label: "Open" },
      RESOLVED: { color: "bg-green-100 text-green-800", label: "Resolved" }
    }
    
    const config = statusConfig[status] || statusConfig.PENDING
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getContributionTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'ADD_WORD': 'New Word',
      'UPDATE_WORD': 'Update Word',
      'ADD_PHONEME': 'Add Phoneme',
      'ADD_MEANING': 'Add Meaning',
      'CORRECT_ERROR': 'Error Report'
    }
    return typeLabels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link href="/admin/users" className="text-blue-600 hover:text-blue-500">
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">User not found</div>
          <Link href="/admin/users" className="text-blue-600 hover:text-blue-500">
            Back to Users
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
              <Link href="/admin/users" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Users
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Manage User</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                <div className="text-center">
                  <div className="relative inline-block">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h1 className="mt-4 text-xl font-bold text-white">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  <div className="mt-3 flex justify-center">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span>{user.reputation} reputation points</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{user.approvalCount}/{user.contributionCount} contributions approved</span>
                  </div>

                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Management Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Update User Information</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="CONTRIBUTOR">Contributor</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="EXPERT">Expert</option>
                    {session?.user?.role === "ADMIN" && (
                      <option value="ADMIN">Admin</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="User bio..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Areas of expertise..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleUpdateUser}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {session?.user?.role === "ADMIN" && user.id !== session.user.id && (
                  <button
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? "Deleting..." : "Delete User"}
                  </button>
                )}
              </div>
            </div>

            {/* Recent Contributions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contributions</h3>
              {user.contributions.length > 0 ? (
                <div className="space-y-3">
                  {user.contributions.map((contribution) => (
                    <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getContributionTypeLabel(contribution.type)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contribution.proposedData.word || "N/A"} - {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(contribution.status)}
                        <Link
                          href={`/admin/contributions/${contribution.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No contributions yet</p>
              )}
            </div>

            {/* Recent Flags */}
            {user.flags.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Flags</h3>
                <div className="space-y-3">
                  {user.flags.map((flag) => (
                    <div key={flag.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {flag.reason.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(flag.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(flag.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}