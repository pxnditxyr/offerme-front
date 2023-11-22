import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementProduct } from '~/interfaces'
import { AuthService, ManagementCompanyUsersService, ManagementProductsService } from '~/services'


import styles from './module.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementProducts = routeLoader$<IManagementProduct[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) throw redirect( 302, '/signin' )
  const company = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  if ( 'errors' in company ) return company
  
  const products = await ManagementProductsService.products({ search, jwt: jwt.value })
  if ( 'errors' in products ) return products
  const companyProducts = products.filter( ( product ) => product.company.id === company.id )
  return companyProducts
} )

export default component$( () => {
  useStyles$( styles )

  const products = useGetManagementProducts().value

  if ( 'errors' in products ) return ( <UnexpectedErrorPage /> )
  const searchValue = useGetSearch().value

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const errors = useSignal<string | null>( null )
  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const onEditClick = $( ( id : string ) => nav( `/company/modules/products/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/company/modules/products/view/${ btoa( id ) }` ) )

  const onToggleStatus = $( async ( id : string ) => {
    const product =  await ManagementProductsService.toggleStatusProduct({ toggleStatusProductId: id, jwt: token || '' })
    if ( 'errors' in product ) {
      errors.value = product.errors
      onOpenModal()
      return
    }
    nav()
  } )

  const headers = [ 'Id', 'Name', 'Description', 'Stock', 'Price', 'Code', 'Status', 'Created At', 'Creator', 'Updated At', 'Updater' ]
  const keys = [ 'id', 'name', 'description', 'stock', 'price', 'code', 'status', 'createdAt', 'creator', 'updatedAt', 'updater' ]

  const formatedProducts = products.map( ( product ) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    stock: product.stock,
    price: product.price,
    code: product.code,
    status: product.status,
    createdAt: parseDate( product.createdAt ),
    creator: product.creator?.email || '',
    updatedAt: parseDate( product.updatedAt ),
    updater: product.updater?.email || 'No Updated',
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `/company/modules/products?${ `search=${ target.search.value }` }` )
  } )

  const newOnCloseModal = $( () => {
    onCloseModal()
  } )

  return (
    <div class="module__container">
      <h1 class="module__title"> Products </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedProducts }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
      />
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ newOnCloseModal }>
            <span> { `${ errors.value  }`} </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Products',
}
