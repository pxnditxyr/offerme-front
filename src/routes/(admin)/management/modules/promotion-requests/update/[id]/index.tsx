import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCompaniesService, ManagementPromotionRequestsService, SubparametersService } from '~/services'
import { managementCreatePromotionRequestValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionRequest, ISubparameter } from '~/interfaces'

import styles from './update-index.styles.css?inline'


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

export const useGetPromotionRequest = routeLoader$<IManagementPromotionRequest | IGQLErrorResponse>( async ({ cookie, params, redirect }) => {
  const id = atob( params.id )

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const promotionRequest = await ManagementPromotionRequestsService.promotionRequest({ promotionRequestId: id, jwt: jwt.value })
  return promotionRequest
} )

export const updatePromotionRequestAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const id = atob( params.id )

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const promotionRequest = await ManagementPromotionRequestsService.updatePromotionRequest({ updatePromotionRequestInput: {
    ...data,
    id
  }, jwt: jwt.value })

  if ( 'errors' in promotionRequest ) {
    return {
      success: false,
      errors: promotionRequest.errors
    }
  }
  return { success: true, promotionRequest }
}, zod$({ ...managementCreatePromotionRequestValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { promotionTypes, companies, currencies } = useGetSubparameters().value
  if ( 'errors' in promotionTypes || 'errors' in companies || 'errors' in currencies ) return ( <UnexpectedErrorPage /> )
  const currentPromotionRequest = useGetPromotionRequest().value
  if ( 'errors' in currentPromotionRequest ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updatePromotionRequestAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__index__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="update__index__title"> Update new Promotion Request </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Title"
          name="title"
          placeholder="Title"
          value={ currentPromotionRequest.title }
          error={ action.value?.fieldErrors?.title?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          placeholder="Description"
          value={ currentPromotionRequest.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Code"
          name="code"
          placeholder="Code"
          value={ currentPromotionRequest.code }
          error={ action.value?.fieldErrors?.code?.join( ', ' ) }
          />
        <FormField
          label="Comment"
          name="comment"
          placeholder="Comment"
          value={ currentPromotionRequest.comment }
          error={ action.value?.fieldErrors?.comment?.join( ', ' ) }
          />
        <FormField
          label="Reason"
          name="reason"
          placeholder="Reason"
          value={ currentPromotionRequest.reason }
          error={ action.value?.fieldErrors?.reason?.join( ', ' ) }
          />
        <FormField
          label="Inversion Amount"
          name="inversionAmount"
          placeholder="Inversion Amount"
          value={ String( currentPromotionRequest.inversionAmount ) }
          error={ action.value?.fieldErrors?.inversionAmount?.join( ', ' ) }
          />
        <FormField
          label="Currency"
          name="currencyId"
          type="select"
          value={ currentPromotionRequest.currency.id }
          options={ currencies }
          />
        <FormField
          label="Promotion Start At"
          name="promotionStartAt"
          type="date"
          value={ currentPromotionRequest.promotionStartAt }
          error={ action.value?.fieldErrors?.promotionStartAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion End At"
          name="promotionEndAt"
          type="date"
          value={ currentPromotionRequest.promotionEndAt }
          error={ action.value?.fieldErrors?.promotionEndAt?.join( ', ' ) }
          />
        <FormField
          label="Promotion Type"
          name="promotionTypeId"
          type="select"
          value={ currentPromotionRequest.promotionType.id }
          options={ promotionTypes }
          />
        <FormField
          label="Company"
          name="companyId"
          type="select"
          value={ currentPromotionRequest.company.id }
          options={ [
            ...companies.map( ( company ) => ({ id: company.id, name: company.name }) )
          ] }
          />
        <button> Update </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion Request { action.value.promotionRequest?.title } updated successfully </span>
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
  title: 'Update Promotion Request',
}
