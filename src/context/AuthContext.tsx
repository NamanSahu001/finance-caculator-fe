import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  register,
  login as apiLogin,
  logout as apiLogout,
} from '../services/api'

type User = {
  id: number
  name: string
  email: string
  type: number // 1 for "simple" user, 2 for "admin"
  token: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password)
    console.log(res)
    setUser(res)
    localStorage.setItem('user', JSON.stringify(res))
    if (res.type === 2) {
      navigate('/admin/users')
    } else {
      navigate('/calculator')
    }
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await register(name, email, password)
    setUser(res)
    localStorage.setItem('user', JSON.stringify(res))
    if (res.type === 2) {
      navigate('/admin/users')
    } else {
      navigate('/calculator')
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  const isAdmin = () => {
    return user?.type === 2
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register: registerUser, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
