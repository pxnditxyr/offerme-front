import { component$, useStyles$ } from '@builder.io/qwik'
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, UnexpectedErrorPage } from '~/components/shared'

import { ManagementCompanyLogosService } from '~/services'
import { IGQLErrorResponse, IManagementCompanyLogo } from '~/interfaces'
import { isUUID } from '~/utils'

import styles from './view.styles.css?inline'

export const useGetCompanyLogoById = routeLoader$<IManagementCompanyLogo | IGQLErrorResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/companies' )

  const companyLogo = await ManagementCompanyLogosService.companyLogo({ companyLogoId: id, jwt: jwt.value })
  return companyLogo
} )

export default component$( () => {
  useStyles$( styles )

  const companyLogo = useGetCompanyLogoById().value
  if ( 'errors' in companyLogo ) return ( <UnexpectedErrorPage /> )


  return (
    <div class="view__container">
      <BackButton href="/management/modules/companies" />
      <article class="view__container__card">
        <section class="view__container__card__header">
          <h1 class="view__name">
            { companyLogo.alt }
          </h1>
          <p class="view__image-item">
            <img src={ companyLogo.url } alt={ companyLogo.alt } />
          </p>
        </section>
      </article>
    </div>
  )
}  )

export const head : DocumentHead = {
  title: 'View Categories',
}
