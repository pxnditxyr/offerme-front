import { component$, useStyles$, useTask$ } from '@builder.io/qwik'
import { Form, RequestEventLoader, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'

import styles from './create.styles.css?inline'
import { SubparametersService, UsersManagementService } from '~/services'
import { graphqlExceptionsHandler } from '~/utils'
import { IRouteLoaderError, ISubparameter } from '~/interfaces'
import { FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { ManagementRolesService } from '~/services/admin/roles.service'
import { useModalStatus } from '~/hooks'

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
    const documentTypes = await SubparametersService.findAllByParameterName( 'document type' )
    const genders = await SubparametersService.findAllByParameterName( 'gender' )
    const roles = await ManagementRolesService.findAll( jwt.value, true )
    return { documentTypes, genders, roles }
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return  fail( 400, { errors } )
  }
} )

export const createUserAction = routeAction$( async ( data, { cookie, fail } ) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )

  try {
    const user = await UsersManagementService.createUser( jwt.value, {
      ...data,
      documentTypeId: data.documentTypeId === 'null' ? null : data.documentTypeId,
      documentNumber: ( data.documentNumber === '' || data.documentTypeId === 'null' ) ? null : data.documentNumber,
    } )
    console.log( user )
    return { success: true, user: data.email }
  } catch ( error : any ) {
    return {
      success: false,
      errors: graphqlExceptionsHandler( error )
    }
  }
}, zod$({
  name: z.string().min( 1, 'Name is required' ),
  paternalSurname: z.string().min( 1, 'Paternal Surname is required' ),
  maternalSurname: z.string().min( 1, 'Maternal Surname is required' ),
  email: z.string().email( 'Invalid email' ),
  password: z.string().min( 8, 'Password must be at least 8 characters long' ),
  documentTypeId: z.string().min( 1, 'Document Type is required, or select "Not Specified"' ),
  genderId: z.string().min( 1, 'Gender is required' ),
  birthdate: z.string().min( 1, 'Birthdate is required' ),
  roleId: z.string().min( 1, 'Role is required' ),
  documentNumber: z.string()
}) )

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
    <>
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
          <select name="documentTypeId">
            <option value="null">Not Specified</option>
            {
              documentTypes.map( ( { id, name } ) => (
                <option value={ id }>{ name }</option>
              ) )
            }
          </select>
          <FormField
            name="documentNumber"
            type="text"
            placeholder="Document Number"
            error={ action.value?.fieldErrors?.documentNumber?.join( ', ' ) }
            />
          <select name="genderId">
            {
              genders.map( ( { id, name } ) => (
                <option value={ id }>{ name }</option>
              ) ) 
            }
          </select>
          <select name="roleId">
            {
              roles.map( ( { id, name } ) => (
                <option value={ id }>{ name }</option>
              ) )
            }
          </select>
          <FormField
            name="birthdate"
            type="date"
            placeholder="Birthdate"
            error={ action.value?.fieldErrors?.birthdate?.join( ', ' ) }
            />
          <button> Create </button>
        </Form>
        {
          ( modalStatus.value ) && (
            <Modal isOpen={ modalStatus.value } onClose={ onCloseModal } modalType={ `${ action.value?.success ? 'success' : 'error' }` } >
              {
                ( action.value?.success === true ) && (
                  <span> User { action.value?.user } Created Successfully </span>
                )
              }
              {
                ( action.value?.success === false ) && (
                  <span> { action.value?.errors || 'Something went wrong' } </span>
                )
              }
            </Modal>
          )
        }
      </div>
    </>
  )
} )
