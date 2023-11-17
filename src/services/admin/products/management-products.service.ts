import { graphqlClient, managementProductCreateMutation, managementProductQuery, managementProductToggleStatusMutation, managementProductUpdateMutation, managementProductsQuery } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateProductInput, IGQLErrorResponse, IManagementProduct, IUpdateProductInput } from '~/interfaces'

interface IGetProductsParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IProductByIdParams {
  productId: string
  jwt:        string
}

interface ICreateProductParams {
  createProductInput: ICreateProductInput
  jwt: string
}

interface IUpdateProductParams {
  updateProductInput: IUpdateProductInput
  jwt: string
}

interface IToggleStatusProductParams {
  toggleStatusProductId: string
  jwt: string
}

export class ManagementProductsService {
  static products = async ( { search = '', offset, limit, status, jwt } : IGetProductsParams  ) : Promise<IManagementProduct[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementProductsQuery, variables: { search, status, offset, limit }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.products
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static product = async ( { productId, jwt } : IProductByIdParams ) : Promise<IManagementProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementProductQuery, variables: { productId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.product
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createProduct = async ( { createProductInput, jwt } : ICreateProductParams ) : Promise<IManagementProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementProductCreateMutation, variables: { createProductInput: {
        ...createProductInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static updateProduct = async ( { updateProductInput, jwt } : IUpdateProductParams ) : Promise<IManagementProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementProductUpdateMutation, variables: { updateProductInput: {
        ...updateProductInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updateProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusProduct = async ( { toggleStatusProductId, jwt } : IToggleStatusProductParams ) : Promise<IManagementProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementProductToggleStatusMutation, variables: { toggleStatusProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
