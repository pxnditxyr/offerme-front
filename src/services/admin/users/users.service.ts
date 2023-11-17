import { getUserByIdQuery, getUsersQuery, graphqlClient } from '~/graphql'
import { getBearerAuthHeader } from '~/utils'

export class UsersService {
  static getUsers = async ( jwt : string ) : Promise<any> => {
    const response = await graphqlClient.query( { document: getUsersQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.users
  }

  static getUserById = async ( jwt : string, id : string ) : Promise<any> => {
    const response = await graphqlClient.query( { document: getUserByIdQuery, variables: { managementUserId: id }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.managementUser
  }
}
