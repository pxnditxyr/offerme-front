import { DocumentHead, Form, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCategoriesService } from '~/services'
import { isUUID, managementCreateCategoryImageValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'

import styles from './create.styles.css?inline'
import { ManagementCategoryImagesService } from '~/services'


export const useGetCategory = routeLoader$<IManagementCategory | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/categories' )

  const category = await ManagementCategoriesService.category({ jwt: jwt.value, categoryId: id })
  return category
} )

export const createCategoryAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const categoryImage = await ManagementCategoryImagesService.createCategoryImage({ createCategoryImageInput: {
    ...data,
    categoryId: id,
  }, jwt: jwt.value })

  if ( 'errors' in categoryImage ) {
    return {
      success: false,
      errors: categoryImage.errors
    }
  }
  return { success: true, categoryImage }
}, zod$({ ...managementCreateCategoryImageValidationSchema }) )

export default component$( () => {
  useStyles$( styles )

  const getCategory = useGetCategory().value
  if ( 'errors' in getCategory ) return ( <UnexpectedErrorPage /> )

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
          name="url"
          placeholder="Url"
          error={ action.value?.fieldErrors?.url?.join( ', ' ) }
          />
        <FormField
          name="alt"
          placeholder="Description"
          error={ action.value?.fieldErrors?.alt?.join( ', ' ) }
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Category created successfully </span>
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
  title: 'Create Category Image',
}
