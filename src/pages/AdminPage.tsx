import React, { useEffect, useState } from 'react'
import { getUsers } from '../services/api'

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='card p-6'>
          <div className='text-center py-8'>Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='card p-6'>
        <h2 className='text-2xl font-bold mb-6'>User Management</h2>

        <div className='mb-4'>
          <span className='text-sm text-gray-600'>
            Total Users: {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <p>No users found</p>
          </div>
        ) : (
          <table className='w-full border'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='py-2 px-3 text-left'>Name</th>
                <th className='py-2 px-3 text-left'>Email</th>
                <th className='py-2 px-3 text-left'>Role</th>
                <th className='py-2 px-3 text-left'>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className='border-t'>
                  <td className='py-2 px-3'>{user.name}</td>
                  <td className='py-2 px-3'>{user.email}</td>
                  <td className='py-2 px-3'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className='py-2 px-3 text-sm text-gray-600'>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminPage
