import { z } from '@builder.io/qwik-city'

export const managementCreateProductValidationSchema = {
  code: z.string().min( 2, 'Code must be at least 2 characters' ),
  companyId: z.string().min( 2, 'Company must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  name: z.string().min( 2, 'Name must be at least 2 characters' ),
  notes: z.string().min( 2, 'Notes must be at least 2 characters' ),
  price: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Price must be at least 0' ) ),
  productTypeId: z.string().min( 2, 'Product Type must be at least 2 characters' ),
  stock: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Stock must be at least 0' ) )
}

export const managementCreateProductImageValidationSchema = {
  url: z.string().min( 2, 'URL must be at least 2 characters' ),
  alt: z.string().min( 2, 'Description must be at least 2 characters' ),
}
