import { $, component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$, useNavigate } from '@builder.io/qwik-city'

import { BackButton, MiniCard, Modal, UnexpectedErrorPage } from '~/components/shared'

import { isUUID, parseDate } from '~/utils'

import { ManagementProductsService, ManagementDiscountProductsService } from '~/services'
import { IGQLErrorResponse, IManagementProduct, IManagementDiscountProduct, IManagementCodePromotionDiscountProduct } from '~/interfaces'

import styles from './view.styles.css?inline'
import { useModalStatus } from '~/hooks'
import { ManagementCodePromotionDiscountProductsService } from '~/services'

interface IUseGetData {
  discountProduct: IManagementDiscountProduct | IGQLErrorResponse
  product: IManagementProduct | IGQLErrorResponse
  codes: IManagementCodePromotionDiscountProduct[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IUseGetData>( async ({ params, cookie, redirect }) => {
  console.log( 'entra')
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      discountProduct: { errors: 'Invalid ID' },
      product: { errors: 'Invalid ID' },
      codes: { errors: 'Invalid ID' }
    }
  }

  const discountProduct = await ManagementDiscountProductsService.findOne({ discountProductId: id, jwt: jwt.value })
  const codes = await ManagementCodePromotionDiscountProductsService.findAll({ jwt: jwt.value, status: true })

  if ( 'errors' in discountProduct ) {
    return {
      discountProduct,
      product: { errors: 'Discount Product not found' },
      codes: { errors: 'Discount Product not found' }
    }
  }

  if ( 'errors' in codes ) {
    return {
      discountProduct,
      product: { errors: 'Discount Product not found' },
      codes
    }
  }

  const codesInDiscountProduct = codes.filter( ( code ) => code.discountProduct.id === discountProduct.id )

  const product = await ManagementProductsService.product({ jwt: jwt.value, productId: discountProduct.productId })

  return {
    discountProduct,
    product,
    codes: codesInDiscountProduct
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { product, discountProduct, codes } = useGetData().value
  if ( 'errors' in product || 'errors' in discountProduct || 'errors' in codes ) return ( <UnexpectedErrorPage /> )

  const nav = useNavigate()

  const onCouponViewClick = $( ( id: string ) => {
    nav( `/seller/modules/promotions/code-promotion-discount-products/view/${ btoa( id ) }` )
  } )
  

  return (
    <div class="view__container">
      <BackButton href="/company/modules/promotion-requests" />
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

        <section>
          <h1 class="view__name">
            Coupons
          </h1>
          <div class="gallery">
            {
              codes.map( ( code ) => (
                <MiniCard
                  header={ [ 'Code', 'Is Used', 'Is Used At', 'Is Redeemed', 'Is Redeemed At', 'Status', 'Created At', 'Updated At' ] }
                  keys={ [ 'code', 'isUsed', 'usedAt', 'isRedeemed', 'redeemedAt', 'status', 'createdAt', 'updatedAt' ] }
                  body={ {
                    id: code.id,
                    code: code.code,
                    isUsed: code.isUsed ? 'Yes' : 'No',
                    usedAt: code.usedAt,
                    isRedeemed: code.isRedeemed ? 'Yes' : 'No',
                    redeemedAt: code.redeemedAt,
                    status: code.status.name,
                    createdAt: code.createdAt,
                    updatedAt: code.updatedAt
                  } }
                  onViewClick={ onCouponViewClick }
                />
              ) )
            }
          </div>
        </section>
      </article>
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Discount Product'
}
