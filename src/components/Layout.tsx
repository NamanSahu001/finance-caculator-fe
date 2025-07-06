import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()
  return (
    <div className='min-h-screen flex flex-col'>
      <nav className='bg-white shadow flex items-center justify-between px-6 py-3'>
        <div className='flex items-center gap-4'>
          <Link to='/calculator' className='font-bold text-lg'>
            Finance Calculator
          </Link>
          {user?.role === 'admin' && (
            <Link
              to='/admin/users'
              className='text-sm text-gray-600 hover:text-black'
            >
              Admin
            </Link>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-700'>{user?.name}</span>
          <button onClick={logout} className='p-2 rounded hover:bg-gray-100'>
            <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className='flex-1 p-6 bg-gray-50'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
