import { graphqlClient, createManagementCategoryImageMutation, getManagementCategoryImageByIdQuery, toggleStatusManagementCategoryImageMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateCategoryImagesInput, IGQLErrorResponse, IManagementCategoryImage } from '~/interfaces'


interface ICategoryByIdParams {
  categoryImageId: string
  jwt:        string
}

interface ICreateCategoryImagesParams {
  createCategoryImageInput: ICreateCategoryImagesInput
  jwt: string
}

interface IToggleStatusCategoryImagesParams {
  toggleStatusCategoryImageId: string
  jwt: string
}

export class ManagementCategoryImagesService {
  static categoryImage = async ( { categoryImageId, jwt } : ICategoryByIdParams ) : Promise<IManagementCategoryImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: getManagementCategoryImageByIdQuery, variables: { categoryImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.categoryImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createCategoryImage = async ( { createCategoryImageInput, jwt } : ICreateCategoryImagesParams ) : Promise<IManagementCategoryImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: createManagementCategoryImageMutation, variables: { createCategoryImageInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createCategoryImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusCategoryImage = async ( { toggleStatusCategoryImageId, jwt } : IToggleStatusCategoryImagesParams ) : Promise<IManagementCategoryImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementCategoryImageMutation, variables: { toggleStatusCategoryImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusCategoryImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
