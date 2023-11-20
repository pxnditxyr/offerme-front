import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementPromotion } from '~/interfaces'
import { ManagementPromotionsService } from '~/services'

import styles from './module.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementPromotions = routeLoader$<IManagementPromotion[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  
  const promotions = await ManagementPromotionsService.promotions({ search, jwt: jwt.value })
  return promotions
} )

export default component$( () => {
  useStyles$( styles )

  const promotions = useGetManagementPromotions().value

  if ( 'errors' in promotions ) return ( <UnexpectedErrorPage /> )
  const searchValue = useGetSearch().value

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const errors = useSignal<string | null>( null )
  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const onEditClick = $( ( id : string ) => nav( `/management/modules/promotion-requests/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/management/modules/promotion-requests/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const promotion =  await ManagementPromotionsService.toggleStatusPromotion({ toggleStatusPromotionId: id, jwt: token || '' })
    if ( 'errors' in promotion ) {
      errors.value = promotion.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const headers = [ 'Id', 'Title', 'Code', 'Company', 'Promotion Started At', 'Promotion End At', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'title', 'code', 'company', 'promotionStartAt', 'promotionEndAt', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedPromotions = promotions.map( ( promotion ) => ({
    id: promotion.id,
    title: promotion.title,
    code: promotion.code,
    company: promotion.company.name,
    promotionStartAt: parseDate( promotion.promotionStartAt ),
    promotionEndAt: parseDate( promotion.promotionEndAt ),
    status: promotion.status,
    createdAt: parseDate( promotion.createdAt ),
    creator: promotion.creator?.email || '',
    updatedAt: parseDate( promotion.updatedAt ),
    updater: promotion.updater?.email || 'No Updated',
    newId: promotion.promotionRequestId
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/management/modules/promotions?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    onCloseModal()
  } )

  return (
    <div class="module__container">
      <h1 class="module__title"> Promotions </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedPromotions }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
        idToRedirect="newId"
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
  title: 'Promotions',
}
