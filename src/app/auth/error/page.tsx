"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

const errorMessages: Record<string, { title: string; description: string; suggestion: string }> = {
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description: "There was a problem signing you in with your OAuth provider.",
    suggestion: "Please try signing in again or contact support if the problem persists."
  },
  OAuthCallback: {
    title: "OAuth Callback Error", 
    description: "There was a problem during the OAuth callback process.",
    suggestion: "This might be a temporary network issue. Please try signing in again."
  },
  OAuthCreateAccount: {
    title: "Account Creation Error",
    description: "There was a problem creating your account.",
    suggestion: "Please try signing in again or contact support."
  },
  EmailCreateAccount: {
    title: "Email Account Error",
    description: "There was a problem with email account creation.",
    suggestion: "Please verify your email and try again."
  },
  Callback: {
    title: "Callback Error",
    description: "There was a problem during the authentication callback.",
    suggestion: "Please try signing in again."
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    description: "This account is not linked to any existing user.",
    suggestion: "Please try using a different sign-in method or contact support."
  },
  EmailSignin: {
    title: "Email Sign In",
    description: "Check your email for the sign in link.",
    suggestion: "A sign in link has been sent to your email address."
  },
  CredentialsSignin: {
    title: "Credentials Sign In Failed",
    description: "The credentials you provided are incorrect.",
    suggestion: "Please check your email and password and try again."
  },
  SessionRequired: {
    title: "Session Required",
    description: "You must be signed in to access this page.",
    suggestion: "Please sign in to continue."
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred during authentication.",
    suggestion: "Please try again or contact support if the problem persists."
  }
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"
  
  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Authentication Error
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">What happened?</h3>
          <p className="text-sm mb-3">{errorInfo.description}</p>
          <p className="text-sm font-medium">{errorInfo.suggestion}</p>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-1">Debug Info (Dev Only)</h4>
            <p className="text-xs">Error Code: {error}</p>
            <p className="text-xs">Environment: Development</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center block"
          >
            Try Signing In Again
          </Link>
          
          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 text-center block"
          >
            Continue as Guest
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Need Help?</h4>
          <ul className="text-sm space-y-1">
            <li>• Check your internet connection</li>
            <li>• Try clearing your browser cache</li>
            <li>• Disable ad blockers temporarily</li>
            <li>• Contact support if issues persist</li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2"
          >
            ← Back to Dictionary
          </Link>
        </div>
      </div>
    </div>
  )
}