import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCategoriesService } from '~/services'
import { managementCreateCategoryValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'

import styles from './create.styles.css?inline'
import { useModalStatus } from '~/hooks'


export const useGetCategories = routeLoader$<IManagementCategory[] | IGQLErrorResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const categories = await ManagementCategoriesService.categories({ jwt: jwt.value, status: true })
  return categories
} )

export const createCategoryAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const category = await ManagementCategoriesService.createCategory({ createCategoryInput: data, jwt: jwt.value })

  if ( 'errors' in category ) {
    return {
      success: false,
      errors: category.errors
    }
  }
  return { success: true, category }
}, zod$({ ...managementCreateCategoryValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const getCategories = useGetCategories().value
  if ( 'errors' in getCategories ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createCategoryAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/categories" />
      <h1 class="create__title"> Create new Category </h1>
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
          name="order"
          placeholder="Order"
          error={ action.value?.fieldErrors?.order?.join( ', ' ) }
          />
        <FormField
          name="parentId"
          placeholder="Parent"
          type="select"
          options={ [
            { id: 'null', name: 'No Parent' },
            ...getCategories.map( ({ id, name }) => ( { id, name } ) )
          ] }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Category { action.value.category?.name } created successfully </span>
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
  title: 'Create Category',
}
