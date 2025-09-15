import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BookOpen, Users, Globe, Heart, Award, Zap } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Preserving Heritage Through Technology
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {`Building the world's most advanced and comprehensive Ghanaian language dictionary`}
          </p>
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>9,046+ Words</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Community Built</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              We envision a world where Ghanaian languages thrive in the digital age, where every word, expression, 
              and cultural nuance is preserved, celebrated, and made easily accessible to anyone, anywhere. Our platform 
              serves as a bridge between traditional knowledge and modern technology.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Accessibility</h3>
                <p className="text-gray-600 text-sm">Making Ghanaian languages accessible to diaspora communities worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">Empowering native speakers to contribute and maintain their heritage</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Impact</h3>
                <p className="text-gray-600 text-sm">Supporting schools and educators with comprehensive resources</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Excellence</h3>
                <p className="text-gray-600 text-sm">Maintaining highest standards through expert verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Growing Impact</h2>
            <p className="text-xl text-gray-600">Making a real difference in language preservation</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">9,046</div>
              <div className="text-gray-600">Words Documented</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">127</div>
              <div className="text-gray-600">Active Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">23</div>
              <div className="text-gray-600">Expert Linguists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-gray-600">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">
                Our collaborative model ensures accuracy while encouraging community participation
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Community Contribution</h3>
                  <p className="text-gray-600">
                    Native speakers and language enthusiasts submit new words, corrections, or improvements to existing entries
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Review</h3>
                  <p className="text-gray-600">
                    Verified linguists and language teachers review submissions for accuracy, completeness, and cultural appropriateness
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">
                    Multiple verification checks ensure phonetic accuracy, cultural context, and proper usage examples
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Publication</h3>
                  <p className="text-gray-600">
                    Approved entries are published to the main dictionary, immediately accessible to all users worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines linguistic expertise, technological innovation, and deep cultural understanding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                KA
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Dr. Kwame Asante</h3>
              <p className="text-blue-600 text-sm mb-3">Chief Linguist</p>
              <p className="text-gray-600 text-sm">Professor of African Languages with 20+ years in Ga research</p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                AM
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Akosua Mensah</h3>
              <p className="text-green-600 text-sm mb-3">Community Coordinator</p>
              <p className="text-gray-600 text-sm">Native Ga speaker connecting traditional knowledge with our platform</p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                JO
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Joseph Osei</h3>
              <p className="text-purple-600 text-sm mb-3">Technical Lead</p>
              <p className="text-gray-600 text-sm">Software engineer specializing in language technologies</p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                SA
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Dr. Sarah Adjei</h3>
              <p className="text-orange-600 text-sm mb-3">Research Director</p>
              <p className="text-gray-600 text-sm">Computational linguist focused on digital preservation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technology & Innovation</h2>
              <p className="text-xl text-gray-600">
                Leveraging cutting-edge technology for language preservation
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600">Lightning-fast search with fuzzy matching and phonetic similarity</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborative Platform</h3>
                <p className="text-gray-600">Real-time collaboration tools for community contributions</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Control</h3>
                <p className="text-gray-600">AI-assisted verification and expert review workflows</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Open Source</h3>
                <p className="text-gray-600">Transparent, community-driven development and open API</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Future Roadmap</h2>
              <p className="text-xl text-gray-600">
                Our journey begins with Ga, but extends to all Ghanaian languages
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1 - 2025</span>
                  <h3 className="text-xl font-bold text-gray-900">Ga Language Mastery</h3>
                </div>
                <p className="text-gray-600">Complete comprehensive Ga dictionary with 5,000+ verified entries, audio pronunciations, and mobile apps</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2 - 2026</span>
                  <h3 className="text-xl font-bold text-gray-900">Multi-Language Expansion</h3>
                </div>
                <p className="text-gray-600">Add Twi, Ewe, and Fante languages with the same comprehensive approach</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3 - 2027</span>
                  <h3 className="text-xl font-bold text-gray-900">Complete Ghana Coverage</h3>
                </div>
                <p className="text-gray-600">Include all major Ghanaian languages including Dagbani, Gonja, Hausa, and regional dialects</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 4 - 2028+</span>
                  <h3 className="text-xl font-bold text-gray-900">Advanced Features</h3>
                </div>
                <p className="text-gray-600">AI-powered translation, advanced learning modules, and integration with educational institutions across West Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {`Whether you're a native speaker, language enthusiast, educator, or simply someone who values 
            cultural preservation, there's a place for you in our community.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contribute" className="inline-block">
              <div className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Heart className="w-5 h-5" />
                Start Contributing
              </div>
            </Link>
            <Link href="/browse" className="inline-block">
              <div className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                <BookOpen className="w-5 h-5" />
                Explore Dictionary
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}