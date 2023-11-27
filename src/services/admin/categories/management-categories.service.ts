import { createManagementCategoryMutation, toggleStatusManagementCategoryMutation, getManagementCategoriesQuery, getManagementCategoryByIdQuery, graphqlClient, updateManagementCategoryMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCategoryInput, IGQLErrorResponse, IManagementCategory, IUpdateCategoryInput } from '~/interfaces'

interface IGetCatgoriesParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  order?:  string
  jwt:     string
}

interface ICategoryByIdParams {
  categoryId: string
  jwt:        string
}

interface ICreateCategoryParams {
  createCategoryInput: ICreateCategoryInput
  jwt: string
}

interface IUpdateCategoryParams {
  updateCategoryInput: IUpdateCategoryInput
  jwt: string
}

interface IToggleStatusCategoryParams {
  toggleStatusCategoryId: string
  jwt: string
}

export class ManagementCategoriesService {
  static categories = async ( { search = '', offset, limit, status, order, jwt } : IGetCatgoriesParams  ) : Promise<IManagementCategory[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: getManagementCategoriesQuery, variables: { search, status, offset, limit, order }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.categories
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static category = async ( { categoryId, jwt } : ICategoryByIdParams ) : Promise<IManagementCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: getManagementCategoryByIdQuery, variables: { categoryId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.category
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createCategory = async ( { createCategoryInput, jwt } : ICreateCategoryParams ) : Promise<IManagementCategory | IGQLErrorResponse> => {
    try {
      
      const response = await graphqlClient.mutation({ document: createManagementCategoryMutation, variables: { createCategoryInput: {
        ...createCategoryInput,
        parentId: createCategoryInput.parentId === 'null' ? null : createCategoryInput.parentId,
        order: createCategoryInput.parentId === 'null' ? 0 : createCategoryInput.order
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static updateCategory = async ( { updateCategoryInput, jwt } : IUpdateCategoryParams ) : Promise<IManagementCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: updateManagementCategoryMutation, variables: { updateCategoryInput: {
        ...updateCategoryInput,
        parentId: updateCategoryInput.parentId === 'null' ? null : updateCategoryInput.parentId,
        order: updateCategoryInput.parentId === 'null' ? 0 : updateCategoryInput.order
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updateCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusCategory = async ( { toggleStatusCategoryId, jwt } : IToggleStatusCategoryParams ) : Promise<IManagementCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementCategoryMutation, variables: { toggleStatusCategoryId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
