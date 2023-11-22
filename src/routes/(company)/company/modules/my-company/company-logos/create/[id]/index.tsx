import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCompaniesService, ManagementCompanyLogosService } from '~/services'
import { isUUID, managementCreateCompanyLogoValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementCompany } from '~/interfaces'

import styles from './create.styles.css?inline'


export const useGetCompany = routeLoader$<IManagementCompany | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/companies' )

  const company = await ManagementCompaniesService.company({ jwt: jwt.value, companyId: id })
  return company
} )

export const createCompanyAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const companyLogo = await ManagementCompanyLogosService.createCompanyLogo({ createCompanyLogoInput: {
    ...data,
    companyId: id,
  }, jwt: jwt.value })

  if ( 'errors' in companyLogo ) {
    return {
      success: false,
      errors: companyLogo.errors
    }
  }
  return { success: true, companyLogo }
}, zod$({ ...managementCreateCompanyLogoValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const getCompany = useGetCompany().value
  if ( 'errors' in getCompany ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createCompanyAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/companies" />
      <h1 class="create__title"> Upload new Logo </h1>
      <Form class="form" action={ action }>
        <FormField
          name="url"
          placeholder="Url"
          error={ action.value?.fieldErrors?.url?.join( ', ' ) }
          />
        <FormField
          name="alt"
          placeholder="Description"
          error={ action.value?.fieldErrors?.alt?.join( ', ' ) }
          />
        <button> Upload </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Logo uploaded successfully </span>
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
  title: 'Create Company Logo',
}
