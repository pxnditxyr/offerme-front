import { $, component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { routeLoader$, useNavigate } from '@builder.io/qwik-city'

import { LoadingPage, Table } from '~/components/shared'
import { useUsersManagementStore } from '~/hooks'
import { parseDate } from '~/utils'

import styles from './table.style.css?inline'

export const getToken = routeLoader$<string>( async ({ cookie }) => {
  const token = cookie.get( 'jwt' )
  if ( !token ) return ''
  return token.value
} )

export default component$( () => {
  useStyles$( styles )
  const nav = useNavigate()
  const { setUsers, isLoading, users, setIsLoading } = useUsersManagementStore()
  const token = getToken()

  useTask$( async () => {
    setIsLoading( true )
    await setUsers( token.value )
    setIsLoading( false )
  } )

  if ( isLoading ) return ( <LoadingPage /> )

  const onCreateClick = $( () => {
    nav( '/management/modules/users/create' )
  } )

  const onViewClick = $( ( id : string ) => {
    const idBase64 = btoa( id )
    nav( `/management/modules/users/view/${ idBase64 }` )
  } )

  const onEditClick = $( ( id : string ) => {
    const idBase64 = btoa( id )
    nav( `/management/modules/users/edit/${ idBase64 }` )
  } )

  const onToggleStatus = $( ( id : string ) => {
    console.log( id )
  } )

  const headers = [ 'Id', 'Email', 'Is Verified Email', 'Status', 'Created At', 'Created By', 'Updated At', 'Updated By', 'Names', 'Role', 'Avatars' ]
  const keys = [ 'id', 'email', 'isVerifiedEmail', 'status', 'createdAt', 'creator', 'updatedAt', 'updater', 'peopleInfo', 'role', 'avatars' ]

  const formatedUsers = users.map( ( user ) => ({
      id: user.id,
      email: user.email,
      isVerifiedEmail: ( user.isVerifiedEmail ) ? 'Yes' : 'No',
      status: user.status,
      createdAt: parseDate( user.createdAt ),
      creator: user.creator?.email || user.email,
      updatedAt: parseDate( user.updatedAt ),
      updater: user.updater?.email || 'No Updated',
      peopleInfo: `${ user.peopleInfo.name } ${ user.peopleInfo.paternalSurname } ${ user.peopleInfo.maternalSurname }`,
      role: user.role.name,
      avatars: ( ( user.avatars as [] ).length === 0 ) ? 'No avatars' : 'Avatars'
  }) )

  return (
      <div class="modules__container">
        <h1> Users </h1>
        <button
          class="button is-primary"
          onClick$={ onCreateClick }
        > Create </button>
        <div class="table__container">
          {/* <table class="table"> */}
          {/*   <thead> */}
          {/*     <tr> */}
          {/*       <th>Id</th> */}
          {/*       <th>Email</th> */}
          {/*       <th>Is Verified Email</th> */}
          {/*       <th>Status</th> */}
          {/*       <th>Created At</th> */}
          {/*       <th>Created By</th> */}
          {/*       <th>Updated At</th> */}
          {/*       <th>Updated By</th> */}
          {/*       <th>Names</th> */}
          {/*       <th>Role</th> */}
          {/*       <th>Avatars</th> */}
          {/*       <th>Actions</th> */}
          {/*       <th>Deactivate</th> */}
          {/*     </tr> */}
          {/*   </thead> */}
          {/*   <tbody> */}
          {/*     { users.map( ( user, index ) => ( */}
          {/*       <tr key={ user.id }> */}
          {/*         <td>{ index }</td> */}
          {/*         <td>{ user.email }</td> */}
          {/*         <td>{ `${ user.isVerifiedEmail ? 'Yes' : 'No' }` }</td> */}
          {/*         <td><span class={ `${ ( user.status ) ? 'is-active__item' : 'is-inactivate__item' }` }> { `${ user.status ? 'Active' : 'Inactive' }` } </span></td> */}
          {/*         <td>{ `${ parseDate( user.createdAt ) }` }</td> */}
          {/*         <td>{ `${ user.creator?.email || user.email }` }</td> */}
          {/*         <td>{ `${ parseDate( user.updatedAt ) }` }</td> */}
          {/*         <td>{ `${ user.updater?.email || 'No Updated' }` }</td> */}
          {/*         <td>{ `${ user.peopleInfo.name } ${ user.peopleInfo.paternalSurname } ${ user.peopleInfo.maternalSurname }` }</td> */}
          {/*         <td>{ user.role.name }</td> */}
          {/*         <td>{ ( ( user.avatars as [] ).length === 0 ) ? 'No avatars' : 'Avatars' }</td> */}
          {/*         <td> */}
          {/*           <button */}
          {/*             class="button is-primary" */}
          {/*             onClick$={ () => onViewClick( user.id ) } */}
          {/*           > View </button> */}
          {/*           <button */}
          {/*             class="button is-primary" */}
          {/*             onClick$={ () => onEditClick( user.id ) } */}
          {/*           > Edit </button> */}
          {/*         </td> */}
          {/*         <td><button class="button is-danger"> Deactivate </button></td> */}
          {/*       </tr> */}
          {/*     ) ) } */}
          {/*   </tbody> */}
          {/* </table> */}
          <Table
            header={ headers }
            keys={ keys }
            body={ formatedUsers }
            onViewClick={ onViewClick }
            onEditClick={ onEditClick }
            onToggleStatus={ onToggleStatus }
          />
        </div>
      </div>
  )
} )
