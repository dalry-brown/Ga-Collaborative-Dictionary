// app/profile/page.tsx - Fixed User Profile Page with Navigation

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { 
  User, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Mail, 
  Calendar,
  Award,
  BookOpen,
  Flag,
  Clock,
  ChevronLeft,
  ArrowLeft
} from "lucide-react"

interface UserProfile {
  id: string
  name: string | null
  email: string | null
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
}

interface EditableProfile {
  name: string
  bio: string
  expertise: string
  location: string
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editForm, setEditForm] = useState<EditableProfile>({
    name: "",
    bio: "",
    expertise: "",
    location: ""
  })

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/profile")
      return
    }
    
    fetchProfile()
  }, [session, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/profile")
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      
      const data = await response.json()
      setProfile(data.profile)
      
      // Initialize edit form
      setEditForm({
        name: data.profile.name || "",
        bio: data.profile.bio || "",
        expertise: data.profile.expertise || "",
        location: data.profile.location || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError("")
      
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }
      
      const data = await response.json()
      setProfile(data.profile)
      setEditing(false)
      
      // Update session if name changed
      if (editForm.name !== session?.user?.name) {
        await update({ name: editForm.name })
      }
      
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        bio: profile.bio || "",
        expertise: profile.expertise || "",
        location: profile.location || ""
      })
    }
    setEditing(false)
    setError("")
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      USER: "bg-gray-100 text-gray-800",
      CONTRIBUTOR: "bg-blue-100 text-blue-800",
      MODERATOR: "bg-purple-100 text-purple-800",
      EXPERT: "bg-green-100 text-green-800",
      ADMIN: "bg-red-100 text-red-800"
    }
    return roleColors[role] || "bg-gray-100 text-gray-800"
  }

        if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
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
            <div className="text-red-600 mb-4">{error || "Profile not found"}</div>
            <button
              onClick={handleGoBack}
              className="text-blue-600 hover:text-blue-500"
            >
              Go Back
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
                <span className="text-gray-900 font-medium">Profile</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || "User Profile"}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                      {profile.role}
                    </span>
                    <span className="text-sm text-gray-500">
                      Member since {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Accra, Ghana"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profile.location || "Not provided"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself and your interest in Ga language..."
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio || "No bio provided"}</p>
                  )}
                  {editing && (
                    <p className="text-xs text-gray-500 mt-1">
                      {editForm.bio.length}/500 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.expertise}
                      onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Native speaker, Linguist, Teacher, etc."
                    />
                  ) : (
                    <p className="text-gray-900">{profile.expertise || "Not specified"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{profile.contributionCount}</div>
                  <div className="text-sm text-gray-600">Contributions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{profile.approvalCount}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{profile.reputation}</div>
                  <div className="text-sm text-gray-600">Reputation</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-xs font-medium text-orange-600">Last Active</div>
                  <div className="text-sm text-gray-600">
                    {new Date(profile.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/contribute"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Add New Words
                </Link>
                <Link
                  href="/my-contributions"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  My Contributions
                </Link>
                <Link
                  href="/flags"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Flag className="w-4 h-4 mr-3" />
                  My Flags
                </Link>
                <Link
                  href="/settings"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Account Settings
                </Link>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Current Role:</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                      {profile.role}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Member Since:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Approval Rate:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {profile.contributionCount > 0 
                      ? `${Math.round((profile.approvalCount / profile.contributionCount) * 100)}%`
                      : "No contributions yet"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}