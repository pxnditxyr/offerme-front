import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementCompany } from '~/interfaces'
import { AuthService, ManagementCompanyUsersService } from '~/services'

import styles from './view.styles.css?inline'

interface IUseGetDataResponse {
  company: IManagementCompany | IGQLErrorResponse
}

export const useGetData = routeLoader$<IUseGetDataResponse>( async ({ cookie, redirect }) => {

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in authResponse ) return {
    company: authResponse,
    users: authResponse,
  }

  const company = await ManagementCompanyUsersService.companyByUserId({ userId: authResponse.user.id, jwt: jwt.value })
  return { company }
} )


export default component$( () => {
  useStyles$( styles )

  const { company } = useGetData().value
  if ( 'errors' in company ) return ( <UnexpectedErrorPage /> )

  const nav = useNavigate()

  const onImageClick = $( ( id : string ) => {
    nav( `/seller/modules/my-company/company-logos/view/${ btoa( id ) }` )
  } )

  const onProductClick = $( ( id : string ) => {
    nav( `/seller/modules/products/view/${ btoa( id ) }` )
  } )

  const onPromotionClick = $( ( id : string ) => {
    nav( `/seller/modules/promotions/view/${ btoa( id ) }` )
  } )

  return (
    <div class="view__container">
      <BackButton href="/seller/modules/my-company" />
      <div class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { company.name }
          </h1>
          <p class="view__image-item">
            <img src={ ( company.logos.find( ( image ) => image.status ) )
                ? company.logos.find( ( image ) => image.status )?.url
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
        </section>
      </div>
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'View Companies',
}
