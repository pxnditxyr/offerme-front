import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementCompany } from '~/interfaces'
import { ManagementCompaniesService } from '~/services'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'
import { useAuthStore, useModalStatus } from '~/hooks'

export const useGetCompanyById = routeLoader$<IManagementCompany | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/companies' )

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const company = await ManagementCompaniesService.company({ companyId: id, jwt: jwt.value })
  return company
} )

export default component$( () => {
  useStyles$( styles )

  const company = useGetCompanyById().value
  if ( 'errors' in company ) return ( <UnexpectedErrorPage /> )
  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const errors = useSignal<string | null>( null )

  const onImageClick = $( ( id : string ) => {
    nav( `/management/modules/companies/company-images/view/${ btoa( id ) }` )
  } )

  const onProductClick = $( ( id : string ) => {
    nav( `/management/modules/products/view/${ btoa( id ) }` )
  } )

  const onPromotionClick = $( ( id : string ) => {
    nav( `/management/modules/promotions/view/${ btoa( id ) }` )
  } )

  const onPromotionRequestClick = $( ( id : string ) => {
    nav( `/management/modules/promotion-requests/view/${ btoa( id ) }` )
  } )

  const onEditClick = $( ( id : string ) => {
    nav( `/management/modules/companies/update/${ btoa( id ) }` )
  } )

  const onToggleStatus = $( async ( id : string ) => {
    const company =  await ManagementCompaniesService.toggleStatusCompany({ toggleStatusCompanyId: id, jwt: token || '' })
    if ( 'errors' in company ) {
      errors.value = company.errors
      onOpenModal()
      return
    }
    nav()
  } )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/companies" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { company.name }
          </h1>
          <p class="view__image-item">
            <img src={ ( company.logos.find( ( image ) => image.status ) )
                ? company.logos[ 0 ].url
                : '/images/fallback-image.png'
            } alt={ company.name } />
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="view__info-item"> Description: { company.description } </p>
          <p class="view__info-item"> Company Type: { company.companyType.name } </p>
          <p class="view__info-item"> Document Type: { company.documentType?.name || 'No Document Type' } </p>
          <p class="view__info-item"> Document Number: { company.documentNumber || 'No Document Number' } </p>
          <p class="view__info-item"> Website: { company.website || 'No Website' } </p>
          <p class="view__info-item"> Email: { company.email || 'No Email' } </p>
          <p class="view__info-item"> Founded At: { company.foundedAt } </p>
          <p class="view__info-item">
            Status: { company.status ? 'Active' : 'Inactive' }
          </p>
          <p class="view__info-item"> Created At: { company.createdAt } </p>
          <p class="view__info-item">
            Created By: { company.creator?.email || 'No Creator' }
          </p>
          <p class="view__info-item"> Updated At: { company.updatedAt } </p>
          <p class="view__info-item">
            Updated By: { company.updater?.email || 'No Updated' }
          </p>
        </section>
        <section class="view__container__card__actions">
          <button class="edit__button" onClick$={ () => onEditClick( company.id ) }> Edit </button>
          <button class={ `toggle-radius ${ company.status ? 'is-activate' : 'is-deactivate' }` } onClick$={ () => onToggleStatus( company.id ) }></button>
        </section>
        <section class="view__container__card__footer">
          <div class="view__images">
            <p> Images </p>
            <div class="view__gallery">
              { company.logos.map( ( image ) => (
                  <article key={ image.id } onClick$={ () => onImageClick( image.id ) } >
                    <section>
                      <img src={ image.url } alt={ image.alt } />
                    </section>
                  </article>
                ))
              }
              {
                company.logos.length === 0 && ( <p> No Images </p> )
              }
            </div>
          </div>
          <Link
            href={ `/management/modules/companies/company-logos/create/${ btoa( company.id ) }` }
            class="view__link"
          > Add Image </Link>
          <div class="view__images">
            <p> Products </p>
            <div class="view__gallery">
              { company.products.map( ( product ) => (
                  <article key={ product.id } onClick$={ () => onProductClick( product.id ) } >
                    <section>
                      <p> { product.name } </p>
                      <p> { product.description } </p>
                      <p> { product.price } </p>
                    </section>
                  </article>
                ))
              }
              {
                company.products.length === 0 && ( <p> No Products </p> )
              }
            </div>
          </div>
          <Link
            href={ `/management/modules/products/create?companyId=${ btoa( company.id ) }` }
            class="view__link"
          > Add Product </Link>

          <div class="view__images">
            <p> Promotions </p>
            <div class="view__gallery">
              { company.promotions.map( ( promotion ) => (
                <article key={ promotion.id } onClick$={ () => onPromotionClick( promotion.id ) } >
                  <section>
                    <p> { promotion.title } </p>
                    <p> { promotion.description } </p>
                    <p> { promotion.promotionStartAt } </p>
                    <p> { promotion.promotionEndAt } </p>
                    <p> { promotion.status } </p>
                  </section>
                </article>
              ))
              }
              {
                company.promotions.length === 0 && ( <p> No Promotions </p> )
              }
            </div>
          </div>
          <Link
            href={ `/management/modules/promotions/create?companyId=${ btoa( company.id ) }` }
            class="view__link"
          > Add Promotion </Link>

          <div class="view__images">
            <p> Promotion Requests </p>
            <div class="view__gallery">
              { company.promotionRequests.map( ( promotionRequest ) => (
                <article key={ promotionRequest.id } onClick$={ () => onPromotionRequestClick( promotionRequest.id ) } >
                  <section>
                    <p> { promotionRequest.title } </p>
                    <p> { promotionRequest.description } </p>
                    <p> { promotionRequest.promotionStartAt } </p>
                    <p> { promotionRequest.promotionEndAt } </p>
                    <p> { promotionRequest.status } </p>
                  </section>
                </article>
              ))
              }
              {
                company.promotionRequests.length === 0 && ( <p> No Promotion Requests </p> )
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Companies',
}
