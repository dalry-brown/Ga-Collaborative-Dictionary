import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-ghana-gold to-ghana-brown rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          
          {/* 404 Message */}
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            {`The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.`}
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="w-full">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search Dictionary
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/contribute">
                <Button variant="ghost" size="sm">
                  Contribute
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm">
                  About
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}