import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { Form, RequestEventLoader, routeAction$, routeLoader$, zod$ } from '@builder.io/qwik-city'

import { SubparametersService, UsersManagementService, ManagementRolesService, ManagementCompanyUsersService, AuthService } from '~/services'
import { graphqlExceptionsHandler, managementCreateUsersValidationSchema } from '~/utils'
import { IRole, IRouteLoaderError, ISubparameter } from '~/interfaces'
import { BackButton, FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'

import styles from './create.styles.css?inline'

interface ICreateUserSubparameters {
  documentTypes: ISubparameter[],
  genders: ISubparameter[]
  roles: ISubparameter[]
}

export const getSubparameters = routeLoader$<ICreateUserSubparameters | IRouteLoaderError>( async ( event : RequestEventLoader ) => {
  const { fail, cookie } = event

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  try {
    const documentTypes = await SubparametersService.findAllByParameterName({ parameterName: 'document type', status: true })
    const genders = await SubparametersService.findAllByParameterName({ parameterName: 'gender', status: true })
    const roles = await ManagementRolesService.findAll( jwt.value, true )
    const companyRoles = roles.filter( ( role : IRole ) => role.name === 'COMPANY_REPRESENTATIVE' || role.name === 'SELLER' )
    return { documentTypes, genders, roles: companyRoles }
  } catch ( error : any ) {
    console.error( error )
    const errors = graphqlExceptionsHandler( error )
    return  fail( 400, { errors } )
  }
} )

export const createUserAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  const currentUser = await AuthService.newRevalidateToken( jwt.value )
  if ( 'errors' in currentUser ) return fail( 401, { errors: 'Unauthorized' } )
  const currentCompany = await ManagementCompanyUsersService.companyByUserId({
    userId: currentUser.user.id,
    jwt: jwt.value
  })

  if ( 'errors' in currentCompany ) return fail( 401, { errors: 'Unauthorized' } )

  try {
    const newUser = await UsersManagementService.createUser( jwt.value, {
      ...data,
      documentTypeId: data.documentTypeId === 'null' ? null : data.documentTypeId,
      documentNumber: ( data.documentNumber === '' || data.documentTypeId === 'null' ) ? null : data.documentNumber,
    } )

    if ( 'errors' in newUser ) {
      return {
        success: false,
        errors: newUser.errors
      }
    }

    const companyUser = await ManagementCompanyUsersService.createCompanyUser({
      createCompanyUserInput: {
        userId: newUser.id,
        companyId: currentCompany.id
      },
      jwt: jwt.value
    })

    if ( 'errors' in companyUser ) {
      return {
        success: false,
        errors: companyUser.errors
      }
    }

    return { success: true, userEmail: data.email }
  } catch ( error : any ) {
    return {
      success: false,
      errors: graphqlExceptionsHandler( error )
    }
  }
}, zod$({ ...managementCreateUsersValidationSchema }) )

export default component$( () => {
  useStyles$( styles )
  const subparameters = getSubparameters()
  const action = createUserAction()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  if ( 'errors' in subparameters.value ) return ( <UnexpectedErrorPage /> )
  if ( 'errors' in action ) return ( <UnexpectedErrorPage /> )

  useTask$( ({ track }) => {
    track( () => action.isRunning )
    if ( action.value && action.value.success === false && action.value.errors ) onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )

  
  const { genders, documentTypes, roles } = subparameters.value

  return (
    <div class="create__user__container">
      <BackButton />
      <h1> Create New User </h1>
      <div class="form__container">
        <Form class="form" action={ action }>
          <FormField
            name="name"
            type="text"
            placeholder="Name"
            error={ action.value?.fieldErrors?.name?.join( ', ' ) }
            />
          <FormField
            name="paternalSurname"
            type="text"
            placeholder="Paternal Surname"
            error={ action.value?.fieldErrors?.paternalSurname?.join( ', ' ) }
            />
          <FormField
            name="maternalSurname"
            type="text"
            placeholder="Maternal Surname"
            error={ action.value?.fieldErrors?.maternalSurname?.join( ', ' ) }
            />
          <FormField
            name="email"
            type="text"
            placeholder="Email"
            error={ action.value?.fieldErrors?.email?.join( ', ' ) }
            />
          <FormField
            name="password"
            type="text"
            placeholder="Password"
            error={ action.value?.fieldErrors?.password?.join( ', ' ) }
            />
          <FormField
            name="documentTypeId"
            type="select"
            error={ action.value?.fieldErrors?.documentTypeId?.join( ', ' ) }
            options={ [
              { id: 'null', name: 'Not Specified' },
              ...documentTypes
            ] }
            />
          <FormField
            name="documentNumber"
            type="text"
            placeholder="Document Number"
            error={ action.value?.fieldErrors?.documentNumber?.join( ', ' ) }
            />
          <FormField
            name="genderId"
            type="select"
            options={ genders }
            />
          <FormField
            name="roleId"
            type="select"
            options={ roles }
            />
          <FormField
            name="birthdate"
            type="date"
            placeholder="Birthdate"
            value={ new Date().toISOString().split( 'T' )[0] }
            error={ action.value?.fieldErrors?.birthdate?.join( ', ' ) }
            />
          <button> Create </button>
        </Form>
        {
          ( modalStatus.value ) && (
            <Modal isOpen={ modalStatus.value } onClose={ onCloseModal } modalType={ `${ action.value?.success ? 'success' : 'error' }` } >
              {
                ( action.value?.success === true ) && (
                  <span> User { action.value?.userEmail } Created Successfully </span>
                )
              }
              {
                ( action.value?.success === false ) && (
                  <span> { JSON.stringify( action.value?.errors ) || 'Something went wrong' } </span>
                )
              }
            </Modal>
          )
        }
      </div>
    </div>
  )
} )
