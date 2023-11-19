import { graphqlClient, managementPromotionImageCreateMutation, managementPromotionImageQuery, toggleStatusManagementPromotionImageMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreatePromotionImageInput, IGQLErrorResponse, IManagementPromotionImage } from '~/interfaces'


interface IPromotionRequestByIdParams {
  promotionImageId: string
  jwt:        string
}

interface ICreatePromotionImagesParams {
  createPromotionImageInput: ICreatePromotionImageInput
  jwt: string
}

interface IToggleStatusPromotionImagesParams {
  toggleStatusPromotionImageId: string
  jwt: string
}

export class ManagementPromotionImagesService {
  static promotionImage = async ( { promotionImageId, jwt } : IPromotionRequestByIdParams ) : Promise<IManagementPromotionImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementPromotionImageQuery, variables: { promotionImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.promotionImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createPromotionImage = async ( { createPromotionImageInput, jwt } : ICreatePromotionImagesParams ) : Promise<IManagementPromotionImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementPromotionImageCreateMutation, variables: { createPromotionImageInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createPromotionImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusPromotionImage = async ( { toggleStatusPromotionImageId, jwt } : IToggleStatusPromotionImagesParams ) : Promise<IManagementPromotionImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementPromotionImageMutation, variables: { toggleStatusPromotionImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusPromotionImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
