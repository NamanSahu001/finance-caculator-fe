import React from 'react'

type ChartProps = {
  data: {
    total: number
    breakdown: Record<string, number>
    analysis?: {
      savingsRate: string
      yearsToRetirement: number
      monthlySurplus: number
      projectedRetirementSavings: string
      retirementCorpusNeeded: string
      investmentAllocation: {
        fixedReturns: number
        largeCap: number
        directStocks: number
        smallCap: number
      }
    }
    yearlyProjections?: Array<{
      age: number
      startingSavings: number
      plannedExpenses: number
      additionalExpenses: number
      additionalSavings: number
      endingSavings: number
      status: string
    }>
  }
}

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-indigo-500',
]

const Chart: React.FC<ChartProps> = ({ data }) => {
  const entries = Object.entries(data.breakdown)
  const max = Math.max(...Object.values(data.breakdown))

  return (
    <div className='mt-8 space-y-6'>
      <h3 className='font-bold text-xl text-gray-800'>Financial Analysis</h3>

      {/* Summary Cards */}
      {data.analysis && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='card p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {data.analysis.savingsRate}%
            </div>
            <div className='text-sm text-gray-600'>Savings Rate</div>
          </div>
          <div className='card p-4 text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {data.analysis.yearsToRetirement}
            </div>
            <div className='text-sm text-gray-600'>Years to Retirement</div>
          </div>
          <div className='card p-4 text-center'>
            <div className='text-2xl font-bold text-purple-600'>
              ${data.analysis.monthlySurplus.toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Monthly Surplus</div>
          </div>
          <div className='card p-4 text-center'>
            <div className='text-2xl font-bold text-indigo-600'>
              $
              {Number(
                data.analysis.projectedRetirementSavings
              ).toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Projected Retirement</div>
          </div>
        </div>
      )}

      {/* Investment Allocation */}
      {data.analysis?.investmentAllocation && (
        <div className='card p-6'>
          <h4 className='font-semibold text-gray-700 mb-4'>
            Investment Allocation
          </h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {data.analysis.investmentAllocation.fixedReturns}%
              </div>
              <div className='text-sm text-gray-600'>Fixed Returns</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {data.analysis.investmentAllocation.largeCap}%
              </div>
              <div className='text-sm text-gray-600'>Large Cap</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {data.analysis.investmentAllocation.directStocks}%
              </div>
              <div className='text-sm text-gray-600'>Direct Stocks</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {data.analysis.investmentAllocation.smallCap}%
              </div>
              <div className='text-sm text-gray-600'>Small Cap</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className='card p-6'>
        <h4 className='font-semibold text-gray-700 mb-4'>
          Financial Breakdown
        </h4>
        <div className='flex gap-4 items-end h-48'>
          {entries.map(([key, value], i) => (
            <div key={key} className='flex flex-col items-center flex-1'>
              <div
                className={`w-full ${
                  colors[i % colors.length]
                } rounded-t transition-all duration-300 hover:opacity-80`}
                style={{ height: `${(value / max) * 100}%` }}
                title={`${key}: $${value.toLocaleString()}`}
              ></div>
              <span className='text-xs mt-2 text-center font-medium text-gray-700'>
                {key}
              </span>
              <span className='text-xs text-gray-500'>
                ${value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Year-by-Year Projections */}
      {data.yearlyProjections && data.yearlyProjections.length > 0 && (
        <div className='card p-6'>
          <h4 className='font-semibold text-gray-700 mb-4'>
            Year-by-Year Projections
          </h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2'>Age</th>
                  <th className='text-right py-2'>Starting Savings</th>
                  <th className='text-right py-2'>Planned Expenses</th>
                  <th className='text-right py-2'>Additional Savings</th>
                  <th className='text-right py-2'>Ending Savings</th>
                  <th className='text-center py-2'>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.yearlyProjections
                  .slice(0, 10)
                  .map((projection, index) => (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='py-2'>{projection.age}</td>
                      <td className='text-right py-2'>
                        ${projection.startingSavings.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ${projection.plannedExpenses.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ${projection.additionalSavings.toLocaleString()}
                      </td>
                      <td className='text-right py-2 font-medium'>
                        ${projection.endingSavings.toLocaleString()}
                      </td>
                      <td className='text-center py-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            projection.status === 'Working'
                              ? 'bg-blue-100 text-blue-800'
                              : projection.status === 'Retired'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {projection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                {data.yearlyProjections.length > 10 && (
                  <tr>
                    <td colSpan={6} className='text-center py-2 text-gray-500'>
                      ... and {data.yearlyProjections.length - 10} more years
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Total */}
      <div className='text-center'>
        <div className='text-lg font-semibold text-gray-700'>
          Total Portfolio Value
        </div>
        <div className='text-3xl font-bold text-green-600'>
          ${data.total.toLocaleString()}
        </div>
        {data.analysis?.retirementCorpusNeeded && (
          <div className='mt-2 text-sm text-gray-600'>
            Retirement Corpus Needed: $
            {Number(data.analysis.retirementCorpusNeeded).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Chart
