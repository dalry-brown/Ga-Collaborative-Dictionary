// app/auth/error/page.tsx - Fixed with Suspense Boundary

import { Suspense } from 'react'
import AuthErrorContent from './error-content'

// Loading component for Suspense fallback
function AuthErrorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  )
}