import {
  graphqlClient, managementPromotionStatesQuery,
  managementPromotionStatusApproveMutation,
  managementPromotionStatusCreateMutation, managementPromotionStatusRejectMutation, managementPromotionStatusesApprovedQuery,
  managementPromotionStatusesPendingQuery, managementPromotionStatusesQuery,
  managementPromotionStatusesRejectedQuery
} from '~/graphql'

import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionStatusInput, IGQLErrorResponse, IManagementPromotionStatus, IUpdatePromotionStatusInput } from '~/interfaces'

interface IFindAllParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
  jwt:     string
}

interface IFindOneParams {
  promotionStatesId: string
  jwt:        string
}

interface ICreateParams {
  createPromotionStatusInput: ICreatePromotionStatusInput
  jwt: string
}

interface IUpdateParams {
  statusUpdatePromotionStatusInput: IUpdatePromotionStatusInput
  jwt: string
}

export class ManagementPromotionStatusService {
  static findAllApproved = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionStatusesApprovedQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionStatusesApproved
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static findAllRejected = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionStatusesRejectedQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionStatusesRejected
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static findAllPending = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionStatusesPendingQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionStatusesPending
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static findAll = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionStatusesQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionStatuses
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }


  static findOne = async ( { promotionStatesId, jwt } : IFindOneParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionStatesQuery, variables: { promotionStatesId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionStates
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static create = async ( { createPromotionStatusInput, jwt } : ICreateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionStatusCreateMutation, variables: { createPromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createPromotionStatus
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static approve = async ( { statusUpdatePromotionStatusInput, jwt } : IUpdateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionStatusApproveMutation, variables: { statusUpdatePromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.approvePromotionStatus
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static reject = async ( { statusUpdatePromotionStatusInput, jwt } : IUpdateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionStatusRejectMutation, variables: { statusUpdatePromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.rejectPromotionStatus
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
