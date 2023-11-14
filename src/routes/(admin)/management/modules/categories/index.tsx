import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useManagementCategoriesStore, useModalStatus } from '~/hooks'
import { ManagementCategoriesService } from '~/services'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementCategory } from '~/interfaces'

import styles from './module.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementCategories = routeLoader$<IManagementCategory[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  
  const categories = await ManagementCategoriesService.categories({ search, jwt: jwt.value })
  return categories
} )

export default component$( () => {
  useStyles$( styles )

  const getManagementCategories = useGetManagementCategories().value
  if ( 'errors' in getManagementCategories ) return ( <UnexpectedErrorPage /> )

  const searchValue = useGetSearch().value
  const nav = useNavigate()

  const { token, status } = useAuthStore()
  const {
    categories, setCategories,
    isLoading, toggleStatusCategory,
    errors, setErrors,
    categoriesStore
  } = useManagementCategoriesStore()

  if ( isLoading || status === 'loading' ) return ( <LoadingPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  
  useTask$( () => {
    setCategories( getManagementCategories )
  } )

  const onEditClick = $( ( id : string ) => nav( `/management/modules/categories/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/management/modules/categories/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const response =  await ManagementCategoriesService.toggleStatusCategory({ toggleStatusCategoryId: id, jwt: token || '' })
    if ( 'errors' in response ) {
      setErrors( response.errors )
      return
    }
    toggleStatusCategory( id )
  } )

  useTask$( ({ track }) => {
    track( () => categoriesStore.errors )
    if ( categoriesStore.errors ) onOpenModal()
  } )

  const headers = [ 'Id', 'Name', 'Description', 'Order', 'Parent', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'name', 'description', 'order', 'parent', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedCategories = categories.map( ( category ) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    order: category.order,
    parent: category.parent?.name || 'No Parent',
    status: category.status,
    createdAt: parseDate( category.createdAt ),
    creator: category.creator?.email || '',
    updatedAt: parseDate( category.updatedAt ),
    updater: category.updater?.email || 'No Updated',
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/management/modules/categories?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    setErrors( null )
    onCloseModal()
  } )

  return (
    <div class="module__container">
      <h1 class="module__title"> Categories </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedCategories }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
      />
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ newOnCloseModal }>
            <span> { errors } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Categories',
}
