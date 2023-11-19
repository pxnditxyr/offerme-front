import { $, component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$, useNavigate } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'

import { isUUID, parseDate } from '~/utils'

import { ManagementProductsService, ManagementDiscountProductsService } from '~/services'
import { IGQLErrorResponse, IManagementProduct, IManagementDiscountProduct } from '~/interfaces'

import styles from './view.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IUseGetData {
  discountProduct: IManagementDiscountProduct | IGQLErrorResponse
  product: IManagementProduct | IGQLErrorResponse
}

export const useGetData = routeLoader$<IUseGetData>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      discountProduct: { errors: 'Invalid ID' },
      product: { errors: 'Invalid ID' }
    }
  }

  const discountProduct = await ManagementDiscountProductsService.findOne({ discountProductId: id, jwt: jwt.value })

  if ( 'errors' in discountProduct ) return {
    discountProduct,
    product: { errors: 'Discount Product not found' }
  }

  const product = await ManagementProductsService.product({ jwt: jwt.value, productId: discountProduct.productId })
  return {
    discountProduct,
    product
  }
} )

export const toggleStatusManagementDiscountProductAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const promotionPayment = await ManagementDiscountProductsService.toggleStatus({ toggleStatusDiscountProductId: id, jwt: jwt.value })

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

  const { product, discountProduct } = useGetData().value
  if ( 'errors' in product || 'errors' in discountProduct ) return ( <UnexpectedErrorPage /> )

  const nav = useNavigate()
  const onEditClick = $( ( id: string ) => {
    nav( `/management/modules/promotion-requests/discount-products/update/${ btoa( id ) }` )
  } )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementDiscountProductAction()

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
            { discountProduct.title }
          </h1>
          <h3 class="view__info-item"> Description: { discountProduct.description } </h3>
          <h3 class="view__info-item"> Discount Percentage: { discountProduct.discountPercentage } </h3>
          <h3 class="view__info-item"> Discount Amount: { discountProduct.discountAmount } </h3>
          <p class="view__image-item">
            <img src={
              ( product.images.length > 0 && product.images.find( ( image ) => image.status )?.url )
                ||
              ( '/images/fallback-image.png' ) } alt="avatar" />
          </p>
          <h3 class="view__info-item"> Product: { product.name } </h3>
          <h3 class="view__info-item"> Product Description: { product.description } </h3>
          <h3 class="view__info-item"> Product Stock: { product.stock } </h3>
          <h3 class="view__info-item"> Previous Price: { product.price } </h3>
          <h3 class="view__info-item"> New Price: { discountProduct.discountPrice } </h3>
          <h3 class="view__info-item"> Product Code: { product.code } </h3>
          <h3 class="view__info-item"> Created At: { parseDate( discountProduct.createdAt ) } </h3>
          <h3 class="view__info-item"> Created By: { discountProduct.creator?.email } </h3>
          <h3 class="view__info-item"> Updated At: { parseDate( discountProduct.updatedAt ) } </h3>
          <h3 class="view__info-item"> Updated By: { discountProduct.updater?.email || 'No Updated' } </h3>
        </section>

        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( discountProduct.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
          </Form>
          <button class="edit__button" onClick$={ () => onEditClick( discountProduct.id ) }> Edit </button>
        </section>
      </article>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success === false ) && (
                <span> { action.value.errors || 'Unexpected Error' } </span>
              )
            }
          </Modal>
        )
      }
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Discount Product',
}
