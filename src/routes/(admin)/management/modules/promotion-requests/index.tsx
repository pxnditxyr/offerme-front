import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionRequest } from '~/interfaces'
import { ManagementPromotionRequestsService } from '~/services'


import styles from './module.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementPromotionRequests = routeLoader$<IManagementPromotionRequest[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  
  const promotionRequests = await ManagementPromotionRequestsService.promotionRequests({ search, jwt: jwt.value })
  return promotionRequests
} )

export default component$( () => {
  useStyles$( styles )

  const promotionRequests = useGetManagementPromotionRequests().value

  if ( 'errors' in promotionRequests ) return ( <UnexpectedErrorPage /> )
  const searchValue = useGetSearch().value

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const errors = useSignal<string | null>( null )
  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const onEditClick = $( ( id : string ) => nav( `/management/modules/promotion-requests/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/management/modules/promotion-requests/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const promotionRequest =  await ManagementPromotionRequestsService.toggleStatusPromotionRequest({ toggleStatusPromotionRequestId: id, jwt: token || '' })
    if ( 'errors' in promotionRequest ) {
      errors.value = promotionRequest.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const headers = [ 'Id', 'Title', 'Code', 'Company', 'Started At', 'End At', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'title', 'code', 'company', 'promotionStartAt', 'promotionEndAt', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedPromotionRequests = promotionRequests.map( ( promotionRequest ) => ({
    id: promotionRequest.id,
    title: promotionRequest.title,
    code: promotionRequest.code,
    company: promotionRequest.company.name,
    promotionStartAt: parseDate( promotionRequest.promotionStartAt ),
    promotionEndAt: parseDate( promotionRequest.promotionEndAt ),
    status: promotionRequest.status,
    createdAt: parseDate( promotionRequest.createdAt ),
    creator: promotionRequest.creator?.email || '',
    updatedAt: parseDate( promotionRequest.updatedAt ),
    updater: promotionRequest.updater?.email || 'No Updated',
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/management/modules/promotion-requests?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    onCloseModal()
  } )

  return (
    <div class="module__container">
      <h1 class="module__title"> Promotion Requests </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedPromotionRequests }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
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
  title: 'Promotion Requests',
}
