import { z } from '@builder.io/qwik-city'

export const managementCreateCompanyValidationSchema = {
  name: z.string().min( 2, 'Name must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  companyTypeId: z.string().min( 2, 'Company Type must be at least 2 characters' ),
  documentNumber: z.string().optional(),
  documentTypeId: z.string().optional(),
  foundedAt: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
}
