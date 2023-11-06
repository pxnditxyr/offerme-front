
export const getUsersQuery = `
  query Users {
    users {
      id
      email
      isVerifiedEmail
      status
      createdAt
      createdBy
      updatedAt
      updatedBy
      creator {
        id
        email
      }
      updater {
        id
        email 
      }
      peopleInfo {
        id
        name
        paternalSurname
        maternalSurname
      }
      role {
        id
        name
      }
      avatars {
        id
        isMain
        url
      }
    }
  }
`
