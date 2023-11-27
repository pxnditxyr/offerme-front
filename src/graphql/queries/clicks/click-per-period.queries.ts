const data = `
    id
    companyId
    startDate
    endDate
    count
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
    company {
      id
      email
    }
    creator {
      id
      email
    }
    updater {
      id
      email
    }
`

export const clickPerPeriodQuery = `
query ClickCounterPerPeriod($clickCounterPerPeriodId: String!) {
  clickCounterPerPeriod(id: $clickCounterPerPeriodId) {
    ${ data }
  }
}
`

export const clickPerPeriodsQuery = `
query ClickCounterPerPeriods($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  clickCounterPerPeriods(offset: $offset, limit: $limit, search: $search, status: $status) {
    ${ data }
  }
}`


export const updateClickCounterPerPeriodMutation = `
mutation UpdateClickCounterPerPeriod($updateClickCounterPerPeriodInput: UpdateClickCounterPerPeriodInput!) {
  updateClickCounterPerPeriod(updateClickCounterPerPeriodInput: $updateClickCounterPerPeriodInput) {
    ${ data }
  }
}
`

export const createClickCounterPerPeriodMutation = `
mutation CreateClickCounterPerPeriod($createClickCounterPerPeriodInput: CreateClickCounterPerPeriodInput!) {
  createClickCounterPerPeriod(createClickCounterPerPeriodInput: $createClickCounterPerPeriodInput) {
    ${ data }
  }
}`

export const addClickClickCounterPerPeriodMutation = `
mutation AddClickClickCounterPerPeriod($addClickClickCounterPerPeriodId: ID!) {
  addClickClickCounterPerPeriod(id: $addClickClickCounterPerPeriodId) {
    ${ data }
  }
}`
