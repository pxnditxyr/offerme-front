import { graphqlClient, managementPromotionCreateMutation, managementPromotionQuery, managementPromotionToggleStatusMutation, managementPromotionUpdateMutation, managementPromotionsQuery } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionInput, IGQLErrorResponse, IManagementPromotion, IUpdatePromotionInput } from '~/interfaces'

interface IGetPromotionsParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IPromotionByIdParams {
  promotionId: string
  jwt:        string
}

interface ICreatePromotionParams {
  createPromotionInput: ICreatePromotionInput
  jwt: string
}

interface IUpdatePromotionParams {
  updatePromotionInput: IUpdatePromotionInput
  jwt: string
}

interface IToggleStatusPromotionParams {
  toggleStatusPromotionId: string
  jwt: string
}

export class ManagementPromotionsService {
  static promotions = async ( { search = '', offset, limit, status, jwt } : IGetPromotionsParams  ) : Promise<IManagementPromotion[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionsQuery, variables: { search, status, offset, limit }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotions
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static promotion = async ( { promotionId, jwt } : IPromotionByIdParams ) : Promise<IManagementPromotion | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionQuery, variables: { promotionId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotion
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createPromotion = async ( { createPromotionInput, jwt } : ICreatePromotionParams ) : Promise<IManagementPromotion | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionCreateMutation, variables: { createPromotionInput: {
        ...createPromotionInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createPromotion
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static updatePromotion = async ( { updatePromotionInput, jwt } : IUpdatePromotionParams ) : Promise<IManagementPromotion | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionUpdateMutation, variables: { updatePromotionInput: {
        ...updatePromotionInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updatePromotion
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusPromotion = async ( { toggleStatusPromotionId, jwt } : IToggleStatusPromotionParams ) : Promise<IManagementPromotion | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionToggleStatusMutation, variables: { toggleStatusPromotionId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusPromotion
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
