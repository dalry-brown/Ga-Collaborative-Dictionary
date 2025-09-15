import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url))
      }
      return null
    }
    
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAuth || token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }
    
    // Protect contribution routes (require at least CONTRIBUTOR role)
    if (req.nextUrl.pathname.startsWith("/contribute") && req.nextUrl.pathname !== "/contribute") {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to public pages
        if (req.nextUrl.pathname === "/" || 
            req.nextUrl.pathname === "/browse" || 
            req.nextUrl.pathname === "/about" ||
            req.nextUrl.pathname.startsWith("/api/dictionary") ||
            req.nextUrl.pathname.startsWith("/api/auth")) {
          return true
        }
        
        // For protected pages, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}