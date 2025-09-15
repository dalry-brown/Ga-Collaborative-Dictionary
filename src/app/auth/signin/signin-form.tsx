// app/auth/signin/signin-form.tsx - Sign In Form Component

"use client"

import { signIn, getProviders } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BuiltInProviderType } from "next-auth/providers/index"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react"

export default function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const urlError = searchParams.get("error")
  const message = searchParams.get("message")
  
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const [loading, setLoading] = useState(false)
  const [credentialsLoading, setCredentialsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    loadProviders()
  }, [])

  // Clear errors when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: "" }))
    }
    if (error) setError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: "" }))
    }
    if (error) setError("")
  }

  const validateFields = () => {
    const errors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 3) {
      errors.password = "Password is too short"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      await signIn("google", { 
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error("Google sign in error:", error)
      setError("Failed to sign in with Google. Please try again.")
      setLoading(false)
    }
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateFields()) {
      return
    }

    setCredentialsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        // Handle specific error types
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (result.error === "Configuration") {
          setError("Authentication service is temporarily unavailable. Please try again later.")
        } else {
          setError("Sign in failed. Please try again.")
        }
        console.error("Sign in failed:", result.error)
      } else if (result?.ok) {
        // Success - redirect will happen automatically or manually
        if (result.url) {
          window.location.href = result.url
        } else {
          window.location.href = callbackUrl
        }
      } else {
        setError("Unexpected error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setCredentialsLoading(false)
    }
  }

  // Determine which error to show
  const displayError = error || (urlError && getErrorMessage(urlError))

  function getErrorMessage(errorCode: string) {
    switch (errorCode) {
      case "CredentialsSignin":
        return "Invalid email or password. Please check your credentials."
      case "OAuthSignin":
        return "Error connecting to sign-in provider. Please try again."
      case "OAuthCallback":
        return "Error during authentication. Please try again."
      case "OAuthCreateAccount":
        return "Could not create account with this provider."
      case "EmailCreateAccount":
        return "Could not create account with this email."
      case "Callback":
        return "Authentication callback error. Please try again."
      case "OAuthAccountNotLinked":
        return "This account is linked to a different sign-in method."
      case "EmailSignin":
        return "Unable to send sign-in email."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An authentication error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-xl">
              <span className="text-2xl font-bold">🇬🇭</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Ga Dictionary account
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{displayError}</span>
            </div>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                fieldErrors.email 
                  ? "border-red-300 bg-red-50" 
                  : "border-gray-300 focus:border-yellow-500"
              }`}
              placeholder="Enter your email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                fieldErrors.password 
                  ? "border-red-300 bg-red-50" 
                  : "border-gray-300 focus:border-yellow-500"
              }`}
              placeholder="Enter your password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={credentialsLoading || !email.trim() || !password}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
              credentialsLoading || !email.trim() || !password
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:shadow-lg"
            }`}
          >
            {credentialsLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        {providers?.google && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        )}

        {/* Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
           {` Don't have an account?`}{' '}
            <Link href="/auth/signup" className="text-yellow-600 hover:text-yellow-500 font-medium">
              Sign up here
            </Link>
          </p>
          <Link
            href="/"
            className="block text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Dictionary
          </Link>
        </div>

        {/* Browse as Guest */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-yellow-600 hover:text-yellow-500 font-medium"
          >
            Browse Dictionary as Guest →
          </Link>
        </div>
      </div>
    </div>
  )
}