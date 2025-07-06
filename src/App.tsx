import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout'
import SignupPage from './pages/SignupPage'
import CalculatorPage from './pages/CalculatorPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlanProvider } from './context/PlanContext'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useAuth()
  if (!user) return <Navigate to='/signup' />
  return children
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to='/signup' />
  return children
}

function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <Routes>
          <Route path='/signup' element={<SignupPage />} />
          <Route element={<MainLayout />}>
            <Route
              path='/calculator'
              element={
                <RequireAuth>
                  <CalculatorPage />
                </RequireAuth>
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
          <Route path='*' element={<Navigate to='/signup' />} />
        </Routes>
      </PlanProvider>
    </AuthProvider>
  )
}

export default App
