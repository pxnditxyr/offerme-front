
export const getUsersQuery = `
query ManagementUsers($offset: Int, $limit: Int, $search: String) {
  managementUsers(offset: $offset, limit: $limit, search: $search) {
    id
    email
    peopleInfo {
      birthdate
      id
      name
      maternalSurname
      paternalSurname
      gender {
        id
        name
      }
      documentNumber
      documentType {
        name
        id
      }
    }
    role {
      id
      name
    }
    mainAvatar
    mainPhone
    mainAddress {
      state
      street
      zipCode
      country
      city
      status
    }
    isVerifiedEmail
    googleId
    status
    createdAt
    updatedAt
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    avatars {
      id
      isMain
      url
      status
    }
    phones {
      number
      id
      phoneType {
        name
        id
      }
      status
    }
    addresses {
      state
      street
      zipCode
      country
      city
      status
    }
    creditCards {
      creditCardType {
        id
        name
      }
      cvv
      expMonth
      expYear
      id
      number
      isMain
      status
    }
  }
}
`

export const getUserByIdQuery = `
query ManagementUser($managementUserId: ID!) {
  managementUser(id: $managementUserId) {
   id
    email
    peopleInfo {
      birthdate
      id
      name
      maternalSurname
      paternalSurname
      gender {
        id
        name
      }
      documentNumber
      documentType {
        name
        id
      }
    }
    role {
      id
      name
    }
    mainAvatar
    mainPhone
    mainAddress {
      state
      street
      zipCode
      country
      city
      status
    }
    isVerifiedEmail
    googleId
    status
    createdAt
    updatedAt
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    avatars {
      id
      isMain
      url
      status
    }
    phones {
      number
      id
      phoneType {
        name
        id
      }
      status
    }
    addresses {
      state
      street
      zipCode
      country
      city
      status
    }
    creditCards {
      creditCardType {
        id
        name
      }
      cvv
      expMonth
      expYear
      id
      number
      isMain
      status
    }
  }
}`
      

export const createUserMutation = `
mutation CreateManagementUser($createManagementUserInput: CreateManagementUserInput!) {
  createManagementUser(createManagementUserInput: $createManagementUserInput) {
    id
    email
    peopleInfo {
      birthdate
      id
      name
      maternalSurname
      paternalSurname
      gender {
        id
        name
      }
      documentNumber
      documentType {
        name
        id
      }
    }
    role {
      id
      name
    }
    mainAvatar
    mainPhone
    mainAddress {
      state
      street
      zipCode
      country
      city
      status
    }
    isVerifiedEmail
    googleId
    status
    createdAt
    updatedAt
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    avatars {
      id
      isMain
      url
      status
    }
    phones {
      number
      id
      phoneType {
        name
        id
      }
      status
    }
    addresses {
      state
      street
      zipCode
      country
      city
      status
    }
    creditCards {
      creditCardType {
        id
        name
      }
      cvv
      expMonth
      expYear
      id
      number
      isMain
      status
    }
  }
}
`

export const updateUserMutation = `
mutation UpdateManagementUser($updateManagementUserInput: UpdateManagementUserInput!) {
  updateManagementUser(updateManagementUserInput: $updateManagementUserInput) {
   id
    email
    peopleInfo {
      birthdate
      id
      name
      maternalSurname
      paternalSurname
      gender {
        id
        name
      }
      documentNumber
      documentType {
        name
        id
      }
    }
    role {
      id
      name
    }
    mainAvatar
    mainPhone
    mainAddress {
      state
      street
      zipCode
      country
      city
      status
    }
    isVerifiedEmail
    googleId
    status
    createdAt
    updatedAt
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    avatars {
      id
      isMain
      url
      status
    }
    phones {
      number
      id
      phoneType {
        name
        id
      }
      status
    }
    addresses {
      state
      street
      zipCode
      country
      city
      status
    }
    creditCards {
      creditCardType {
        id
        name
      }
      cvv
      expMonth
      expYear
      id
      number
      isMain
      status
    }
  }
}`

export const deactivateUserMutation = `
mutation DeactivateManagementUser($deactivateManagementUserId: ID!) {
  deactivateManagementUser(id: $deactivateManagementUserId) {
     id
    email
    peopleInfo {
      birthdate
      id
      name
      maternalSurname
      paternalSurname
      gender {
        id
        name
      }
      documentNumber
      documentType {
        name
        id
      }
    }
    role {
      id
      name
    }
    mainAvatar
    mainPhone
    mainAddress {
      state
      street
      zipCode
      country
      city
      status
    }
    isVerifiedEmail
    googleId
    status
    createdAt
    updatedAt
    creator {
      id
      email
    }
    updater {
      id
      email
    }
    avatars {
      id
      isMain
      url
      status
    }
    phones {
      number
      id
      phoneType {
        name
        id
      }
      status
    }
    addresses {
      state
      street
      zipCode
      country
      city
      status
    }
    creditCards {
      creditCardType {
        id
        name
      }
      cvv
      expMonth
      expYear
      id
      number
      isMain
      status
    }
  }
}`
