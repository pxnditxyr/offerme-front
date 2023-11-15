import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCompaniesService, SubparametersService } from '~/services'
import { managementCreateCompanyValidationSchema } from '~/utils'

import { IGQLErrorResponse, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'
import { useModalStatus } from '~/hooks'


interface IGetSubparametersResponse {
  documentTypes: ISubparameter[] | IGQLErrorResponse
  companyTypes: ISubparameter[] | IGQLErrorResponse
} 

export const useGetSubparameters = routeLoader$<IGetSubparametersResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const documentTypes = await SubparametersService.findAllByParameterName({ parameterName: 'document type', status: true })
  const companyTypes = await SubparametersService.findAllByParameterName({ parameterName: 'company type', status: true })
  return { documentTypes, companyTypes }
} )

export const createCompanyAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const company = await ManagementCompaniesService.createCompany({ createCompanyInput: data, jwt: jwt.value })

  if ( 'errors' in company ) {
    return {
      success: false,
      errors: company.errors
    }
  }
  return { success: true, company }
}, zod$({ ...managementCreateCompanyValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { companyTypes, documentTypes } = useGetSubparameters().value
  if ( 'errors' in companyTypes || 'errors' in documentTypes ) return <UnexpectedErrorPage />

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
      <h1 class="create__title"> Create new Company </h1>
      <Form class="form" action={ action }>
        <FormField
          name="name"
          placeholder="Name"
          error={ action.value?.fieldErrors?.name?.join( ', ' ) }
          />
        <FormField
          name="description"
          placeholder="Description"
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          name="companyTypeId"
          type="select"
          options={ companyTypes }
          />
        <FormField
          name="documentTypeId"
          type="select"
          options={[
            { id: 'null', name: 'No Document' },
            ...documentTypes,
          ]}
          />
        <FormField
          name="documentNumber"
          placeholder="Document Number"
          error={ action.value?.fieldErrors?.documentNumber?.join( ', ' ) }
          />
        <FormField
          name="foundedAt"
          type="date"
          placeholder="Founded At"
          error={ action.value?.fieldErrors?.foundedAt?.join( ', ' ) }
          />
        <FormField
          name="email"
          placeholder="Email"
          error={ action.value?.fieldErrors?.email?.join( ', ' ) }
          />
        <FormField
          name="website"
          placeholder="Website"
          error={ action.value?.fieldErrors?.website?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Company { action.value.company?.name } created successfully </span>
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
  title: 'Create Company',
}
