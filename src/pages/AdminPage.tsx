import React, { useEffect, useState } from 'react'
import { getUsers, getPlanData, getPlanSummary } from '../services/api'
import PlanSummary from '../components/PlanSummary'

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPlan, setShowPlan] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [planData, setPlanData] = useState<any>(null)
  const [planResult, setPlanResult] = useState<any>(null)
  const [planLoading, setPlanLoading] = useState(false)

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

  const handleViewPlan = async (user: any) => {
    setSelectedUser(user)
    setShowPlan(true)
    setPlanLoading(true)
    setPlanData(null)
    setPlanResult(null)
    try {
      const plan = await getPlanData(user)
      setPlanData(plan)
      const result = await getPlanSummary(plan, user)
      setPlanResult(result)
    } catch (e) {
      setPlanData(null)
      setPlanResult(null)
    } finally {
      setPlanLoading(false)
    }
  }

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
                <th className='py-2 px-3 text-center'>Plan</th>
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
                  <td className='py-2 px-3 text-center'>
                    <button
                      title='View Plan Summary'
                      onClick={() => handleViewPlan(user)}
                      className='hover:text-blue-600 text-gray-600'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='inline h-5 w-5'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPlan && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative'>
            <button
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold'
              onClick={() => setShowPlan(false)}
              title='Close'
            >
              &times;
            </button>
            {planLoading ? (
              <div className='text-center py-12 text-lg text-gray-500'>
                Loading plan summary...
              </div>
            ) : planData && planResult ? (
              <PlanSummary plan={planData} result={planResult} />
            ) : (
              <div className='text-center py-12 text-lg text-red-500'>
                Unable to load plan summary.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
