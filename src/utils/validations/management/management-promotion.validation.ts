import { z } from '@builder.io/qwik-city'

export const managementCreatePromotionValidationSchema = {
  title: z.string().min( 2, 'Title must be at least 2 characters' ),
  reason: z.string().min( 2, 'Reason must be at least 2 characters' ),
  promotionStartAt: z.string().min( 2, 'Promotion Start At must be at least 2 characters' ),
  promotionPaymentId: z.string().min( 2, 'Promotion Payment must be at least 2 characters' ),
  promotionEndAt: z.string().min( 2, 'Promotion End At must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  comment: z.string().min( 2, 'Comment must be at least 2 characters' ),
  code: z.string().min( 2, 'Code must be at least 2 characters' ),
}
