import { z } from '@builder.io/qwik-city'

export const signupValidationSchema = {
  name: z.string().min( 1, 'Name is required' ),
  paternalSurname: z.string().min( 1, 'Paternal Surname is required' ),
  maternalSurname: z.string().min( 1, 'Maternal Surname is required' ),
  birthdate: z.string().min( 1, 'Birthdate is required' ),
  email: z.string().email( 'Invalid Email' ),
  password: z.string().min( 1, 'Password is required' ),
  confirmPassword: z.string().min( 1, 'Confirm Password is required' ),
  genderId: z.string().min( 1, 'Gender is required' )
}
