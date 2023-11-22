import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, Modal, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementProduct, IManagementPromotion, IManagementPromotionRequest } from '~/interfaces'
import { ManagementProductsService, ManagementPromotionRequestsService, ManagementPromotionsService } from '~/services'
import { isUUID } from '~/utils'

import { useAuthStore } from '~/hooks'
import { MiniCard } from '~/components/shared'

import styles from './view.styles.css?inline'

interface IGetDataResponse {
  promotion: IManagementPromotion | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
  promotionRequest: IManagementPromotionRequest | IGQLErrorResponse
}

export const useGetPromotionById = routeLoader$<IGetDataResponse>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )

  if ( !isUUID( id ) ) {
    return {
      promotion: { errors: 'Invalid Promotion ID' },
      products: { errors: 'Invalid Promotion ID' },
      promotionRequest: { errors: 'Invalid Promotion ID' },
    }
  }

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const promotion = await ManagementPromotionsService.promotion({ promotionId: id, jwt: jwt.value })
  let products = await ManagementProductsService.products({ jwt: jwt.value, status: true })
  if ( 'errors' in products || 'errors' in promotion ) {
    return {
      promotion,
      products,
      promotionRequest: { errors: 'Invalid Promotion ID' },
    }
  }

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: promotion.promotionRequestId })

  if ( 'errors' in promotionRequest ) return {
    promotion,
    products,
    promotionRequest: { errors: 'Invalid Promotion ID' }
  }
  
  const companyProducts  = products.filter( ( product ) => 
    ( product.company.id === promotionRequest.company.id )
  )

  const productsIsInTargetProducts = companyProducts.filter( ( product ) =>
    ( promotionRequest.targetProducts.find( ( targetProduct ) => targetProduct.productId === product.id ) )
  )

  return {
    promotion,
    products: productsIsInTargetProducts,
    promotionRequest,
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { promotion, products, promotionRequest } = useGetPromotionById().value
  if ( 'errors' in promotion || 'errors' in products || 'errors' in promotionRequest ) return ( <UnexpectedErrorPage /> )

  const { status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()

  const onImageClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/promotion-images/view/${ btoa( id ) }` )
  } )

  const onPaymentClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/promotion-payments/view/${ btoa( id ) }` )
  } )

  const onDiscountProductClick = $( ( id : string ) => {
    console.log( 'entra', id )
    nav( `/company/modules/promotions/discount-products/view/${ btoa( id ) }` )
  } )

  return (
    <div class="view__container">
      <BackButton href="/company/modules/promotion-requests" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { promotion.title }
          </h1>
          <p class="view__image-item">
            <img src={ ( promotionRequest.images.find( ( image ) => image.status ) )
                ? ( promotionRequest.images.find( ( image ) => image.status )?.url )
                : '/images/fallback-image.png'
            } alt={ promotion.title } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { promotion.description } </p>
          <p class="view__info-item"> Promotion Type: { promotion.promotionType.name } </p>
          <p class="view__info-item"> Company: { promotion.company.name } </p>
          <p class="view__info-item"> Requested By: { promotionRequest.requestingUser.email } </p>
          <p class="view__info-item"> Code: { promotion.code } </p>
          <p class="view__info-item"> Reason: { promotion.reason } </p>
          <p class="view__info-item"> Inversion Amount: { promotionRequest.inversionAmount } { promotionRequest.currency.name } </p>
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
                            header={ [ 'Title', 'Description', 'Name', 'Price', 'New Price', 'Stock', 'Status',  ] }
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
        </section>
      </div>
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'View Promotion',
}
