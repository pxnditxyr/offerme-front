import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

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

export const toggleStatusManagementCompanyLogoAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const companyLogo = await ManagementCompanyLogosService.toggleStatusCompanyLogo({ toggleStatusCompanyLogoId: id, jwt: jwt.value })

  if ( 'errors' in companyLogo ) {
    return {
      success: false,
      errors: companyLogo.errors
    }
  }
  return {
    success: true,
    companyLogo
  }
} )

export default component$( () => {
  useStyles$( styles )

  const companyLogo = useGetCompanyLogoById().value
  if ( 'errors' in companyLogo ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementCompanyLogoAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false ) onOpenModal()
  } )

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
        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( companyLogo.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
          </Form>
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
  title: 'View Categories',
}
