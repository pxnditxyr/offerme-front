import { graphqlClient, publicFindAllCodePromotionDiscountProductsQuery, publicFindAllDiscountProductsQuery, publicFindAllProductsQuery, publicFindAllPromotionsQuery, redeemCouponMutation } from '~/graphql'
import { graphqlExceptionsHandler } from '~/utils'

import { IPublicCodePromotionDiscountProductsService } from '~/interfaces/public/code-promotion-discount-products.interface'

interface IFindAllParams {
  search?: string
  offset?: number
  limit?:  number
  status?: boolean
}



// interface IFindOneParams {
//   codePromotionDiscountProductId: string
// }

export class PublicPromotionDiscountProductsService {
  // static findOne = async ( { codePromotionDiscountProductId, jwt } : IFindOneParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.query({ document: managementCodePromotionDiscountProductQuery, variables: { codePromotionDiscountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return response.codePromotionDiscountProduct
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }

  static findAll = async ( { search = '', offset, limit, status = true } : IFindAllParams ) : Promise<IPublicCodePromotionDiscountProductsService> => {
    try {
      const publicFindAllDiscountProducts = await graphqlClient.query({ document: publicFindAllDiscountProductsQuery, variables: { search, offset, limit, status } })
      const publicFindAllProducts = await graphqlClient.query({ document: publicFindAllProductsQuery, variables: { search, offset, limit, status } })
      const publicFindAllCodePromotionDiscountProducts = await graphqlClient.query({ document: publicFindAllCodePromotionDiscountProductsQuery, variables: { search, offset, limit, status } })
      const publicPromotions = await graphqlClient.query({ document: publicFindAllPromotionsQuery, variables: { search, offset, limit, status } })
      return {
        publicCodePromotionDiscountProducts: publicFindAllCodePromotionDiscountProducts.codePromotionDiscountProducts,
        publicDiscountProducts: publicFindAllDiscountProducts.discountProducts,
        publicProducts: publicFindAllProducts.products,
        publicPromotions: publicPromotions.promotions
      }
    } catch ( error : any ) {
      return {
        publicProducts: { errors: graphqlExceptionsHandler( error ) },
        publicDiscountProducts: { errors: graphqlExceptionsHandler( error ) },
        publicCodePromotionDiscountProducts: { errors: graphqlExceptionsHandler( error ) },
        publicPromotions: { errors: graphqlExceptionsHandler( error ) }
      }
    }
  }

  // static create = async ( { createCodePromotionDiscountProductInput, jwt } : ICreateParams ) : Promise<{ success: boolean } | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.mutation({ document: managementCodePromotionDiscountProductCreateMutation, variables: { createCodePromotionDiscountProductInput }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return { success: response.createCodePromotionDiscountProduct }
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }
  //
  // static toggleStatus = async ( { toggleStatusCodePromotionDiscountProductId, jwt } : IToggleStatusParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.mutation({ document: managementCodePromotionDiscountProductToggleStatusMutation, variables: { toggleStatusCodePromotionDiscountProductId }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return response.toggleStatusCodePromotionDiscountProduct
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }
  //
  // static redeemCoupon = async ( { redeemDiscountCouponId, jwt } : IRedeemCouponParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.mutation({ document: redeemCouponMutation, variables: { redeemDiscountCouponId:  redeemDiscountCouponId }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return response.redeemDiscountCoupon
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }
  //
  // static getCoupon = async ( { getDiscountCouponId, jwt } : IGetCouponParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.query({ document: managementCodePromotionDiscountProductQuery, variables: { codePromotionDiscountProductId: getDiscountCouponId }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return response.getDiscountCoupon
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }
  //
  // static forgetCoupon = async ( { forgetDiscountCouponId, jwt } : IForgetCouponParams ) : Promise<IManagementCodePromotionDiscountProduct | IGQLErrorResponse> => {
  //   try {
  //     const response = await graphqlClient.mutation({ document: forgetCouponMutation, variables: { forgetDiscountCouponId }, requestHeaders: getBearerAuthHeader( jwt ) })
  //     return response.forgetDiscountCoupon
  //   } catch ( error : any ) {
  //     return {
  //       errors: graphqlExceptionsHandler( error )
  //     }
  //   }
  // }
}
