import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementProductsService, ManagementPromotionRequestsService, ManagementDiscountProductsService } from '~/services'
import { isUUID, managementCreateDiscountProductValidationSchema  } from '~/utils'

import { IGQLErrorResponse, IManagementProduct, IManagementPromotionRequest } from '~/interfaces'

import styles from './create.styles.css?inline'

interface IGetDataResponse {
  promotionRequest: IManagementPromotionRequest | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: id })
  let products = await ManagementProductsService.products({ jwt: jwt.value, status: true })
  if ( 'errors' in promotionRequest || 'errors' in products ) return { promotionRequest, products }

  products = products.filter( ( product ) =>
    ( product.company.id === promotionRequest.company.id )
      &&
    ( !promotionRequest.discountProducts.some( ( discountProduct ) => discountProduct.productId === product.id )
  ) )

  return {
    promotionRequest,
    products
  }
} )

export const createDiscountProductAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const discountProduct = await ManagementDiscountProductsService.create({
    createDiscountProductInput: {
      ...data,
      promotionRequestId: id,
    },
    jwt: jwt.value
  })

  if ( 'errors' in discountProduct ) {
    return {
      success: false,
      errors: discountProduct.errors
    }
  }
  return { success: true, discountProduct }
}, zod$({ ...managementCreateDiscountProductValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { products, promotionRequest } = useGetData().value
  if ( 'errors' in promotionRequest || 'errors' in products ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createDiscountProductAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="create__title"> Create new Discount Product </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Select Product"
          name="productId"
          type="select"
          error={
            ( products.length === 0 && 'This promotion request has no more products to add' )
            ||
            action.value?.fieldErrors?.productId?.join( ', ' )
          }
          options={ products.map( ( product ) => ({ id: product.id, name: product.name }) ) }
          />
        <FormField
          label="Discount Amount"
          name="discountAmount"
          type="number"
          error={ action.value?.fieldErrors?.discountAmount?.join( ', ' ) }
          />
        <FormField
          label="Discount Percentage"
          name="discountPercentage"
          type="number"
          error={ action.value?.fieldErrors?.discountPercentage?.join( ', ' ) }
          />
        <FormField
          label="Discount Price"
          name="discountPrice"
          type="number"
          error={ action.value?.fieldErrors?.discountPrice?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Discount Product created successfully </span>
              )
            }
            {
              ( action.value?.success === false ) && (
                <span> { action.value.errors || 'Error' } </span>
              )
            }
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Create Discount Product',
}
