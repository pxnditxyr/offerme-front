import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementCategoriesService } from '~/services'
import { managementCreateCategoryValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'

import styles from './update-index.styles.css?inline'
import { useModalStatus } from '~/hooks'


export const useGetCategories = routeLoader$<IManagementCategory[] | IGQLErrorResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const categories = await ManagementCategoriesService.categories({ jwt: jwt.value, status: true })
  return categories
} )

export const useGetCategoryById = routeLoader$<IManagementCategory | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const category = await ManagementCategoriesService.category({ categoryId: atob( params.id ), jwt: jwt.value })
  return category
} )

export const updateCategoryAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id )

  const category = await ManagementCategoriesService.updateCategory({ updateCategoryInput: { ...data, id }, jwt: jwt.value })

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

  const getCategoryById = useGetCategoryById().value
  if ( 'errors' in getCategoryById ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updateCategoryAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__index__container">
      <BackButton href="/management/modules/categories" />
      <h1 class="update__index__title"> Update new Category </h1>
      <Form class="form" action={ action }>
        <FormField
          name="name"
          placeholder="Name"
          value={ getCategoryById.name }
          error={ action.value?.fieldErrors?.name?.join( ', ' ) }
          />
        <FormField
          name="description"
          placeholder="Description"
          value={ getCategoryById.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          name="order"
          placeholder="Order"
          value={ String( getCategoryById.order ) }
          error={ action.value?.fieldErrors?.order?.join( ', ' ) }
          />
        <FormField
          name="parentId"
          placeholder="Parent"
          type="select"
          value={ getCategoryById.parent?.id || 'null' }
          options={ [
            { id: 'null', name: 'No Parent' },
            ...getCategories.map( ({ id, name }) => ( { id, name } ) )
          ] }
          />
        <button> Update </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Category { action.value.category?.name } updated successfully </span>
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
  title: 'Update Category',
}
