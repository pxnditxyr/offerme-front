import { $, component$, useStyles$, useTask$, useVisibleTask$ } from '@builder.io/qwik'
import { routeLoader$, useNavigate } from '@builder.io/qwik-city'

import { LoadingPage, Modal, Table } from '~/components/shared'
import { useModalStatus, useUsersManagementStore } from '~/hooks'
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
  const { setUsers, isLoading, users, setIsLoading, onToggleUserStatus, error } = useUsersManagementStore()
  const { modalStatus, onCloseModal, onOpenModal } = useModalStatus()

  const token = getToken()

  useTask$( async () => {
    setIsLoading( true )
    await setUsers( token.value )
    setIsLoading( false )
  } )

  if ( isLoading ) return ( <LoadingPage /> )

  const onCreateClick  = $( () => nav( '/management/modules/users/create' ))
  const onViewClick    = $( ( id : string ) => nav( `/management/modules/users/view/${ btoa( id ) }` ) )
  const onEditClick    = $( ( id : string ) => nav( `/management/modules/users/edit/${ btoa( id ) }` ) )
  const onToggleStatus = $( ( id : string ) => onToggleUserStatus( id, token.value ) )

  useVisibleTask$( ({ track }) => {
    track( () => error )
    if ( error ) onOpenModal()
  } )

  const headers = [ 'Id', 'Email', 'Is Verified Email', 'Created At', 'Created By', 'Updated At', 'Updated By', 'Names', 'Role', 'Avatars' ]
  const keys = [ 'id', 'email', 'isVerifiedEmail', 'createdAt', 'creator', 'updatedAt', 'updater', 'peopleInfo', 'role', 'avatars' ]

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
        <button class="button is-primary" onClick$={ onCreateClick } > Create </button>
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
