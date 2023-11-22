import { $, QwikSubmitEvent, component$, useComputed$, useSignal, useStyles$, useVisibleTask$ } from '@builder.io/qwik'
import { routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city'

import { LoadingPage, Modal, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { graphqlExceptionsHandler, parseDate } from '~/utils'

import { AuthService, ManagementCompanyUsersService, UsersManagementService } from '~/services'
import { IGQLErrorResponse, IManagementUsersData } from '~/interfaces'

import styles from './management-users.styles.css?inline'

interface IGetManagementUsers {
  users: IManagementUsersData[] | IGQLErrorResponse
  jwt: string
}

export const useGetMangementUsers = routeLoader$<IGetManagementUsers>( async ({ cookie, query, redirect }) => {
  const search = query.get( 'search' ) || ''
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const users = await UsersManagementService.newGetUsers( jwt.value, search )
  if ( 'errors' in users ) {
    return {
      users,
      jwt: ''
    }
  }
  const authResponse  = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) {
    return {
      users: authResponse,
      jwt: ''
    }
  }
  const company = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  if ( 'errors' in company ) {
    return {
      users: company,
      jwt: ''
    }
  }

  const companyUsers = users.filter( ( user ) => company.users.find( ( companyUser ) => companyUser.userId === user.id ) )
  return {
    users: companyUsers,
    jwt: jwt.value
  }
} )

export default component$( () => {
  useStyles$( styles )
  const location = useLocation()
  const { users, jwt } = useGetMangementUsers().value
  if ( 'errors' in users || !jwt ) return ( <UnexpectedErrorPage /> )

  const searchArgument = useComputed$<string>( () => {
    const urlSearchParams = new URLSearchParams( location.url.search )
    const searchArg = urlSearchParams.get( 'search' )
    if ( !searchArg ) return ''
    return searchArg
  } )

  const nav = useNavigate()
  const { authState, status } = useAuthStore()

  if ( status === 'loading' ) return ( <LoadingPage /> )

  const error = useSignal<string | null>( null )

  const { modalStatus, onCloseModal, onOpenModal } = useModalStatus()

  

  const onCreateClick  = $( () => nav( '/company/modules/users/create' ))
  const onViewClick    = $( ( id : string ) => nav( `/company/modules/users/view/${ btoa( id ) }` ) )
  const onEditClick    = $( ( id : string ) => nav( `/company/modules/users/update/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {

    if ( authState.user?.id === id ) {
      error.value = 'You can\'t change your own status'
      onOpenModal()
      return
    }

    const user = await UsersManagementService.toggleStatus({ toggleStatusManagementUserId: id, jwt })
    if ( 'errors' in user ) {
      error.value = graphqlExceptionsHandler( user.errors )
      onOpenModal()
      return
    }
    nav()
  } )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/company/modules/users?${ `search=${ target.search.value }` }` )
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
            <p> { error.value } </p>
          </Modal>
        )
      }
    </div>
  )
} )
