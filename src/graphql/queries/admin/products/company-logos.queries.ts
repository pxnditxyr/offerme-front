export const managementCompanyLogoQuery = `
query CompanyLogo($companyLogoId: ID!) {
  companyLogo(id: $companyLogoId) {
    id
    url
    alt
    status
  }
}`

export const managementCompanyLogoCreateMutation = `
mutation CreateCompanyLogo($createCompanyLogoInput: CreateCompanyLogoInput!) {
  createCompanyLogo(createCompanyLogoInput: $createCompanyLogoInput) {
    alt
    id
    status
    url
  }
}`

export const toggleStatusManagementCompanyLogoMutation = `
mutation ToggleStatusCompanyLogo($toggleStatusCompanyLogoId: ID!) {
  toggleStatusCompanyLogo(id: $toggleStatusCompanyLogoId) {
    alt
    id
    url
    status
  }
}`
