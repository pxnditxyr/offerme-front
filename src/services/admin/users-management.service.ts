import { createUserMutation, deactivateUserMutation, getUserByIdQuery, getUsersQuery, graphqlClient, updateUserMutation } from '~/graphql'
import { ICreateUserManagement } from '~/hooks/context/admin/use-users-management'
import { IManagementUsersData } from '~/interfaces'
import { getBearerAuthHeader } from '~/utils'

export class UsersManagementService {
  static getUsers = async ( jwt : string ) : Promise<IManagementUsersData[]> => {
    const response = await graphqlClient.query( { document: getUsersQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.managementUsers
  }

  static getUserById = async ( jwt : string, id : string ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.query( { document: getUserByIdQuery, variables: { id }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.managementUser
  }

  static createUser = async ( jwt : string, user : ICreateUserManagement ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: createUserMutation, variables: { user }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.createUser
  }

  static updateUser = async ( jwt : string, user : ICreateUserManagement ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: updateUserMutation, variables: { user }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.updateUser
  }

  static deactivateUser = async ( jwt : string, id : string ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: deactivateUserMutation, variables: { id }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.deactivateUser
  }
}
