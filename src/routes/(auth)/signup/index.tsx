import { component$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, zod$ } from '@builder.io/qwik-city'
import { signupApi } from '~/api'
import { FormField, Modal } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { signupValidationSchema } from '~/utils'


export const useSignupUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  try {
    // const json = await signupApi( data )
    // if ( json.token ) {
    //   cookie.set( 'jwt', json.token, { secure: true, path: '/' } )
    //   redirect( 302, '/' )
    //   return { success: true }
    // }
    return {
      success: false,
      error: 'Unimplemented',
    }
    
  } catch ( error : any ) {
    console.log({ error })
    return {
      success: false,
      error: ( error.message as string ).includes( 'fetch' ) ? 'Could not connect to server' : error.message,
    }
  }
}, zod$({ ...signupValidationSchema }) )

export default component$( () => {

  const action = useSignupUserAction()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    console.log({ action: action.value?.error })
    if ( action.value && action.value.success === false && action.value.error ) onOpenModal()
  } )

  useTask$( ({ track }) => {
    track( () => modalStatus.value )
    if ( !modalStatus.value && action.value ) action.value.error = null
  } )

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
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            <span> { action.value?.error || 'Something went wrong' } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Sign Up'
}
