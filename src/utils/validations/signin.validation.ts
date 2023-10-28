import { z } from '@builder.io/qwik-city'

export const signinValidationSchema = {
  email: z.string().email( 'Invalid Email' ),
  password: z.string().min( 1, 'Password is required' ),
}
