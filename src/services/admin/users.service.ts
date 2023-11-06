import { getUsersQuery, graphqlClient } from '~/graphql'
import { getBearerAuthHeader } from '~/utils'

export class UsersService {
  static getUsers = async ( jwt : string ) : Promise<any> => {
    const users = graphqlClient.query( { document: getUsersQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
    console.log( users )
    return users
  }
}
