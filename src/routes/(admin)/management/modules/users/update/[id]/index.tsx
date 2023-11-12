import { component$, useTask$ } from '@builder.io/qwik'
import { Form, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { FormField, Modal, UnexpectedErrorPage } from '~/components/shared'
import { useModalStatus } from '~/hooks'
import { IManagementUsersData, IRouteLoaderError, ISubparameter } from '~/interfaces'
import { SubparametersService, UsersManagementService } from '~/services'
import { ManagementRolesService } from '~/services/admin/roles.service'
import { graphqlExceptionsHandler, isUUID, serializeDate } from '~/utils'

interface IUpdateSubparameters {
  documentTypes: ISubparameter[]
  genders: ISubparameter[]
  roles: ISubparameter[]
}

export const getSubparameters = routeLoader$<IUpdateSubparameters | IRouteLoaderError>( async ( { fail, cookie } ) => {

  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )
  try {
    const documentTypes = await SubparametersService.findAllByParameterName( 'document type' )
    const genders = await SubparametersService.findAllByParameterName( 'gender' )
    const roles = await ManagementRolesService.findAll( jwt.value, true )
    return {  documentTypes, genders, roles }
  } catch ( error : any ) {
    const errors = graphqlExceptionsHandler( error )
    return fail( 400, { errors } )
  }
} )

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

export const updateManagementUserAction = routeAction$( async ( data, { fail, cookie, params } ) => {
  const id = atob( params.id )
  if ( !isUUID( id ) ) return fail( 400, { errors: 'Invalid user id' } )
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) return fail( 401, { errors: 'Unauthorized' } )
  try {
    const newData = {
      ...data,
      id,
      documentTypeId: data.documentTypeId === 'null' ? null : data.documentTypeId,
      documentNumber: ( data.documentNumber === '' || data.documentTypeId === 'null' ) ? null : data.documentNumber,
    }
    await UsersManagementService.updateUser( jwt.value, {
      ...newData,
    } )
    return { success: true, userEmail: data.email }
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
  documentTypeId: z.string().min( 1, 'Document Type is required, or select "Not Specified"' ),
  genderId: z.string().min( 1, 'Gender is required' ),
  birthdate: z.string().min( 1, 'Birthdate is required' ),
  roleId: z.string().min( 1, 'Role is required' ),
  documentNumber: z.string()
}) )

export default component$( () => {
  const currentUser = useGetManagementUser().value
  const subparameters = getSubparameters().value
  const action = updateManagementUserAction()
  const { modalStatus, onOpenModal, onCloseModal } = useModalStatus()

  
  if ( 'errors' in currentUser ) return ( <UnexpectedErrorPage /> )
  if ( 'errors' in subparameters ) return ( <UnexpectedErrorPage /> )

  const { documentTypes, roles, genders } = subparameters
  
  useTask$( ({ track }) => {
    track( () => action.value )
    if ( action.value && action.value.success === false && action.value.errors ) onOpenModal()
    if ( action.value && action.value.success ) onOpenModal()
  } )
  

  return (
    <div>
      <h1> Update User </h1>
      <div>
      <Form action={ action }>
        <FormField
            name="name"
            type="text"
            placeholder="Name"
            value={ currentUser.peopleInfo.name }
            error={ action.value?.fieldErrors?.name?.join( ', ' ) }
            />
          <FormField
            name="paternalSurname"
            type="text"
            placeholder="Paternal Surname"
            value={ currentUser.peopleInfo.paternalSurname }
            error={ action.value?.fieldErrors?.paternalSurname?.join( ', ' ) }
            />
          <FormField
            name="maternalSurname"
            type="text"
            placeholder="Maternal Surname"
            value={ currentUser.peopleInfo.maternalSurname }
            error={ action.value?.fieldErrors?.maternalSurname?.join( ', ' ) }
            />
          <FormField
            name="email"
            type="text"
            placeholder="Email"
            value={ currentUser.email }
            error={ action.value?.fieldErrors?.email?.join( ', ' ) }
            />
          <select name="documentTypeId">
            <option value="null" selected={ currentUser.peopleInfo.documentType === null }>Not Specified</option>
            {
              documentTypes.map( ( { id, name } ) => (
                <option value={ id } selected={ currentUser.peopleInfo.documentType?.id === id }>{ name }</option>
              ) )
            }
          </select>
          <FormField
            name="documentNumber"
            type="text"
            placeholder="Document Number"
            value={ currentUser.peopleInfo.documentNumber }
            error={ action.value?.fieldErrors?.documentNumber?.join( ', ' ) }
            />
          <select name="genderId">
            {
              genders.map( ( { id, name } ) => (
                <option value={ id } selected={ currentUser.peopleInfo.gender.id === id }>{ name }</option>
              ) ) 
            }
          </select>
          <select name="roleId">
            {
              roles.map( ( { id, name } ) => (
                <option value={ id } selected={ currentUser.role.id === id }>{ name }</option>
              ) )
            }
          </select>
          <FormField
            name="birthdate"
            type="date"
            placeholder="Birthdate"
            value={ serializeDate( currentUser.peopleInfo.birthdate ) }
            error={ action.value?.fieldErrors?.birthdate?.join( ', ' ) }
            />
          <button> Update </button>
        </Form>
        {
          ( modalStatus.value ) && (
            <Modal isOpen={ modalStatus.value } onClose={ onCloseModal } modalType={ `${ action.value?.success ? 'success' : 'error' }` } >
              {
                ( action.value?.success === true ) && (
                  <span> User { action.value?.userEmail } Updated Successfully </span>
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
    </div>
  )
} )
