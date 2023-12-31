import { z } from '@builder.io/qwik-city'

export const managementCreatePromotionRequestValidationSchema = {
  code: z.string().min( 2, 'Code must be at least 2 characters' ),
  comment: z.string().min( 2, 'Comment must be at least 2 characters' ),
  companyId: z.string().min( 2, 'Company must be at least 2 characters' ),
  currencyId: z.string().min( 2, 'Currency must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  inversionAmount: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Inversion Amount must be at least 0' ) ),
  promotionEndAt: z.string().min( 2, 'Promotion End At must be at least 2 characters' ),
  promotionStartAt: z.string().min( 2, 'Promotion Start At must be at least 2 characters' ),
  promotionTypeId: z.string().min( 2, 'Promotion Type must be at least 2 characters' ),
  reason: z.string().min( 2, 'Reason must be at least 2 characters' ),
  title: z.string().min( 2, 'Title must be at least 2 characters' ),
}

export const managementCreatePromotionImageValidationSchema = {
  url: z.string().min( 2, 'URL must be at least 2 characters' ),
  alt: z.string().min( 2, 'Description must be at least 2 characters' ),
}
