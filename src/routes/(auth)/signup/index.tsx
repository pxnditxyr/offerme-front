import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { graphqlExceptionsHandler, signupValidationSchema } from '~/utils'

import type { IAuthGender, IRouteLoaderError } from '~/interfaces'
import { userAuthorizationSchema } from '~/schemas'
import { AuthService } from '~/services'

import styles from './signup.styles.css?inline'

export const useSignupUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  let response : any
  if ( data.confirmPassword !== data.password ) {
    return {
      success: false,
      error: 'Passwords do not match',
    }
  }
  try {
    response = await AuthService.signup( data )
  } catch ( error : any ) {
    return {
      success: false,
      error: ( error.message as string ).includes( 'fetch' ) ? 'Could not connect to server' : error.message,
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
}, zod$({ ...signupValidationSchema }) )

export const useGetGenders = routeLoader$<IAuthGender[] | IRouteLoaderError>( async ({ fail }) => {
  try {
    const genders = await AuthService.getGenders()
    return genders
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

export default component$( () => {
  useStyles$( styles )

  const genders = useGetGenders().value
  const action = useSignupUserAction()

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  if ( 'errors' in genders ) return ( <UnexpectedErrorPage /> )

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false && action.value.error ) onOpenModal()
  } )

  useTask$( ({ track }) => {
    track( () => modalStatus.value )
    if ( !modalStatus.value && action.value ) action.value.error = null
  } )


  return (
    <div class="signup__container">
      <div class="signup__content">
        <section>
          <img src="/offer-me-icon.svg" alt="Offer Me Logo" />
        </section>
        <section>
          <h1 class="signup__title"> Sign Up </h1>
          <Form action={ action } class="form signup__form">
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
              name="genderId"
              type="select"
              options={ genders }
            />
            <button> Sign Up </button>
          </Form>
          <Link href="/signin" class="signup__link">
            Already have an account? Sign In
          </Link>
        </section>
    </div>
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
