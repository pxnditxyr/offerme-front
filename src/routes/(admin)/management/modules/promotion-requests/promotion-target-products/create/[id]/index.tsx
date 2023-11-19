import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementProductsService, ManagementPromotionRequestsService, ManagementPromotionTargetProductsService } from '~/services'
import { isUUID  } from '~/utils'

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
    ( !promotionRequest.targetProducts.some( ( targetProduct ) => targetProduct.productId === product.id ) )
  )

  return {
    promotionRequest,
    products
  }
} )

export const createPromotionAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const promotionTargetProduct = await ManagementPromotionTargetProductsService.create({
    createPromotionTargetProductInput: {
      ...data,
      promotionRequestId: id,
    },
    jwt: jwt.value
  })

  if ( 'errors' in promotionTargetProduct ) {
    return {
      success: false,
      errors: promotionTargetProduct.errors
    }
  }
  return { success: true, promotionTargetProduct }
}, zod$({ 
  productId: z.string().min( 2, 'This promotion request has no more products to add' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' )
}) )

export default component$( () => {
  useStyles$( styles )

  const { products, promotionRequest } = useGetData().value
  if ( 'errors' in promotionRequest || 'errors' in products ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createPromotionAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="create__title"> Create new Payment </h1>
      <Form class="form" action={ action }>
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
          label="Description"
          name="description"
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion created successfully </span>
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
  title: 'Create Promotion Payment',
}
