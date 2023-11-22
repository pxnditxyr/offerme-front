import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCategoriesService, ManagementProductCategoriesService, ManagementProductsService } from '~/services'
import { isUUID  } from '~/utils'

import { IGQLErrorResponse,  IManagementCategory,  IManagementProduct } from '~/interfaces'

import styles from './create.styles.css?inline'

interface IUseGetDataResponse {
  product: IManagementProduct | IGQLErrorResponse
  categories: IManagementCategory[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IUseGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/products' )

  const product = await ManagementProductsService.product({ jwt: jwt.value, productId: id })
  let categories = await ManagementCategoriesService.categories({ jwt: jwt.value, status: true })
  
  if ( 'errors' in product ) {
    return {
      product,
      categories: { errors: 'Product not found' }
    }
  }

  if ( !( 'errors' in categories ) ) {
    categories = [
      ...categories.filter( ( category ) =>
        !( product.categories.map( ( category ) =>
          category.categoryId ).includes( category.id ) ) ),
    ]
  }

  return {
    product,
    categories
  }
} )

export const createProductAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const productCategory = await ManagementProductCategoriesService.createProductCategory({
    createProductCategoryInput: {
      categoryId: data.categoryId,
      productId: id
    },
    jwt: jwt.value
  })

  if ( 'errors' in productCategory ) {
    return {
      success: false,
      errors: productCategory.errors
    }
  }
  return { success: true, productCategory }
}, zod$({ categoryId: z.string().min( 10, 'User is required' ) }) )

export default component$( () => {
  useStyles$( styles )

  const { product, categories } = useGetData().value
  if ( 'errors' in product || 'errors' in categories ) return ( <UnexpectedErrorPage /> )

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
          name="categoryId"
          type="select"
          options={[
            ...categories.map( ( category ) => ({
              id: category.id,
              name: category.name
            }) )
          ]}
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Product created successfully </span>
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
  title: 'Create Product User',
}
