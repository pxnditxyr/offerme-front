import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementProductsService, ManagementPromotionRequestsService, ManagementDiscountProductsService } from '~/services'
import { isUUID, managementCreateDiscountProductValidationSchema  } from '~/utils'

import { IGQLErrorResponse, IManagementDiscountProduct, IManagementProduct } from '~/interfaces'

import styles from './update-index.styles.css?inline'

interface IGetDataResponse {
  discountProduct: IManagementDiscountProduct | IGQLErrorResponse
  products: IManagementProduct[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const discountProduct = await ManagementDiscountProductsService.findOne({ jwt: jwt.value, discountProductId: id })
  let products = await ManagementProductsService.products({ jwt: jwt.value, status: true })
  if ( 'errors' in discountProduct || 'errors' in products ) return { discountProduct, products }
  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: discountProduct.promotionRequestId })
  if ( 'errors' in promotionRequest ) return { discountProduct, products }

  products = products.filter( ( product ) =>
    ( product.company.id === promotionRequest.company.id )
      &&
    ( !promotionRequest.discountProducts.some( ( promotionRequestDiscountProduct ) =>
        (
          promotionRequestDiscountProduct.productId === product.id
            &&
          promotionRequestDiscountProduct.status
            &&
          promotionRequestDiscountProduct.id !== discountProduct.id
        ) )
  ) )

  return {
    discountProduct,
    products
  }
} )

export const updateDiscountProductAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const discountProduct = await ManagementDiscountProductsService.update({
    updateDiscountProductInput: { ...data, id },
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

  const { products, discountProduct } = useGetData().value
  if ( 'errors' in discountProduct || 'errors' in products ) return <UnexpectedErrorPage />

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updateDiscountProductAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__index__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="update__index__title"> Update new Discount Product </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          value={ discountProduct.title }
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          value={ discountProduct.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Select Product"
          name="productId"
          type="select"
          value={ discountProduct.productId }
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
          value={ String( discountProduct.discountAmount ) }
          error={ action.value?.fieldErrors?.discountAmount?.join( ', ' ) }
          />
        <FormField
          label="Discount Percentage"
          name="discountPercentage"
          value={ String( discountProduct.discountPercentage ) }
          error={ action.value?.fieldErrors?.discountPercentage?.join( ', ' ) }
          />
        <FormField
          label="Discount Price"
          name="discountPrice"
          value={ String( discountProduct.discountPrice ) }
          error={ action.value?.fieldErrors?.discountPrice?.join( ', ' ) }
          />
        <button> Update </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Discount Product updated successfully </span>
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
  title: 'Update Discount Product',
}
