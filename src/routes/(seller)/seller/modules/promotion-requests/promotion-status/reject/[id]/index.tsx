import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementPromotionStatusService } from '~/services'
import { isUUID  } from '~/utils'

import { IGQLErrorResponse, IManagementPromotionStatus } from '~/interfaces'

import styles from './create.styles.css?inline'

interface IGetDataResponse {
  promotionStatus: IManagementPromotionStatus | IGQLErrorResponse
}

export const useGetData = routeLoader$<IGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/promotions' )

  const promotionStatus = await ManagementPromotionStatusService.findOne({ jwt: jwt.value, promotionStatesId: id })

  return { promotionStatus }
} )

export const approvePromotionStatusAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const promotionStatus = await ManagementPromotionStatusService.reject({ jwt: jwt.value, statusUpdatePromotionStatusInput: { id, ...data } })
  if ( 'errors' in promotionStatus ) {
    return {
      success: false,
      errors: promotionStatus.errors
    }
  }
  return { success: true, promotionStatus }
}, zod$({ 
  adminReason: z.string().min( 4, 'Admin Reason must be at least 4 characters' ),
  adminComment: z.string().min( 4, 'Admin Comment must be at least 4 characters' ),
}) )

export default component$( () => {
  useStyles$( styles )

  const { promotionStatus } = useGetData().value
  if ( 'errors' in promotionStatus ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = approvePromotionStatusAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/promotion-requests" />
      <h1 class="create__title"> Reject Promotion </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Reason"
          name="adminReason"
          error={ action.value?.fieldErrors?.adminReason?.join( ', ' ) }
          />
        <FormField
          label="Comment"
          name="adminComment"
          error={ action.value?.fieldErrors?.adminComment?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Promotion Rejected </span>
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
  title: 'Reject Promotion',
}
