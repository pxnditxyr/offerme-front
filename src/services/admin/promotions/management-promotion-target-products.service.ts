import { graphqlClient, managementCodePromotionDiscountProductCreateMutation, managementCodePromotionDiscountProductQuery, managementCodePromotionDiscountProductsQuery, managementCodePromotionDiscountProductToggleStatusMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCodePromotionDiscountProductInput, IGQLErrorResponse, IManagementCodePromotionDiscountProduct } from '~/interfaces'

interface IFindAllParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IFindOneParams {
  codePromotionDiscountProductId: string
  jwt:        string
}

interface ICreateParams {
  createCodePromotionDiscountProductInput: ICreateCodePromotionDiscountProductInput
  jwt: string
}

interface IToggleStatusParams {
  toggleStatusCodePromotionDiscountProductId: string
  jwt: string
}

export class ManagementCodePromotionDiscountProductsService {
  static findOne = async ( { codePromotionDiscountProductId, jwt } : IFindOneParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCodePromotionDiscountProductQuery, variables: { codePromotionDiscountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.codePromotionDiscountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static findAll = async ( { jwt, search, offset, limit, status } : IFindAllParams ) : Promise<IManagementCodePromotionDiscountProduct[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementCodePromotionDiscountProductsQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.codePromotionDiscountProducts
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static create = async ( { createCodePromotionDiscountProductInput, jwt } : ICreateParams ) : Promise<{ success: boolean } | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCodePromotionDiscountProductCreateMutation, variables: { createCodePromotionDiscountProductInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return { success: response.createCodePromotionDiscountProduct }
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatus = async ( { toggleStatusCodePromotionDiscountProductId, jwt } : IToggleStatusParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementCodePromotionDiscountProductToggleStatusMutation, variables: { toggleStatusCodePromotionDiscountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCodePromotionDiscountProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
