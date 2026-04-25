import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await authService.getProfile()
          setUser(res.data)
        } catch {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    init()
  }, [token])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token: jwt, ...userData } = res.data
    localStorage.setItem('token', jwt)
    setToken(jwt)
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await authService.register(data)
    const { token: jwt, ...userData } = res.data
    localStorage.setItem('token', jwt)
    setToken(jwt)
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
