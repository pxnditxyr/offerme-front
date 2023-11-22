import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, Modal, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementProduct, IManagementPromotionRequest, IManagementPromotionStatus } from '~/interfaces'
import { ManagementProductsService, ManagementPromotionRequestsService, ManagementPromotionStatusService } from '~/services'
import { isUUID } from '~/utils'

import { useAuthStore, useModalStatus } from '~/hooks'
import { MiniCard } from '~/components/shared'

import styles from './view.styles.css?inline'

interface IGetDataResponse {
  promotionRequest: IManagementPromotionRequest | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
  promotionStatus: IManagementPromotionStatus | IGQLErrorResponse
}

export const useGetPromotionRequestById = routeLoader$<IGetDataResponse>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      promotionRequest: { errors: 'Invalid PromotionRequest ID' },
      products: { errors: 'Invalid PromotionRequest ID' },
      promotionStatus: { errors: 'Invalid PromotionRequest ID' }
    }
  }

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ promotionRequestId: id, jwt: jwt.value })
  const products = await ManagementProductsService.products({ jwt: jwt.value, status: true })


  if ( 'errors' in products || 'errors' in promotionRequest ) return { promotionRequest, products, promotionStatus: { errors: 'Invalid Promotion Request ID' } }

  const promotionStatus = await ManagementPromotionStatusService.findOne({ promotionStatesId: promotionRequest.promotionStatus[ 0 ].id, jwt: jwt.value })
  if ( 'errors' in promotionStatus ) return { promotionRequest, products, promotionStatus }

  const companyProducts  = products.filter( ( product ) => 
    ( product.company.id === promotionRequest.company.id )
  )

  return {
    promotionRequest,
    products: companyProducts,
    promotionStatus
  }
} )

const useGetToken = routeLoader$( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  return jwt.value
} )

