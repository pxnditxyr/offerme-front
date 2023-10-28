import { $, component$, useSignal, useTask$ } from '@builder.io/qwik'
import { Form, type DocumentHead, routeAction$, zod$, Link } from '@builder.io/qwik-city'
import { FormField, Modal } from '~/components/shared'

import { signinValidationSchema } from '~/utils'

export const useSignInUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  try {
    const response = await fetch( 'http://localhost:3001/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( data ),
    } )
    const json = await response.json()
    if ( json.token ) {
      cookie.set( 'jwt', json.token, { secure: true, path: '/' } )
      redirect( 302, '/' )
      return {
        success: true,
      }
    }
    return {
      success: false,
      error: json.message,
    }
  } catch ( error : any ) {
    console.error({ error })
    return {
      success: false,
      error: ( ( error.message as string ).includes( 'fetch' ) ) ? 'Could not connect to server' : error.message,
    }
  }
}, zod$({ ...signinValidationSchema }) )


export default component$( () => {

  const action = useSignInUserAction()

  const modalStatus = useSignal( false )

  const handleClose = $( () => {
    modalStatus.value = false
  } )

  useTask$( ({ track }) => {
    track( () => action.value?.success )

    if ( !action.value?.success )
      modalStatus.value = true
  } )

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
      {
        ( !action.value?.success && action.value?.error ) && (
          <Modal isOpen={ modalStatus.value } handleClose={ handleClose }>
            <span> { action.value?.error } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Sign In'
}
