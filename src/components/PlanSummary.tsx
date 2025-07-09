import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PlanSummaryProps {
  plan: any
  result: any
}

const PlanSummary: React.FC<PlanSummaryProps> = ({ plan, result }) => {
  const investmentStrategy = plan.investmentstrategy || {}

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

  const investments = [
    {
      label: 'VPF/EPF/PPF',
      amount: vpfAmount,
      irr: Number(investmentStrategy['VPF/EPF/PPF IRR']) || 0,
    },
    {
      label: 'Recurring Deposit/Fixed Dep',
      amount: rdAmount,
      irr: Number(investmentStrategy['Recurring Deposit/Fixed Dep IRR']) || 0,
    },
    {
      label: 'Government Bills',
      amount: govBillsAmount,
      irr: Number(investmentStrategy['Government Bills IRR']) || 0,
    },
    {
      label: 'Gold',
      amount: goldAmount,
      irr: Number(investmentStrategy['Gold IRR']) || 0,
    },
    {
      label: 'Corporate Bonds',
      amount: corporateBondsAmount,
      irr: Number(investmentStrategy['Corporate Bonds IRR']) || 0,
    },
    {
      label: 'Largecap Mutual Fund',
      amount: largeCapAmount,
      irr: Number(investmentStrategy['Largecap Mutual Fund IRR']) || 0,
    },
    {
      label: 'Direct Stocks',
      amount: directStocksAmount,
      irr: Number(investmentStrategy['Direct Stocks IRR']) || 0,
    },
    {
      label: 'Smallcap Mutual Fund',
      amount: smallCapAmount,
      irr: Number(investmentStrategy['Smallcap Mutual Fund IRR']) || 0,
    },
  ]
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)

  // PDF download handler
  const handleDownloadPDF = () => {
    if (!result?.yearlyProjections || result.yearlyProjections.length === 0)
      return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Year-by-Year Projections', 14, 16)
    const tableColumn = [
      'Age',
      'Starting Savings',
      'Planned Expenses',
      'Additional Expenses',
      'Additional Savings',
      'Ending Savings',
      'Status',
    ]
    const tableRows = result.yearlyProjections.map((projection: any) => [
      projection.age,
      `rs${projection.startingSavings.toLocaleString()}`,
      `rs${projection.plannedExpenses.toLocaleString()}`,
      `rs${projection.additionalExpenses.toLocaleString()}`,
      `rs${projection.additionalSavings.toLocaleString()}`,
      `rs${projection.endingSavings.toLocaleString()}`,
      projection.status,
    ])
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [100, 116, 139] },
      margin: { left: 8, right: 8 },
      didDrawPage: (data) => {
        doc.setFontSize(10)
      },
    })
    doc.save('yearly-projections.pdf')
  }

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
                <th className='text-right py-2'>Amount</th>
                <th className='text-right py-2'>IRR (%)</th>
                <th className='text-right py-2'>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv.label}>
                  <td className='py-2'>{inv.label}</td>
                  <td className='text-right py-2'>
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className='text-right py-2'>{inv.irr}</td>
                  <td className='text-right py-2'>
                    {totalInvestment > 0
                      ? ((inv.amount / totalInvestment) * 100).toFixed(1)
                      : '0'}
                  </td>
                </tr>
              ))}
              <tr className='bg-gray-50 font-semibold'>
                <td className='py-2'>Total</td>
                <td className='text-right py-2'>
                  ₹{totalInvestment.toLocaleString()}
                </td>
                <td className='text-right py-2'></td>
                <td className='text-right py-2'>100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-by-Year Projections */}
      {result?.yearlyProjections && result.yearlyProjections.length > 0 && (
        <div className='card p-4'>
          <div className='flex justify-between items-center mb-3'>
            <h4 className='font-semibold text-gray-700'>
              Year-by-Year Projections
            </h4>
            <button
              onClick={handleDownloadPDF}
              className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow'
            >
              Download PDF
            </button>
          </div>
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
                        ₹{projection.startingSavings.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ₹{projection.plannedExpenses.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ₹{projection.additionalExpenses.toLocaleString()}
                      </td>
                      <td className='text-right py-2'>
                        ₹{projection.additionalSavings.toLocaleString()}
                      </td>
                      <td className='text-right py-2 font-medium'>
                        ₹{projection.endingSavings.toLocaleString()}
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
