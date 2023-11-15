import { graphqlClient, managementCompanyLogoCreateMutation, managementCompanyLogoQuery, toggleStatusManagementCompanyLogoMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCompanyLogoInput, IGQLErrorResponse, IManagementCompanyLogo } from '~/interfaces'


interface ICompanyByIdParams {
  companyLogoId: string
  jwt:        string
}

interface ICreateCompanyLogosParams {
  createCompanyLogoInput: ICreateCompanyLogoInput
  jwt: string
}

interface IToggleStatusCompanyLogosParams {
  toggleStatusCompanyLogoId: string
  jwt: string
}

export class ManagementCompanyLogosService {
  static companyLogo = async ( { companyLogoId, jwt } : ICompanyByIdParams ) : Promise<IManagementCompanyLogo | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCompanyLogoQuery, variables: { companyLogoId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.companyLogo
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createCompanyLogo = async ( { createCompanyLogoInput, jwt } : ICreateCompanyLogosParams ) : Promise<IManagementCompanyLogo | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCompanyLogoCreateMutation, variables: { createCompanyLogoInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createCompanyLogo
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusCompanyLogo = async ( { toggleStatusCompanyLogoId, jwt } : IToggleStatusCompanyLogosParams ) : Promise<IManagementCompanyLogo | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementCompanyLogoMutation, variables: { toggleStatusCompanyLogoId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCompanyLogo
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
