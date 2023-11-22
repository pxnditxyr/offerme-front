
import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionRequest } from '~/interfaces'
import { AuthService, ManagementCompanyUsersService, ManagementPromotionRequestsService } from '~/services'

import styles from './update.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementPromotionRequests = routeLoader$<IManagementPromotionRequest[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  
  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) throw redirect( 302, '/signin' )
  const currentCompany = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  if ( 'errors' in currentCompany ) return currentCompany
  const promotionRequests = await ManagementPromotionRequestsService.promotionRequests({ search, jwt: jwt.value })
  if ( 'errors' in promotionRequests ) return promotionRequests
  const companyPromotionRequests = promotionRequests.filter( ( promotionRequests) => promotionRequests.company.id === currentCompany.id )
  return companyPromotionRequests
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

  const onEditClick = $( ( id : string ) => nav( `/company/modules/promotion-requests/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/company/modules/promotion-requests/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const promotionRequest =  await ManagementPromotionRequestsService.toggleStatusPromotionRequest({ toggleStatusPromotionRequestId: id, jwt: token || '' })
    if ( 'errors' in promotionRequest ) {
      errors.value = promotionRequest.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const headers = [ 'Id', 'Title', 'Code', 'Started At', 'End At', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'title', 'code', 'promotionStartAt', 'promotionEndAt', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedPromotionRequests = promotionRequests.map( ( promotionRequest ) => ({
    id: promotionRequest.id,
    title: promotionRequest.title,
    code: promotionRequest.code,
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
    nav( `/company/modules/promotion-requests?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    onCloseModal()
  } )

  return (
    <div class="update__container">
      <h1 class="update__title"> Select Promotion Requests </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedPromotionRequests }
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
  title: 'Update Promotion Requests',
}

