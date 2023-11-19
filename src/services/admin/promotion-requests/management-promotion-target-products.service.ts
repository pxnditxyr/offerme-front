import { graphqlClient, managementPromotionTargetProductsCreateMutation, managementPromotionTargetProductsQuery, managementPromotionTargetProductsToggleStatusMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionTargetProductInput, IGQLErrorResponse, IManagementPromotionTargetProduct } from '~/interfaces'


interface IPromotionByIdParams {
  promotionTargetProductsId: string
  jwt:        string
}

interface ICreatePromotionTargetProductsParams {
  createPromotionTargetProductInput: ICreatePromotionTargetProductInput
  jwt: string
}

interface IToggleStatusPromotionTargetProductsParams {
  toggleStatusPromotionTargetProductId: string
  jwt: string
}

export class ManagementPromotionTargetProductsService {
  static findOne = async ( { promotionTargetProductsId, jwt } : IPromotionByIdParams ) : Promise<IManagementPromotionTargetProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionTargetProductsQuery, variables: { promotionTargetProductsId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionTargetProducts
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static create = async ( { createPromotionTargetProductInput, jwt } : ICreatePromotionTargetProductsParams ) : Promise<IManagementPromotionTargetProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionTargetProductsCreateMutation, variables: { createPromotionTargetProductInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createPromotionTargetProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatus = async ( { toggleStatusPromotionTargetProductId, jwt } : IToggleStatusPromotionTargetProductsParams ) : Promise<IManagementPromotionTargetProduct | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionTargetProductsToggleStatusMutation, variables: { toggleStatusPromotionTargetProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusPromotionTargetProduct
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
