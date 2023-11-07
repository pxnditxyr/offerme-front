import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IRouteLoaderError } from '~/interfaces'
import { UsersService } from '~/services'
import { graphqlExceptionsHandler, isUUID, parseDate } from '~/utils'


export const useGetUserById = routeLoader$<any | IRouteLoaderError>( async ({ params, redirect, fail, cookie }) => {
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

  const user = useGetUserById().value

  if ( ( user as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

  return (
    <div>
      <h1> Full Name: { `${ user.peopleInfo.name } ${ user.peopleInfo.paternalSurname } ${ user.peopleInfo.maternalSurname }` } </h1>
      <h1> Email: { user.email } </h1>
      <h1> Is Verified Email: { `${ user.isVerifiedEmail ? 'Yes' : 'No' }` } </h1>
      <h1> Status: { `${ user.status ? 'Active' : 'Inactive' }` } </h1>
      <h1> Created At: { parseDate( user.createdAt ) } </h1>
      <h1> Created By: { ( user.createdBy ) ? user.creator?.email : user.email } </h1>
      <h1> Updated At: { parseDate( user.updatedAt ) } </h1>
      <h1> Updated By: { ( user.updatedBy ) ? user.updater?.email : 'No updated' } </h1>
      <h1> Role: { user.role.name } </h1>
      <h1> Avatars: { ( ( user.avatars as [] ).length === 0 ) ? 'No avatars' : 'Avatars' } </h1>
      <h1> Actions: </h1>
    </div>
  )
} )
