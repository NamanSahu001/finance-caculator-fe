import React from 'react'

interface PlanSummaryProps {
  plan: any
  result: any
}

const PlanSummary: React.FC<PlanSummaryProps> = ({ plan, result }) => {
  const personalInfo = plan.personalinfo || {}
  const investmentStrategy = plan.investmentstrategy || {}

  const currentSavings = Number(personalInfo['Current Savings']) || 0
  const currentMonthlyInvestment =
    Number(investmentStrategy['Current Monthly Investment']) || 0

  // Calculate investment approach returns
  const vpfAmount = Number(investmentStrategy['VPF/EPF/PPF Amount']) || 0
  const rdAmount =
    Number(investmentStrategy['Recurring Deposit/Fixed Dep Amount']) || 0
  const govBillsAmount =
    Number(investmentStrategy['Government Bills Amount']) || 0
  const goldAmount = Number(investmentStrategy['Gold Amount']) || 0
  const corporateBondsAmount =
    Number(investmentStrategy['Corporate Bonds Amount']) || 0
  const largeCapAmount =
    Number(investmentStrategy['Largecap Mutual Fund Amount']) || 0
  const directStocksAmount =
    Number(investmentStrategy['Direct Stocks Amount']) || 0
  const smallCapAmount =
    Number(investmentStrategy['Smallcap Mutual Fund Amount']) || 0

  const totalInvestment =
    vpfAmount +
    rdAmount +
    govBillsAmount +
    goldAmount +
    corporateBondsAmount +
    largeCapAmount +
    directStocksAmount +
    smallCapAmount

  // Calculate weighted returns and tax rates
  const weightedReturns =
    totalInvestment > 0
      ? (vpfAmount * 7 +
          rdAmount * 7 +
          govBillsAmount * 7 +
          goldAmount * 7 +
          corporateBondsAmount * 7 +
          largeCapAmount * 12 +
          directStocksAmount * 15 +
          smallCapAmount * 18) /
        totalInvestment
      : 0

  const weightedTaxRate =
    totalInvestment > 0
      ? ((vpfAmount +
          rdAmount +
          govBillsAmount +
          goldAmount +
          corporateBondsAmount) *
          30 +
          (largeCapAmount + directStocksAmount + smallCapAmount) * 20) /
        totalInvestment
      : 0

  // Calculate shares
  const fixedReturnsShare =
    totalInvestment > 0
      ? ((vpfAmount +
          rdAmount +
          govBillsAmount +
          goldAmount +
          corporateBondsAmount) /
          totalInvestment) *
        100
      : 0
  const largeCapShare =
    totalInvestment > 0 ? (largeCapAmount / totalInvestment) * 100 : 0
  const directStocksShare =
    totalInvestment > 0 ? (directStocksAmount / totalInvestment) * 100 : 0
  const smallCapShare =
    totalInvestment > 0 ? (smallCapAmount / totalInvestment) * 100 : 0

  // Post-retirement monthly amount
  const postRetirementMonthly =
    Number(personalInfo['Post-retirement monthly amount']) || 110000

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>
        Financial Planning Summary
      </h3>

      {/* Current Investment Approach */}
      <div className='card p-4'>
        <h4 className='font-semibold text-gray-700 mb-3'>
          Current Savings - Investment Approach
        </h4>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>Investment Type</th>
                <th className='text-right py-2'>Returns</th>
                <th className='text-right py-2'>Tax</th>
                <th className='text-right py-2'>Share</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b'>
                <td className='py-2'>Fixed Returns</td>
                <td className='text-right py-2'>
                  {weightedReturns.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {weightedTaxRate.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {fixedReturnsShare.toFixed(0)}%
                </td>
              </tr>
              <tr className='border-b'>
                <td className='py-2'>Large Cap Mutual Funds</td>
                <td className='text-right py-2'>
                  {weightedReturns.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {weightedTaxRate.toFixed(1)}%
                </td>
                <td className='text-right py-2'>{largeCapShare.toFixed(0)}%</td>
              </tr>
              <tr className='border-b'>
                <td className='py-2'>Direct Stocks</td>
                <td className='text-right py-2'>
                  {weightedReturns.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {weightedTaxRate.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {directStocksShare.toFixed(0)}%
                </td>
              </tr>
              <tr className='border-b'>
                <td className='py-2'>Smallcap Mutual Funds</td>
                <td className='text-right py-2'>
                  {weightedReturns.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {weightedTaxRate.toFixed(1)}%
                </td>
                <td className='text-right py-2'>{smallCapShare.toFixed(0)}%</td>
              </tr>
              <tr className='bg-gray-50 font-semibold'>
                <td className='py-2'>Total</td>
                <td className='text-right py-2'>
                  {weightedReturns.toFixed(1)}%
                </td>
                <td className='text-right py-2'>
                  {weightedTaxRate.toFixed(1)}%
                </td>
                <td className='text-right py-2'>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-by-Year Projections */}
      {result?.yearlyProjections && result.yearlyProjections.length > 0 && (
        <div className='card p-4'>
          <h4 className='font-semibold text-gray-700 mb-3'>
            Year-by-Year Projections
          </h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2'>Age</th>
                  <th className='text-right py-2'>Starting Savings</th>
                  <th className='text-right py-2'>Planned Expenses</th>
                  <th className='text-right py-2'>Additional Expenses</th>
                  <th className='text-right py-2'>Additional Savings</th>
                  <th className='text-right py-2'>Ending Savings</th>
                  <th className='text-center py-2'>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyProjections
                  .slice(0, 150)
                  .map((projection: any, index: number) => (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='py-2'>{projection.age}</td>
                      <td className='text-right py-2'>
                        ${projection.startingSavings.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ${projection.plannedExpenses.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ${projection.additionalExpenses.toLocaleString()}
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
                            projection.status === 'Earning'
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
                {result.yearlyProjections.length > 20 && (
                  <tr>
                    <td colSpan={7} className='text-center py-2 text-gray-500'>
                      ... and {result.yearlyProjections.length - 20} more years
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanSummary
