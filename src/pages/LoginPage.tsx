import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='card w-full max-w-md p-8'>
        <h2 className='text-2xl font-bold mb-6'>Login</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Email</label>
            <input
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              className='input w-full'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Password</label>
            <input
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              className='input w-full'
              required
            />
          </div>
          {error && <div className='text-red-500 text-sm'>{error}</div>}
          <button type='submit' className='btn w-full' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
