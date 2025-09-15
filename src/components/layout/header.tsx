// components/layout/header.tsx - Updated with Flags Integration

"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, Flag, Settings, LogOut, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Browse', href: '/browse' },
    { name: 'Contribute', href: '/contribute' },
    { name: 'About', href: '/about' },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">Ga</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Ga Dictionary</h1>
              <p className="text-xs text-gray-600 -mt-1">Advanced Ghanaian Languages</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Add My Flags link for authenticated users */}
            {session && (
              <Link
                href="/flags"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  pathname === '/flags'
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Flag className="w-4 h-4" />
                My Flags
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/browse"
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              title="Quick Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Authentication Section */}
            {status === "loading" ? (
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : session?.user ? (
              /* User Menu */
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-semibold text-sm">
                    {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-24">
                      {session.user.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {session.user.role?.toLowerCase() || "user"}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {session.user.email}
                      </div>
                      <div className="text-xs text-yellow-600 font-medium mt-1 capitalize">
                        {session.user.role?.toLowerCase() || "user"} account
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/flags"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        My Flags
                      </Link>
                      <Link
                        href="/my-contributions"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Contributions
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      
                      {/* Admin Panel for privileged users */}
                      {["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role) && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleSignOut()
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In/Up Buttons */
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {session?.user ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-900">
                      Hello, {session.user.name || "User"}
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:text-orange-600 text-base"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/flags"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-orange-600 text-base"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      My Flags
                    </Link>
                    <Link
                      href="/my-contributions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:text-orange-600 text-base"
                    >
                      My Contributions
                    </Link>
                    {["ADMIN", "MODERATOR", "EXPERT"].includes(session.user.role) && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-purple-700 hover:text-purple-800 text-base"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleSignOut()
                      }}
                      className="block w-full text-left px-3 py-2 text-red-700 hover:text-red-800 text-base"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:text-orange-600 text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block mx-3 mt-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg text-base font-medium text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}