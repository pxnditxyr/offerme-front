import { graphqlClient, managementPromotionRequestCreateMutation, managementPromotionRequestQuery, managementPromotionRequestToggleStatusMutation, managementPromotionRequestUpdateMutation, managementPromotionRequestsQuery } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionRequestInput, IGQLErrorResponse, IManagementPromotionRequest, IUpdatePromotionRequestInput } from '~/interfaces'

interface IGetPromotionRequestsParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IPromotionRequestByIdParams {
  promotionRequestId: string
  jwt:        string
}

interface ICreatePromotionRequestParams {
  createPromotionRequestInput: ICreatePromotionRequestInput
  jwt: string
}

interface IUpdatePromotionRequestParams {
  updatePromotionRequestInput: IUpdatePromotionRequestInput
  jwt: string
}

interface IToggleStatusPromotionRequestParams {
  toggleStatusPromotionRequestId: string
  jwt: string
}

export class ManagementPromotionRequestsService {
  static promotionRequests = async ( { search = '', offset, limit, status, jwt } : IGetPromotionRequestsParams  ) : Promise<IManagementPromotionRequest[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionRequestsQuery, variables: { search, status, offset, limit }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionRequests
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static promotionRequest = async ( { promotionRequestId, jwt } : IPromotionRequestByIdParams ) : Promise<IManagementPromotionRequest | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionRequestQuery, variables: { promotionRequestId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionRequest
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createPromotionRequest = async ( { createPromotionRequestInput, jwt } : ICreatePromotionRequestParams ) : Promise<IManagementPromotionRequest | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionRequestCreateMutation, variables: { createPromotionRequestInput: {
        ...createPromotionRequestInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createPromotionRequest
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static updatePromotionRequest = async ( { updatePromotionRequestInput, jwt } : IUpdatePromotionRequestParams ) : Promise<IManagementPromotionRequest | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionRequestUpdateMutation, variables: { updatePromotionRequestInput: {
        ...updatePromotionRequestInput,
      } }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.updatePromotionRequest
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusPromotionRequest = async ( { toggleStatusPromotionRequestId, jwt } : IToggleStatusPromotionRequestParams ) : Promise<IManagementPromotionRequest | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionRequestToggleStatusMutation, variables: { toggleStatusPromotionRequestId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusPromotionRequest
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
