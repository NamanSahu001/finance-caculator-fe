import React, { useState, useEffect } from 'react'
import { usePlan } from '../context/PlanContext'
import { useAuth } from '../context/AuthContext'
import { getPlanSummary, getPlanData } from '../services/api'
import PlanSummary from '../components/PlanSummary'

const tabs = [
  'Personal Info',
  'Income',
  'Expenses',
  'Investment Strategy',
  'Summary',
]

// Predefined fields based on financial planning structure
const fieldDefinitions = {
  'Personal Info': {
    'Current Age': { type: 'number', placeholder: 'Enter your current age' },
    'Retirement Age': { type: 'number', placeholder: 'Target retirement age' },
    'Wish to live till': {
      type: 'number',
      placeholder: 'Expected life expectancy',
      defaultValue: 85,
    },
    'Current Savings': { type: 'number', placeholder: 'Current total savings' },
    Inflation: {
      type: 'number',
      placeholder: 'Expected inflation rate %',
      defaultValue: 6,
    },
    'Capital Gain Tax': {
      type: 'number',
      placeholder: 'Capital gains tax rate %',
      defaultValue: 20,
    },
    'Income Tax': {
      type: 'number',
      placeholder: 'Income tax rate %',
      defaultValue: 30,
    },
  },
  Income: {
    Salary: { type: 'number', placeholder: 'Monthly salary' },
    Bonus: { type: 'number', placeholder: 'Monthly bonus' },
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
    // Safe Asset Investments
    'VPF/EPF/PPF Amount': {
      type: 'number',
      placeholder: 'VPF/EPF/PPF amount',
      defaultValue: 0,
    },
    'VPF/EPF/PPF IRR': {
      type: 'number',
      placeholder: 'VPF/EPF/PPF IRR %',
      defaultValue: 7,
    },
    'Recurring Deposit/Fixed Dep Amount': {
      type: 'number',
      placeholder: 'Recurring Deposit amount',
      defaultValue: 0,
    },
    'Recurring Deposit/Fixed Dep IRR': {
      type: 'number',
      placeholder: 'Recurring Deposit IRR %',
      defaultValue: 7,
    },
    'Government Bills Amount': {
      type: 'number',
      placeholder: 'Government Bills amount',
      defaultValue: 0,
    },
    'Government Bills IRR': {
      type: 'number',
      placeholder: 'Government Bills IRR %',
      defaultValue: 7,
    },
    'Gold Amount': {
      type: 'number',
      placeholder: 'Gold amount',
      defaultValue: 0,
    },
    'Gold IRR': { type: 'number', placeholder: 'Gold IRR %', defaultValue: 7 },
    'Corporate Bonds Amount': {
      type: 'number',
      placeholder: 'Corporate Bonds amount',
      defaultValue: 20,
    },
    'Corporate Bonds IRR': {
      type: 'number',
      placeholder: 'Corporate Bonds IRR %',
      defaultValue: 7,
    },
    // Stock Market Investments
    'Largecap Mutual Fund Amount': {
      type: 'number',
      placeholder: 'Largecap Mutual Fund amount',
      defaultValue: 0,
    },
    'Largecap Mutual Fund IRR': {
      type: 'number',
      placeholder: 'Largecap Mutual Fund IRR %',
      defaultValue: 12,
    },
    'Direct Stocks Amount': {
      type: 'number',
      placeholder: 'Direct Stocks amount',
      defaultValue: 220,
    },
    'Direct Stocks IRR': {
      type: 'number',
      placeholder: 'Direct Stocks IRR %',
      defaultValue: 10,
    },
    'Smallcap Mutual Fund Amount': {
      type: 'number',
      placeholder: 'Smallcap Mutual Fund amount',
      defaultValue: 10,
    },
    'Smallcap Mutual Fund IRR': {
      type: 'number',
      placeholder: 'Smallcap Mutual Fund IRR %',
      defaultValue: 18,
    },
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
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Personal Info')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // Load plan data on component mount
  useEffect(() => {
    const loadPlanData = async () => {
      if (!user) return

      try {
        setDataLoading(true)
        const planData = await getPlanData(user) // Fetch plan with user object
        console.log('Loaded plan data:', planData)

        // Update the plan context with fetched data
        setPlan(planData)
      } catch (error) {
        console.error('Error loading plan data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    loadPlanData()
  }, [setPlan, user])

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
    if (!user) return

    setLoading(true)
    const summary = await getPlanSummary(plan, user)
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
    return <PlanSummary plan={plan} result={result} />
  }
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='card p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>
          Financial Planning Calculator
        </h2>

        {dataLoading && (
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <div className='flex items-center text-blue-700'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2'></div>
              Loading your financial plan data...
            </div>
          </div>
        )}

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
      </div>
    </div>
  )
}

export default CalculatorPage
