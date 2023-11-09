import { $, component$, useStyles$ } from '@builder.io/qwik'
import { Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IRouteLoaderError } from '~/interfaces'
import { UsersService } from '~/services'
import { graphqlExceptionsHandler, isUUID, parseDate } from '~/utils'

import styles from './view.styles.css?inline'

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
  useStyles$( styles )

  const user = useGetUserById().value
  const nav = useNavigate()

  if ( ( user as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

  const onEditClick = $( () => {
    const base64Id = btoa( user.id )
    nav( `/management/modules/users/${ base64Id }/edit` )
  } )

  const onDeleteClick = $( () => {
    console.log( 'delete' )
  } )

  return (
    <div class="view__container">
      <Link href="/management/modules/users">
        Back
      </Link>
      <article class="card">
        <section class="card__header">
          <div>
            <h3> Email: <span> { user.email } </span> </h3>
            <h3> Gender: <span> { user.peopleInfo.genderId } </span> </h3>
            <h3> Is Verified Email: <span> { `${ user.isVerifiedEmail ? 'Yes' : 'No' }` } </span> </h3>
          </div>
          <div>
            {
              ( ( user.avatars as [] ).length === 0 ) ? (
                <img src="https://via.placeholder.com/150" alt="avatar" />
              ) : (
                <img src={ user.avatars[0].url } alt="avatar" />
              )
            }
          </div>
        </section>
        <section class="card__body">
          <div>
            <h3> Status: <span> { `${ user.status ? 'Active' : 'Inactive' }` } </span> </h3>
            <h3> Created At: <span> { parseDate( user.createdAt ) } </span> </h3>
            <h3> Created By: <span> { ( user.createdBy ) ? user.creator?.email : user.email } </span> </h3>
            <h3> Updated At: <span> { parseDate( user.updatedAt ) } </span> </h3>
            <h3> Updated By: <span> { ( user.updatedBy ) ? user.updater?.email : 'No updated' } </span> </h3>
          </div>
          <div>
            <h3> Role: <span> { user.role.name } </span> </h3>
          </div>
        </section>
        <section class="card__footer">
          <div>
            <button
              onClick$={ onEditClick }
            > Edit </button>
            <button
              onClick$={ onDeleteClick }
            > Deactivate </button>
          </div>
        </section>
      </article>
    </div>
  )
} )
