import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`
    }
  }
  return config
})

export async function register(name: string, email: string, password: string) {
  try {
    const response = await api.post('/auth/register', {
      username: name,
      email,
      password,
    })

    // The backend returns user data on successful registration
    const { user, token } = response.data
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      type: user.type || 1, // Default to simple user if type not provided
      token,
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Registration failed')
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', {
      username: email, // Backend expects 'username' field
      password,
    })
    console.log(response.data)
    const { user, token } = response.data
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      type: user.type || 1, // Default to simple user if type not provided
      token,
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Login failed')
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
    localStorage.removeItem('user')
  } catch (error: any) {
    console.error('Logout error:', error)
    localStorage.removeItem('user')
  }
}

async function savePlanData(planData: any) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]')
  const newPlan = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...planData,
  }
  savedPlans.push(newPlan)
  localStorage.setItem('savedPlans', JSON.stringify(savedPlans))

  console.log('Plan data saved to localStorage:', newPlan)
  return { success: true, data: newPlan }
}

export async function getPlanSummary(plan: any, user: any) {
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
  const directStocksIRR = Number(investmentStrategy['Direct Stocks IRR']) || 10
  const smallCapAmount =
    Number(investmentStrategy['Smallcap Mutual Fund Amount']) || 10
  const smallCapIRR =
    Number(investmentStrategy['Smallcap Mutual Fund IRR']) || 18

  const capitalGainTax = Number(personalInfo['Capital Gain Tax']) || 20
  const incomeTax = Number(personalInfo['Income Tax']) || 30

  const totalSafeAssets =
    vpfAmount + rdAmount + govBillsAmount + goldAmount + corporateBondsAmount
  const totalStockMarket = largeCapAmount + directStocksAmount + smallCapAmount
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
      ? (totalSafeAssets * incomeTax + totalStockMarket * capitalGainTax) /
        totalInvestment
      : 0

  const postRetirementSafeAssets = 70
  const postRetirementLargeCap = 30

  const postRetirementReturns =
    (postRetirementSafeAssets * 7 + postRetirementLargeCap * 12) / 100

  const postRetirementTax =
    (postRetirementSafeAssets * incomeTax +
      postRetirementLargeCap * capitalGainTax) /
    100

  const age = Number(personalInfo['Current Age']) || 30
  const retirementAge = Number(personalInfo['Retirement Age']) || 65
  const lifeExpectancy = Number(personalInfo['Wish to live till']) || 85
  const inflationRate = Number(personalInfo['Inflation']) || 6
  const currentSavings = Number(personalInfo['Current Savings']) || 0

  const yearsToRetirement = retirementAge - age
  const yearsInRetirement = lifeExpectancy - retirementAge

  const yearlyProjections: Array<{
    age: number
    startingSavings: number
    plannedExpenses: number
    additionalExpenses: number
    additionalSavings: number
    endingSavings: number
    status: string
  }> = []
  let currentYearSavings = currentSavings
  let currentYearInvestment = currentMonthlyInvestment * 12

  for (let year = 1; year <= yearsToRetirement; year++) {
    const currentAge = age + year - 1

    // Calculate returns for the year (post-tax)
    const annualReturn = currentReturns * (1 - currentTaxRate / 100)
    const yearEndSavings =
      currentYearSavings * (1 + annualReturn / 100) + currentYearInvestment

    // Calculate planned expenses (adjusted for inflation)
    const inflatedExpenses =
      totalExpenses * 12 * Math.pow(1 + inflationRate / 100, year - 1)

    // Additional expenses (can be customized)
    const additionalExpenses = 0

    // Additional savings (step-up) - using a default 5% step-up
    const stepUpRate = 5
    const additionalSavings = currentYearInvestment * (stepUpRate / 100)

    yearlyProjections.push({
      age: currentAge,
      startingSavings: currentYearSavings,
      plannedExpenses: inflatedExpenses,
      additionalExpenses: additionalExpenses,
      additionalSavings: additionalSavings,
      endingSavings: yearEndSavings,
      status:
        currentAge >= lifeExpectancy
          ? 'Dead'
          : currentAge >= retirementAge
          ? 'Retired'
          : 'Working',
    })

    currentYearSavings = yearEndSavings
    currentYearInvestment += additionalSavings
  }

  const monthlyExpensesInRetirement =
    totalExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const postRetirementAnnualReturn =
    postRetirementReturns * (1 - postRetirementTax / 100)
  const retirementCorpusNeeded =
    monthlyExpensesInRetirement * 12 * yearsInRetirement

  const planData = {
    user_id: user.id || 1,
    current_age: age,
    retirement_age: retirementAge,
    wist_to_live_till: lifeExpectancy,
    current_savings: currentSavings,
    inflation_rate: inflationRate,
    capital_gains_tax_rate: capitalGainTax,
    income_tax_rate: incomeTax,
    salary: Number(income.Salary) || 0,
    bonus: Number(income.Bonus) || 0,
    investment_income: Number(income['Investment Income']) || 0,
    rental_income: Number(income['Rental Income']) || 0,
    other_income: Number(income['Other Income']) || 0,
    housing_cost: Number(expenses.Housing) || 0,
    transportation_cost: Number(expenses.Transportation) || 0,
    food_cost: Number(expenses.Food) || 0,
    utilities_cost: Number(expenses.Utilities) || 0,
    insurance_cost: Number(expenses.Insurance) || 0,
    entertainment_cost: Number(expenses.Entertainment) || 0,
    healthcare_cost: Number(expenses.Healthcare) || 0,
    debt_payments: Number(expenses['Debt Payments']) || 0,
    vpf_epf_ppf_amount: vpfAmount,
    vpf_epf_ppf_irr: vpfIRR,
    recurring_deposit_amount: rdAmount,
    recurring_deposit_irr: rdIRR,
    government_bills_amount: govBillsAmount,
    government_bills_irr: govBillsIRR,
    gold_amount: goldAmount,
    gold_irr: goldIRR,
    corporate_bonds_amount: corporateBondsAmount,
    corporate_bonds_irr: corporateBondsIRR,
    largecap_mutual_fund_amount: largeCapAmount,
    largecap_mutual_fund_irr: largeCapIRR,
    direct_stocks_amount: directStocksAmount,
    direct_stocks_irr: directStocksIRR,
    smallcap_mutual_fund_amount: smallCapAmount,
    smallcap_mutual_fund_irr: smallCapIRR,
  }

  let saveSuccess = false
  try {
    console.log('Sending plan data to backend:', planData)
    const response = await api.post('/plan/data', { planData })
    console.log('Plan data saved successfully:', response.data)
    saveSuccess = true
  } catch (error: any) {
    console.error('Failed to save plan data to backend:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    })

    try {
      console.log('Attempting to save using mock function...')
      await savePlanData(planData)
      saveSuccess = true
      console.log('Plan data saved using mock function')
    } catch (mockError) {
      console.error(
        'Failed to save plan data even with mock function:',
        mockError
      )
    }
  }

  if (saveSuccess) {
    console.log('✅ Plan data saved successfully')
  } else {
    console.log('❌ Plan data could not be saved')
  }

  return {
    total: currentYearSavings,
    breakdown: {
      'Current Savings': currentSavings,
      'Monthly Investment': currentMonthlyInvestment,
      'Expected Returns': currentReturns,
      'Effective Tax Rate': currentTaxRate,
      'Post-Retirement Returns': postRetirementReturns,
      'Retirement Corpus Needed': retirementCorpusNeeded,
    },
    analysis: {
      savingsRate:
        totalIncome > 0
          ? ((currentMonthlyInvestment / totalIncome) * 100).toFixed(1)
          : 0,
      yearsToRetirement,
      monthlySurplus: netIncome,
      projectedRetirementSavings: currentYearSavings.toFixed(0),
      retirementCorpusNeeded: retirementCorpusNeeded.toFixed(0),
      investmentAllocation: {
        fixedReturns: totalSafeAssets,
        largeCap: largeCapAmount,
        directStocks: directStocksAmount,
        smallCap: smallCapAmount,
      },
    },
    yearlyProjections,
  }
}

export async function getUsers() {
  try {
    const response = await api.get('/auth/users')
    const users = response.data.users || response.data || []

    return users.map((user: any) => ({
      id: user.id,
      name: user.username,
      email: user.email_id,
      role: user.type === 2 ? 'admin' : 'user',
      createdAt: user.created_at,
    }))
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function getPlanData(user: any) {
  try {
    console.log('Fetching plan data for ID:', user.id)
    const response = await api.get(`/plan/data/${user.id}`)
    console.log('Plan data fetched successfully:', response.data)

    const responseData = response.data.data || response.data
    const apiData = Array.isArray(responseData) ? responseData[0] : responseData

    if (!apiData) {
      console.log('No data found in API response')
      return {
        personalinfo: {},
        income: {},
        expenses: {},
        investmentstrategy: {},
      }
    }

    console.log('Extracted API data:', apiData)

    const transformedData = {
      personalinfo: {
        'Current Age': apiData.current_age || '',
        'Retirement Age': apiData.retirement_age || '',
        'Wish to live till': apiData.wist_to_live_till || '',
        'Current Savings': apiData.current_savings || '',
        Inflation: apiData.inflation_rate || '',
        'Capital Gain Tax': apiData.capital_gains_tax_rate || '',
        'Income Tax': apiData.income_tax_rate || '',
      },
      income: {
        Salary: apiData.salary || '',
        Bonus: apiData.bonus || '',
        'Investment Income': apiData.investment_income || '',
        'Rental Income': apiData.rental_income || '',
        'Other Income': apiData.other_income || '',
      },
      expenses: {
        Housing: apiData.housing_cost || '',
        Transportation: apiData.transportation_cost || '',
        Food: apiData.food_cost || '',
        Utilities: apiData.utilities_cost || '',
        Insurance: apiData.insurance_cost || '',
        Entertainment: apiData.entertainment_cost || '',
        Healthcare: apiData.healthcare_cost || '',
        'Debt Payments': apiData.debt_payments || '',
      },
      investmentstrategy: {
        'VPF/EPF/PPF Amount': apiData.vpf_epf_ppf_amount || '',
        'VPF/EPF/PPF IRR': apiData.vpf_epf_ppf_irr || '',
        'Recurring Deposit/Fixed Dep Amount':
          apiData.recurring_deposit_amount || '',
        'Recurring Deposit/Fixed Dep IRR': apiData.recurring_deposit_irr || '',
        'Government Bills Amount': apiData.government_bills_amount || '',
        'Government Bills IRR': apiData.government_bills_irr || '',
        'Gold Amount': apiData.gold_amount || '',
        'Gold IRR': apiData.gold_irr || '',
        'Corporate Bonds Amount': apiData.corporate_bonds_amount || '',
        'Corporate Bonds IRR': apiData.corporate_bonds_irr || '',
        'Largecap Mutual Fund Amount':
          apiData.largecap_mutual_fund_amount || '',
        'Largecap Mutual Fund IRR': apiData.largecap_mutual_fund_irr || '',
        'Direct Stocks Amount': apiData.direct_stocks_amount || '',
        'Direct Stocks IRR': apiData.direct_stocks_irr || '',
        'Smallcap Mutual Fund Amount':
          apiData.smallcap_mutual_fund_amount || '',
        'Smallcap Mutual Fund IRR': apiData.smallcap_mutual_fund_irr || '',
      },
    }

    console.log('Transformed data for form:', transformedData)
    return transformedData
  } catch (error) {
    console.error('Error fetching plan data:', error)

    const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]')
    if (savedPlans.length > 0) {
      console.log(
        'Using fallback data from localStorage:',
        savedPlans[savedPlans.length - 1]
      )
      return savedPlans[savedPlans.length - 1]
    }

    return {
      personalinfo: {},
      income: {},
      expenses: {},
      investmentstrategy: {},
    }
  }
}
