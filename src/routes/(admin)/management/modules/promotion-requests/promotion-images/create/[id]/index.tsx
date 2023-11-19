import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementPromotionRequestsService, ManagementPromotionImagesService } from '~/services'
import { isUUID, managementCreatePromotionImageValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionRequest } from '~/interfaces'

import styles from './create.styles.css?inline'


export const useGetPromotionRequest = routeLoader$<IManagementPromotionRequest | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotion-requests' )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: id })
  return promotionRequest
} )

export const createPromotionRequestAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const promotionRequestImage = await ManagementPromotionImagesService.createPromotionImage({ createPromotionImageInput: {
    ...data,
    promotionRequestId: id,
  }, jwt: jwt.value })

  if ( 'errors' in promotionRequestImage ) {
    return {
      success: false,
      errors: promotionRequestImage.errors
    }
  }
  return { success: true, promotionRequestImage }
}, zod$({ ...managementCreatePromotionImageValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const getPromotionRequest = useGetPromotionRequest().value
  if ( 'errors' in getPromotionRequest ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createPromotionRequestAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="create__title"> Create Promotion Image </h1>
      <Form class="form" action={ action }>
        <FormField
          name="url"
          placeholder="Url"
          error={ action.value?.fieldErrors?.url?.join( ', ' ) }
          />
        <FormField
          name="alt"
          placeholder="Description"
          error={ action.value?.fieldErrors?.alt?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion Image created successfully </span>
              )
            }
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
} )

export const head : DocumentHead = {
  title: 'Create Promotion Image',
}
