import { graphqlClient, managementCompaniesQuery, managementCompanyCreateMutation, managementCompanyQuery, managementCompanyToggleStatusMutation, managementCompanyUpdateMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCompanyInput, IGQLErrorResponse, IManagementCompany, IUpdateCompanyInput } from '~/interfaces'

interface IGetCompaniesParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface ICompanyByIdParams {
  companyId: string
  jwt:        string
}

interface ICreateCompanyParams {
  createCompanyInput: ICreateCompanyInput
  jwt: string
}

interface IUpdateCompanyParams {
  updateCompanyInput: IUpdateCompanyInput
  jwt: string
}

interface IToggleStatusCompanyParams {
  toggleStatusCompanyId: string
  jwt: string
}

export class ManagementCompaniesService {
  static companies = async ( { search = '', offset, limit, status, jwt } : IGetCompaniesParams  ) : Promise<IManagementCompany[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCompaniesQuery, variables: { search, status, offset, limit }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.companies
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static company = async ( { companyId, jwt } : ICompanyByIdParams ) : Promise<IManagementCompany | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCompanyQuery, variables: { companyId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.company
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createCompany = async ( { createCompanyInput, jwt } : ICreateCompanyParams ) : Promise<IManagementCompany | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCompanyCreateMutation, variables: { createCompanyInput: {
        ...createCompanyInput,
        documentTypeId: createCompanyInput.documentTypeId === 'null' ? null : createCompanyInput.documentTypeId,
        documentNumber: createCompanyInput.documentTypeId === 'null' ? null : createCompanyInput.documentNumber,
        foundedAt: createCompanyInput.foundedAt === '' ? null : createCompanyInput.foundedAt,
        email: createCompanyInput.email === '' ? null : createCompanyInput.email,
        website: createCompanyInput.website === '' ? null : createCompanyInput.website,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createCompany
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static updateCompany = async ( { updateCompanyInput, jwt } : IUpdateCompanyParams ) : Promise<IManagementCompany | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCompanyUpdateMutation, variables: { updateCompanyInput: {
        ...updateCompanyInput,
        documentTypeId: updateCompanyInput.documentTypeId === 'null' ? null : updateCompanyInput.documentTypeId,
        documentNumber: updateCompanyInput.documentTypeId === 'null' ? null : updateCompanyInput.documentNumber,
        foundedAt: updateCompanyInput.foundedAt === '' ? null : updateCompanyInput.foundedAt,
        email: updateCompanyInput.email === '' ? null : updateCompanyInput.email,
        website: updateCompanyInput.website === '' ? null : updateCompanyInput.website,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updateCompany
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusCompany = async ( { toggleStatusCompanyId, jwt } : IToggleStatusCompanyParams ) : Promise<IManagementCompany | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCompanyToggleStatusMutation, variables: { toggleStatusCompanyId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCompany
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
