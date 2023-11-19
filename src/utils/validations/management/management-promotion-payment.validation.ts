import { z } from '@builder.io/qwik-city'

export const managementCreatePromotionPaymentValidationSchema = {
  amount: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Amount must be at least 0' ) ),
  voucher: z.string(),
  paymentDate: z.string(),
  paymentMethodId: z.string().min( 2, 'Payment Method must be at least 2 characters' ),
}
