import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { component$, useStyles$, useTask$ } from '@builder.io/qwik'

import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { ManagementCompaniesService, UsersManagementService } from '~/services'
import { graphqlExceptionsHandler, isUUID  } from '~/utils'

import { IGQLErrorResponse,  IManagementCompany, IManagementUsersData } from '~/interfaces'

import styles from './create.styles.css?inline'
import { ManagementCompanyUsersService } from '~/services/admin/management-company-users.service'

interface IUseGetDataResponse {
  company: IManagementCompany | IGQLErrorResponse
  users: IManagementUsersData[] | IGQLErrorResponse
}

export const useGetData = routeLoader$<IUseGetDataResponse>( async ({ cookie, redirect, params }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )

  const id = atob( params.id )
  if ( !isUUID( id ) ) throw redirect( 302, '/management/modules/companies' )

  const company = await ManagementCompaniesService.company({ jwt: jwt.value, companyId: id })
  if ( 'errors' in company ) throw redirect( 302, '/management/modules/companies' )

  try {
    const users = await UsersManagementService.getUsers( jwt.value )
    const companyUsers = users.filter( ( user ) => ( user.role.name === 'COMPANY_REPRESENTATIVE' ) || ( user.role.name === 'SELLER' ) )

    const usersThatAreNotInCompany = companyUsers.filter( ( user ) => !company.users.find( ( companyUser ) => ( companyUser.userId === user.id && companyUser.status ) ) )

    const activeUsers = usersThatAreNotInCompany.filter( ( user ) => user.status === true )
    return {
      company,
      users: activeUsers
    }
  } catch ( error : any ) {
    return {
      company,
      users: { errors: graphqlExceptionsHandler( error ) }
    }
  }
} )

export const createCompanyAction = routeAction$( async ( data, { cookie, fail, params } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const id = atob( params.id ) || ''

  const companyUser = await ManagementCompanyUsersService.createCompanyUser({ createCompanyUserInput: {
    companyId: id,
    userId: data.userId
  }, jwt: jwt.value })

  if ( 'errors' in companyUser ) {
    return {
      success: false,
      errors: companyUser.errors
    }
  }
  return { success: true, companyUser }
}, zod$({ userId: z.string().min( 10, 'User is required' ) }) )

export default component$( () => {
  useStyles$( styles )

  const { company, users } = useGetData().value
  if ( 'errors' in company || 'errors' in users ) return ( <UnexpectedErrorPage /> )

  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  const action = createCompanyAction()

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false )  onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  return (
    <div class="create__container">
      <BackButton href="/management/modules/companies" />
      <h1 class="create__title"> Create new Company </h1>
      <Form class="form" action={ action }>
        <FormField
          name="userId"
          type="select"
          options={[
            ...users.map( ( user ) => ({
              id: user.id,
              name: user.email
            }) )
          ]}
          />
        <button> Create </button>
      </Form>
      {
        ( modalStatus.value ) && (
          <Modal isOpen={ modalStatus.value } onClose={ onCloseModal }>
            {
              ( action.value?.success ) && (
                <span> Company created successfully </span>
              )
            }
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
} )

export const head : DocumentHead = {
  title: 'Create Company User',
}
