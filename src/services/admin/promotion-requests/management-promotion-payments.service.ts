import { graphqlClient, managementPromotionPaymentCreateMutation, managementPromotionPaymentQuery, managementPromotionPaymentToggleStatusMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionPaymentInput, IGQLErrorResponse, IManagementPromotionPayment } from '~/interfaces'


interface IFindAllParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IPromotionByIdParams {
  promotionPaymentId: string
  jwt:        string
}

interface ICreatePromotionPaymentsParams {
  createPromotionPaymentInput: ICreatePromotionPaymentInput
  jwt: string
}

interface IToggleStatusPromotionPaymentsParams {
  toggleStatusPromotionPaymentId: string
  jwt: string
}

export class ManagementPromotionPaymentsService {

  static promotionPayments = async ( { search, offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionPayment[] | IGQLErrorResponse> => {
    try {
      
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static promotionPayment = async ( { promotionPaymentId, jwt } : IPromotionByIdParams ) : Promise<IManagementPromotionPayment | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionPaymentQuery, variables: { promotionPaymentId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionPayment
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createPromotionPayment = async ( { createPromotionPaymentInput, jwt } : ICreatePromotionPaymentsParams ) : Promise<IManagementPromotionPayment | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionPaymentCreateMutation, variables: {
        createPromotionPaymentInput: {
          ...createPromotionPaymentInput,
          voucher: createPromotionPaymentInput.voucher || null,
        }
      }, requestHeaders: getBearerAuthHeader( jwt ) })
      
      return response.createPromotionPayment
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusPromotionPayment = async ( { toggleStatusPromotionPaymentId, jwt } : IToggleStatusPromotionPaymentsParams ) : Promise<IManagementPromotionPayment | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionPaymentToggleStatusMutation, variables: { toggleStatusPromotionPaymentId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusPromotionPayment
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
