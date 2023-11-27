import { getManagementCategoriesQuery, getManagementCategoryByIdQuery, graphqlClient } from '~/graphql'
import { graphqlExceptionsHandler } from '~/utils'

import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'

interface IGetCatgoriesParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  order?: string
}

interface ICategoryByIdParams {
  categoryId: string
}

export class PublicCategoriesService {
  static findAll = async ( { search = '', offset, limit, status, order } : IGetCatgoriesParams  ) : Promise<IManagementCategory[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: getManagementCategoriesQuery, variables: { search, status, offset, limit, order } })
      return response.categories
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static findOne = async ( { categoryId } : ICategoryByIdParams ) : Promise<IManagementCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: getManagementCategoryByIdQuery, variables: { categoryId } })
      return response.category
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
