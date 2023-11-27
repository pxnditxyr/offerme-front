export interface IClickPerPeriod {
  startDate: string
  endDate: string
  company: {
    id: string
    name: string
  }
}

export interface ICreateClickCounterPerPeriodInput {
  startDate: string
  endDate: string
  companyId: string
}

export interface IUpdateClickCounterPerPeriodInput {
  id: string
  startDate?: string
  endDate?: string
  companyId?: string
}
