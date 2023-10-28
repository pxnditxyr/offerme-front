import { component$, useTask$ } from '@builder.io/qwik'
import { Form, type DocumentHead, routeAction$, zod$, Link } from '@builder.io/qwik-city'
import { signinApi } from '~/api'
import { FormField, Modal } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { signinValidationSchema } from '~/utils'

export const useSignInUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  try {
    const json = await signinApi( data )
    if ( json.token ) {
      cookie.set( 'jwt', json.token, { secure: true, path: '/' } )
      redirect( 302, '/' )
      return { success: true }
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
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false && action.value.error ) onOpenModal()
  } )

  useTask$( ({ track }) => {
    track( () => modalStatus.value )
    if ( !modalStatus.value && action.value ) action.value.error = null
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
        <button
          disabled={ modalStatus.value }
        > Sign In </button>
      </Form>
      <Link href="/signup">
        Don't have an account? Sign Up
      </Link>
      {
        ( modalStatus ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            <span> { action.value?.error || 'Something went wrong' } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Sign In'
}
