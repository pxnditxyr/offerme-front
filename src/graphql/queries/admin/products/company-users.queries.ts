export const managementCompanyUserQuery = `
query CompanyUser($companyUserId: ID!) {
  companyUser(id: $companyUserId) {
    id
    companyId
    userId
    status
  }
}`

export const managementCompanyUserCreateMutation = `
mutation CreateCompanyUser($createCompanyUserInput: CreateCompanyUserInput!) {
  createCompanyUser(createCompanyUserInput: $createCompanyUserInput) {
    id
    companyId
    userId
    status
  }
}`

export const toggleStatusManagementCompanyUserMutation = `
mutation ToggleStatusCompanyUser($toggleStatusCompanyUserId: ID!) {
  toggleStatusCompanyUser(id: $toggleStatusCompanyUserId) {
    id
    companyId
    userId
    status
  }
}`
