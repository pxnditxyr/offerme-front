import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCompaniesService, ManagementPromotionRequestsService, ManagementPromotionStatusService, SubparametersService } from '~/services'
import { managementCreatePromotionRequestValidationSchema } from '~/utils'

import { IGQLErrorResponse, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'


interface IGetSubparametersResponse {
  companies: ISubparameter[] | IGQLErrorResponse
  promotionTypes: ISubparameter[] | IGQLErrorResponse
  currencies: ISubparameter[] | IGQLErrorResponse
} 

export const useGetSubparameters = routeLoader$<IGetSubparametersResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const companies = await ManagementCompaniesService.companies({ jwt: jwt.value, status: true })
  const promotionTypes = await SubparametersService.findAllByParameterName({ parameterName: 'promotion type', status: true })
  const currencies = await SubparametersService.findAllByParameterName({ parameterName: 'currency', status: true })

  return {
    companies,
    currencies,
    promotionTypes
  }
} )

export const createPromotionRequestAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const promotionRequest = await ManagementPromotionRequestsService.createPromotionRequest({ createPromotionRequestInput: data, jwt: jwt.value })

  if ( 'errors' in promotionRequest ) {
    return {
      success: false,
      errors: promotionRequest.errors
    }
  }

  const promotionStatus = await ManagementPromotionStatusService.create({ createPromotionStatusInput: { promotionRequestId: promotionRequest.id }, jwt: jwt.value } )
  if ( 'errors' in promotionStatus ) {
    return {
      success: false,
      errors: promotionStatus.errors
    }
  }
  return { success: true, promotionRequest }
}, zod$({ ...managementCreatePromotionRequestValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { promotionTypes, companies, currencies } = useGetSubparameters().value
  if ( 'errors' in promotionTypes || 'errors' in companies || 'errors' in currencies ) return ( <UnexpectedErrorPage /> )

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
      <h1 class="create__title"> Create new Promotion Request </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          placeholder="Title"
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          placeholder="Description"
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Code"
          name="code"
          placeholder="Code"
          error={ action.value?.fieldErrors?.code?.join( ', ' ) }
          />
        <FormField
          label="Comment"
          name="comment"
          placeholder="Comment"
          error={ action.value?.fieldErrors?.comment?.join( ', ' ) }
          />
        <FormField
          label="Reason"
          name="reason"
          placeholder="Reason"
          error={ action.value?.fieldErrors?.reason?.join( ', ' ) }
          />
        <FormField
          label="Inversion Amount"
          name="inversionAmount"
          placeholder="Inversion Amount"
          error={ action.value?.fieldErrors?.inversionAmount?.join( ', ' ) }
          />
        <FormField
          label="Currency"
          name="currencyId"
          type="select"
          options={ currencies }
          />
        <FormField
          label="Promotion Start At"
          name="promotionStartAt"
          type="date"
          error={ action.value?.fieldErrors?.promotionStartAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion End At"
          name="promotionEndAt"
          type="date"
          error={ action.value?.fieldErrors?.promotionEndAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion Type"
          name="promotionTypeId"
          type="select"
          options={ promotionTypes }
          />
        <FormField
          label="Company"
          name="companyId"
          type="select"
          options={ [
            ...companies.map( ( company ) => ({ id: company.id, name: company.name }) )
          ] }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion Request { action.value.promotionRequest?.title } created successfully </span>
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
  title: 'Create Promotion Request',
}
