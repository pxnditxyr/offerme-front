import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

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

export const toggleStatusManagementPromotionImageAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const promotionImage = await ManagementPromotionImagesService.toggleStatusPromotionImage({ toggleStatusPromotionImageId: id, jwt: jwt.value })

  if ( 'errors' in promotionImage ) {
    return {
      success: false,
      errors: promotionImage.errors
    }
  }
  return {
    success: true,
    promotionImage
  }
} )

export default component$( () => {
  useStyles$( styles )

  const promotionImage = useGetPromotionImageById().value
  if ( 'errors' in promotionImage ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementPromotionImageAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

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
        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( promotionImage.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
          </Form>
        </section>
      </article>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success === false ) && (
                <span> { action.value.errors } </span>
              )
            }
          </Modal>
        )
      }
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Categories',
}
