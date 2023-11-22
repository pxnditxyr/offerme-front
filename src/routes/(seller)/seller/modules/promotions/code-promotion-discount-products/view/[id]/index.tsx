import { $, component$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$, useNavigate } from '@builder.io/qwik-city'

import { BackButton, LoadingPage, Modal, UnexpectedErrorPage } from '~/components/shared'

import { isUUID } from '~/utils'

import { IGQLErrorResponse, IManagementCodePromotionDiscountProduct } from '~/interfaces'

import styles from './view.styles.css?inline'
import { ManagementCodePromotionDiscountProductsService } from '~/services'
import { useAuthStore, useModalStatus } from '~/hooks'

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

export const useRedeemAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  if ( !isUUID( id ) ) return fail( 400, { errors: 'Invalid ID' } )

  const redeem = await ManagementCodePromotionDiscountProductsService.redeemCoupon({ jwt: jwt.value, redeemDiscountCouponId: id })
  if ( 'errors' in redeem ) return fail( 400, redeem )

  return redeem
} )

export default component$( () => {
  useStyles$( styles )

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const { code } = useGetCodePromotionDiscountProductById().value
  if ( 'errors' in code ) return ( <UnexpectedErrorPage /> )

  const errors = useSignal<string | null>( null )
  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const onToggleStatus = $( async ( id : string ) => {
    const redeem = await ManagementCodePromotionDiscountProductsService.redeemCoupon({ jwt: token || '', redeemDiscountCouponId: id })
    if ( 'errors' in redeem ) {
      errors.value = redeem.errors
      onOpenModal()
      return
    }
    nav()
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
          {
            ( code.status && !code.isRedeemed && code.isUsed ) && (
              <section class="actions">
                <Form>
                  <button class="redeem" onClick$={ () => onToggleStatus( code.id ) }>
                    Redeem
                  </button>
                </Form>
              </section>
            )
          }
        </section>
      </article>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            <span> { `${ errors.value  }`} </span>
          </Modal>
        )
      }
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Code Promotion of Discount Product',
}
