import { $, component$, useStyles$ } from '@builder.io/qwik'
import { BackButton, CategoryCard, UnexpectedErrorPage } from '~/components/shared'

import styles from './sectors.styles.css?inline'
import { routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { PublicCategoriesService, PublicPromotionDiscountProductsService } from '~/services'
import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'
import { IPublicProducts } from '~/interfaces/public/code-promotion-discount-products.interface'
import { isUUID } from '~/utils'

interface IGetDataResponse {
  categories: IManagementCategory[] | IGQLErrorResponse
  products: IPublicProducts[] | IGQLErrorResponse
  discountProducts: IPublicProducts[] | IGQLErrorResponse
}

export const useGetCurrentCategory = routeLoader$<IGetDataResponse>( async ({ params }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      categories: { errors: 'Invalid category id' },
      products: { errors: 'Invalid category id' }
    }
  }
  const category = await PublicCategoriesService.findOne({ categoryId: id })
  if ( 'errors' in category ) {
    return {
      categories: category,
      products: { errors: 'Invalid category id' },
      discountProducts: { errors: 'Invalid category id' }
    }
  }

  const { publicProducts, publicPromotions, publicDiscountProducts, publicCodePromotionDiscountProducts } = await PublicPromotionDiscountProductsService.findAll({ status: true })
  if ( 'errors' in publicProducts || 'errors' in publicPromotions || 'errors' in publicDiscountProducts || 'errors' in publicCodePromotionDiscountProducts ) {
    return {
      categories: category,
      products: { errors: 'Something went wrong' },
      discountProducts: { errors: 'Something went wrong' }
    }
  }

  const validPromotions = publicPromotions.filter( ( promotion ) => {
    const promotionStartAt = new Date( promotion.promotionStartAt )
    const promotionEndAt = new Date( promotion.promotionEndAt )
    const now = new Date()
    return now >= promotionStartAt && now <= promotionEndAt
  } )


  const validProducts = publicProducts.filter( ( product ) =>
    product.categories.find( ( category ) => category.id === id )
  )

  const validDiscountProducts = publicDiscountProducts.filter( ( discountProduct ) => 
    ( validPromotions.find( ( promotion ) => promotion.promotionRequestId === discountProduct.promotionRequestId ) )
    &&
    ( publicCodePromotionDiscountProducts.find( ( codePromotionDiscountProduct ) => codePromotionDiscountProduct.discountProductId === discountProduct.id ) )
    &&
    ( validProducts.find( ( product ) => product.id === discountProduct.productId ) )
  )


  return {
    categories: category.children,
    products: validProducts,
    discountProducts: validDiscountProducts
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { products, categories, discountProducts } = useGetCurrentCategory().value
  if ( 'errors' in categories ) return ( <UnexpectedErrorPage error={ categories.errors } /> )
  if ( 'errors' in products ) return ( <UnexpectedErrorPage error={ products.errors } /> )
  if ( 'errors' in discountProducts ) return ( <UnexpectedErrorPage error={ discountProducts.errors } /> )


  const nav = useNavigate()

  const onCategoryClick = $( ( id : string ) => {
    nav( `/categories/${ btoa( id ) }` )
  } )

  return (
    <div class="sectors__container">
      <BackButton theme="dark" />
      <div class="sectors__title">
        {
          ( categories.length > 0 ) && (
            <h1> Sectors </h1>
          )
        }
      </div>
      <div class="sectors__gallery">
        {
          categories.map( ( category ) => (
            <CategoryCard 
              id={ category.id }
              name={ category.name }
              description={ category.description }
              onClick={ onCategoryClick }
            />
          ) )
        }
      </div>
      <div class="sectors__title">
        {
          ( products.length > 0 ) ? (
            <h1> Products </h1>
          ) : (
            <h1> No products available </h1>
          )
        }
      </div>
    </div>
  )
} )
