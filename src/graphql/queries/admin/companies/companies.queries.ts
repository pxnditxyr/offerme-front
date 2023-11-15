export const managementCompaniesQuery = `
query Companies($offset: Int, $limit: Int, $search: String, $status: Boolean) {
  companies(offset: $offset, limit: $limit, search: $search, status: $status) {
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
      email
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

export const managementCompanyQuery = `
query Company($companyId: ID!) {
  company(id: $companyId) {
    id
    name
    description
    companyTypeId
    documentTypeId
    documentNumber
    website
    email
    foundedAt
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
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
      email
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

export const managementCompanyCreateMutation = `
mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {
  createCompany(createCompanyInput: $createCompanyInput) {
    id
    name
    description
    companyTypeId
    documentTypeId
    documentNumber
    website
    email
    foundedAt
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
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
      email
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

export const managementCompanyUpdateMutation = `
mutation UpdateCompany($updateCompanyInput: UpdateCompanyInput!) {
  updateCompany(updateCompanyInput: $updateCompanyInput) {
     id
    name
    description
    companyTypeId
    documentTypeId
    documentNumber
    website
    email
    foundedAt
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
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
      email
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

export const managementCompanyToggleStatusMutation = `
mutation ToggleStatusCompany($toggleStatusCompanyId: ID!) {
  toggleStatusCompany(id: $toggleStatusCompanyId) {
    id
    name
    description
    companyTypeId
    documentTypeId
    documentNumber
    website
    email
    foundedAt
    status
    createdAt
    createdBy
    updatedAt
    updatedBy
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
      email
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
