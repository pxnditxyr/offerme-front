import { z } from '@builder.io/qwik-city'

export const managementCreatePromotionPaymentValidationSchema = {
  amount: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Amount must be at least 0' ) ),
  voucher: z.string(),
  paymentDate: z.string(),
  paymentMethodId: z.string().min( 2, 'Payment Method must be at least 2 characters' ),
}
