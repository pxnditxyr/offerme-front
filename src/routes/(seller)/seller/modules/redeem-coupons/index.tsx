import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { $, QwikSubmitEvent, component$, useSignal, useStyles$ } from '@builder.io/qwik'

import { FormField, LoadingPage, Modal, SearchBar, Table, UnexpectedErrorPage } from '~/components/shared'
import { useAuthStore, useModalStatus } from '~/hooks'
import { parseDate } from '~/utils'

import { IGQLErrorResponse, IManagementCodePromotionDiscountProduct } from '~/interfaces'
import { AuthService, ManagementCodePromotionDiscountProductsService, ManagementCompanyUsersService, ManagementDiscountProductsService, ManagementPromotionRequestsService } from '~/services'


import styles from './module.styles.css?inline'

export const useGetSearch = routeLoader$<string>( async ({ query }) => {
  const search = query.get( 'search' ) || ''
  return search
} )

export const useGetManagementPromotionRequests = routeLoader$<IManagementCodePromotionDiscountProduct[] | IGQLErrorResponse>( async ({ cookie, redirect, query }) => {
  const search = query.get( 'search' ) || ''
  const state = query.get( 'state' ) || ''

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) throw redirect( 302, '/signin' )
  const company = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  if ( 'errors' in company ) return company
  
  let coupons = await ManagementCodePromotionDiscountProductsService.findAll({ jwt: jwt.value, status: true, search })
  if ( 'errors' in coupons ) return coupons
  if ( coupons.length === 0 ) return coupons

  const discountProducts = await ManagementDiscountProductsService.findAll({ jwt: jwt.value, status: true })
  if ( 'errors' in discountProducts ) return discountProducts

  coupons = coupons.filter( ( coupon ) => discountProducts.find( ( discountProduct ) => discountProduct.id === coupon.discountProduct.id ) )


  if ( state === 'redeemed' ) {
    const redeemedCoupons = coupons.filter( ( coupon ) => coupon.isRedeemed )
    return redeemedCoupons
  }

  if ( state === 'pending' ) {
    const pendingCoupons = coupons.filter( ( coupon ) => !coupon.isRedeemed )
    return pendingCoupons
  }

  return coupons
} )

export default component$( () => {
  useStyles$( styles )

  const coupons = useGetManagementPromotionRequests().value

  if ( 'errors' in coupons ) return ( <UnexpectedErrorPage /> )
  const searchValue = useGetSearch().value

  const { status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()

  const onEditClick = $( ( id : string ) => nav( `/seller/modules/promotion-requests/update/${ btoa( id ) }` ) )
  const onViewClick = $( ( id : string ) => nav( `/seller/modules/promotions/code-promotion-discount-products/view/${ btoa( id ) }` ) )
  const onToggleStatus = $( ( _id : string ) => {} )

  const headers = [ 'Id', 'Code', 'Redeemed', 'Redeem At', 'Used', 'Used At', 'Status', 'Created At', 'Updated At' ]
  const keys = [ 'id', 'code', 'isRedeemed', 'redeemAt', 'isUsed', 'usedAt', 'status', 'createdAt', 'updatedAt' ]

  const formatedPromotionRequests = coupons.map( ( coupon ) => ({
    id: coupon.id,
    code: coupon.code,
    isRedeemed: coupon.isRedeemed,
    redeemAt: ( coupon.redeemedAt ) ? parseDate( coupon.redeemedAt ) : 'Not Redeemed',
    isUsed: coupon.isUsed,
    usedAt: ( coupon.usedAt ) ? parseDate( coupon.usedAt ) : 'Not Used',
    status: coupon.status,
    createdAt: parseDate( coupon.createdAt ),
    updatedAt: parseDate( coupon.updatedAt ),
  }) )

  const onSearchSubmit = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `?${ `search=${ target.search.value }` }` )
  } )
  
  const onSearchState = $( ( event : QwikSubmitEvent<HTMLFormElement> ) => {
    const { target } = event as any
    nav( `?${ `state=${ target.state.value }` }` )
  } )

  return (
    <div class="module__container">
      <h1 class="module__title"> Promotion Requests </h1>
      <SearchBar value={ searchValue } onSearchSubmit={ onSearchSubmit } />
      <form class="form__state__selector" onSubmit$={ onSearchState }>
        <FormField
          name="state"
          type="select"
          options={ [
            { id: '', name: 'All' },
            { id: 'pending', name: 'Pending' },
            { id: 'redeemed', name: 'Redeemed' },
          ] }
          />
        <button> Search </button>
      </form>
      <Table 
        header={ headers }
        keys={ keys }
        body={ formatedPromotionRequests }
        onEditClick={ onEditClick }
        onViewClick={ onViewClick }
        onToggleStatus={ onToggleStatus }
        canToggle={ false }
        canEdit={ false }
      />
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'Promotion Requests',
}
