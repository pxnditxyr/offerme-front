import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementPromotionPaymentsService, ManagementPromotionRequestsService, SubparametersService } from '~/services'
import { isUUID, managementCreatePromotionPaymentValidationSchema  } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionRequest, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'

interface IGetDataResponse {
  promotionRequest: IManagementPromotionRequest | IGQLErrorResponse
  paymentMethods: ISubparameter[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: id })
  const paymentMethods = await SubparametersService.findAllByParameterName({ parameterName: 'payment method', status: true })
  return {
    promotionRequest,
    paymentMethods
  }
} )

export const createPromotionAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const promotionPayment = await ManagementPromotionPaymentsService.createPromotionPayment({
    createPromotionPaymentInput: {
      ...data,
      promotionRequestId: id
    },
    jwt: jwt.value
  })

  if ( 'errors' in promotionPayment ) {
    return {
      success: false,
      errors: promotionPayment.errors
    }
  }
  return { success: true, promotionPayment }
}, zod$({ ...managementCreatePromotionPaymentValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { paymentMethods, promotionRequest } = useGetData().value
  if ( 'errors' in promotionRequest || 'errors' in paymentMethods ) return ( <UnexpectedErrorPage /> )

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
          label="Amount"
          name="amount"
          error={ action.value?.fieldErrors?.amount?.join( ', ' ) }
          />
        <FormField
          label="Voucher"
          name="voucher"
          type="text"
          error={ action.value?.fieldErrors?.voucher?.join( ', ' ) }
          />
        <FormField
          label="Payment Date"
          name="paymentDate"
          type="date"
          error={ action.value?.fieldErrors?.paymentDate?.join( ', ' ) }
          />
        <FormField
          label="Payment Method"
          name="paymentMethodId"
          type="select"
          error={ action.value?.fieldErrors?.paymentMethodId?.join( ', ' ) }
          options={ paymentMethods.map( ( paymentMethod ) =>
            ({ id: paymentMethod.id, name: paymentMethod.name })
          ) }
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
