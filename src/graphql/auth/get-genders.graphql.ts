import { graphqlClient } from '../graphql-client'

export const getGenders = async () => {
  const query = `
    query {
      genders {
        id
        name
      }
    }
  `
  return graphqlClient.query( { document: query } )
}
