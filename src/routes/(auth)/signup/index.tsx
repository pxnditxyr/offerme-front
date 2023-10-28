import { component$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, zod$ } from '@builder.io/qwik-city'
import { FormField } from '~/components/shared'

import { signupValidationSchema } from '~/utils'


export const useSignupUserAction = routeAction$( ( data, event ) => {
  const {
    name, paternalSurname, maternalSurname,
    birthdate, email, password, confirmPassword, gender
  } = data

  const { cookie, redirect } = event

  if ( email === 'pxnditxyr@gmail.com' && password === '12345' ) {
    cookie.set( 'jwt', '12345', { secure: true, path: '/' } )
    redirect( 302, '/' )
  }
  return {
    success: false,
  }
}, zod$({ ...signupValidationSchema }) )

export default component$( () => {

  const action = useSignupUserAction()

  return (
    <div>
      <h1> Sign Up </h1>

      <div>
        <Form action={ action } >
          <FormField
            name="name"
            type="text"
            placeholder="Names"
            error={ action.value?.fieldErrors?.name?.join( ', ' ) }
          />
          <FormField
            name="paternalSurname"
            type="text"
            placeholder="Paternal Surname"
            error={ action.value?.fieldErrors?.paternalSurname?.join( ', ' ) }
          />
          <FormField
            name="maternalSurname"
            type="text"
            placeholder="Maternal Surname"
            error={ action.value?.fieldErrors?.maternalSurname?.join( ', ' ) }
          />
          <FormField
            name="birthdate"
            type="date"
            value="2000-01-01"
            error={ action.value?.fieldErrors?.birthdate?.join( ', ' ) }
          />
          <FormField
            name="email"
            type="email"
            placeholder="Email"
            error={ action.value?.fieldErrors?.email?.join( ', ' ) }
          />
          <FormField
            name="password"
            type="password"
            placeholder="Password"
            error={ action.value?.fieldErrors?.password?.join( ', ' ) }
          />
          <FormField
            name="confirmPassword"
            type="password"
            placeholder="Password"
            error={ action.value?.fieldErrors?.confirmPassword?.join( ', ' ) }
          />
          <FormField
            name="gender"
            type="text"
            placeholder="Gender"

          />
          <button> Sign Up </button>
        </Form>
      </div>
      <Link href="/signin">
        Already have an account? Sign In
      </Link>
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Sign Up'
}
