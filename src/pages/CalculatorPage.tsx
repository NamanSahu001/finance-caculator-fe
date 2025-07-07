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

const fieldDefinitions = {
  'Personal Info': {
    'Current Age': { type: 'number', placeholder: 'Enter your current age' },
    'Retirement Age': { type: 'number', placeholder: 'Target retirement age' },
    'Wish to live till': {
      type: 'number',
      placeholder: 'Expected life expectancy',
    },
    'Current Savings': { type: 'number', placeholder: 'Current total savings' },
    Inflation: {
      type: 'number',
      placeholder: 'Expected inflation rate %',
    },
    'Capital Gain Tax': {
      type: 'number',
      placeholder: 'Capital gains tax rate %',
    },
    'Income Tax': {
      type: 'number',
      placeholder: 'Income tax rate %',
    },
  },
  Income: {
    Salary: { type: 'number', placeholder: 'Monthly salary' },
    Bonus: { type: 'number', placeholder: 'Monthly bonus' },
    'Investment Income': {
      type: 'number', placeholder: 'Monthly investment income' },
    'Rental Income': { type: 'number', placeholder: 'Monthly rental income' },
    'Other Income': { type: 'number', placeholder: 'Other monthly income' },
  },
  Expenses: {
    Housing: { type: 'number', placeholder: 'Monthly housing costs' },
    Transportation: {
      type: 'number', placeholder: 'Monthly transportation costs' },
    Food: { type: 'number', placeholder: 'Monthly food expenses' },
    Utilities: { type: 'number', placeholder: 'Monthly utilities' },
    Insurance: { type: 'number', placeholder: 'Monthly insurance premiums' },
    Entertainment: { type: 'number', placeholder: 'Monthly entertainment' },
    Healthcare: { type: 'number', placeholder: 'Monthly healthcare costs' },
    'Debt Payments': { type: 'number', placeholder: 'Monthly debt payments' },
  },
  'Investment Strategy': {
    'VPF/EPF/PPF Amount': {
      type: 'number', placeholder: 'VPF/EPF/PPF amount' },
    'VPF/EPF/PPF IRR': {
      type: 'number', placeholder: 'VPF/EPF/PPF IRR %' },
    'Recurring Deposit/Fixed Dep Amount': {
      type: 'number', placeholder: 'Recurring Deposit amount' },
    'Recurring Deposit/Fixed Dep IRR': {
      type: 'number', placeholder: 'Recurring Deposit IRR %' },
    'Government Bills Amount': {
      type: 'number', placeholder: 'Government Bills amount' },
    'Government Bills IRR': {
      type: 'number', placeholder: 'Government Bills IRR %' },
    'Gold Amount': {
      type: 'number', placeholder: 'Gold amount' },
    'Gold IRR': { type: 'number', placeholder: 'Gold IRR %' },
    'Corporate Bonds Amount': {
      type: 'number', placeholder: 'Corporate Bonds amount' },
    'Corporate Bonds IRR': {
      type: 'number', placeholder: 'Corporate Bonds IRR %' },
    'Largecap Mutual Fund Amount': {
      type: 'number', placeholder: 'Largecap Mutual Fund amount' },
    'Largecap Mutual Fund IRR': {
      type: 'number', placeholder: 'Largecap Mutual Fund IRR %' },
    'Direct Stocks Amount': {
      type: 'number', placeholder: 'Direct Stocks amount' },
    'Direct Stocks IRR': {
      type: 'number', placeholder: 'Direct Stocks IRR %' },
    'Smallcap Mutual Fund Amount': {
      type: 'number', placeholder: 'Smallcap Mutual Fund amount' },
    'Smallcap Mutual Fund IRR': {
      type: 'number', placeholder: 'Smallcap Mutual Fund IRR %' },
  },
}

const CalculatorPage: React.FC = () => {
  const { plan, setPlan } = usePlan()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Personal Info')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const loadPlanData = async () => {
      if (!user) return
      try {
        setDataLoading(true)
        const planData:any = await getPlanData(user)
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
    setActiveTab('Summary')
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
