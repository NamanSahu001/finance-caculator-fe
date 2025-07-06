import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export async function register(name: string, email: string, password: string) {
  // Stub: returns fake user
  return {
    name,
    email,
    role: 'user' as 'user',
    token: 'fake-jwt',
  }
}

export async function login(email: string, password: string) {
  // Stub: returns fake user
  return {
    name: 'Demo User',
    email,
    role:
      email === 'admin@demo.com' ? ('admin' as 'admin') : ('user' as 'user'),
    token: 'fake-jwt',
  }
}

export async function getPlanSummary(plan: any) {
  // Enhanced financial planning calculations based on Excel structure
  const personalInfo = plan.personalinfo || {}
  const income = plan.income || {}
  const expenses = plan.expenses || {}
  const investmentStrategy = plan.investmentstrategy || {}
  const goals = plan.goals || {}

  // Calculate totals
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

  // Investment approach calculations
  const fixedReturnsAlloc =
    Number(investmentStrategy['Fixed Returns Allocation']) || 0
  const largeCapAlloc =
    Number(investmentStrategy['Large Cap Mutual Funds Allocation']) || 0
  const directStocksAlloc =
    Number(investmentStrategy['Direct Stocks Allocation']) || 0
  const smallCapAlloc =
    Number(investmentStrategy['Small Cap Mutual Funds Allocation']) || 0

  const currentReturns =
    (fixedReturnsAlloc * 7 +
      largeCapAlloc * 12 +
      directStocksAlloc * 15 +
      smallCapAlloc * 18) /
    100

  const currentTaxRate =
    (fixedReturnsAlloc * 30 +
      largeCapAlloc * 20 +
      directStocksAlloc * 20 +
      smallCapAlloc * 20) /
    100

  // Post-retirement strategy
  const postRetirementFixed =
    Number(investmentStrategy['Post Retirement Fixed Returns']) || 0
  const postRetirementLargeCap =
    Number(investmentStrategy['Post Retirement Large Cap']) || 0

  const postRetirementReturns =
    (postRetirementFixed * 7 + postRetirementLargeCap * 12) / 100

  const postRetirementTax =
    (postRetirementFixed * 30 + postRetirementLargeCap * 20) / 100

  // Year-by-year projections
  const age = Number(personalInfo.Age) || 30
  const retirementAge = Number(personalInfo.RetirementAge) || 65
  const lifeExpectancy = Number(personalInfo.LifeExpectancy) || 85
  const inflationRate = Number(personalInfo['Inflation Rate']) || 6
  const stepUpRate = Number(personalInfo['Step-up in Savings']) || 5
  const currentSavings = Number(personalInfo.CurrentSavings) || 0

  const yearsToRetirement = retirementAge - age
  const yearsInRetirement = lifeExpectancy - retirementAge

  // Generate year-by-year projections
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

    // Additional savings (step-up)
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

  // Calculate retirement corpus needed
  const monthlyExpensesInRetirement =
    totalExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const postRetirementAnnualReturn =
    postRetirementReturns * (1 - postRetirementTax / 100)
  const retirementCorpusNeeded =
    monthlyExpensesInRetirement * 12 * yearsInRetirement

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
        fixedReturns: fixedReturnsAlloc,
        largeCap: largeCapAlloc,
        directStocks: directStocksAlloc,
        smallCap: smallCapAlloc,
      },
    },
    yearlyProjections,
  }
}

export async function getUsers() {
  // Stub: returns fake users
  return [
    { name: 'Alice', email: 'alice@demo.com', role: 'user', status: 'active' },
    { name: 'Bob', email: 'bob@demo.com', role: 'admin', status: 'active' },
  ]
}
