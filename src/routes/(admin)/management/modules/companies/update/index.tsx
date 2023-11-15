
import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { BackButton, LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementCompany } from '~/interfaces'
import { ManagementCompaniesService } from '~/services'


import styles from './update.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementCompanies = routeLoader$<IManagementCompany[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  
  const companies = await ManagementCompaniesService.companies({ search, jwt: jwt.value })
  return companies
} )

export default component$( () => {
  useStyles$( styles )

  const companies = useGetManagementCompanies().value
  if ( 'errors' in companies ) return ( <UnexpectedErrorPage /> )
  const searchValue = useGetSearch().value

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const errors = useSignal<string | null>( null )
  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const onEditClick = $( ( id : string ) => nav( `/management/modules/companies/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/management/modules/companies/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const company =  await ManagementCompaniesService.toggleStatusCompany({ toggleStatusCompanyId: id, jwt: token || '' })
    if ( 'errors' in company ) {
      errors.value = company.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const headers = [ 'Id', 'Name', 'Description', 'Website', 'Email', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'name', 'description', 'website', 'email', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedCompanies = companies.map( ( company ) => ({
    id: company.id,
    name: company.name,
    description: company.description,
    website: company.website || 'No Website',
    email: company.email || 'No Email',
    status: company.status,
    createdAt: parseDate( company.createdAt ),
    creator: company.creator?.email || '',
    updatedAt: parseDate( company.updatedAt ),
    updater: company.updater?.email || 'No Updated',
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/management/modules/companies?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    onCloseModal()
  } )

  return (
    <div class="update__container">
      <h1 class="update__title"> Select a Company to update </h1>
      <BackButton href="/management/modules/companies" />
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedCompanies }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
        tableType="update"
      />
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ newOnCloseModal }>
            <span> { `${ errors.value  }`} </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Update Companies',
}

