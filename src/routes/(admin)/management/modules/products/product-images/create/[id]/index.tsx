import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementProductsService, ManagementProductImagesService } from '~/services'
import { isUUID, managementCreateProductImageValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementProduct } from '~/interfaces'

import styles from './create.styles.css?inline'


export const useGetProduct = routeLoader$<IManagementProduct | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/products' )

  const product = await ManagementProductsService.product({ jwt: jwt.value, productId: id })
  return product
} )

export const createProductAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const productImage = await ManagementProductImagesService.createProductImage({ createProductImageInput: {
    ...data,
    productId: id,
  }, jwt: jwt.value })

  if ( 'errors' in productImage ) {
    return {
      success: false,
      errors: productImage.errors
    }
  }
  return { success: true, productImage }
}, zod$({ ...managementCreateProductImageValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const getProduct = useGetProduct().value
  if ( 'errors' in getProduct ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createProductAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/products" />
      <h1 class="create__title"> Upload Product Image </h1>
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
                <span> Product created successfully </span>
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
  title: 'Create Product Image',
}
