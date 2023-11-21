import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementPromotionPaymentsService, ManagementPromotionRequestsService, ManagementPromotionsService, SubparametersService } from '~/services'
import { isUUID, managementCreatePromotionValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementPromotion, IManagementPromotionPayment, IManagementPromotionRequest, ISubparameter } from '~/interfaces'

import styles from './update.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IGetDataResponse {
  promotion: IManagementPromotion | IGQLErrorResponse
  promotionRequest: IManagementPromotionRequest | IGQLErrorResponse
}
  
interface ISubparametersResponse {
  currencies: ISubparameter[] | IGQLErrorResponse
  promotionPayments: IManagementPromotionPayment[] | IGQLErrorResponse
}

export const useGetPromotion = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, params }) => {
  
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  console.log( id )
  if ( !isUUID( id ) ) {
    return {
      promotion: { errors: 'Invalid Promotion ID' },
      promotionRequest: { errors: 'Invalid Promotion ID' },
    }
  }

  const promotion = await ManagementPromotionsService.promotion({ jwt: jwt.value, promotionId: id })
  console.log(  'promo', promotion )
  if ( 'errors' in promotion ) {
    return {
      promotion,
      promotionRequest: { errors: 'Invalid Promotion ID' },
    }
  }

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ jwt: jwt.value, promotionRequestId: promotion.promotionRequestId })
  return {
    promotion,
    promotionRequest,
  }
} )

export const useGetSubparameters = routeLoader$<ISubparametersResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const currencies = await SubparametersService.findAllByParameterName({ parameterName: 'currency', status: true })
  const promotionPayments = await ManagementPromotionPaymentsService.promotionPayments({ jwt: jwt.value, status: true })
  return {
    currencies,
    promotionPayments
  }
} )

export const updatePromotionAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id )
  if ( !isUUID( id ) ) return fail( 400, { errors: 'Invalid Promotion ID' } )

  const promotion = await ManagementPromotionsService.updatePromotion({
    updatePromotionInput: { ...data, id },
    jwt: jwt.value
  })

  if ( 'errors' in promotion ) {
    return {
      success: false,
      errors: promotion.errors
    }
  }
  return { success: true, promotion }
}, zod$({ ...managementCreatePromotionValidationSchema }) )

export default component$( () => {
  useStyles$( styles )
  const { promotion, promotionRequest } = useGetPromotion().value
  if ( 'errors' in promotion || 'errors' in promotionRequest ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updatePromotionAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__container">
      <BackButton href="/management/modules/promotions" />
      <h1 class="update_title"> Update Promotion </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          placeholder="Title"
          value={ promotion.title }
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          placeholder="Description"
          value={ promotion.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Code"
          name="code"
          placeholder="Code"
          value={ promotion.code }
          error={ action.value?.fieldErrors?.code?.join( ', ' ) }
          />
        <FormField
          label="Reason"
          name="reason"
          placeholder="Reason"
          value={ promotion.reason }
          error={ action.value?.fieldErrors?.reason?.join( ', ' ) }
          />
        <FormField
          label="Comment"
          name="comment"
          placeholder="Comment"
          value={ promotion.comment }
          error={ action.value?.fieldErrors?.comment?.join( ', ' ) }
          />
        <FormField
          label="Promotion Start At"
          name="promotionStartAt"
          type="date"
          value={ promotion.promotionStartAt }
          error={ action.value?.fieldErrors?.promotionStartAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion End At"
          name="promotionEndAt"
          type="date"
          value={ promotion.promotionEndAt }
          error={ action.value?.fieldErrors?.promotionEndAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion Payment"
          name="promotionPaymentId"
          type="select"
          options={ promotionRequest.promotionPayments.map( ( promotionPayment ) =>
            ( { id: promotionPayment.id, name: String( promotionPayment.amount ) } )
          ) }
          error={ action.value?.fieldErrors?.promotionPaymentId?.join( ', ' ) }
          />
        <button> Update </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion { action.value.promotion?.title } updated successfully </span>
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
  title: 'Update Promotion',
}
