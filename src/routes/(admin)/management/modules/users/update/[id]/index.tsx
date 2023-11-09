import { component$ } from '@builder.io/qwik'
import { Form, routeLoader$ } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IRouteLoaderError } from '~/interfaces'
import { UsersService } from '~/services'
import { graphqlExceptionsHandler, isUUID } from '~/utils'

export const useCreateUser = routeLoader$<any | IRouteLoaderError>( async ( { cookie, redirect, params, fail } ) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) redirect( 301, '/management/modules/users' )
  try {
    const token = cookie.get( 'jwt' )
    if ( !token ) return fail( 401, { errors: [ 'Unauthorized' ] } )
    const user = await UsersService.getUserById( token.value, id )
    return user
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

export default component$( () => {
  const user = useCreateUser().value

  if ( ( user as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

  return (
    <div>
      { JSON.stringify( user )}
      <Form>
        {
          Object.keys( user ).map( ( key ) => {
            return (
              <div>
                <label for={ key }>{ key }</label>
                {
                  ( typeof user[ key ] === 'boolean' )
                  ? ( <input
                        type="checkbox"
                        id={ key }
                        name={ key }
                        checked={ user[ key ] }
                    /> )
                  : (
                    <input
                      type="text"
                      id={ key }
                      name={ key }
                      value={ user[ key ] }
                    />
                  )
                }
              </div>
            )
          } )
        }
      </Form>
    </div>
  )
} )
