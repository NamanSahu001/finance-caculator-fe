import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import CalculatorPage from './pages/CalculatorPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlanProvider } from './context/PlanContext'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' />
  return children
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { user, isAdmin } = useAuth()
  if (!user || !isAdmin()) return <Navigate to='/login' />
  return children
}

function RequireSimpleUser({ children }: { children: React.ReactElement }) {
  const { user, isAdmin } = useAuth()
  if (!user || isAdmin()) return <Navigate to='/admin/users' />
  return children
}

function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <Routes>
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route
              path='/calculator'
              element={
                <RequireSimpleUser>
                  <CalculatorPage />
                </RequireSimpleUser>
              }
            />
            <Route
              path='/admin/users'
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />
          </Route>
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </PlanProvider>
    </AuthProvider>
  )
}

export default App
