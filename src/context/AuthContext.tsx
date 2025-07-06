import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login as apiLogin } from '../services/api'

type User = {
  name: string
  email: string
  role: 'user' | 'admin'
  token: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
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
    setUser(res)
    localStorage.setItem('user', JSON.stringify(res))
    navigate('/calculator')
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await register(name, email, password)
    setUser(res)
    localStorage.setItem('user', JSON.stringify(res))
    navigate('/calculator')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/signup')
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register: registerUser, logout }}
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
