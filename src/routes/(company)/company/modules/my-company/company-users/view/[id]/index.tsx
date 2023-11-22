import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { DocumentHead, Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'

import { BackButton, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import { ManagementCompanyUsersService, UsersManagementService } from '~/services'
import { IGQLErrorResponse, IManagementCompanyUser, IManagementUsersData } from '~/interfaces'
import { graphqlExceptionsHandler, isUUID } from '~/utils'

import styles from './view.styles.css?inline'

interface IUseGetDataResponse {
  companyUser: IManagementCompanyUser | IGQLErrorResponse
  user: IManagementUsersData | IGQLErrorResponse
}

export const useGetCompanyUserById = routeLoader$<IUseGetDataResponse>( async ({ params, cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/companies' )

  const companyUser = await ManagementCompanyUsersService.companyUser({ companyUserId: id, jwt: jwt.value })
  if ( 'errors' in companyUser ) throw redirect( 302, '/management/modules/companies' )
  try {
    const user = await UsersManagementService.getUserById( jwt.value, companyUser.userId )
    return {
      companyUser,
      user
    }
  } catch ( errors : any ) {
    return {
      companyUser,
      user: { errors: graphqlExceptionsHandler( errors ) }
    }
  }
  
} )

export const toggleStatusManagementCompanyUserAction = routeAction$( async ( _data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''
  const companyUser = await ManagementCompanyUsersService.toggleStatusCompanyUser({ toggleStatusCompanyUserId: id, jwt: jwt.value })

  if ( 'errors' in companyUser ) {
    return {
      success: false,
      errors: companyUser.errors
    }
  }
  return {
    success: true,
    companyUser
  }
} )

export default component$( () => {
  useStyles$( styles )

  const { companyUser, user } = useGetCompanyUserById().value
  console.log( companyUser, user )
  if ( 'errors' in companyUser || 'errors' in user ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()
  const action = toggleStatusManagementCompanyUserAction()

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
            { user.peopleInfo.name } { user.peopleInfo.paternalSurname } { user.peopleInfo.maternalSurname }
          </h1>
          <h3 class="view__info-item"> { user.email } </h3>
          <p class="view__image-item">
            <img src={ user.mainAvatar || '/icons/user-avatar.svg' } alt="avatar" />
          </p>
          <p class="view__info-item"> { user.role.name } </p>
        </section>
        <section class="view__container__card__footer">
          <h1 class="view__info-item"> Status </h1>
          <Form action={ action }>
            <button class={ `toggle-radius ${ ( companyUser.status ) ? 'is-activate' : 'is-deactivate' }` }></button>
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
  title: 'View Company User',
}
