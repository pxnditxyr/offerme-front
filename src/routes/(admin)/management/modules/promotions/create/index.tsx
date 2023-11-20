import { DocumentHead, Form, routeAction$, routeLoader$, useNavigate, zod$ } from '@builder.io/qwik-city'
import { QwikSubmitEvent, component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementPromotionPaymentsService, ManagementPromotionRequestsService, ManagementPromotionsService, SubparametersService } from '~/services'
import { managementCreatePromotionValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionPayment, IManagementPromotionRequest, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IGetDataResponse {
  promotionRequest: IManagementPromotionRequest[] | IManagementPromotionRequest  | IGQLErrorResponse
} 
interface ISubparametersResponse {
  currencies: ISubparameter[] | IGQLErrorResponse
  promotionPayments: IManagementPromotionPayment[] | IGQLErrorResponse
}

export const useGetDataResponse = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, query }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const promotionRequestId = query.get( 'promotionRequestId' ) || ''
  if ( promotionRequestId ) {
    const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ promotionRequestId, jwt: jwt.value })
    if ( 'errors' in promotionRequest ) return { promotionRequest }
    if ( !promotionRequest.promotionStatus[ 0 ].adminApprovedStatus ) return { promotionRequest: { errors: 'Promotion Request is not approved by admin' } }
    return { promotionRequest }
  }
  let promotionRequest = await ManagementPromotionRequestsService.promotionRequests({ jwt: jwt.value, status: true })
  if ( 'errors' in promotionRequest ) return { promotionRequest }

  promotionRequest = promotionRequest.filter( ( promotionRequest ) => ( promotionRequest.promotionStatus[ 0 ].adminApprovedStatus === true ) )
  return { promotionRequest }
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

export const createPromotionAction = routeAction$( async ( data, { cookie, fail, query } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const promotionRequestId = query.get( 'promotionRequestId' ) || ''
  if ( !promotionRequestId ) return fail( 400, { errors: 'Promotion Request Id is required' } )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ promotionRequestId, jwt: jwt.value })
  if ( 'errors' in promotionRequest ) return fail( 400, { errors: promotionRequest.errors } )

  const promotion = await ManagementPromotionsService.createPromotion({
    createPromotionInput: {
      ...data,
      promotionRequestId,
      companyId: promotionRequest.company.id,
      promotionTypeId: promotionRequest.promotionType.id,
    },
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
  const { promotionRequest } = useGetDataResponse().value
  if ( 'errors' in promotionRequest ) return ( <UnexpectedErrorPage error={ promotionRequest.errors }/> )
  const nav = useNavigate()

  if ( !( 'id' in promotionRequest ) ) {
    return (
      <div class="create__container">
        <BackButton href="/management/modules/promotions" />
        <h1 class="create__title"> Create new Promotion </h1>
        <span> No promotion request found </span>
        <h2> Please select a promotion request </h2>
        <form class="form" onSubmit$={ ( event : QwikSubmitEvent<HTMLFormElement> ) => {
          const { target } = event as any
          nav( `?promotionRequestId=${ target.promotionRequestId.value }` )
        } }>
          <FormField
            label="Promotion Request"
            name="promotionRequestId"
            type="select"
            options={ promotionRequest.map( ( promotionRequest ) =>
              ( { id: promotionRequest.id, name: promotionRequest.title } )
            ) }
            />
            <button> Create </button>
        </form>
      </div>
    )
  }
  const { currencies } = useGetSubparameters().value
  if ( 'errors' in currencies ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createPromotionAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/promotions" />
      <h1 class="create__title"> Create new Promotion </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          placeholder="Title"
          value={ promotionRequest.title }
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          placeholder="Description"
          value={ promotionRequest.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Code"
          name="code"
          placeholder="Code"
          value={ promotionRequest.code }
          error={ action.value?.fieldErrors?.code?.join( ', ' ) }
          />
        <FormField
          label="Reason"
          name="reason"
          placeholder="Reason"
          value={ promotionRequest.reason }
          error={ action.value?.fieldErrors?.reason?.join( ', ' ) }
          />
        <FormField
          label="Comment"
          name="comment"
          placeholder="Comment"
          value={ promotionRequest.comment }
          error={ action.value?.fieldErrors?.comment?.join( ', ' ) }
          />
        <FormField
          label="Promotion Start At"
          name="promotionStartAt"
          type="date"
          value={ promotionRequest.promotionStartAt }
          error={ action.value?.fieldErrors?.promotionStartAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion End At"
          name="promotionEndAt"
          type="date"
          value={ promotionRequest.promotionEndAt }
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
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion { action.value.promotion?.title } created successfully </span>
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
  title: 'Create Promotion',
}
