import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, Link, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'

import { graphqlExceptionsHandler, isUUID } from '~/utils'

import { ManagementCategoriesService, ManagementProductCategoriesService } from '~/services'
import { IGQLErrorResponse, IManagementCategory, IManagementProductCategory } from '~/interfaces'

import styles from './view.styles.css?inline'
import { useModalStatus } from '~/hooks'

interface IUseGetDataResponse {
  productCategory: IManagementProductCategory | IGQLErrorResponse
  category: IManagementCategory | IGQLErrorResponse
}

export const useGetProductCategoryById = routeLoader$<IUseGetDataResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) {
    return {
      productCategory: { errors: 'Product Category not found' },
      category: { errors: 'Product Category not found' }
    }
  }

  const productCategory = await ManagementProductCategoriesService.productCategory({ productCategoryId: id, jwt: jwt.value })
  if ( 'errors' in productCategory ) {
    return {
      productCategory,
      category: { errors: 'Product Category not found' }
    }
  }
  try {
    const category = await ManagementCategoriesService.category({ categoryId: productCategory.categoryId, jwt: jwt.value })
    return {
      productCategory,
      category
    }
  } catch ( errors : any ) {
    return {
      productCategory,
      category: { errors: graphqlExceptionsHandler( errors ) }
    }
  }
  
} )

export const toggleStatusManagementProductCategoryAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const productCategory = await ManagementProductCategoriesService.toggleStatusProductCategory({ toggleStatusProductCategoryId: id, jwt: jwt.value })

  if ( 'errors' in productCategory ) {
    return {
      success: false,
      errors: productCategory.errors
    }
  }
  return {
    success: true,
    productCategory
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { productCategory, category } = useGetProductCategoryById().value
  if ( 'errors' in productCategory || 'errors' in category ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementProductCategoryAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/products" />
       <article class="view__container__card">
         <section class="view__container__card__header">
           <h1 class="view__name">
             Name: { category.name }
           </h1>
           <h3 class="view__info-item"> Order: { category.order } </h3>
           <p class="view__image-item">
             <img src={ category.images[ 0 ]?.url || '/images/fallback-image.png' } alt="avatar" />
           </p>
         </section>
         <section class="view__container__card__footer">
           <h1 class="view__info-item"> Status </h1>
           <Form action={ action }>
             <button class={ `toggle-radius ${ ( productCategory.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
           </Form>
         </section>
         <section class="view__container__card__footer">
          <Link href={ `/management/modules/categories/view/${ btoa( category.id ) }` } class="button__view">
            View Category
          </Link>
         </section>
       </article>
       {
         ( modalStatus.value ) && (
           <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
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
}  )

export const head : DocumentHead = {
  title: 'View Product Category',
}
