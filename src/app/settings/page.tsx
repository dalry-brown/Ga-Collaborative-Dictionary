// app/settings/page.tsx - User Settings Page with Suspense Boundary

"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Shield,
  Bell,
  Eye,
  Mail,
  Key,
  Trash2,
  Save,
  AlertTriangle,
  Home
} from "lucide-react"

interface UserSettings {
  emailNotifications: boolean
  contributionNotifications: boolean
  flagNotifications: boolean
  profileVisibility: "PUBLIC" | "PRIVATE"
  showEmail: boolean
  showLocation: boolean
}

function SettingsContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    contributionNotifications: true,
    flagNotifications: true,
    profileVisibility: "PUBLIC",
    showEmail: false,
    showLocation: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        'my-contributions': { path: '/my-contributions', label: 'Back to My Contributions' },
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
      router.push("/auth/signin?callbackUrl=/settings")
      return
    }
    
    fetchSettings()
  }, [session, router])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/settings")
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")
      
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update settings")
      }
      
      setSuccess("Settings updated successfully")
      setTimeout(() => setSuccess(""), 3000)
      
    } catch (error) {
      console.error("Error updating settings:", error)
      setError(error instanceof Error ? error.message : "Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE"
      })
      
      if (response.ok) {
        router.push("/auth/signin?message=account-deleted")
      } else {
        throw new Error("Failed to delete account")
      }
    } catch (error) {
      setError("Failed to delete account. Please contact support.")
    }
  }

  if (loading) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-lg font-medium text-gray-900">Account Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive email updates about important activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Contribution Updates</label>
                  <p className="text-sm text-gray-500">Get notified when your contributions are reviewed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.contributionNotifications}
                    onChange={(e) => setSettings({ ...settings, contributionNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Flag Updates</label>
                  <p className="text-sm text-gray-500">{`Receive updates on flags you've submitted`}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.flagNotifications}
                    onChange={(e) => setSettings({ ...settings, flagNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Profile Visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as "PUBLIC" | "PRIVATE" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PUBLIC">Public - Visible to all users</option>
                  <option value="PRIVATE">Private - Only visible to administrators</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Show Email Address</label>
                  <p className="text-sm text-gray-500">Display your email on your public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Show Location</label>
                  <p className="text-sm text-gray-500">Display your location on your public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showLocation}
                    onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Account Security</h2>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
                <span className="text-sm text-green-600 font-medium">Verified</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Authentication</h3>
                    <p className="text-sm text-gray-500">Signed in with Google OAuth</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow rounded-lg border-l-4 border-red-400">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Danger Zone</h2>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <div className="flex space-x-2">
                  {showDeleteConfirm ? (
                    <>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Confirm Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}