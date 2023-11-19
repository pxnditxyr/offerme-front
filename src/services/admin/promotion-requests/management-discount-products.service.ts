import { graphqlClient, managementDiscountProductQuery, managementDiscountProductsCreateMutation, managementDiscountProductsToggleStatusMutation, managementDiscountProductsUpdateMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateDiscountProductInput, IGQLErrorResponse, IManagementDiscountProduct, IUpdateDiscountProductInput } from '~/interfaces'

interface IPromotionByIdParams {
  discountProductId: string
  jwt:        string
}

interface ICreateDiscountProductsParams {
  createDiscountProductInput: ICreateDiscountProductInput
  jwt: string
}

interface IUpdateDiscountProductsParams {
  updateDiscountProductInput: IUpdateDiscountProductInput
  jwt: string
}

interface IToggleStatusDiscountProductsParams {
  toggleStatusDiscountProductId: string
  jwt: string
}

export class ManagementDiscountProductsService {
  static findOne = async ( { discountProductId, jwt } : IPromotionByIdParams ) : Promise<IManagementDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementDiscountProductQuery, variables: { discountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.discountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static create = async ( { createDiscountProductInput, jwt } : ICreateDiscountProductsParams ) : Promise<IManagementDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementDiscountProductsCreateMutation, variables: { createDiscountProductInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createDiscountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static update = async ( { updateDiscountProductInput, jwt } : IUpdateDiscountProductsParams ) : Promise<IManagementDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementDiscountProductsUpdateMutation, variables: { updateDiscountProductInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updateDiscountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatus = async ( { toggleStatusDiscountProductId, jwt } : IToggleStatusDiscountProductsParams ) : Promise<IManagementDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementDiscountProductsToggleStatusMutation, variables: { toggleStatusDiscountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusDiscountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
