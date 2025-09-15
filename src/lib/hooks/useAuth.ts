import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/types/dictionary"

export function useAuth() {
  const { data: session, status } = useSession()
  
  const user = session?.user
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  
  return {
    user,
    isLoading,
    isAuthenticated,
    session,
  }
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  if (!isLoading && !isAuthenticated) {
    throw new Error("Authentication required")
  }
  
  return { user, isLoading, isAuthenticated }
}

export function useRole() {
  const { user } = useAuth()
  const userRole = (user?.role as UserRole) || "USER"
  
  const hasRole = (role: UserRole) => {
    const roleHierarchy: Record<UserRole, number> = {
      USER: 1,
      CONTRIBUTOR: 2,
      MODERATOR: 3,
      EXPERT: 4,
      ADMIN: 5,
    }
    
    return roleHierarchy[userRole] >= roleHierarchy[role]
  }
  
  const isUser = userRole === "USER"
  const isContributor = hasRole("CONTRIBUTOR")
  const isModerator = hasRole("MODERATOR")
  const isExpert = hasRole("EXPERT")
  const isAdmin = hasRole("ADMIN")
  
  return {
    role: userRole,
    hasRole,
    isUser,
    isContributor,
    isModerator,
    isExpert,
    isAdmin,
  }
}