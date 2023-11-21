import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, Modal, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementProduct, IManagementPromotion, IManagementPromotionStatus } from '~/interfaces'
import { ManagementProductsService, ManagementPromotionsService, ManagementPromotionStatusService } from '~/services'
import { isUUID } from '~/utils'

import { useAuthStore, useModalStatus } from '~/hooks'
import { MiniCard } from '~/components/shared'

import styles from './view.styles.css?inline'

interface IGetDataResponse {
  promotion: IManagementPromotion | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
  promotionStatus: IManagementPromotionStatus | IGQLErrorResponse
}

export const useGetPromotionById = routeLoader$<IGetDataResponse>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      promotion: { errors: 'Invalid Promotion ID' },
      products: { errors: 'Invalid Promotion ID' },
      promotionStatus: { errors: 'Invalid Promotion ID' }
    }
  }

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const promotion = await ManagementPromotionsService.promotion({ promotionId: id, jwt: jwt.value })
  let products = await ManagementProductsService.products({ jwt: jwt.value, status: true })


  if ( 'errors' in products || 'errors' in promotion ) return { promotion, products, promotionStatus: { errors: 'Invalid Promotion ID' } }

  const promotionStatus = await ManagementPromotionStatusService.findOne({ promotionStatesId: promotion.promotionStatus[ 0 ].id, jwt: jwt.value })
  if ( 'errors' in promotionStatus ) return { promotion, products, promotionStatus }


  products = products.filter( ( product ) => 
    ( product.company.id === promotion.company.id )
     &&
    ( !promotion.targetProducts.some( ( targetProduct ) => targetProduct.productId === product.id ) )
  )

  return {
    promotion,
    products,
    promotionStatus
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { promotion, products, promotionStatus } = useGetPromotionById().value
  if ( 'errors' in promotion || 'errors' in products || 'errors' in promotionStatus ) return ( <UnexpectedErrorPage /> )

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const errors = useSignal<string | null>( null )

  const onImageClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/promotion-images/view/${ btoa( id ) }` )
  } )

  const onEditClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/update/${ btoa( id ) }` )
  } )

  const onPaymentClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/promotion-payments/view/${ btoa( id ) }` )
  } )

  const onTargetProductClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/promotion-target-products/view/${ btoa( id ) }` )
  } )

  const onDiscountProductClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/discount-products/view/${ btoa( id ) }` )
  } )

  const onToggleStatus = $( async ( id : string ) => {
    const promotion =  await ManagementPromotionsService.toggleStatusPromotion({ toggleStatusPromotionId: id, jwt: token || '' })
    if ( 'errors' in promotion ) {
      errors.value = promotion.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const onApproveClick = $( async ( id : string ) => {
    if ( promotion.discountProducts.length === 0 ) {
      errors.value = 'You need to add at least one discount product'
      onOpenModal()
      return
    }
    if ( !promotion.status ) {
      errors.value = 'You need to activate the promotion request'
      onOpenModal()
      return
    }
    if ( ( promotion.targetProducts.some( ( targetProduct ) => targetProduct.status ) ) ) {
      errors.value = 'You need to activate all discount products'
      onOpenModal()
      return
    }
    nav( `/management/modules/promotion-requests/promotion-status/approve/${ btoa( id ) }` )
  } )

  const onRejectClick = $( async ( id : string ) => {
    nav( `/management/modules/promotion-requests/promotion-status/reject/${ btoa( id ) }` )
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/promotion-requests" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { promotion.title }
          </h1>
          <p class="view__image-item">
            <img src={ ( promotion.images.find( ( image ) => image.status ) )
                ? ( promotion.images.find( ( image ) => image.status )?.url )
                : '/images/fallback-image.png'
            } alt={ promotion.title } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { promotion.description } </p>
          <p class="view__info-item"> Promotion Type: { promotion.promotionType.name } </p>
          <p class="view__info-item"> Company: { promotion.company.name } </p>
          <p class="view__info-item"> Requested By: { promotion.requestingUser.email } </p>
          <p class="view__info-item"> Code: { promotion.code } </p>
          <p class="view__info-item"> Reason: { promotion.reason } </p>
          <p class="view__info-item"> Inversion Amount: { promotion.inversionAmount } { promotion.currency.name } </p>
          <p class="view__info-item"> Start Date: { promotion.promotionStartAt } </p>
          <p class="view__info-item"> End Date: { promotion.promotionEndAt } </p>
          <p class="view__info-item"> 
            Status: { promotion.status ? 'Active' : 'Inactive' }
          </p>
          <p class="view__info-item"> Created At: { promotion.createdAt } </p>
          <p class="view__info-item">
            Created By: { promotion.creator?.email || 'No Creator' }
          </p>
          <p class="view__info-item"> Updated At: { promotion.updatedAt } </p>
          <p class="view__info-item">
            Updated By: { promotion.updater?.email || 'No Updated' }
          </p>
        </section>

        <section class="view__container__card__info">
          <h2> Promotion Status </h2>
          {
            ( promotionStatus.adminApprovedStatus ) && (
              <>
                <p class="view__info-item"> Comment: { promotionStatus.adminComment } </p>
                <p class="view__info-item"> Reason: { promotionStatus.adminReason } </p>
                <p class="view__info-item"> Approved By: { promotionStatus.adminApproved?.email || 'No Approved' } </p>
                <p class="view__info-item"> Approved At: { promotionStatus.adminApprovedAt } </p>
                <p class="view__info-item"> Approved Status: { promotionStatus.adminApprovedStatus ? 'Active' : 'Inactive' } </p>
              </>
            )
          }
          {
            ( promotionStatus.adminRejectedStatus ) && (
              <>
                <p class="view__info-item"> Comment: { promotionStatus.adminComment } </p>
                <p class="view__info-item"> Reason: { promotionStatus.adminReason } </p>
                <p class="view__info-item"> Rejected By: { promotionStatus.adminRejected?.email || 'No Rejected' } </p>
                <p class="view__info-item"> Rejected At: { promotionStatus.adminRejectedAt } </p>
                <p class="view__info-item"> Rejected Status: { promotionStatus.adminRejectedStatus ? 'Active' : 'Inactive' } </p>
              </>
            )
          }
          {
            ( !promotionStatus.adminApprovedStatus && !promotionStatus.adminRejectedStatus ) && (
              <p> Promotion Status is Pending, please approve or reject </p>
            )
          }
        </section>

        <section class="view__container__card__actions">
          <button
            class="approve__button"
            onClick$={ () => onApproveClick( promotionStatus.id ) }
            disabled={ promotionStatus.adminApprovedStatus }
          > Approve </button>
          <button
            class="reject__button"
            onClick$={ () => onRejectClick( promotionStatus.id ) }
            disabled={ promotionStatus.adminRejectedStatus }
          > Reject </button>
        </section>

        <section class="view__container__card__actions">
          <button class="edit__button" onClick$={ () => onEditClick( promotion.id ) }> Edit </button>
          <button class={ `toggle-radius ${ promotion.status ? 'is-activate' : 'is-deactivate' }` } onClick$={ () => onToggleStatus( promotion.id ) }></button>
        </section>


        <section class="view__container__card__footer">
          <div class="view__images">
            <p> Images </p>
            <div class="view__gallery">
              { promotion.images.map( ( image ) => (
                  <article key={ image.id } onClick$={ () => onImageClick( image.id ) } >
                    <section>
                      <img src={ image.url } alt={ image.alt } />
                    </section>
                  </article>
                ))
              }
              {
                promotion.images.length === 0 && ( <p> No Images </p> )
              }
            </div>
          </div>
          <Link
            href={ `/management/modules/promotion-requests/promotion-images/create/${ btoa( promotion.id ) }` }
            class="view__link"
          > Add Image </Link>
          
          <div class="view__images">
            <p> Payment </p>
            <MiniCard
              header={ [ 'Title', 'Amount', 'Status', 'Date' ] }
              keys={ [ 'title', 'amount', 'status', 'date' ] }
              body={ {
                id: promotion.promotionPayment.id,
                title: 'Payment',
                amount: promotion.promotionPayment.amount,
                status: promotion.promotionPayment.status ? 'Active' : 'Inactive',
                date: promotion.promotionPayment.paymentDate
              } }
              existsImage
              image={ promotion.promotionPayment.voucher }
              onViewClick={ onPaymentClick }
            />
          </div>
          <Link
            href={ `/management/modules/promotion-requests/promotion-payments/create/${ btoa( promotion.id ) }` }
            class="view__link"
          > Add Payment </Link>
        </section>
      </div>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            <span> { errors.value } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'View Promotion',
}
