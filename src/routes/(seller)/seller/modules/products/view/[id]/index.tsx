import { $, component$, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementCategory, IManagementProduct, IManagementUsersData } from '~/interfaces'
import { ManagementCategoriesService, ManagementProductsService, UsersManagementService } from '~/services'
import { graphqlExceptionsHandler, isUUID } from '~/utils'

import styles from './view.styles.css?inline'
import { useAuthStore } from '~/hooks'

interface IGetProductById {
  product: IManagementProduct | IGQLErrorResponse
  categories: IManagementCategory[] | IGQLErrorResponse
}

export const useGetProductById = routeLoader$<IGetProductById>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/seller/modules/products' )

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const product = await ManagementProductsService.product({ productId: id, jwt: jwt.value })

  let categories = await ManagementCategoriesService.categories({ jwt: jwt.value })
  if ( !( 'errors' in categories ) && !( 'errors' in product ) ) {
    categories = categories.filter( ( category ) =>
      product.categories.find( ( productCategory ) =>
        ( productCategory.categoryId === category.id ) && ( category.status )
      ) )
  }
  return {
    product,
    categories,
  }
} )

export const useGetUsers = routeLoader$<IManagementUsersData[] | IGQLErrorResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  try {
    const users = await UsersManagementService.getUsers( jwt.value )
    return users
  } catch ( error : any ) {
    return { errors: graphqlExceptionsHandler( error ) }
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { categories, product } = useGetProductById().value
  if ( 'errors' in product || 'errors' in categories ) return ( <UnexpectedErrorPage /> )

  const { status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()


  const onImageClick = $( ( id : string ) => {
    nav( `/seller/modules/products/product-images/view/${ btoa( id ) }` )
  } )

  const onCategoryClick = $( ( id : string ) => {
    nav( `/seller/modules/products/product-categories/view/${ btoa( id ) }` )
  } )

  return (
    <div class="view__container">
      <BackButton href="/seller/modules/products" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { product.name }
          </h1>
          <p class="view__image-item">
            <img src={ ( product.images.find( ( image ) => image.status ) )
                ? product.images.find( ( image ) => image.status )?.url
                : '/images/fallback-image.png'
            } alt={ product.name } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { product.description } </p>
          <p class="view__info-item"> Product Type: { product.productType.name } </p>
          <p class="view__info-item"> Company: { product.company.name } </p>
          <p class="view__info-item"> Stock: { product.stock } </p>
          <p class="view__info-item"> Price: { product.price } </p>
          <p class="view__info-item"> Code: { product.code } </p>
          <p class="view__info-item"> Notes: { product.notes } </p>
          <p class="view__info-item">
            Status: { product.status ? 'Active' : 'Inactive' }
          </p>
          <p class="view__info-item"> Created At: { product.createdAt } </p>
          <p class="view__info-item">
            Created By: { product.creator?.email || 'No Creator' }
          </p>
          <p class="view__info-item"> Updated At: { product.updatedAt } </p>
          <p class="view__info-item">
            Updated By: { product.updater?.email || 'No Updated' }
          </p>
        </section>

        <section class="view__container__card__footer">
          <div class="view__images">
            <p> Images </p>
            <div class="view__gallery">
              { product.images.map( ( image ) => (
                  <article key={ image.id } onClick$={ () => onImageClick( image.id ) } >
                    <section>
                      <img src={ image.url } alt={ image.alt } />
                    </section>
                  </article>
                ))
              }
              {
                product.images.length === 0 && ( <p> No Images </p> )
              }
            </div>
          </div>
          <div class="view__images">
            <p> Categories </p>
            <div class="view__gallery">
              { product.categories.map( ( productCategory ) => {
                const category = categories.find( ( category ) => category.id === productCategory.categoryId )
                return (
                  ( category )
                    ? (
                      <article class="view__gallery__card" key={ category.id } onClick$={ () => onCategoryClick( productCategory.id ) }> 
                        <section>
                          <p> Name: </p>
                          <p> { category.name } </p>
                          <p> Description: </p>
                          <p> { category.description } </p>
                        </section>
                      </article>
                    )
                    : ( <></> )
                ) } )
              }
              {
                product.categories.length === 0 && ( <p> No Categories </p> )
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'View Product',
}
