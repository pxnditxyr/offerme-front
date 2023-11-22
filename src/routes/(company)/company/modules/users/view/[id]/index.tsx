import { component$, useStyles$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { UnexpectedErrorPage, BackButton } from '~/components/shared'
import { IManagementUsersData, IRouteLoaderError } from '~/interfaces'
import { UsersManagementService } from '~/services'
import { graphqlExceptionsHandler, isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetManagementUser = routeLoader$<IManagementUsersData | IRouteLoaderError>( async ( { cookie, redirect, params, fail } ) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) redirect( 301, '/management/modules/users' )
  try {
    const token = cookie.get( 'jwt' )
    if ( !token ) return fail( 401, { errors: 'Unauthorized' } )
    const user = await UsersManagementService.getUserById( token.value, id )
    return user
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

export default component$( () => {
  useStyles$( styles )

  const user = useGetManagementUser().value

  if ( 'errors' in user ) return ( <UnexpectedErrorPage /> )

  return (
    <div class="view__container">
      <BackButton href="/management/modules/users" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="user__name">
            { user.peopleInfo.name } { user.peopleInfo.paternalSurname } { user.peopleInfo.maternalSurname }
          </h1>
          <p class="user__detail-item">
            { user.mainAvatar
                ? ( <img src={ user.mainAvatar } alt="avatar" /> )
                : ( <img src="/icons/user-avatar.svg" alt="avatar" /> )
            }
          </p>
        </section>
        <section class="view__container__card__info">
          <p class="user__info-item">Email: {user.email}</p>
          <p class="user__info-item">
            Is Verified Email: {user.isVerifiedEmail ? 'Yes' : 'No'}
          </p>
          <p class="user__info-item">Gender: {user.peopleInfo.gender.name}</p>
          <p class="user__info-item">
            Status: { user.status ? 'Active' : 'Inactive' }
          </p>
          <p class="user__info-item">Created At: {user.createdAt}</p>
          <p class="user__info-item">
            Created By: { user.creator?.email || user.email }
          </p>
          <p class="user__info-item">Updated At: {user.updatedAt}</p>
          <p class="user__info-item">
            Updated By: { user.updater?.email || 'No Updated' }
          </p>
          <p class="user__info-item">Role: { user.role.name }</p>
        </section>
        <section class="view__container__card__detail">
          <p class="user__detail-item">
            Main Phone: { user.mainPhone ? `${ user.mainPhone }` : 'No' }
          </p>
          <p class="user__detail-item">
            Main Address: { !user.mainAddress ? 'No addresses' :
              <div class="main-address">
                <p>Street: { user.mainAddress.street }</p>
                <p>Postal Code: { user.mainAddress.zipCode }</p>
                <p>City: { user.mainAddress.city }</p>
                <p>State: { user.mainAddress.state }</p>
                <p>Country: { user.mainAddress.country }</p>
              </div>
             }
          </p>
        </section>
        <section class="view__container__card__footer">
          <div class="user__avatars">
            <p>Avatars:</p>
            <div class="avatars__container">
              { user.avatars.length === 0 ? <p>No avatars</p> :
                user.avatars.map((avatar) => (
                  <article>
                    <section>
                      <img src={ avatar.url } alt="avatar" />
                    </section>
                  </article>
                ))
               }
            </div>
          </div>
          <div class="user__phones">
            <p>Phones:</p>
            <div class="phones__container">
              {user.phones.length === 0 ? <p>No phones</p> :
                user.phones.map((phone) => (
                  <article>
                    <section>
                      <p>{phone.number}</p>
                      <p>{phone.phoneType.name}</p>
                    </section>
                  </article>
                ))
              }
            </div>
          </div>
          <div class="user__addresses">
            <p>Addresses:</p>
            <div class="addresses__container">
              {user.addresses.length === 0 ? <p>No addresses</p> :
                user.addresses.map((address) => (
                  <article>
                    <section>
                      <p>Street: {address.street}</p>
                      <p>Postal Code: {address.zipCode}</p>
                      <p>City: {address.city}</p>
                      <p>State: {address.state}</p>
                      <p>Country: {address.country}</p>
                    </section>
                  </article>
                ))
              }
            </div>
          </div>
          <div class="user__credit-cards">
            <p>Credit Cards:</p>
            <div class="credit-cards__container">
              {user.creditCards.length === 0 ? <p>No credit cards</p> :
                user.creditCards.map((creditCard) => (
                  <article>
                    <section>
                      <p>Number: {creditCard.number}</p>
                      <p>
                        Expiration Date: {creditCard.expMonth}/{creditCard.expYear}
                      </p>
                      <p>Credit Card Type: {creditCard.creditCardType.name}</p>
                    </section>
                  </article>
                ))
              }
            </div>
          </div>
        </section>
      </article>
  </div>
  )
} )
