import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BackButton, LoadingPage, Modal, UnexpectedErrorPage } from '~/components/shared'
import { IGQLErrorResponse, IManagementCompany, IManagementUsersData } from '~/interfaces'
import { AuthService, ManagementCompaniesService, ManagementCompanyUsersService, UsersManagementService } from '~/services'
import { graphqlExceptionsHandler } from '~/utils'

import styles from './view.styles.css?inline'
import { useAuthStore, useModalStatus } from '~/hooks'

interface IUseGetDataResponse {
  company: IManagementCompany | IGQLErrorResponse
  users: IManagementUsersData[] | IGQLErrorResponse
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
  if ( 'errors' in company ) {
    return {
      company,
      users: company,
    }
  }

  try {
    const allUsers = await UsersManagementService.getUsers( jwt.value )
    const companyUsers = allUsers.filter( ( user ) => company.users.find( ( companyUser ) => companyUser.userId === user.id ) )
    return {
      company,
      users: companyUsers
    }
  } catch ( error : any ) {
    return {
      company,
      users: {
        errors: graphqlExceptionsHandler( error ),
      }
    }
  }
} )


export default component$( () => {
  useStyles$( styles )

  const { users, company } = useGetData().value
  if ( 'errors' in company || 'errors' in users ) return ( <UnexpectedErrorPage /> )

  const { token, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  const nav = useNavigate()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const errors = useSignal<string | null>( null )

  const onImageClick = $( ( id : string ) => {
    nav( `/company/modules/my-company/company-logos/view/${ btoa( id ) }` )
  } )

  const onUserClick = $( ( id : string ) => {
    nav( `/company/modules/my-company/company-users/view/${ btoa( id ) }` )
  } )

  const onProductClick = $( ( id : string ) => {
    nav( `/company/modules/products/view/${ btoa( id ) }` )
  } )

  const onPromotionClick = $( ( id : string ) => {
    nav( `/company/modules/promotions/view/${ btoa( id ) }` )
  } )

  const onPromotionRequestClick = $( ( id : string ) => {
    nav( `/company/modules/promotion-requests/view/${ btoa( id ) }` )
  } )

  const onEditClick = $( ( id : string ) => {
    nav( `/company/modules/my-company/update/${ btoa( id ) }` )
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
      <BackButton href="/company/modules/my-company" />
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
            href={ `/company/modules/my-company/company-logos/create/${ btoa( company.id ) }` }
            class="view__link"
          > Add Image </Link>
          
          <div class="view__images">
            <p> Users </p>
            <div class="view__gallery">
              { company.users.map( ( user ) => (
                  ( user.status )
                    ? (
                      <article
                        class="view__gallery__card"
                        key={ user.id } onClick$={ () => onUserClick( user.id ) }
                      >
                        <section>
                          <p> Email: </p>
                          <p> { users.find( ( fullUser ) => fullUser.id === user.userId )?.email } </p>
                          <p> Role: </p>
                          <p> { users.find( ( fullUser ) => fullUser.id === user.userId )?.role.name } </p>
                        </section>
                      </article>
                    )
                    : ( <></> )
                ))
              }
              {
                company.users.length === 0 && ( <p> No Users </p> )
              }
            </div>
          </div>
          <Link
            href={ `/company/modules/users/create/` }
            class="view__link"
          > Create Users </Link>

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
            href={ `/company/modules/products/create` }
            class="view__link"
          > Add Product </Link>

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
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            <span> { errors.value } </span>
          </Modal>
        )
      }
    </div>
  )
} )

export const head : DocumentHead = {
  title: 'View Companies',
}
