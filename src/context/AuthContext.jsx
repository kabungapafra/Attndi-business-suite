/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'

/**
 * AuthContext
 * Provides authentication state (user, token, isAuthenticated)
 * and actions (login, logout) across the entire app.
 *
 * TODO: Connect login/logout/register to real API calls in
 *       src/services/authService.js when the backend is ready.
 */
export const AuthContext = createContext(null)

const TOKEN_KEY = 'abs_token'
const USER_KEY  = 'abs_user'

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [token, setToken]                 = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading]         = useState(true)  // hydration loading

  // ── Hydrate from localStorage on mount ──────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser  = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    } else {
      const demoUser = {
        id: '1',
        name: 'Pafra K.',
        email: 'pafra@nilefresh.ug',
        role: 'Owner · Admin',
      }
      setToken('demo-session')
      setUser(demoUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    /**
     * TODO: Replace mock with real API call:
     *   const { data } = await authService.login(credentials)
     *   const { token, user } = data
     */
    const mockToken = 'mock-jwt-token-12345'
    const mockUser  = {
      id:     '1',
      name:   credentials.email.split('@')[0],
      email:  credentials.email,
      role:   'admin',
      avatar: null,
    }
    localStorage.setItem(TOKEN_KEY, mockToken)
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    setToken(mockToken)
    setUser(mockUser)
    setIsAuthenticated(true)
  }, [])

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // ── Update user profile ──────────────────────────────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
