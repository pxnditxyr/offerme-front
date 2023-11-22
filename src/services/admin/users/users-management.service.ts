import { createUserMutation, deactivateUserMutation, getUserByIdQuery, getUsersQuery, graphqlClient, managementToggleStatusUserMutation, updateUserMutation } from '~/graphql'
import { ICreateUserManagement, IGQLErrorResponse, IManagementUsersData, IUpdateUserManagement } from '~/interfaces'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

interface IToggleStatusParams {
  toggleStatusManagementUserId: string
  jwt: string
}


export class UsersManagementService {
  static getUsers = async ( jwt : string, search : string = '' ) : Promise<IManagementUsersData[]> => {
    const response = await graphqlClient.query( { document: getUsersQuery, variables: { search }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.managementUsers
  }

  static newGetUsers = async ( jwt : string, search : string = '' ) : Promise<IManagementUsersData[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query( { document: getUsersQuery, variables: { search }, requestHeaders: getBearerAuthHeader( jwt ) } )
      return response.managementUsers
    } catch ( error ) {
      return {
        errors: graphqlExceptionsHandler( error ),
      }
    }
  } 

  static getUserById = async ( jwt : string, id : string ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.query( { document: getUserByIdQuery, variables: { managementUserId: id }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.managementUser
  }

  static createUser = async ( jwt : string, user : ICreateUserManagement ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: createUserMutation, variables: { createManagementUserInput: user }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.createManagementUser
  }

  static updateUser = async ( jwt : string, user : IUpdateUserManagement ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: updateUserMutation, variables: { updateManagementUserInput: user }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.updateManagementUser
  }

  static deactivateUser = async ( jwt : string, id : string ) : Promise<IManagementUsersData> => {
    const response = await graphqlClient.mutation( { document: deactivateUserMutation, variables: { deactivateManagementUserId: id }, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.deactivateManagementUser
  }

  static getGenders = async ( jwt : string ) : Promise<{ id: string, name: string }[]> => {
    const response = await graphqlClient.query( { document: getUsersQuery, requestHeaders: getBearerAuthHeader( jwt ) } )
    return response.genders
  }

  static toggleStatus = async ( { toggleStatusManagementUserId, jwt } : IToggleStatusParams ) : Promise<IManagementUsersData | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation( { document: managementToggleStatusUserMutation, variables: { toggleStatusManagementUserId }, requestHeaders: getBearerAuthHeader( jwt ) } )
      return response.toggleStatusManagementUser
    } catch ( error ) {
      return {
        errors: graphqlExceptionsHandler( error ),
      }
    }
  }
}
