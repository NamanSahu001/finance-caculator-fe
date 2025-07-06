import React, { useEffect, useState } from 'react'
import { getUsers } from '../services/api'
import { Pencil, Trash2 } from 'lucide-react'

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='card p-6'>
        <h2 className='text-xl font-bold mb-4'>Users</h2>
        <table className='w-full text-left border'>
          <thead>
            <tr>
              <th className='py-2 px-3'>Name</th>
              <th className='py-2 px-3'>Email</th>
              <th className='py-2 px-3'>Role</th>
              <th className='py-2 px-3'>Status</th>
              <th className='py-2 px-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className='border-t'>
                <td className='py-2 px-3'>{user.name}</td>
                <td className='py-2 px-3'>{user.email}</td>
                <td className='py-2 px-3'>{user.role}</td>
                <td className='py-2 px-3'>{user.status}</td>
                <td className='py-2 px-3 flex gap-2'>
                  <button className='btn p-1'>
                    <Pencil size={16} />
                  </button>
                  <button className='btn p-1'>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPage
