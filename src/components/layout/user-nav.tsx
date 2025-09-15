"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { User, LogOut, Settings, BookOpen, ChevronDown } from "lucide-react"

export function UserNav() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Show loading state
  if (status === "loading") {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  // Show sign in/up buttons if not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/auth/signin"
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/auth/signin"
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
        >
          Get Started
        </Link>
      </div>
    )
  }

  // Show user menu if authenticated
  const user = session.user
  const userInitial = user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"
  const userRole = user.role || "user"

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
          {userInitial}
        </div>
        
        {/* User Info (hidden on mobile) */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user.name || "User"}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {userRole.toLowerCase()}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user.email}
              </div>
              <div className="text-xs text-yellow-600 font-medium mt-1 capitalize">
                {userRole.toLowerCase()} account
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              <Link
                href="/my-contributions"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                My Contributions
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              <div className="border-t border-gray-100 my-1" />
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}