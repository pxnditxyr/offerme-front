import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { ManagementProductImagesService } from '~/services'
import { IGQLErrorResponse, IManagementProductImage } from '~/interfaces'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetProductImageById = routeLoader$<IManagementProductImage | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/products' )

  const productImage = await ManagementProductImagesService.productImage({ productImageId: id, jwt: jwt.value })
  return productImage
} )

export const toggleStatusManagementProductImageAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const productImage = await ManagementProductImagesService.toggleStatusProductImage({ toggleStatusProductImageId: id, jwt: jwt.value })

  if ( 'errors' in productImage ) {
    return {
      success: false,
      errors: productImage.errors
    }
  }
  return {
    success: true,
    productImage
  }
} )

export default component$( () => {
  useStyles$( styles )

  const productImage = useGetProductImageById().value
  if ( 'errors' in productImage ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementProductImageAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/products" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { productImage.alt }
          </h1>
          <p class="view__image-item">
            <img src={ productImage.url } alt={ productImage.alt } />
          </p>
        </section>
        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( productImage.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
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
