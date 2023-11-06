export const revalidateTokenQuery = `
  query {
    revalidateToken {
      token
      user {
        id
        email
        peopleInfo {
          id
          name
          paternalSurname
          maternalSurname
          birthdate
          genderId
        }
        role {
          id
          name
        }
      }
    }
  }`

export const getGendersQuery = `
  query {
    genders {
      id
      name
    }
  }`
