import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'

import { isUUID } from '~/utils'

import { ManagementProductsService, ManagementPromotionTargetProductsService } from '~/services'
import { IGQLErrorResponse, IManagementProduct, IManagementPromotionTargetProduct } from '~/interfaces'

import styles from './view.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IUseGetData {
  promotionRequest: IManagementPromotionTargetProduct | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
}

export const useGetPromotionTargetProductById = routeLoader$<IUseGetData>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) return { errors: 'Promotion Payment not found' }

  const promotionRequest = await ManagementPromotionTargetProductsService.findOne({ promotionTargetProductsId: id, jwt: jwt.value })
  let products = await ManagementProductsService.products({ jwt: jwt.value, status: true })
  if ( 'errors' in products || 'errors' in promotionRequest ) return { promotionRequest, products }
  
  products = products.filter( ( product ) => product.id === promotionRequest.productId )

} )

export const toggleStatusManagementPromotionTargetProductAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const promotionPayment = await ManagementPromotionTargetProductsService.toggleStatusPromotionTargetProduct({ toggleStatusPromotionTargetProductId: id, jwt: jwt.value })

  if ( 'errors' in promotionPayment ) {
    return {
      success: false,
      errors: promotionPayment.errors
    }
  }
  return {
    success: true,
    promotionPayment
  }
} )

export default component$( () => {
  useStyles$( styles )

  const promotionPayment = useGetPromotionTargetProductById().value
  if ( 'errors' in promotionPayment ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementPromotionTargetProductAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/promotion-requests" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            Payment
          </h1>
          <h3 class="view__info-item"> Amount: { promotionPayment.amount } </h3>
          <h3 class="view__info-item"> { ( !promotionPayment.voucher ) && 'No Voucher' } </h3>
          <p class="view__image-item">
            <img src={ promotionPayment.voucher || '/images/fallback-image.png' } alt="avatar" />
          </p>
          <h3 class="view__info-item"> Payment Date: { promotionPayment.paymentDate } </h3>
          <h3 class="view__info-item"> Created At: { promotionPayment.createdAt } </h3>
          <h3 class="view__info-item"> Created By: { promotionPayment.creator?.email } </h3>
          <h3 class="view__info-item"> Updated At: { promotionPayment.updatedAt } </h3>
          <h3 class="view__info-item"> Updated By: { promotionPayment.updater?.email || 'No Updated' } </h3>
        </section>

        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( promotionPayment.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
          </Form>
        </section>
      </article>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success === false ) && (
                <span> { action.value.errors } </span>
              )
            }
          </Modal>
        )
      }
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Promotion Payment',
}
