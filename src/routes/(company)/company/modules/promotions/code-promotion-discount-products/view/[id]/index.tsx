import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'

import { isUUID } from '~/utils'

import { IGQLErrorResponse, IManagementCodePromotionDiscountProduct } from '~/interfaces'

import styles from './view.styles.css?inline'
import { useModalStatus } from '~/hooks'
import { ManagementCodePromotionDiscountProductsService } from '~/services'

interface IUseGetData {
  code: IManagementCodePromotionDiscountProduct | IGQLErrorResponse
}

export const useGetCodePromotionDiscountProductById = routeLoader$<IUseGetData>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) return { code: { errors: 'Promotion Payment not found' } }

  const code = await ManagementCodePromotionDiscountProductsService.findOne({ jwt: jwt.value, codePromotionDiscountProductId: id })
  if ( 'errors' in code ) return { code: { errors: 'Discount Product not found' } }

  return { code }
} )

export const toggleStatusManagementCodePromotionDiscountProductAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const promotionPayment = await ManagementCodePromotionDiscountProductsService.toggleStatus({ toggleStatusCodePromotionDiscountProductId: id, jwt: jwt.value })

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

  const { code } = useGetCodePromotionDiscountProductById().value
  if ( 'errors' in code ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementCodePromotionDiscountProductAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

  return (
    <div class="view__container">
      <BackButton href="/company/modules/promotion-requests" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            Code Promotion of Discount Product
          </h1>
          <h3 class="view__info-item"> Code: { code.code } </h3>
          <h3 class="view__info-item"> Is Used: { code.isUsed ? 'Yes' : 'No' } </h3>
          <h3 class="view__info-item"> Used At: { code.usedAt } </h3>
          <h3 class="view__info-item"> Is Redeemed: { code.isRedeemed ? 'Yes' : 'No' } </h3>
          <h3 class="view__info-item"> Redeemed At: { code.redeemedAt } </h3>
          <h3 class="view__info-item"> Status: { code.status.name } </h3>
          <h3 class="view__info-item"> Created At: { code.createdAt } </h3>
          <h3 class="view__info-item"> Created By: { code.creator?.email } </h3>
          <h3 class="view__info-item"> Updated At: { code.updatedAt } </h3>
          <h3 class="view__info-item"> Updated By: { code.updater?.email || 'No Updated' } </h3>
        </section>

        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( code.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
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
  title: 'View Code Promotion of Discount Product',
}
