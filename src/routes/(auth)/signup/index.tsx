import { component$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { signupApi } from '~/api'
import { FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { signupValidationSchema } from '~/utils'
import type { IAuthGender } from '~/interfaces'

export const useSignupUserAction = routeAction$( async ( data, event ) => {
  const { cookie, redirect } = event
  try {
    const json = await signupApi( data )
    if ( json.token ) {
      cookie.set( 'jwt', json.token, { secure: true, path: '/' } )
      redirect( 302, '/' )
      return { success: true }
    }
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

interface IError {
  failed: boolean
  errors: string
}
export const useGetGenders = routeLoader$<IAuthGender[] | IError>( async ({ fail }) => {
  try {
    const response = await fetch( 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify( {
        query: `
          query {
            genders {
              id
              name
            }
          }
        `
      } )
    } )
    const json = await response.json()
    if ( json.errors ) {
      // console.log({ errors: json.errors })
      return fail( 400, {
        errors: ( json.errors as any[] ).map( error => error.message ).join( ', ' )
      } )
    }
    console.log({ xd: json.data.genders })
    if ( json.data ) return json.data.genders
  } catch ( error : any ) {
    return fail( 400, {
      errors: error.message as string
    } )
  }
} )


export default component$( () => {

  const genders = useGetGenders()
  console.log( genders.value )
  
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

  if ( ( genders.value as IError ).failed ) {
    return ( 
      <UnexpectedErrorPage />
    )
  }

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
