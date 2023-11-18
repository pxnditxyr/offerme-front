import { graphqlClient, managementProductCategoryCreateMutation, managementProductCategoryQuery, toggleStatusManagementProductCategoryMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateProductCategoryInput, IGQLErrorResponse, IManagementProductCategory } from '~/interfaces'


interface IProductByIdParams {
  productCategoryId: string
  jwt:        string
}

interface ICreateProductCategoriesParams {
  createProductCategoryInput: ICreateProductCategoryInput
  jwt: string
}

interface IToggleStatusProductCategoriesParams {
  toggleStatusProductCategoryId: string
  jwt: string
}

export class ManagementProductCategoriesService {
  static productCategory = async ( { productCategoryId, jwt } : IProductByIdParams ) : Promise<IManagementProductCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementProductCategoryQuery, variables: { productCategoryId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.productCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createProductCategory = async ( { createProductCategoryInput, jwt } : ICreateProductCategoriesParams ) : Promise<IManagementProductCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementProductCategoryCreateMutation, variables: { createProductCategoryInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createProductCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusProductCategory = async ( { toggleStatusProductCategoryId, jwt } : IToggleStatusProductCategoriesParams ) : Promise<IManagementProductCategory | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementProductCategoryMutation, variables: { toggleStatusProductCategoryId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusProductCategory
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
