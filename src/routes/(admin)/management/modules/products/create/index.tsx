import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCompaniesService, ManagementProductsService, SubparametersService } from '~/services'
import { managementCreateProductValidationSchema } from '~/utils'

import { IGQLErrorResponse, ISubparameter } from '~/interfaces'

import styles from './create.styles.css?inline'
import { useModalStatus } from '~/hooks'


interface IGetSubparametersResponse {
  companies: ISubparameter[] | IGQLErrorResponse
  productTypes: ISubparameter[] | IGQLErrorResponse
} 

export const useGetSubparameters = routeLoader$<IGetSubparametersResponse>( async ({ cookie, redirect, query }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = query.get( 'companyId' )

  let companies = await ManagementCompaniesService.companies({ jwt: jwt.value, status: true })
  const productTypes = await SubparametersService.findAllByParameterName({ parameterName: 'product type', status: true })

  if ( 'errors' in companies || 'errors' in productTypes ) return { companies, productTypes }

  if ( id ) companies = companies.filter( ( company ) => company.id === atob( id ) )

  return { companies, productTypes }
} )

export const createProductAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const product = await ManagementProductsService.createProduct({ createProductInput: data, jwt: jwt.value })

  if ( 'errors' in product ) {
    return {
      success: false,
      errors: product.errors
    }
  }
  return { success: true, product }
}, zod$({ ...managementCreateProductValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const { productTypes, companies } = useGetSubparameters().value
  if ( 'errors' in productTypes || 'errors' in companies ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createProductAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/products" />
      <h1 class="create__title"> Create new Product </h1>
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
          label="Product Type"
          name="productTypeId"
          type="select"
          options={ productTypes }
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
          label="Price of product(Bs.)"
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
                <span> Product { action.value.product?.name } created successfully </span>
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
  title: 'Create Product',
}
