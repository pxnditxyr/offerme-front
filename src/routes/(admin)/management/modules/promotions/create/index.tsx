import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCompaniesService, ManagementPromotionPaymentsService, ManagementPromotionsService, SubparametersService } from '~/services'
import { managementCreatePromotionValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionPayment, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'
import { useModalStatus } from '~/hooks'

// code: z.string().min( 2, 'Code must be at least 2 characters' ),
//   comment: z.string().min( 2, 'Comment must be at least 2 characters' ),
//   companyId: z.string().min( 2, 'Company must be at least 2 characters' ),
//   description: z.string().min( 2, 'Description must be at least 2 characters' ),
//   currencyId: z.string().min( 2, 'Currency must be at least 2 characters' ),
//   inversionAmount: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
//     z.number().int().min( 0, 'Inversion Amount must be at least 0' ) ),
//   promotionEndAt: z.string().min( 2, 'Promotion End At must be at least 2 characters' ),
//   promotionStartAt: z.string().min( 2, 'Promotion Start At must be at least 2 characters' ),
//   promotionTypeId: z.string().min( 2, 'Promotion Type must be at least 2 characters' ),
//   promotionPaymentId: z.string().min( 2, 'Promotion Payment must be at least 2 characters' ),
//   promotionRequestId: z.string().min( 2, 'Promotion Request must be at least 2 characters' ),
//   reason: z.string().min( 2, 'Reason must be at least 2 characters' ),
//   title: z.string().min( 2, 'Title must be at least 2 characters' )


interface IGetDataResponse {
  companies: ISubparameter[] | IGQLErrorResponse
  promotionTypes: ISubparameter[] | IGQLErrorResponse
  promotionPayments: IManagementPromotionPayment[] | IGQLErrorResponse
  promotionRequests: ISubparameter[] | IGQLErrorResponse
} 

export const useGetSubparameters = routeLoader$<IGetDataResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const companies = await ManagementCompaniesService.companies({ jwt: jwt.value, status: true })
  const promotionTypes = await SubparametersService.findAllByParameterName({ parameterName: 'Promotion type', status: true })
  const promotionPayments = await ManagementPromotionPaymentsService.promotionPayment()
  return { companies, promotionTypes }
} )

export const createPromotionAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const Promotion = await ManagementPromotionsService.createPromotion({ createPromotionInput: data, jwt: jwt.value })

  if ( 'errors' in Promotion ) {
    return {
      success: false,
      errors: Promotion.errors
    }
  }
  return { success: true, Promotion }
}, zod$({ ...managementCreatePromotionValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { PromotionTypes, companies } = useGetSubparameters().value
  if ( 'errors' in PromotionTypes || 'errors' in companies ) return ( <UnexpectedErrorPage /> )

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
          label="Name"
          name="name"
          placeholder="Name"
          error={ action.value?.fieldErrors?.name?.join( ', ' ) }
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
          label="Notes"
          name="notes"
          placeholder="Notes"
          error={ action.value?.fieldErrors?.notes?.join( ', ' ) }
          />
        <FormField
          label="Promotion Type"
          name="PromotionTypeId"
          type="select"
          options={ PromotionTypes }
          />
        <FormField
          label="Company"
          name="companyId"
          type="select"
          options={ [
            ...companies.map( ( company ) => ({ id: company.id, name: company.name }) )
          ] }
          />
        <FormField
          label="Price of Promotion(Bs.)"
          name="price"
          placeholder="Price"
          error={ action.value?.fieldErrors?.price?.join( ', ' ) }
          />
        <FormField
          label="Stock"
          name="stock"
          placeholder="Stock"
          error={ action.value?.fieldErrors?.stock?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion { action.value.Promotion?.name } created successfully </span>
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
