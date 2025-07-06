import React, { useState, useEffect } from 'react'
import { usePlan } from '../context/PlanContext'
import { getPlanSummary, getPlanData } from '../services/api'
import Chart from '../components/Chart'

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
  const [activeTab, setActiveTab] = useState('Personal Info')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // Load plan data on component mount
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        setDataLoading(true)
        const planData = await getPlanData(1) // Fetch plan with ID 1
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
  }, [setPlan])

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

    // Calculate investment approach returns using new field structure
    const vpfAmount = Number(investmentStrategy['VPF/EPF/PPF Amount']) || 0
    const vpfIRR = Number(investmentStrategy['VPF/EPF/PPF IRR']) || 7
    const rdAmount =
      Number(investmentStrategy['Recurring Deposit/Fixed Dep Amount']) || 0
    const rdIRR =
      Number(investmentStrategy['Recurring Deposit/Fixed Dep IRR']) || 7
    const govBillsAmount =
      Number(investmentStrategy['Government Bills Amount']) || 0
    const govBillsIRR = Number(investmentStrategy['Government Bills IRR']) || 7
    const goldAmount = Number(investmentStrategy['Gold Amount']) || 0
    const goldIRR = Number(investmentStrategy['Gold IRR']) || 7
    const corporateBondsAmount =
      Number(investmentStrategy['Corporate Bonds Amount']) || 20
    const corporateBondsIRR =
      Number(investmentStrategy['Corporate Bonds IRR']) || 7

    const largeCapAmount =
      Number(investmentStrategy['Largecap Mutual Fund Amount']) || 0
    const largeCapIRR =
      Number(investmentStrategy['Largecap Mutual Fund IRR']) || 12
    const directStocksAmount =
      Number(investmentStrategy['Direct Stocks Amount']) || 220
    const directStocksIRR =
      Number(investmentStrategy['Direct Stocks IRR']) || 10
    const smallCapAmount =
      Number(investmentStrategy['Smallcap Mutual Fund Amount']) || 10
    const smallCapIRR =
      Number(investmentStrategy['Smallcap Mutual Fund IRR']) || 18

    const totalSafeAssets =
      vpfAmount + rdAmount + govBillsAmount + goldAmount + corporateBondsAmount
    const totalStockMarket =
      largeCapAmount + directStocksAmount + smallCapAmount
    const totalInvestment = totalSafeAssets + totalStockMarket

    const currentReturns =
      totalInvestment > 0
        ? (vpfAmount * vpfIRR +
            rdAmount * rdIRR +
            govBillsAmount * govBillsIRR +
            goldAmount * goldIRR +
            corporateBondsAmount * corporateBondsIRR +
            largeCapAmount * largeCapIRR +
            directStocksAmount * directStocksIRR +
            smallCapAmount * smallCapIRR) /
          totalInvestment
        : 0

    const currentTaxRate =
      totalInvestment > 0
        ? (totalSafeAssets * 30 + totalStockMarket * 20) / totalInvestment
        : 0

    // Post-retirement strategy - using default conservative allocation
    const postRetirementSafeAssets = 70 // 70% safe assets
    const postRetirementLargeCap = 30 // 30% large cap

    const postRetirementReturns =
      (postRetirementSafeAssets * 7 + postRetirementLargeCap * 12) / 100

    const postRetirementTax =
      (postRetirementSafeAssets * 30 + postRetirementLargeCap * 20) / 100

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
                  ${(personalInfo['Current Savings'] || 0).toLocaleString()}
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
                ${totalSafeAssets.toLocaleString()}
              </div>
              <div className='text-gray-600'>Safe Assets</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-green-600'>
                ${largeCapAmount.toLocaleString()}
              </div>
              <div className='text-gray-600'>Largecap Mutual Fund</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-purple-600'>
                ${directStocksAmount.toLocaleString()}
              </div>
              <div className='text-gray-600'>Direct Stocks</div>
            </div>
            <div className='text-center'>
              <div className='font-medium text-orange-600'>
                ${smallCapAmount.toLocaleString()}
              </div>
              <div className='text-gray-600'>Smallcap Mutual Fund</div>
            </div>
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

        {result && activeTab === 'Summary' && <Chart data={result} />}
      </div>
    </div>
  )
}

export default CalculatorPage
