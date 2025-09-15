import Link from 'next/link'
import { BookOpen, Users, Heart, Mail, Github, Twitter } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    dictionary: [
      { name: 'Browse Words', href: '/browse' },
      { name: 'Advanced Search', href: '/browse?advanced=true' },
      { name: 'Word of the Day', href: '/word-of-day' },
      { name: 'Recently Added', href: '/browse?sort=newest' },
    ],
    community: [
      { name: 'Contribute', href: '/contribute' },
      { name: 'Guidelines', href: '/guidelines' },
      { name: 'Contributors', href: '/contributors' },
      { name: 'Feedback', href: '/feedback' },
    ],
    resources: [
      { name: 'About Ga Language', href: '/about' },
      { name: 'Learning Resources', href: '/learn' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Research', href: '/research' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
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
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
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
              {footerLinks.dictionary.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
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
  )
}