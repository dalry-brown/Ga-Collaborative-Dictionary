'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Globe, 
  Heart, 
  Zap, 
  Award, 
  Plus, 
  Edit3,
  CheckCircle,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import type { DatabaseStats, Word } from '@/lib/types/stats'

export default function HomePage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [featuredWords, setFeaturedWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test')
        const data = await response.json()
        
        if (data.success) {
          setStats(data)
          setFeaturedWords(data.sampleWords || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchTerm)}`
    } else {
      window.location.href = '/browse'
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      alert('Thank you for subscribing! We\'ll keep you updated.')
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Use the updated Header component with authentication */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50 opacity-50"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Preserving{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Ga Language
              </span>{' '}
              for Future Generations
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The most comprehensive digital dictionary for Ga language, built by the community
            </p>

            {/* Live Stats */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {loading ? '...' : stats?.totalWords?.toLocaleString()} words
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Community-driven</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Free & Open</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for Ga words, meanings, or phonemes..."
                    className="w-full pl-14 pr-32 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 shadow-lg outline-none transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-medium transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {`Try searching: "akpɛ" (thank you), "baayo" (hello), or "nɔŋ" (water)`}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse" className="inline-block">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 text-lg rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <BookOpen className="w-5 h-5" />
                  Explore Dictionary
                </div>
              </Link>
              <Link href="/contribute" className="inline-block">
                <div className="border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-600 px-8 py-4 text-lg rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <Heart className="w-5 h-5" />
                  Start Contributing
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Growing Every Day</h2>
            <p className="text-gray-600 text-lg">Our community is actively preserving and expanding Ga language resources</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats?.totalWords?.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Words</div>
            </div>

            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Verified</div>
            </div>

            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-gray-600">Contributors</div>
            </div>

            <div className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
              <div className="text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Words */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Words</h2>
            </div>
            <p className="text-gray-600 text-lg">Discover beautiful words from the Ga language</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {featuredWords.slice(0, 3).map((word) => (
              <div key={word.id} className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-100">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{word.word}</h3>
                  {word.phoneme && (
                    <p className="text-blue-600 italic text-lg">/{word.phoneme}/</p>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{word.meaning}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                  Featured
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/browse" className="inline-block">
              <div className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all group cursor-pointer">
                Explore More Words
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Dictionary?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Built by the community, for the community. Experience the most comprehensive Ga language resource available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast Search</h3>
              <p className="text-gray-600">
                Find any Ga word instantly with our advanced search engine. Search by word, meaning, or phonetic spelling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Built by native speakers and language enthusiasts. Every entry is verified by our community of experts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Always Free</h3>
              <p className="text-gray-600">
                {`Our mission is language preservation. That's why our dictionary will always be free and accessible to everyone.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with fellow language enthusiasts, native speakers, and learners from around the world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Add New Words</h3>
              <p className="text-gray-600 mb-4">Contribute new Ga words to expand our dictionary and help preserve the language.</p>
              <Link href="/contribute" className="text-blue-600 hover:text-blue-700 font-medium">
                Start Contributing →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Improve Entries</h3>
              <p className="text-gray-600 mb-4">Help complete existing entries by adding missing phonemes and usage examples.</p>
              <Link href="/contribute" className="text-green-600 hover:text-green-700 font-medium">
                Get Started →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Expert Review</h3>
              <p className="text-gray-600 mb-4">Join our team of language experts to review and verify community contributions.</p>
              <Link href="/about" className="text-purple-600 hover:text-purple-700 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <p className="text-gray-600 text-lg">{`See what's happening in our community`}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Recent Additions */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Recent Additions
                </h3>
                <div className="space-y-3">
                  {featuredWords.slice(0, 3).map((word) => (
                    <div key={word.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-semibold text-blue-600">{word.word}</span>
                        <p className="text-sm text-gray-600">{word.meaning}</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  ))}
                </div>
                <Link href="/browse?sort=newest" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block">
                  View all recent additions →
                </Link>
              </div>

              {/* Community Stats */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Community Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Words added this week</span>
                    <span className="font-bold text-green-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Active contributors</span>
                    <span className="font-bold text-green-600">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Entries verified</span>
                    <span className="font-bold text-green-600">43</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Languages supported</span>
                    <span className="font-bold text-green-600">1 (growing)</span>
                  </div>
                </div>
                <Link href="/about" className="text-green-600 hover:text-green-700 text-sm font-medium mt-4 inline-block">
                  Learn about our mission →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 text-lg mb-8">
              Get notified about new features, word additions, and community highlights
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Help Us Build the Future of Ga Language
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of language enthusiasts and help preserve Ga for future generations. 
            Every contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contribute" className="inline-block">
              <div className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Heart className="w-5 h-5" />
                Start Contributing
              </div>
            </Link>
            <Link href="/browse" className="inline-block">
              <div className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                <BookOpen className="w-5 h-5" />
                Explore Dictionary
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Ga</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ga Dictionary</h3>
                  <p className="text-sm text-gray-400">Advanced Ghanaian Languages</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Preserving and celebrating the Ga language through community collaboration and modern technology. 
                Building the most comprehensive digital dictionary for Ga language.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Dictionary Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Dictionary
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/browse" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Browse Words
                  </Link>
                </li>
                <li>
                  <Link href="/browse?advanced=true" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link href="/word-of-day" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Word of the Day
                  </Link>
                </li>
                <li>
                  <Link href="/browse?sort=newest" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Recently Added
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contribute" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contribute
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/contributors" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contributors
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2025 Ga Dictionary. Built with ❤️ for language preservation.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>🇬🇭 Made in Ghana</span>
                <span>•</span>
                <span>Open Source</span>
                <span>•</span>
                <span>Always Free</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}