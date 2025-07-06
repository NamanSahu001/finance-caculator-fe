import React, { useState } from 'react'
import { usePlan } from '../context/PlanContext'
import { getPlanSummary } from '../services/api'
import Chart from '../components/Chart'

const tabs = [
  'Personal Info',
  'Income',
  'Expenses',
  'Investment Strategy',
  'Goals',
  'Summary',
]

// Predefined fields based on financial planning structure
const fieldDefinitions = {
  'Personal Info': {
    Age: { type: 'number', placeholder: 'Enter your age' },
    'Retirement Age': { type: 'number', placeholder: 'Target retirement age' },
    'Life Expectancy': {
      type: 'number',
      placeholder: 'Expected life expectancy',
    },
    'Current Savings': { type: 'number', placeholder: 'Current total savings' },
    'Monthly Income': {
      type: 'number',
      placeholder: 'Monthly take-home income',
    },
    'Inflation Rate': {
      type: 'number',
      placeholder: 'Expected inflation rate %',
      defaultValue: 6,
    },
    'Step-up in Savings': {
      type: 'number',
      placeholder: 'Annual increase in savings %',
      defaultValue: 5,
    },
  },
  Income: {
    Salary: { type: 'number', placeholder: 'Annual salary' },
    Bonus: { type: 'number', placeholder: 'Annual bonus' },
    'Investment Income': {
      type: 'number',
      placeholder: 'Monthly investment income',
    },
    'Rental Income': { type: 'number', placeholder: 'Monthly rental income' },
    'Other Income': { type: 'number', placeholder: 'Other monthly income' },
  },
  Expenses: {
    Housing: { type: 'number', placeholder: 'Monthly housing costs' },
    Transportation: {
      type: 'number',
      placeholder: 'Monthly transportation costs',
    },
    Food: { type: 'number', placeholder: 'Monthly food expenses' },
    Utilities: { type: 'number', placeholder: 'Monthly utilities' },
    Insurance: { type: 'number', placeholder: 'Monthly insurance premiums' },
    Entertainment: { type: 'number', placeholder: 'Monthly entertainment' },
    Healthcare: { type: 'number', placeholder: 'Monthly healthcare costs' },
    'Debt Payments': { type: 'number', placeholder: 'Monthly debt payments' },
  },
  'Investment Strategy': {
    'Current Monthly Investment': {
      type: 'number',
      placeholder: 'Current monthly investment amount',
    },
    'Fixed Returns Allocation': {
      type: 'number',
      placeholder: 'Fixed returns allocation %',
      defaultValue: 0,
    },
    'Large Cap Mutual Funds Allocation': {
      type: 'number',
      placeholder: 'Large cap allocation %',
      defaultValue: 40,
    },
    'Direct Stocks Allocation': {
      type: 'number',
      placeholder: 'Direct stocks allocation %',
      defaultValue: 35,
    },
    'Small Cap Mutual Funds Allocation': {
      type: 'number',
      placeholder: 'Small cap allocation %',
      defaultValue: 25,
    },
    'Post Retirement Fixed Returns': {
      type: 'number',
      placeholder: 'Post-retirement fixed returns %',
      defaultValue: 50,
    },
    'Post Retirement Large Cap': {
      type: 'number',
      placeholder: 'Post-retirement large cap %',
      defaultValue: 50,
    },
  },
  Goals: {
    'Emergency Fund': {
      type: 'number',
      placeholder: 'Target emergency fund amount',
    },
    'House Down Payment': {
      type: 'number',
      placeholder: 'Target house down payment',
    },
    'Children Education': {
      type: 'number',
      placeholder: 'Target education fund',
    },
    'Retirement Goal': {
      type: 'number',
      placeholder: 'Target retirement savings',
    },
    'Travel Fund': { type: 'number', placeholder: 'Annual travel budget' },
  },
}

// Investment approach definitions
const investmentApproaches = {
  'Fixed Returns': { returns: 7, tax: 30 },
  'Large Cap Mutual Funds': { returns: 12, tax: 20 },
  'Direct Stocks': { returns: 15, tax: 20 },
  'Small Cap Mutual Funds': { returns: 18, tax: 20 },
}

const postRetirementApproaches = {
  'Fixed Returns': { returns: 7, tax: 30 },
  'Large Cap Mutual Funds': { returns: 12, tax: 20 },
}

