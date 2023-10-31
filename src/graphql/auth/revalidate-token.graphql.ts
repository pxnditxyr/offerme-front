import { graphqlClient } from '../graphql-client'
import { getBearerAuthHeader } from '~/utils'

export const revalidateToken = async ( jwt : string ) => {
  const query = `
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
  return graphqlClient.query( { document: query, requestHeaders: getBearerAuthHeader( jwt ) } )
}
