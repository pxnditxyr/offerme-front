import { DocumentHead, Form, routeAction$, routeLoader$, useNavigate, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementDiscountProductsService, ManagementProductsService, ManagementPromotionRequestsService, ManagementPromotionTargetProductsService } from '~/services'
import { isUUID  } from '~/utils'

import { IGQLErrorResponse, IManagementDiscountProduct } from '~/interfaces'

import styles from './create.styles.css?inline'
import { ManagementCodePromotionDiscountProductsService } from '~/services/admin/promotions/management-promotion-target-products.service'


export const useGetData = routeLoader$<IManagementDiscountProduct | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const discountProduct = await ManagementDiscountProductsService.findOne({ discountProductId: id, jwt: jwt.value })
  return discountProduct
} )

export const createPromotionAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const codes = await ManagementCodePromotionDiscountProductsService.create({
    createCodePromotionDiscountProductInput: {
      ...data,
      discountProductId: id,
    },
    jwt: jwt.value
  })

  if ( 'errors' in codes ) {
    return {
      success: false,
      errors: codes.errors
    }
  }
  return { success: true }

}, zod$({ 
  quantity: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Order must be a positive integer' ) ),
}) )

export default component$( () => {
  useStyles$( styles )

  const discountProduct = useGetData().value
  if ( 'errors' in discountProduct ) return ( <UnexpectedErrorPage /> )

  const nav = useNavigate()

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createPromotionAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton />
      <h1 class="create__title"> Create new coupons </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Please enter quantity of coupons"
          name="quantity"
          type="number"
          error={ action.value?.fieldErrors?.quantity?.join( ', ' ) }
          />
        <button> Create Coupons </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Coupons created successfully </span>
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
  title: 'Create Coupons',
}
