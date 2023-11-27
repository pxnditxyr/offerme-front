import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './promotion-product-card.styles.css?inline'

interface IPromotionProductCardProps {
  id: string
  productId: string
  title: string
  productDescription: string
  description: string
  productPrice: number
  price: number
  image?: string
  onViewDetailsClick: ( id : string ) => void
  onGetCouponClick: ( id : string ) => void
}

export const PromotionProductCard = component$( ( { id, productId, title, description, productDescription, productPrice, price, image, onViewDetailsClick, onGetCouponClick } : IPromotionProductCardProps ) => {

  useStyles$( styles )

  return (
    <div class="card">
      <div class="banner"
        style={ { backgroundImage: `url(${ image || '/images/fallback-image.png' })` } }
      ></div>
      <h2 class="name">{ title }</h2>
      <div class="title">{ description }</div>
      <div class="actions">
        <div class="follow-info">
          <button>
            <p> Old price </p>
            <span> { price }</span>
            <small>Bs.</small>
          </button>
          <button>
            <p> New price </p>
            <span>{ productPrice }</span>
            <small>Bs.</small>
          </button>
        </div>
        <div class="follow-btn">
          <button
            onClick$={ () => onViewDetailsClick( productId ) }
          > Details </button>
          <button
            onClick$={ () => onGetCouponClick( id ) }
          > Coupon </button>
        </div>
      </div>
      <div class="desc">{ productDescription }</div>
    </div>
  )
} )
