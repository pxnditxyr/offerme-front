import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { ManagementCategoryImagesService } from '~/services'
import { IGQLErrorResponse, IManagementCategoryImage } from '~/interfaces'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetCategoryImageById = routeLoader$<IManagementCategoryImage | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/categories' )

  const categoryImage = await ManagementCategoryImagesService.categoryImage({ categoryImageId: id, jwt: jwt.value })
  return categoryImage
} )

export const toggleStatusManagementCategoryImageAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const categoryImage = await ManagementCategoryImagesService.toggleStatusCategoryImage({ toggleStatusCategoryImageId: id, jwt: jwt.value })

  if ( 'errors' in categoryImage ) {
    return {
      success: false,
      errors: categoryImage.errors
    }
  }
  return {
    success: true,
    categoryImage
  }
} )

export default component$( () => {
  useStyles$( styles )

  const categoryImage = useGetCategoryImageById().value
  if ( 'errors' in categoryImage ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementCategoryImageAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/categories" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { categoryImage.alt }
          </h1>
          <p class="view__image-item">
            <img src={ categoryImage.url } alt={ categoryImage.alt } />
          </p>
        </section>
        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( categoryImage.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
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
  title: 'View Category Image',
}
