import { component$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { graphqlExceptionsHandler, signupValidationSchema } from '~/utils'

import type { IAuthGender, IRouteLoaderError } from '~/interfaces'
import { userAuthorizationSchema } from '~/schemas'
import { AuthService } from '~/services'

export const useSignupUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  let response : any
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

  const genders = useGetGenders()
  const action = useSignupUserAction()

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false && action.value.error ) onOpenModal()
  } )

  useTask$( ({ track }) => {
    track( () => modalStatus.value )
    if ( !modalStatus.value && action.value ) action.value.error = null
  } )

  if ( ( genders.value as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

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
          <select name="genderId" id="genderId">
            {
              ( genders.value as IAuthGender[] ).map( ({ id, name }) => ( 
                <option key={ id } value={ id }>{ name }</option>
              ) )
            }
          </select>
  
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
