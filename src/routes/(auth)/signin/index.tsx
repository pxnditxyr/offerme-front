import { component$ } from '@builder.io/qwik'
import { Form, type DocumentHead, routeAction$, zod$, Link } from '@builder.io/qwik-city'
import { FormField } from '~/components/shared'

import { signinValidationSchema } from '~/utils'

export const useSignInUserAction = routeAction$( ( data, event ) => {
  const { email, password } = data
  const { cookie, redirect } = event

  if ( email === 'pxnditxyr@gmail.com' && password === '12345' ) {
    cookie.set( 'jwt', '12345', { secure: true, path: '/' } )
    redirect( 302, '/' )
  }
  return {
    success: false,
  }
}, zod$({ ...signinValidationSchema }) )


export default component$( () => {

  const action = useSignInUserAction()

  return (
    <div>
      <h1> Sign In </h1>
      <Form action={ action }>
        <FormField
          name="email"
          type="text"
          placeholder="Email"
          error={ action.value?.fieldErrors?.email?.join( ', ' ) }
        />
        <FormField
          name="password"
          type="password"
          placeholder="Password"
          error={ action.value?.fieldErrors?.password?.join( ', ' ) }
        />
        <button> Sign In </button>
      </Form>
      <Link href="/signup">
        Don't have an account? Sign Up
      </Link>
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Sign In'
}
