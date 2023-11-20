import { z } from '@builder.io/qwik-city'

export const managementCreateDiscountProductValidationSchema = {
  productId: z.string().min( 2, 'This promotion request has no more products to add' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  discountAmount: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Amount must be at least 0' ) ),
  discountPercentage: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Percentage must be at least 0' ) ),
  discountPrice: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Price must be at least 0' ) ),
  title: z.string().min( 2, 'Title must be at least 2 characters' )
}
