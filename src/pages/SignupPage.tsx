import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const SignupPage: React.FC = () => {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      await register(form.name, form.email, form.password)
    } catch (err: any) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='card w-full max-w-md p-8'>
        <h2 className='text-2xl font-bold mb-6'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1'>Name</label>
            <input
              name='name'
              type='text'
              value={form.name}
              onChange={handleChange}
              className='input w-full'
              required
            />
          </div>
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
