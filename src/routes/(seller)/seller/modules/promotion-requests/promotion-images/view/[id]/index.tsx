import { component$, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, UnexpectedErrorPage } from '~/components/shared'

import { ManagementPromotionImagesService } from '~/services'
import { IGQLErrorResponse, IManagementPromotionImage } from '~/interfaces'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetPromotionImageById = routeLoader$<IManagementPromotionImage | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const promotionImage = await ManagementPromotionImagesService.promotionImage({ promotionImageId: id, jwt: jwt.value })
  return promotionImage
} )

export default component$( () => {
  useStyles$( styles )

  const promotionImage = useGetPromotionImageById().value
  if ( 'errors' in promotionImage ) return ( <UnexpectedErrorPage /> )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/promotion-requests" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { promotionImage.alt }
          </h1>
          <p class="view__image-item">
            <img src={ promotionImage.url } alt={ promotionImage.alt } />
          </p>
        </section>
      </article>
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Promotion Image'
}