const CalculatorPage: React.FC = () => {
  const { plan, setPlan } = usePlan()
  const [activeTab, setActiveTab] = useState('Personal Info')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleInput = (section: string, key: string, value: any) => {
    setPlan((prev) => ({
      ...prev,
      [section.toLowerCase().replace(' ', '')]: {
        ...prev[section.toLowerCase().replace(' ', '') as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleCalculate = async () => {
    setLoading(true)
    const summary = await getPlanSummary(plan)
    setResult(summary)
    setLoading(false)
  }

  const renderSection = () => {
    if (activeTab === 'Summary') {
      return renderSummary()
    }

    const sectionKey = activeTab
      .toLowerCase()
      .replace(' ', '') as keyof typeof plan
    const section = plan[sectionKey] || {}
    const fields = fieldDefinitions[activeTab as keyof typeof fieldDefinitions]

    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800'>{activeTab}</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(fields).map(([key, config]) => (
            <div key={key} className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700 capitalize'>
                {key}
              </label>
              <input
                type={config.type}
                className='input'
                placeholder={config.placeholder}
                value={section[key] || ''}
                onChange={(e) => handleInput(activeTab, key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSummary = () => {
    const personalInfo = plan.personalinfo || {}
    const income = plan.income || {}
    const expenses = plan.expenses || {}
    const investmentStrategy = plan.investmentstrategy || {}
    const goals = plan.goals || {}

    const totalIncome = Object.values(income).reduce(
      (sum: number, val: any) => sum + (Number(val) || 0),
      0
    )
    const totalExpenses = Object.values(expenses).reduce(
      (sum: number, val: any) => sum + (Number(val) || 0),
      0
    )
    const currentMonthlyInvestment =
      Number(investmentStrategy['Current Monthly Investment']) || 0
    const netIncome = totalIncome - totalExpenses

    // Calculate investment approach returns
    const fixedReturnsAlloc =
      Number(investmentStrategy['Fixed Returns Allocation']) || 0
    const largeCapAlloc =
      Number(investmentStrategy['Large Cap Mutual Funds Allocation']) || 0
    const directStocksAlloc =
      Number(investmentStrategy['Direct Stocks Allocation']) || 0
    const smallCapAlloc =
      Number(investmentStrategy['Small Cap Mutual Funds Allocation']) || 0

    const currentReturns =
      (fixedReturnsAlloc * investmentApproaches['Fixed Returns'].returns +
        largeCapAlloc * investmentApproaches['Large Cap Mutual Funds'].returns +
        directStocksAlloc * investmentApproaches['Direct Stocks'].returns +
        smallCapAlloc *
          investmentApproaches['Small Cap Mutual Funds'].returns) /
      100

    const currentTaxRate =
      (fixedReturnsAlloc * investmentApproaches['Fixed Returns'].tax +
        largeCapAlloc * investmentApproaches['Large Cap Mutual Funds'].tax +
        directStocksAlloc * investmentApproaches['Direct Stocks'].tax +
        smallCapAlloc * investmentApproaches['Small Cap Mutual Funds'].tax) /
      100

    const postRetirementFixed =
      Number(investmentStrategy['Post Retirement Fixed Returns']) || 0
    const postRetirementLargeCap =
      Number(investmentStrategy['Post Retirement Large Cap']) || 0

    const postRetirementReturns =
      (postRetirementFixed * postRetirementApproaches['Fixed Returns'].returns +
        postRetirementLargeCap *
          postRetirementApproaches['Large Cap Mutual Funds'].returns) /
      100

    const postRetirementTax =
      (postRetirementFixed * postRetirementApproaches['Fixed Returns'].tax +
        postRetirementLargeCap *
          postRetirementApproaches['Large Cap Mutual Funds'].tax) /
      100

    return (
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Financial Planning Summary
        </h3>

        {/* Current Financial Status */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='card p-4'>
            <h4 className='font-medium text-gray-700 mb-3'>
              Current Financial Status
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>Current Savings:</span>
                <span className='font-medium'>
                  ${(personalInfo.CurrentSavings || 0).toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Monthly Investment:</span>
                <span className='font-medium text-blue-600'>
                  ${currentMonthlyInvestment.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Net Monthly Income:</span>
                <span
                  className={`font-medium ${
                    netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ${netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className='card p-4'>
            <h4 className='font-medium text-gray-700 mb-3'>
              Investment Strategy
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>Expected Returns:</span>
                <span className='font-medium text-green-600'>
                  {currentReturns.toFixed(1)}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Effective Tax Rate:</span>
                <span className='font-medium text-red-600'>
                  {currentTaxRate.toFixed(1)}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Post-Retirement Returns:</span>
                <span className='font-medium text-blue-600'>
                  {postRetirementReturns.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Allocation */}
        <div className='card p-4'>
          <h4 className='font-medium text-gray-700 mb-3'>
            Current Investment Allocation
          </h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div className='text-center'>
              <div className='font-medium text-blue-600'>
                {fixedReturnsAlloc}%
              </div>
              <div className='text-gray-600'>Fixed Returns</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-green-600'>{largeCapAlloc}%</div>
              <div className='text-gray-600'>Large Cap</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-purple-600'>
                {directStocksAlloc}%
              </div>
              <div className='text-gray-600'>Direct Stocks</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-orange-600'>
                {smallCapAlloc}%
              </div>
              <div className='text-gray-600'>Small Cap</div>
            </div>
          </div>
        </div>

        {/* Financial Goals */}
        <div className='card p-4'>
          <h4 className='font-medium text-gray-700 mb-3'>Financial Goals</h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            {Object.entries(goals).map(([key, value]) => (
              <div key={key} className='flex justify-between'>
                <span className='capitalize'>
                  {key.replace(/([A-Z])/g, ' $1')}:
                </span>
                <span className='font-medium'>
                  ${(Number(value) || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='card p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>
          Financial Planning Calculator
        </h2>

        <div className='flex flex-wrap gap-2 mb-6'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {renderSection()}

        {activeTab !== 'Summary' && (
          <button
            className='btn mt-6 w-full'
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Summary'}
          </button>
        )}

        {result && activeTab === 'Summary' && <Chart data={result} />}
      </div>
    </div>
  )
}

export default CalculatorPage
