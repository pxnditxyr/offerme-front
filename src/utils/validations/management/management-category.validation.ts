import { z } from '@builder.io/qwik-city'

export const managementCreateCategoryValidationSchema = {
  name: z.string().min( 2, 'Name must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  order: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Order must be a positive integer' ) ),
  parentId: z.string().nullable().optional(),
}

export const managementCreateCategoryImageValidationSchema = {
  url: z.string().min( 2, 'Name must be at least 2 characters' ),
  alt: z.string().min( 2, 'Description must be at least 2 characters' ),
}
