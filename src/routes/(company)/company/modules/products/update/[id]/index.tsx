import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { AuthService, ManagementCompanyUsersService, ManagementProductsService, SubparametersService } from '~/services'
import { managementCreateProductValidationSchema } from '~/utils'

import { IGQLErrorResponse, IManagementProduct, ISubparameter } from '~/interfaces'

import styles from './update-index.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IGetSubparametersResponse {
  productTypes: ISubparameter[] | IGQLErrorResponse
}

export const useGetSubparameters = routeLoader$<IGetSubparametersResponse>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const productTypes = await SubparametersService.findAllByParameterName({ parameterName: 'product type', status: true })

  return {
    productTypes
  }
} )

export const useGetCurrentProduct = routeLoader$<IManagementProduct | IGQLErrorResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const product = await ManagementProductsService.product({ productId: atob( params.id ), jwt: jwt.value })
  return product
} )

export const updateProductAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id )
  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) return fail( 401, { errors: 'Unauthorized' } )
  const company = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  if ( 'errors' in company ) return fail( 401, { errors: 'Unauthorized' } )

  const product = await ManagementProductsService.updateProduct({ updateProductInput: { ...data, id }, jwt: jwt.value })

  if ( 'errors' in product ) {
    return {
      success: false,
      errors: product.errors
    }
  }
  return { success: true, product }
}, zod$({
  code: z.string().min( 2, 'Code must be at least 2 characters' ),
  description: z.string().min( 2, 'Description must be at least 2 characters' ),
  name: z.string().min( 2, 'Name must be at least 2 characters' ),
  notes: z.string().min( 2, 'Notes must be at least 2 characters' ),
  price: z.preprocess( ( value ) => parseFloat( z.string().parse( value ) ),
    z.number().min( 0, 'Price must be at least 0' ) ),
  productTypeId: z.string().min( 2, 'Product Type must be at least 2 characters' ),
  stock: z.preprocess( ( value ) => parseInt( z.string().parse( value ), 10 ),
    z.number().int().min( 0, 'Stock must be at least 0' ) )
}) )

export default component$( () => {
  useStyles$( styles )

  const { productTypes } = useGetSubparameters().value
  if ( 'errors' in productTypes ) return ( <UnexpectedErrorPage /> )

  const currentProduct = useGetCurrentProduct().value
  if ( 'errors' in currentProduct ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = updateProductAction()
  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="update__index__container">
      <BackButton href="/management/modules/products" />
      <h1 class="update__index__title"> Update Product </h1>
      <Form class="form" action={ action }>
        <FormField
          label="Name"
          name="name"
          placeholder="Name"
          value={ currentProduct.name }
          error={ action.value?.fieldErrors?.name?.join( ', ' ) }
          />
        <FormField
          label="Description"
          name="description"
          placeholder="Description"
          value={ currentProduct.description }
          error={ action.value?.fieldErrors?.description?.join( ', ' ) }
          />
        <FormField
          label="Code"
          name="code"
          placeholder="Code"
          value={ currentProduct.code }
          error={ action.value?.fieldErrors?.code?.join( ', ' ) }
          />
        <FormField
          label="Notes"
          name="notes"
          placeholder="Notes"
          value={ currentProduct.notes }
          error={ action.value?.fieldErrors?.notes?.join( ', ' ) }
          />
        <FormField
          label="Product Type"
          name="productTypeId"
          type="select"
          value={ currentProduct.productType.id }
          options={ productTypes }
          />
        <FormField
          label="Price of product(Bs.)"
          name="price"
          placeholder="Price"
          value={ String( currentProduct.price ) }
          error={ action.value?.fieldErrors?.price?.join( ', ' ) }
          />
        <FormField
          label="Stock"
          name="stock"
          placeholder="Stock"
          value={ String( currentProduct.stock ) }
          error={ action.value?.fieldErrors?.stock?.join( ', ' ) }
          />
        <button> Update </button>
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
  title: 'Update Product',
}
