import { $, component$, useStyles$ } from '@builder.io/qwik'
import { routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IAdminUsersData, IRouteLoaderError } from '~/interfaces'
import { UsersService } from '~/services'
import { graphqlExceptionsHandler, parseDate } from '~/utils'

import styles from './table.style.css?inline'

export const useGetUsers = routeLoader$<any[] | IRouteLoaderError>( async ({ fail, cookie }) => {
  try {
    const token = cookie.get( 'jwt' )
    if ( !token ) return fail( 401, { errors: [ 'Unauthorized' ] } )
    const users = await UsersService.getUsers( token.value )
    return users
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

export default component$( () => {
  useStyles$( styles )
  const nav = useNavigate()
  const users = useGetUsers()

  const onViewClick = $( ( id : string ) => {
    const base64Id = btoa( id )
    nav( `./view/${ base64Id }/` )
  } )

  const onCreateClick = $( () => {
    nav( './create/' )
  } )

  const onEditClick = $( ( id : string ) => {
    const base64Id = btoa( id )
    nav( `./update/${ base64Id }/` )
  } )

  if ( ( users.value as IRouteLoaderError ).failed ) return ( <UnexpectedErrorPage /> )

  return (
    <div class="modules__container">
      <h1> Users </h1>
      <button
        class="button is-primary"
        onClick$={ onCreateClick }
      > Create </button>
      <div class="table__container">
        <table class="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Email</th>
              <th>Is Verified Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Updated At</th>
              <th>Updated By</th>
              <th>Names</th>
              <th>Role</th>
              <th>Avatars</th>
              <th>Actions</th>
              <th>Deactivate</th>
            </tr>
          </thead>
          <tbody>
            { ( users.value as IAdminUsersData[] ).map( ( user, index ) => (
              <tr key={ user.id }>
                <td>{ index }</td>
                <td>{ user.email }</td>
                <td>{ `${ user.isVerifiedEmail ? 'Yes' : 'No' }` }</td>
                <td><span class={ `${ ( user.status ) ? 'is-active__item' : 'is-inactivate__item' }` }> { `${ user.status ? 'Active' : 'Inactive' }` } </span></td>
                <td>{ `${ parseDate( user.createdAt ) }` }</td>
                <td>{ ( user.createdBy ) ? user.creator?.email : user.email }</td>
                <td>{ `${ parseDate( user.updatedAt ) }` }</td>
                <td>{ ( user.updatedBy ) ? user.updater?.email : 'No updated' }</td>
                <td>{ `${ user.peopleInfo.name } ${ user.peopleInfo.paternalSurname } ${ user.peopleInfo.maternalSurname }` }</td>
                <td>{ user.role.name }</td>
                <td>{ ( ( user.avatars as [] ).length === 0 ) ? 'No avatars' : 'Avatars' }</td>
                <td>
                  <button
                    class="button is-primary"
                    onClick$={ () => onViewClick( user.id ) }
                  > View </button>
                  <button
                    class="button is-primary"
                    onClick$={ () => onEditClick( user.id ) }
                  > Edit </button>
                </td>
                <td><button class="button is-danger"> Deactivate </button></td>
              </tr>
            ) ) }
          </tbody>
        </table>
      </div>
    </div>
  )
} )
