import { $, component$, useStyles$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { ProductCard, PromotionProductCard } from "~/components/shared";
import { PublicPromotionDiscountProductsService } from "~/services";
import { ManagementClicksPerPeriodService } from "~/services/clicks/management-clicks-per-period.service";

import styles from './offers.styles.css?inline'

export const useGetPromotions = routeLoader$( async () => {
  const { publicProducts, publicPromotions, publicDiscountProducts, publicCodePromotionDiscountProducts } = await PublicPromotionDiscountProductsService.findAll({})
  if ( 'errors' in publicProducts || 'errors' in publicPromotions || 'errors' in publicDiscountProducts || 'errors' in publicCodePromotionDiscountProducts ) {
    return {
      discountProducts: [],
      products: [],
    }
  }

  const validPromotions = publicPromotions.filter( ( promotion ) => {
    const promotionStartAt = new Date( promotion.promotionStartAt )
    const promotionEndAt = new Date( promotion.promotionEndAt )
    const now = new Date()
    return now >= promotionStartAt && now <= promotionEndAt
  } )

  const validDiscountProducts = publicDiscountProducts.filter( ( discountProduct ) => 
    ( validPromotions.find( ( promotion ) => promotion.promotionRequestId === discountProduct.promotionRequestId ) )
    &&
    ( publicCodePromotionDiscountProducts.find( ( codePromotionDiscountProduct ) => codePromotionDiscountProduct.discountProductId === discountProduct.id ) )
  )

  const validProducts = publicProducts.filter( ( product ) =>
    ( validDiscountProducts.find( ( discountProduct ) => discountProduct.productId === product.id ) )
  ) 
  
  return {
    discountProducts: validDiscountProducts,
    products: validProducts
  }
} )

export default component$( () => {

  useStyles$( styles )

  const { products, discountProducts } = useGetPromotions().value

  const nav = useNavigate()

  const onGetCouponClick = $( async ( id : string ) => {
    const discountProduct = discountProducts.find( ( discountProduct ) => discountProduct.id === id )
    if ( !discountProduct ) return
    const product = products.find( ( product ) => product.id === discountProduct.productId )
    if ( !product ) return
    await ManagementClicksPerPeriodService.addClick( {
      addClickClickCounterPerPeriodId: product.companyId
    } )
    nav( `/discount-products/${ btoa( id ) }` )
  } )

  const onViewDetailsClick = $( async ( id : string ) => {
    const product = products.find( ( product ) => product.id === id )
    if ( !product ) return
    await ManagementClicksPerPeriodService.addClick( {
      addClickClickCounterPerPeriodId: product.companyId
    } )
    nav( `/products/${ btoa( id ) }` )
  } )

  return (
    <div class="promotions__container">
      <h1 class="promotions__title"> Offers </h1>
      {
        ( discountProducts.length === 0 )
          ? (
            <div>
              <h2> No promotions available </h2>
            </div>
          )
          : (
            <div class="gallery">
              {
                discountProducts.map( ( discountProduct ) => (
                    <PromotionProductCard
                      id={ discountProduct.id }
                      productId={ discountProduct.productId }
                      title={ discountProduct.title }
                      description={ discountProduct.description }
                      productDescription={ products.find( ( product ) => product.id === discountProduct.productId )?.description || '' }
                      productPrice={ products.find( ( product ) => product.id === discountProduct.productId )?.price || 0 }
                      price={ discountProduct.discountPrice }
                      image={ products.find( ( product ) => product.id === discountProduct.productId )?.images.find( ( image ) => image.status )?.url }
                      onViewDetailsClick={ onViewDetailsClick }
                      onGetCouponClick={ onGetCouponClick }
                      />
                  ) )
              }
            </div>
          )
      }
    </div>
  )
} )
