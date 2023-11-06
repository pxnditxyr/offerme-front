import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IRouteLoaderError } from '~/interfaces'
import { UsersService } from '~/services'
import { graphqlExceptionsHandler } from '~/utils'

export const useGetUsers = routeLoader$<any[] | IRouteLoaderError>( async ({ fail, cookie }) => {
  try {
    const token = cookie.get( 'jwt' )
    if ( !token ) return fail( 401, { errors: [ 'Unauthorized' ] } )
    const genders = await UsersService.getUsers( token.value )
    return genders
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

export default component$( () => {

  const users = useGetUsers()
  if ( ( users.value as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

  return (
    <div>
      <h1> Users </h1>
      <pre>
        { JSON.stringify( users.value, null, 2 ) }
      </pre> 
    </div>
  )
} )
