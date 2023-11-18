import { graphqlClient, managementProductImageCreateMutation, managementProductImageQuery, toggleStatusManagementProductImageMutation } from '~/graphql'
import { getBearerAuthHeader, graphqlExceptionsHandler } from '~/utils'

import { ICreateProductImageInput, IGQLErrorResponse, IManagementProductImage } from '~/interfaces'


interface IProductByIdParams {
  productImageId: string
  jwt:        string
}

interface ICreateProductImagesParams {
  createProductImageInput: ICreateProductImageInput
  jwt: string
}

interface IToggleStatusProductImagesParams {
  toggleStatusProductImageId: string
  jwt: string
}

export class ManagementProductImagesService {
  static productImage = async ( { productImageId, jwt } : IProductByIdParams ) : Promise<IManagementProductImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.query({ document: managementProductImageQuery, variables: { productImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.productImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static createProductImage = async ( { createProductImageInput, jwt } : ICreateProductImagesParams ) : Promise<IManagementProductImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: managementProductImageCreateMutation, variables: { createProductImageInput }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.createProductImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }

  static toggleStatusProductImage = async ( { toggleStatusProductImageId, jwt } : IToggleStatusProductImagesParams ) : Promise<IManagementProductImage | IGQLErrorResponse> => {
    try {
      const response = await graphqlClient.mutation({ document: toggleStatusManagementProductImageMutation, variables: { toggleStatusProductImageId }, requestHeaders: getBearerAuthHeader( jwt ) })
      return response.toggleStatusProductImage
    } catch ( error : any ) {
      return {
        errors: graphqlExceptionsHandler( error )
      }
    }
  }
}
