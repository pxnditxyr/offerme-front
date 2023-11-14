import { $, component$, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'
import { ManagementCategoriesService } from '~/services'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetCategoryById = routeLoader$<IManagementCategory | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/categories' )

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const category = await ManagementCategoriesService.category({ categoryId: id, jwt: jwt.value })
  return category
} )

export default component$( () => {
  useStyles$( styles )

  const category = useGetCategoryById().value
  if ( 'errors' in category ) return ( <UnexpectedErrorPage /> )

  const nav = useNavigate()
  const onImageClick = $( ( id : string ) => {
    nav( `/management/modules/categories/category-images/view/${ btoa( id ) }` )
  } )


  return (
    <div class="view__container">
      <BackButton href="/management/modules/categories" />
      <article class="view__container__card">
        <section class="view__container__card__header">
            
          <h1 class="view__name">
            { category.name }
          </h1>
          <p class="view__image-item">
            <img src={ ( category.images.find( ( image ) => image.status ) )
                ? category.images[ 0 ].url
                : '/images/fallback-image.png'
            } alt={ category.name } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { category.description } </p>
          <p class="view__info-item"> Order: { category.order } </p>
          <p class="view__info-item"> Parent: { category.parent?.name || 'No Parent' } </p>
          <p class="view__info-item">
            Status: { category.status ? 'Active' : 'Inactive' }
          </p>
          <p class="view__info-item"> Created At: { category.createdAt } </p>
          <p class="view__info-item">
            Created By: { category.creator?.email || 'No Creator' }
          </p>
          <p class="view__info-item"> Updated At: { category.updatedAt } </p>
          <p class="view__info-item">
            Updated By: { category.updater?.email || 'No Updated' }
          </p>
        </section>
        <section class="view__container__card__footer">
          <div class="view__images">
            <p> Images </p>
            <div class="view__gallery">
              { category.images.map( ( image ) => (
                  <article key={ image.id } onClick$={ () => onImageClick( image.id ) } >
                    <section>
                      <img src={ image.url } alt={ image.alt } />
                    </section>
                  </article>
                ))
              }
              {
                category.images.length === 0 && ( <p> No Images </p> )
              }
            </div>
          </div>
          <Link
            href={ `/management/modules/categories/category-images/create/${ btoa( category.id ) }` }
            class="view__link"
          >
            Add new Image
          </Link>
        </section>
      </article>
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Categories',
}
