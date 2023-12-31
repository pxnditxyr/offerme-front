import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { Form, type DocumentHead, routeAction$, zod$, Link } from '@builder.io/qwik-city'
import { userAuthorizationSchema } from '~/schemas'
import { FormField, Modal } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { signinValidationSchema } from '~/utils'
import { AuthService } from '~/services'

import styles from './signin.styles.css?inline'

export const useSignInUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  let response : any
  try {
    response = await AuthService.signin( data )
  } catch ( error : any ) {
    console.error( error )
    return {
      success: false,
      error: ( ( error.message as string ).includes( 'fetch' ) ) ? 'Could not connect to server' : error.message,
    }
  }

  if ( response.token ) {
    cookie.set( 'jwt', response.token, { secure: true, path: '/' } )
    throw redirect( 302, userAuthorizationSchema[ response.user.role.name ].entrypoint )
  }

  if ( response.error ) {
    return {
      success: false,
      error: response.message,
    }
  }
}, zod$({ ...signinValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

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
    <div class="signin__container">
      <div class="signin__content">
        <section>
          <img src="/offer-me-icon.svg" alt="Offer Me Logo" />
        </section>
        <section>
          <h1 class="signin__title"> Sign In </h1>
          <Form action={ action } class="form signin__form">
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
          <Link href="/signup" class="signin__link">
            Don't have an account? Sign Up
          </Link>
        </section>
      </div>
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
