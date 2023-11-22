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

export const managementCompanyByUserIdQuery = `
query CompanyByUserId($userId: ID!) {
  companyByUserId(userId: $userId) {
    id
    name
    description
    documentNumber
    website
    email
    foundedAt
    status
    createdAt
    updatedAt
    companyType {
      id
      name
    }
    documentType {
      id
      name
    }
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    logos {
      id
      alt
      url
      status
    }
    products {
      id
      code
      name
      price
      description
    }
    users {
      id
      userId
      status
    }
    promotionRequests {
      id
      title
      status
      promotionStartAt
      promotionEndAt
      inversionAmount
      description
      createdAt
    }
    promotions {
      id
      promotionStartAt
      promotionEndAt
      title
      description
      status
      promotionPaymentId
      createdAt
    }
  }
}`
