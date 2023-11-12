import { $, component$, useStyles$ } from '@builder.io/qwik'
import { Link, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { UnexpectedErrorPage } from '~/components/shared'
import { IManagementUsersData, IRouteLoaderError } from '~/interfaces'
import { UsersManagementService } from '~/services'
import { graphqlExceptionsHandler, isUUID, parseDate } from '~/utils'

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
  const nav = useNavigate()

  if ( 'errors' in user ) return ( <UnexpectedErrorPage /> )

  const onEditClick = $( () => {
    const base64Id = btoa( user.id )
    nav( `/management/modules/users/update/${ base64Id }` )
  } )

  const onDeleteClick = $( () => {
    console.log( 'delete' )
  } )

  return (
    <div class="view__container">
      <Link href="/management/modules/users">
        Back
      </Link>
      <article class="card">
        <section class="card__header">
          <div>
            <h1> { user.peopleInfo.name } { user.peopleInfo.paternalSurname } { user.peopleInfo.maternalSurname } </h1>
            <h3> Email: <span> { user.email } </span> </h3>
            <h3> Gender: <span> { user.peopleInfo.gender.name } </span> </h3>
            <h3> Is Verified Email: <span> { `${ user.isVerifiedEmail ? 'Yes' : 'No' }` } </span> </h3>
          </div>
          <div>
            {
              ( ( user.avatars as [] ).length === 0 ) ? (
                <img src="https://via.placeholder.com/150" alt="avatar" />
              ) : (
                <img src={ user.avatars[0].url } alt="avatar" />
              )
            }
          </div>
        </section>
        <section class="card__body">
          <div>
            <h3> Status: <span> { `${ user.status ? 'Active' : 'Inactive' }` } </span> </h3>
            <h3> Created At: <span> { parseDate( user.createdAt ) } </span> </h3>
            <h3> Created By: <span> { ( user.creator ) ? user.creator?.email : user.email } </span> </h3>
            <h3> Updated At: <span> { parseDate( user.updatedAt ) } </span> </h3>
            <h3> Updated By: <span> { ( user.updater ) ? user.updater?.email : 'No Updated' } </span> </h3>
          </div>
          <div>
            <h3> Role: <span> { user.role.name } </span> </h3>
          </div>
        </section>
        <section class="card__footer">
          <div>
            <button
              onClick$={ onEditClick }
            > Edit </button>
            <button
              onClick$={ onDeleteClick }
            > Deactivate </button>
          </div>
        </section>
      </article>
      {/* <h1> { user.peopleInfo.name } { user.peopleInfo.paternalSurname } { user.peopleInfo.maternalSurname } </h1> */}
      {/* <p> Email: { user.email } </p> */}
      {/* <p> Is Verified Email: { ( user.isVerifiedEmail ) ? 'Yes' : 'No' } </p> */}
      {/* <p> Gender: { user.peopleInfo.gender.name } </p> */}
      {/* <p> Status: { ( user.status ) ? 'Active' : 'Inactive' } </p> */}
      {/* <p> Created At: { user.createdAt } </p> */}
      {/* <p> Created By: { user.creator?.email || user.email } </p> */}
      {/* <p> Updated At: { user.updatedAt } </p> */}
      {/* <p> Updated By: { user.updater?.email || 'No Updated' } </p> */}
      {/* <p> Role: { user.role.name } </p> */}
      {/* <p> Main Avatar: { ( user.mainAvatar ) ? ( */}
      {/*   <img src={ user.mainAvatar } alt="avatar" /> */}
      {/* ) : 'No' } </p> */}
      {/* <p> Main Phone: { ( user.mainPhone ) ? `${ user.mainPhone }` : 'No' } </p> */}
      {/* <p> Main Address: { ( !user.mainAddress ) ? 'No addresses' : ( */}
      {/*   <div> */}
      {/*     <p> Street: { user.mainAddress.street } </p> */}
      {/*     <p> Postal Code: { user.mainAddress.zipCode } </p> */}
      {/*     <p> City: { user.mainAddress.city } </p> */}
      {/*     <p> State: { user.mainAddress.state } </p> */}
      {/*     <p> Country: { user.mainAddress.country } </p> */}
      {/*   </div> */}
      {/* ) } </p> */}
      {/* <p> Avatars: </p> */}
      {/* <div class="avatars__container"> */}
      {/*   { */}
      {/*     user.avatars.length === 0 && ( */}
      {/*       <p> No avatars </p> */}
      {/*     ) */}
      {/*   } */}
      {/*   { */}
      {/*     user.avatars.map( ( avatar ) => ( */}
      {/*       <article> */}
      {/*         <section> */}
      {/*           <img src={ avatar.url } alt="avatar" /> */}
      {/*         </section> */}
      {/*       </article> */}
      {/*     ) ) */}
      {/*   } */}
      {/* </div> */}
      {/* <p> Phones: </p> */}
      {/* <div class="phones__container"> */}
      {/*   { */}
      {/*     user.phones.length === 0 && ( */}
      {/*       <p> No phones </p> */}
      {/*     ) */}
      {/*   } */}
      {/*   { */}
      {/*     user.phones.map( ( phone ) => ( */}
      {/*       <article> */}
      {/*         <section> */}
      {/*           <p> { phone.number } </p> */}
      {/*           <p> { phone.phoneType.name } </p> */}
      {/*         </section> */}
      {/*       </article> */}
      {/*     ) ) */}
      {/*   } */}
      {/* </div> */}
      {/* <p> Addresses: </p> */}
      {/* <div class="addresses__container"> */}
      {/*   { */}
      {/*     user.addresses.length === 0 && ( */}
      {/*       <p> No addresses </p> */}
      {/*     ) */}
      {/*   } */}
      {/*   { */}
      {/*     user.addresses.map( ( address ) => ( */}
      {/*       <article> */}
      {/*         <section> */}
      {/*           <p> Street: { address.street } </p> */}
      {/*           <p> Postal Code: { address.zipCode } </p> */}
      {/*           <p> City: { address.city } </p> */}
      {/*           <p> State: { address.state } </p> */}
      {/*           <p> Country: { address.country } </p> */}
      {/*         </section> */}
      {/*       </article> */}
      {/*     ) ) */}
      {/*   } */}
      {/* </div> */}
      {/* <p> Credit Cards: </p> */}
      {/* <div class="credit-cards__container"> */}
      {/*   { */}
      {/*     user.creditCards.length === 0 && ( */}
      {/*       <p> No credit cards </p> */}
      {/*     ) */}
      {/*   } */}
      {/*   { */}
      {/*     user.creditCards.map( ( creditCard ) => ( */}
      {/*       <article> */}
      {/*         <section> */}
      {/*           <p> Number: { creditCard.number } </p> */}
      {/*           <p> Expiration Date: { creditCard.expMonth }/{ creditCard.expYear } </p> */}
      {/*           <p> Credit Card Type: { creditCard.creditCardType.name } </p> */}
      {/*         </section> */}
      {/*       </article> */}
      {/*     ) ) */}
      {/*   } */}
      {/* </div> */}
    </div>
  )
} )
