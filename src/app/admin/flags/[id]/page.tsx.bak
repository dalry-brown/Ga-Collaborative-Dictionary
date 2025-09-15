// app/admin/flags/[id]/page.tsx - Individual Flag Review

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Flag, 
  User, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react"

interface FlagDetail {
  id: string
  reason: string
  description: string
  status: string
  createdAt: string
  resolvedAt: string | null
  resolution: string | null
  word: {
    id: string
    word: string
    meaning: string
    phoneme: string
    partOfSpeech: string | null
    exampleUsage: string | null
  }
  user: {
    name: string
    email: string
    role: string
    contributionCount: number
    approvalCount: number
  }
  resolvedBy?: {
    name: string
    role: string
  }
}

export default function FlagReviewPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [flag, setFlag] = useState<FlagDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
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

    fetchFlag()
  }, [session, router, params.id])

  const fetchFlag = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/flags/${params.id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch flag")
      }

      const data = await response.json()
      setFlag(data.flag)
    } catch (error) {
      console.error("Error fetching flag:", error)
      setError("Failed to load flag")
    } finally {
      setLoading(false)
    }
  }

  const handleResolveFlag = async (action: "RESOLVE" | "DISMISS") => {
    if (!flag || flag.status !== "OPEN") {
      return
    }

    if (!resolutionNotes.trim()) {
      setError("Resolution notes are required")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      
      const response = await fetch(`/api/admin/flags/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          resolution: resolutionNotes.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to resolve flag")
      }

      // Refresh the flag data
      await fetchFlag()
      
      // Redirect after successful resolution
      setTimeout(() => {
        router.push("/admin/flags")
      }, 2000)

    } catch (error) {
      console.error("Error resolving flag:", error)
      setError(error instanceof Error ? error.message : "Failed to resolve flag")
    } finally {
      setSubmitting(false)
    }
  }

  const getReasonLabel = (reason: string): string => {
    const reasonLabels: Record<string, string> = {
      'INCORRECT_MEANING': 'Incorrect Meaning',
      'INCORRECT_PHONEME': 'Incorrect Phoneme',
      'INAPPROPRIATE_CONTENT': 'Inappropriate Content',
      'DUPLICATE_ENTRY': 'Duplicate Entry',
      'SPAM': 'Spam',
      'OTHER': 'Other'
    }
    return reasonLabels[reason] || reason
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof AlertTriangle }> = {
      OPEN: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      REVIEWED: { color: "bg-blue-100 text-blue-800", icon: FileText },
      RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      DISMISSED: { color: "bg-gray-100 text-gray-800", icon: XCircle }
    }
    
    const config = statusConfig[status] || statusConfig.OPEN
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error && !flag) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link href="/admin/flags" className="text-blue-600 hover:text-blue-500">
            Back to Flags
          </Link>
        </div>
      </div>
    )
  }

  if (!flag) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Flag not found</div>
          <Link href="/admin/flags" className="text-blue-600 hover:text-blue-500">
            Back to Flags
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
              <Link href="/admin/flags" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Flags
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Review Flag</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flag Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getReasonLabel(flag.reason)}
              </h2>
              <p className="text-sm text-gray-500">
               Reported {new Date(flag.createdAt).toLocaleString()}
             </p>
           </div>
           {getStatusBadge(flag.status)}
         </div>

         {/* Reporter Info */}
         <div className="border-t pt-4">
           <h3 className="text-sm font-medium text-gray-900 mb-2">Reporter</h3>
           <div className="flex items-center space-x-4">
             <div className="flex items-center">
               <User className="w-5 h-5 text-gray-400 mr-2" />
               <span className="text-sm font-medium">{flag.user.name}</span>
               <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                 {flag.user.role}
               </span>
             </div>
             <div className="text-sm text-gray-500">
               {flag.user.approvalCount}/{flag.user.contributionCount} contributions approved
             </div>
           </div>
         </div>
       </div>

       {/* Flagged Word Content */}
       <div className="bg-white shadow rounded-lg p-6 mb-6">
         <h3 className="text-lg font-medium text-gray-900 mb-4">Flagged Word</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <h4 className="text-sm font-medium text-gray-500 mb-2">Word Information</h4>
             <div className="space-y-3">
               <div>
                 <label className="text-sm font-medium text-gray-500">Word</label>
                 <p className="text-lg font-semibold text-gray-900">{flag.word.word}</p>
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-500">Phoneme</label>
                 <p className="text-gray-900">{flag.word.phoneme || 'N/A'}</p>
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-500">Meaning</label>
                 <p className="text-gray-900">{flag.word.meaning}</p>
               </div>
               {flag.word.partOfSpeech && (
                 <div>
                   <label className="text-sm font-medium text-gray-500">Part of Speech</label>
                   <p className="text-gray-900">{flag.word.partOfSpeech}</p>
                 </div>
               )}
               {flag.word.exampleUsage && (
                 <div>
                   <label className="text-sm font-medium text-gray-500">Example Usage</label>
                   <p className="text-gray-900">{flag.word.exampleUsage}</p>
                 </div>
               )}
             </div>
           </div>

           <div>
             <h4 className="text-sm font-medium text-gray-500 mb-2">Flag Details</h4>
             <div className="space-y-3">
               <div>
                 <label className="text-sm font-medium text-gray-500">Reason</label>
                 <p className="text-gray-900">{getReasonLabel(flag.reason)}</p>
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-500">Description</label>
                 <p className="text-gray-900">{flag.description || 'No additional details provided'}</p>
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-500">Status</label>
                 <div className="mt-1">
                   {getStatusBadge(flag.status)}
                 </div>
               </div>
               <div className="flex items-center text-gray-600">
                 <Calendar className="w-4 h-4 mr-2" />
                 <span>Reported {new Date(flag.createdAt).toLocaleDateString()}</span>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Resolution Actions */}
       {flag.status === "OPEN" ? (
         <div className="bg-white shadow rounded-lg p-6">
           <h3 className="text-lg font-medium text-gray-900 mb-4">Resolve This Flag</h3>
           
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Resolution Notes <span className="text-red-500">*</span>
             </label>
             <textarea
               value={resolutionNotes}
               onChange={(e) => setResolutionNotes(e.target.value)}
               rows={4}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               placeholder="Explain your decision and any actions taken..."
               required
             />
             <p className="mt-1 text-sm text-gray-500">
               Provide details about your investigation and resolution decision.
             </p>
           </div>

           {error && (
             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
               {error}
             </div>
           )}

           <div className="flex space-x-4">
             <button
               onClick={() => handleResolveFlag("RESOLVE")}
               disabled={submitting || !resolutionNotes.trim()}
               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
             >
               <CheckCircle className="w-4 h-4 mr-2" />
               {submitting ? "Processing..." : "Resolve Flag"}
             </button>
             
             <button
               onClick={() => handleResolveFlag("DISMISS")}
               disabled={submitting || !resolutionNotes.trim()}
               className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
             >
               <XCircle className="w-4 h-4 mr-2" />
               {submitting ? "Processing..." : "Dismiss Flag"}
             </button>
           </div>

           <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
             <div className="flex">
               <AlertTriangle className="w-5 h-5 text-blue-400" />
               <div className="ml-3">
                 <h4 className="text-sm font-medium text-blue-800">Resolution Guidelines</h4>
                 <div className="mt-1 text-sm text-blue-700">
                   <p><strong>Resolve:</strong> The flag is valid and the issue has been addressed.</p>
                   <p><strong>Dismiss:</strong> The flag is invalid or the content is acceptable.</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       ) : (
         <div className="bg-white shadow rounded-lg p-6">
           <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution History</h3>
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-500">Status:</span>
               {getStatusBadge(flag.status)}
             </div>
             {flag.resolvedAt && (
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-500">Resolved:</span>
                 <span className="text-sm text-gray-900">
                   {new Date(flag.resolvedAt).toLocaleString()}
                 </span>
               </div>
             )}
             {flag.resolvedBy && (
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-500">Resolved by:</span>
                 <span className="text-sm text-gray-900">
                   {flag.resolvedBy.name} ({flag.resolvedBy.role})
                 </span>
               </div>
             )}
             {flag.resolution && (
               <div>
                 <span className="text-sm font-medium text-gray-500">Resolution Notes:</span>
                 <div className="mt-1 p-3 bg-gray-50 rounded-md">
                   <p className="text-sm text-gray-900">{flag.resolution}</p>
                 </div>
               </div>
             )}
           </div>
         </div>
       )}

       {/* Quick Actions */}
       <div className="mt-6 flex space-x-4">
         <Link
           href={`/admin/contributions?search=${encodeURIComponent(flag.word.word)}`}
           className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
         >
           <FileText className="w-4 h-4 mr-2" />
           View Related Contributions
         </Link>
         
         <Link
           href={`/admin/users/${flag.user.name}`}
           className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
         >
           <User className="w-4 h-4 mr-2" />
           View Reporter Profile
         </Link>
       </div>
     </div>
   </div>
 )
}