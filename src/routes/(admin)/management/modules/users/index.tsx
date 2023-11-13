import { $, QwikSubmitEvent, component$, useComputed$, useStyles$, useTask$, useVisibleTask$ } from '@builder.io/qwik'
import { routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city'

import { LoadingPage, Modal, Table, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus, useUsersManagementStore } from '~/hooks'
import { graphqlExceptionsHandler, parseDate } from '~/utils'

import { UsersManagementService } from '~/services'
import { IManagementUsersData, IRouteLoaderError } from '~/interfaces'

import styles from './management-users.styles.css?inline'

interface IGetManagementUsers {
  managementUsers: IManagementUsersData[]
  jwt: string
}

export const useGetMangementUsers = routeLoader$<IGetManagementUsers | IRouteLoaderError>( async ({ cookie, query, fail }) => {
  const search = query.get( 'search' ) || ''
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )
  try {
    const users = await UsersManagementService.getUsers( jwt.value, search )
    return {
      managementUsers: users,
      jwt: jwt.value
    }
  } catch ( error : any ) {
    return fail( 400, {
      errors: graphqlExceptionsHandler( error )
    } )
  }
} )

export default component$( () => {
  useStyles$( styles )
  const location = useLocation()

  const searchArgument = useComputed$<string>( () => {
    const urlSearchParams = new URLSearchParams( location.url.search )
    const searchArg = urlSearchParams.get( 'search' )
    if ( !searchArg ) return ''
    return searchArg
  } )

  const nav = useNavigate()
  const getManagementUsers = useGetMangementUsers().value

  if ( 'errors' in getManagementUsers ) return ( <UnexpectedErrorPage /> )
  const { managementUsers, jwt } = getManagementUsers

  const { setUsers, isLoading, users, onToggleUserStatus, error } = useUsersManagementStore()
  const { modalStatus, onCloseModal, onOpenModal } = useModalStatus()

  useTask$( async () => {
    await setUsers( managementUsers )
  } )

  if ( isLoading ) return ( <LoadingPage /> )

  const onCreateClick  = $( () => nav( '/management/modules/users/create' ))
  const onViewClick    = $( ( id : string ) => nav( `/management/modules/users/view/${ btoa( id ) }` ) )
  const onEditClick    = $( ( id : string ) => nav( `/management/modules/users/update/${ btoa( id ) }` ) )
  const onToggleStatus = $( ( id : string ) => onToggleUserStatus( id, jwt ) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/management/modules/users?${ `search=${ target.search.value }` }` )
  } )

  useVisibleTask$( ({ track }) => {
    track( () => error )
    if ( error ) onOpenModal()
  } )

  const headers = [ 'Id', 'names', 'Email', 'Is Verified Email','status', 'Created At', 'Created By', 'Updated At', 'Updated By', 'Role' ]
  const keys = [ 'id', 'peopleInfo', 'email', 'isVerifiedEmail', 'status', 'createdAt', 'creator', 'updatedAt', 'updater', 'role' ]

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
      <h1 class="modules__title"> Users </h1>
      <form class="search__container" onSubmit$={ onSearchSubmit }>
        <input type="text" name="search" placeholder="Search" value={ searchArgument.value } id="search" />
        <button> Search </button>
      </form>
      <button class="create__button" onClick$={ onCreateClick } > Create </button>
      <div class="table__container">
        <Table
          header={ headers }
          keys={ keys }
          body={ formatedUsers }
          onViewClick={ onViewClick }
          onEditClick={ onEditClick }
          onToggleStatus={ onToggleStatus }
        />
      </div>
      {
        error && (
          <Modal title="Error" onClose={ onCloseModal } isOpen={ modalStatus.value }>
            <pre> { JSON.stringify( error ) } </pre>
          </Modal>
        )
      }
    </div>
  )
} )
