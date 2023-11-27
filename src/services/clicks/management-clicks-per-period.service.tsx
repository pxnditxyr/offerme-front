// interface IFindAllParams {
//   search?: string
//   offset?: number
//   limit?:  number
//   status?: boolean
//   jwt:     string
// }
//
// interface IFindOneParams {
//   promotionStatesId: string
//   jwt:        string
// }
//
// interface ICreateParams {
//   createPromotionStatusInput: ICreatePromotionStatusInput
//   jwt: string
// }
//
// interface IUpdateParams {
//   statusUpdatePromotionStatusInput: IUpdatePromotionStatusInput
//   jwt: string
// }
//
// export class ManagementPromotionStatusService {
//   static findAllApproved = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.query({ document: managementPromotionStatusesApprovedQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.promotionStatusesApproved
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static findAllRejected = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.query({ document: managementPromotionStatusesRejectedQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.promotionStatusesRejected
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static findAllPending = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.query({ document: managementPromotionStatusesPendingQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.promotionStatusesPending
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static findAll = async ( { search = '', offset, limit, status, jwt } : IFindAllParams ) : Promise<IManagementPromotionStatus[] | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.query({ document: managementPromotionStatusesQuery, variables: { search, offset, limit, status }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.promotionStatuses
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//
//   static findOne = async ( { promotionStatesId, jwt } : IFindOneParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.query({ document: managementPromotionStatesQuery, variables: { promotionStatesId }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.promotionStates
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static create = async ( { createPromotionStatusInput, jwt } : ICreateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.mutation({ document: managementPromotionStatusCreateMutation, variables: { createPromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.createPromotionStatus
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static approve = async ( { statusUpdatePromotionStatusInput, jwt } : IUpdateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.mutation({ document: managementPromotionStatusApproveMutation, variables: { statusUpdatePromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.approvePromotionStatus
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
//
//   static reject = async ( { statusUpdatePromotionStatusInput, jwt } : IUpdateParams ) : Promise<IManagementPromotionStatus | IGQLErrorResponse> => {
//     try {
//       const response = await graphqlClient.mutation({ document: managementPromotionStatusRejectMutation, variables: { statusUpdatePromotionStatusInput }, requestHeaders: getBearerAuthHeader( jwt ) })
//       return response.rejectPromotionStatus
//     } catch ( error : any ) {
//       return {
//         errors: graphqlExceptionsHandler( error )
//       }
//     }
//   }
// }

import { graphqlClient } from "~/graphql"
import { addClickClickCounterPerPeriodMutation, clickPerPeriodQuery, clickPerPeriodsQuery, createClickCounterPerPeriodMutation, updateClickCounterPerPeriodMutation } from "~/graphql/queries/clicks/click-per-period.queries"
import { IClickPerPeriod, ICreateClickCounterPerPeriodInput, IGQLErrorResponse, IUpdateClickCounterPerPeriodInput } from "~/interfaces"
import { graphqlExceptionsHandler } from "~/utils"

interface IFindAllParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
}

interface IFindOneParams {
  clickCounterPerPeriodId: string
}

interface ICreateParams {
  createClickCounterPerPeriodInput: ICreateClickCounterPerPeriodInput
}

interface IUpdateParams {
  updateClickCounterPerPeriodInput: IUpdateClickCounterPerPeriodInput
}

interface IAddClickParams {
  addClickClickCounterPerPeriodId: string
}

export class ManagementClicksPerPeriodService {
  static findAll = async ( { search = '', offset, limit, status } : IFindAllParams ) : Promise<IClickPerPeriod[] | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: clickPerPeriodsQuery, variables: { search, offset, limit, status } })
      return response.clickCounterPerPeriods
    } catch ( error : any ) {
      return { errors: graphqlExceptionsHandler( error ) }
    }
  }

  static findOne = async ( { clickCounterPerPeriodId } : IFindOneParams ) : Promise<IClickPerPeriod | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: clickPerPeriodQuery, variables: { clickCounterPerPeriodId } })
      return response.clickCounterPerPeriod
    } catch ( error : any ) {
      return { errors: graphqlExceptionsHandler( error ) }
    }
  }

  static create = async ( { createClickCounterPerPeriodInput } : ICreateParams ) : Promise<IClickPerPeriod | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: createClickCounterPerPeriodMutation, variables: { createClickCounterPerPeriodInput } })
      return response.createClickCounterPerPeriod
    } catch ( error : any ) {
      return { errors: graphqlExceptionsHandler( error ) }
    }
  }

  static update = async ( { updateClickCounterPerPeriodInput } : IUpdateParams ) : Promise<IClickPerPeriod | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: updateClickCounterPerPeriodMutation, variables: { updateClickCounterPerPeriodInput } })
      return response.createClickCounterPerPeriod
    } catch ( error : any ) {
      return { errors: graphqlExceptionsHandler( error ) }
    }
  }

  static addClick = async ( { addClickClickCounterPerPeriodId } : IAddClickParams ) : Promise<IClickPerPeriod | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: addClickClickCounterPerPeriodMutation, variables: { addClickClickCounterPerPeriodId } })
      return response.createClickCounterPerPeriod
    } catch ( error : any ) {
      return { errors: graphqlExceptionsHandler( error ) }
    }
  }
} 