export default component$( () => {
  useStyles$( styles )

  const { promotionRequest, products, promotionStatus } = useGetPromotionRequestById().value
  if ( 'errors' in promotionRequest || 'errors' in products || 'errors' in promotionStatus ) return ( <UnexpectedErrorPage /> )
  const myToken = useGetToken().value


  const { status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const errors = useSignal<string | null>( null )

  const onImageClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/promotion-images/view/${ btoa( id ) }` )
  } )

  const onEditClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/update/${ btoa( id ) }` )
  } )

  const onPaymentClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/promotion-payments/view/${ btoa( id ) }` )
  } )

  const onTargetProductClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/promotion-target-products/view/${ btoa( id ) }` )
  } )

  const onDiscountProductClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/discount-products/view/${ btoa( id ) }` )
  } )

  const onToggleStatus = $( async ( id : string ) => {
    const promotionRequest =  await ManagementPromotionRequestsService.toggleStatusPromotionRequest({ toggleStatusPromotionRequestId: id, jwt: myToken || '' })
    if ( 'errors' in promotionRequest ) {
      errors.value = promotionRequest.errors
      onOpenModal()
      return
    }
    nav()
  } )

  return (
    <div class="view__container">
      <BackButton href="/company/modules/promotion-requests" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { promotionRequest.title }
          </h1>
          <p class="view__image-item">
            <img src={ ( promotionRequest.images.find( ( image ) => image.status ) )
                ? ( promotionRequest.images.find( ( image ) => image.status )?.url )
                : '/images/fallback-image.png'
            } alt={ promotionRequest.title } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { promotionRequest.description } </p>
          <p class="view__info-item"> Promotion Type: { promotionRequest.promotionType.name } </p>
          <p class="view__info-item"> Company: { promotionRequest.company.name } </p>
          <p class="view__info-item"> Requested By: { promotionRequest.requestingUser.email } </p>
          <p class="view__info-item"> Code: { promotionRequest.code } </p>
          <p class="view__info-item"> Reason: { promotionRequest.reason } </p>
          <p class="view__info-item"> Inversion Amount: { promotionRequest.inversionAmount } { promotionRequest.currency.name } </p>
          <p class="view__info-item"> Start Date: { promotionRequest.promotionStartAt } </p>
          <p class="view__info-item"> End Date: { promotionRequest.promotionEndAt } </p>
          <p class="view__info-item"> 
            Status: { promotionRequest.status ? 'Active' : 'Inactive' }
          </p>
          <p class="view__info-item"> Created At: { promotionRequest.createdAt } </p>
          <p class="view__info-item">
            Created By: { promotionRequest.creator?.email || 'No Creator' }
          </p>
          <p class="view__info-item"> Updated At: { promotionRequest.updatedAt } </p>
          <p class="view__info-item">
            Updated By: { promotionRequest.updater?.email || 'No Updated' }
          </p>
        </section>

        <section class="view__container__card__actions">
          <button class="edit__button" onClick$={ () => onEditClick( promotionRequest.id ) }> Edit </button>
          <button class={ `toggle-radius ${ promotionRequest.status ? 'is-activate' : 'is-deactivate' }` } onClick$={ () => onToggleStatus( promotionRequest.id ) }></button>
        </section>

        <section class="view__container__card__info">
          <h2> Promotion Status </h2>
          {
            ( promotionStatus.adminApprovedStatus ) && (
              <>
                <p class="view__info-item"> Comment: { promotionStatus.adminComment } </p>
                <p class="view__info-item"> Reason: { promotionStatus.adminReason } </p>
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
                <p class="view__info-item"> Rejected At: { promotionStatus.adminRejectedAt } </p>
                <p class="view__info-item"> Rejected Status: { promotionStatus.adminRejectedStatus ? 'Active' : 'Inactive' } </p>
              </>
            )
          }
          {
            ( !promotionStatus.adminApprovedStatus && !promotionStatus.adminRejectedStatus ) && (
              <p> Promotion Status is Pending, please wait for the admin to approve or reject the promotion request </p>
            )
          }
        </section>

        <section class="view__container__card__footer">
          <div class="view__images">
            <p> Images </p>
            <div class="view__gallery">
              { promotionRequest.images.map( ( image ) => (
                  <article key={ image.id } onClick$={ () => onImageClick( image.id ) } >
                    <section>
                      <img src={ image.url } alt={ image.alt } />
                    </section>
                  </article>
                ))
              }
              {
                promotionRequest.images.length === 0 && ( <p> No Images </p> )
              }
            </div>
          </div>
          <Link
            href={ `/company/modules/promotion-requests/promotion-images/create/${ btoa( promotionRequest.id ) }` }
            class="view__link"
          > Add Image </Link>
          
          <div class="view__images">
            <p> Payments </p>
            {
              ( promotionRequest.promotionPayments.length === 0 )
                ? ( <p> No Payments </p> )
                : (
                  <div class="cards__gallery">
                    {
                      promotionRequest.promotionPayments.map( ( promotionPayment ) => (
                        <MiniCard
                          header={ [ 'Title', 'Amount', 'Status', 'Date' ] }
                          keys={ [ 'title', 'amount', 'status', 'date' ] }
                          body={ {
                            id: promotionPayment.id,
                            title: 'Payment',
                            amount: promotionPayment.amount,
                            status: promotionPayment.status ? 'Active' : 'Inactive',
                            date: promotionPayment.paymentDate
                          } }
                          existsImage
                          image={ promotionPayment.voucher }
                          onViewClick={ onPaymentClick }
                        />
                      ) )
                    }
                  </div>
                )
            }
          </div>
          <Link
            href={ `/company/modules/promotion-requests/promotion-payments/create/${ btoa( promotionRequest.id ) }` }
            class="view__link"
          > Add Payment </Link>

          <div class="view__images">
            <p> Target Products </p>
            {
              ( promotionRequest.targetProducts.length === 0 )
                ? ( <p> No Target Products </p> )
                : (
                  <div class="cards__gallery">
                    {
                      promotionRequest.targetProducts.map( ( targetProducts ) => {
                        const product = products.find( ( product ) => product.id === targetProducts.productId )
                        if ( !product ) return ( <></> )
                        return (
                          <MiniCard
                            header={ [ 'Name', 'Price', 'Stock', 'Status' ] }
                            keys={ [ 'name', 'price', 'stock', 'status' ] }
                            body={ {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              stock: product.stock,
                              status: targetProducts.status ? 'Active' : 'Inactive',
                            } }
                            image={ product.images.find( ( image ) => image.status )?.url }
                            onViewClick={ onTargetProductClick }
                            existsImage
                          />
                        )
                      } )
                    }
                  </div>
                )
            }
          </div>
          <Link
            href={ `/company/modules/promotion-requests/promotion-target-products/create/${ btoa( promotionRequest.id ) }` }
            class="view__link"
          > Add Target Products </Link>

          <div class="view__images">
            <p> Discount Products </p>
            {
              ( promotionRequest.discountProducts.length === 0 )
                ? ( <p> No Discount Products </p> )
                : (
                  <div class="cards__gallery">
                    {
                      promotionRequest.discountProducts.map( ( discountProduct ) => {
                        const product = products.find( ( product ) => product.id === discountProduct.productId )
                        if ( !product ) return ( <></> )
                        return (
                          <MiniCard
                            header={ [ 'Title', 'Description', 'Name', 'Price', 'New Price', 'Stock', 'Status' ] }
                            keys={ [ 'title', 'description', 'name', 'price', 'newPrice', 'stock', 'status' ] }
                            body={ {
                              id: discountProduct.id,
                              title: discountProduct.title,
                              description: discountProduct.description,
                              name: product.name,
                              price: product.price,
                              stock: product.stock,
                              newPrice: discountProduct.discountPrice,
                              status: discountProduct.status ? 'Active' : 'Inactive',
                            } }
                            image={ product.images.find( ( image ) => image.status )?.url }
                            onViewClick={ onDiscountProductClick }
                            existsImage
                          />
                        )
                      } )
                    }
                  </div>
                )
            }
          </div>
          <Link
            href={ `/company/modules/promotion-requests/discount-products/create/${ btoa( promotionRequest.id ) }` }
            class="view__link"
          > Add Discount Products </Link>

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
  title: 'View PromotionRequest',
}
