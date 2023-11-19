import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCompaniesService, SubparametersService } from '~/services'
import { managementCreateCompanyValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementCompany, ISubparameter } from '~/interfaces'

import styles from './update-index.styles.css?inline'
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

export const useGetCurrentCompany = routeLoader$<IManagementCompany | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const company = await ManagementCompaniesService.company({ companyId: atob( params.id ), jwt: jwt.value })
  return company
} )

export const updateCompanyAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id )

  const company = await ManagementCompaniesService.updateCompany({ updateCompanyInput: { ...data, id }, jwt: jwt.value })

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

  const { documentTypes, companyTypes } = useGetSubparameters().value
  if ( 'errors' in documentTypes || 'errors' in companyTypes ) return ( <UnexpectedErrorPage /> )

  const currentCompany = useGetCurrentCompany().value
  if ( 'errors' in currentCompany ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updateCompanyAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__index__container">
      <BackButton href="/management/modules/companies" />
      <h1 class="update__index__title"> Update Company </h1>
      <Form class="form" action={ action }>
        <FormField
          name="name"
          placeholder="Name"
          value={ currentCompany.name }
          error={ action.value?.fieldErrors?.name?.join( ', ' ) }
          />
        <FormField
          name="description"
          placeholder="Description"
          value={ currentCompany.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          name="companyTypeId"
          type="select"
          options={ companyTypes }
          value={ currentCompany.companyType?.id }
          />
        <FormField
          name="documentTypeId"
          type="select"
          options={[
            { id: 'null', name: 'No Document' },
            ...documentTypes,
          ]}
          value={ currentCompany.documentType?.id }
          />
        <FormField
          name="documentNumber"
          placeholder="Document Number"
          value={ currentCompany.documentNumber }
          error={ action.value?.fieldErrors?.documentNumber?.join( ', ' ) }
          />
        <FormField
          name="foundedAt"
          placeholder="Founded At"
          type="date"
          value={ currentCompany.foundedAt }
          error={ action.value?.fieldErrors?.foundedAt?.join( ', ' ) }
          />
        <FormField
          name="email"
          placeholder="Email"
          value={ currentCompany.email }
          error={ action.value?.fieldErrors?.email?.join( ', ' ) }
          />
        <FormField
          name="website"
          placeholder="Website"
          value={ currentCompany.website }
          error={ action.value?.fieldErrors?.website?.join( ', ' ) }
          />
        <button> Update </button>
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
  title: 'Update Company',
}
