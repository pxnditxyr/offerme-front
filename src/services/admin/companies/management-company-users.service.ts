import { graphqlClient, managementCompanyUserCreateMutation, managementCompanyUserQuery, managementCompanyByUserIdQuery, toggleStatusManagementCompanyUserMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCompanyUserInput, IGQLErrorResponse, IManagementCompany, IManagementCompanyUser } from '~/interfaces'

interface ICompanyByIdParams {
  companyUserId: string
  jwt:           string
}

interface ICreateCompanyUsersParams {
  createCompanyUserInput: ICreateCompanyUserInput
  jwt: string
}

interface IToggleStatusCompanyUsersParams {
  toggleStatusCompanyUserId: string
  jwt: string
}

interface ICompanyByUserIdParams {
  userId: string
  jwt: string
}

export class ManagementCompanyUsersService {
  static companyUser = async ( { companyUserId, jwt } : ICompanyByIdParams ) : Promise<IManagementCompanyUser | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCompanyUserQuery, variables: { companyUserId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.companyUser
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static companyByUserId = async ( { userId, jwt } : ICompanyByUserIdParams ) : Promise<IManagementCompany | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCompanyByUserIdQuery, variables: { userId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.companyByUserId
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createCompanyUser = async ( { createCompanyUserInput, jwt } : ICreateCompanyUsersParams ) : Promise<IManagementCompanyUser | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCompanyUserCreateMutation, variables: { createCompanyUserInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createCompanyUser
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusCompanyUser = async ( { toggleStatusCompanyUserId, jwt } : IToggleStatusCompanyUsersParams ) : Promise<IManagementCompanyUser | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementCompanyUserMutation, variables: { toggleStatusCompanyUserId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCompanyUser
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
