// src/app/admin/flags/[id]/page.tsx - Complete version with all functionality

"use client";

import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image"
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertCircle,
  Save,
  Calendar,
  Eye,
  Mail,
} from "lucide-react";

interface FlagPageProps {
  params: Promise<{ id: string }>;
}

interface FlagDetail {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    contributionCount?: number;
  };
  word: {
    id: string;
    word: string;
    meaning: string;
    phoneme: string;
    partOfSpeech?: string;
    exampleUsage?: string;
    createdAt: string;
  };
  reviewedBy?: {
    name: string;
    email: string;
    role: string;
  };
  reviewedAt?: string;
  notes?: string;
}

export default function FlagReviewPage({ params }: FlagPageProps) {
  // const { data: session } = useSession();
  const router = useRouter();
  const [flag, setFlag] = useState<FlagDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [flagId, setFlagId] = useState<string>("");
  const [reviewNotes, setReviewNotes] = useState("");

  // Extract id from async params
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setFlagId(resolvedParams.id);
    };
    getId();
  }, [params]);

  const fetchFlag = useCallback(async () => {
    if (!flagId) return;

    try {
      const response = await fetch(`/api/admin/flags/${flagId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch flag");
      }

      setFlag(data.flag);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load flag");
    } finally {
      setLoading(false);
    }
  }, [flagId]);

  useEffect(() => {
    if (flagId) {
      fetchFlag();
    }
  }, [flagId, fetchFlag]);

  const handleResolve = async () => {
    if (!flag) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/flags/${flag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RESOLVED",
          notes: reviewNotes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve flag");
      }

      router.push("/admin/flags?message=resolved");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resolve");
    } finally {
      setProcessing(false);
    }
  };

  const handleDismiss = async () => {
    if (!flag) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/flags/${flag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DISMISSED",
          notes: reviewNotes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to dismiss flag");
      }

      router.push("/admin/flags?message=dismissed");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to dismiss");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof Clock }> =
      {
        OPEN: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        DISMISSED: { color: "bg-red-100 text-red-800", icon: XCircle },
      };

    const config = statusConfig[status] || statusConfig.OPEN;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !flag) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link
            href="/admin/flags"
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Flags
          </Link>
        </div>
      </div>
    );
  }

  if (!flag) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Flag not found</div>
          <Link
            href="/admin/flags"
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Flags
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/flags"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Flags
              </Link>
            </div>
            <h1 className="text-lg font-medium text-gray-900">Review Flag</h1>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/users/${flag.user.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Reporter
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flag Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {`Flag Report: "${flag.word.word}"`}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Report ID: {flag.id.substring(0, 8)}...
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(flag.status)}
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Reported: {new Date(flag.createdAt).toLocaleString()}</span>
            </div>
            {flag.reviewedAt && (
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>
                  Reviewed: {new Date(flag.reviewedAt).toLocaleString()}
                </span>
              </div>
            )}
            {flag.reviewedBy && (
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>By: {flag.reviewedBy.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flagged Word Details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Flagged Word
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Word
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {flag.word.word}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phoneme
                  </label>
                  <p className="text-gray-900 font-mono">
                    {flag.word.phoneme
                      ? `/${flag.word.phoneme}/`
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Meaning
                  </label>
                  <p className="text-gray-900">
                    {flag.word.meaning || "Not provided"}
                  </p>
                </div>
                {flag.word.partOfSpeech && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Part of Speech
                    </label>
                    <p className="text-gray-900">{flag.word.partOfSpeech}</p>
                  </div>
                )}
                {flag.word.exampleUsage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Example Usage
                    </label>
                    <p className="text-gray-900 italic">{`"${flag.word.exampleUsage}"`}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Word Added
                  </label>
                  <p className="text-gray-600 text-sm">
                    {new Date(flag.word.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flag Report Details */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Reporter Information
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {flag.user.avatar ? (
                    <Image
                      src={flag.user.avatar}
                      alt={flag.user.name}
                      width={48} // 👈 matches w-12 (12 * 4px = 48px)
                      height={48} // 👈 matches h-12
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {flag.user.name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {flag.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium">{flag.user.role}</span>
                  </div>
                  {flag.user.contributionCount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contributions:</span>
                      <span className="font-medium">
                        {flag.user.contributionCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Flag Details */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Flag Details
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Reason
                    </label>
                    <p className="text-gray-900 capitalize">
                      {flag.reason.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-900">{flag.description}</p>
                  </div>
                  {flag.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Admin Notes
                      </label>
                      <p className="text-gray-900 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {flag.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Actions */}
        {flag.status === "OPEN" && (
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Actions
            </h3>

            <div className="mb-4">
              <label
                htmlFor="reviewNotes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Notes (Optional)
              </label>
              <textarea
                id="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDismiss}
                disabled={processing}
                className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                {processing ? "Processing..." : "Dismiss Flag"}
              </button>
              <button
                onClick={handleResolve}
                disabled={processing}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center transition-colors"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Resolve Flag
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
