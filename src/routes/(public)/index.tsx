import { $, component$, useStyles$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead, useNavigate } from '@builder.io/qwik-city'

import styles from './public.styles.css?inline'
import { ProductCard } from '~/components/shared'
import { PublicPromotionDiscountProductsService } from '~/services'
import { IPublicDiscountProducts, IPublicProducts } from '~/interfaces/public/code-promotion-discount-products.interface'
import { ManagementClicksPerPeriodService } from '~/services/clicks/management-clicks-per-period.service'

interface IUseGetDiscountProducts {
  discountProducts: IPublicDiscountProducts[]
  products: IPublicProducts[]
}

export const useGetDiscountProducts = routeLoader$<IUseGetDiscountProducts>( async () => {
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
    discountProducts: validDiscountProducts.slice( 0, 3 ),
    products: validProducts
  }
} )

export default component$( () => {

  useStyles$( styles )
  const { discountProducts, products } = useGetDiscountProducts().value
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
    <>
      <section class="section under">
        <div class="under-inner one">
          <div class="fixed">
            <h1 class="section__title"> Our Best Offers </h1>
            <div class="gallery gallery__product__card">
              {
                ( discountProducts.length === 0 )
                  ? (
                    <div>
                      <p> Our best offers are coming soon! </p>
                    </div>
                  ) : (
                    discountProducts.map( ( discountProduct ) => (
                      <ProductCard
                        id={ discountProduct.id }
                        productId={ discountProduct.productId }
                        title={ discountProduct.title }
                        description={ discountProduct.description }
                        price={ discountProduct.discountPrice }
                        image={ products.find( ( product ) => product.id === discountProduct.productId )?.images.find( ( image ) => image.status )?.url }
                        onViewDetailsClick={ onViewDetailsClick }
                        onGetCouponClick={ onGetCouponClick }
                        />
                    ) )
                  )
              }
            </div>
          </div>
        </div>
      </section>
      <section class="section over">
        <div class="over-inner centered">
        <p>I needed to have each section start with a different background image, but the section title needed to be fixed position while the content scrolled over both. This wasnt difficult but the tricky part was having mulitple occurrences of pattern. The "fixed" titles would overlap and be in the incorrect sections.</p>
        </div>
      </section>
      <section class="section under">
        <div class="under-inner two">
          <h2 class="fixed">The Solution:</h2>
        </div>
      </section>
      <section class="section over">
        <div class="over-inner centered">
        <p>Using Waypoints I am hiding and showing section titles as you scroll past the titles. When the title is underneath the section, the title is moved off the screen.</p>
        </div>
      </section>
      <section class="section under">
        <div class="under-inner three">
          <h3 class="fixed">The End.</h3>
        </div>
      </section>
    </>
  )
} )

export const head : DocumentHead = {
  title: 'Offer Me',
  meta: [
    {
      name: 'Offer me Web App',
      content: 'This Web App provides you with the best offers in the market',
    },
  ],
}
