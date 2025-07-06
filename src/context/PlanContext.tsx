import React, { createContext, useContext, useState } from 'react'

type PlanState = {
  personalinfo: { [key: string]: any }
  income: { [key: string]: any }
  expenses: { [key: string]: any }
  investmentstrategy: { [key: string]: any }
  goals: { [key: string]: any }
}

type PlanContextType = {
  plan: PlanState
  setPlan: React.Dispatch<React.SetStateAction<PlanState>>
}

const defaultPlan: PlanState = {
  personalinfo: {},
  income: {},
  expenses: {},
  investmentstrategy: {},
  goals: {},
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [plan, setPlan] = useState<PlanState>(defaultPlan)
  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
