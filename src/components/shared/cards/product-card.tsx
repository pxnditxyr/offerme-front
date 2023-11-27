import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './product-card.styles.css?inline'

interface IProductCardProps {
  id: string
  productId: string
  image?: string
  title: string
  description: string
  price: number
  onViewDetailsClick: ( id : string ) => void
  onGetCouponClick: ( id : string) => void
}


export const ProductCard = component$( ( { id, productId, title, price, description, onViewDetailsClick, onGetCouponClick, image = '' }: IProductCardProps ) => {

  useStyles$( styles )

  return (
    <div class="product__card">
      <section class="product__card__header">
        <div
          class="product__card__image"
          style={
            `background-image: url(${ ( image ) ? image : '/images/fallback-image.png' });`
          }
        ></div>
        <h1 class="product__card__title"> { title } </h1>
        <p class="product__card__subtitle"> { description } </p>
        <p class="product__card__price"> { price } Bs. </p>
      </section>
      <section class="product__card__buttons">
        <button
          class="btn product__card__button__details"
          onClick$={ () => onViewDetailsClick( productId ) }
        > Details </button>
        <button
          class="btn product__card__button__get"
          onClick$={ () => onGetCouponClick( id ) }
        > Get Coupon </button>
      </section>
    </div>
  )
} )
