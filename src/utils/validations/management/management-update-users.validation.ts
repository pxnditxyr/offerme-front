import { z } from '@builder.io/qwik-city'

export const managementUpdateUsersValidationSchema = {
  name: z.string().min( 1, 'Name is required' ),
  paternalSurname: z.string().min( 1, 'Paternal Surname is required' ),
  maternalSurname: z.string().min( 1, 'Maternal Surname is required' ),
  email: z.string().email( 'Invalid email' ),
  documentTypeId: z.string().min( 1, 'Document Type is required, or select "Not Specified"' ),
  genderId: z.string().min( 1, 'Gender is required' ),
  birthdate: z.string().min( 1, 'Birthdate is required' ),
  roleId: z.string().min( 1, 'Role is required' ),
  documentNumber: z.string()
}
