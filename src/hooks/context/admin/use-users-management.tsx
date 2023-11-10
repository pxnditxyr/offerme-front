import { $, useContext } from '@builder.io/qwik'
import { ManagementUsersContext } from '~/context'
import { UsersManagementService } from '~/services'
import { useAuthStore } from '../auth/use-auth-store'

export interface ICreateUserManagement {
  birthdate : string
  documentNumber : string
  documentTypeId : string
  email : string
  genderId : string
  maternalSurname : string
  name : string
  password : string
  paternalSurname : string
  roleId : string
}

export const useUsersManagementStore = () => {
  const managementUsers = useContext( ManagementUsersContext )
  const { token } = useAuthStore()

  const setUsers = $( async ( token : string ) => {
    const users = await UsersManagementService.getUsers( token )
    managementUsers.users = [ ...users ]
  } )

  const createUser = $( async ( data : ICreateUserManagement ) => {
    const user = await UsersManagementService.createUser( token.value || '', data )
    console.log( user )
  } )

  const setIsLoading = $( ( value : boolean ) => {
    managementUsers.isLoading = value
  } )

  return {
    isLoading: managementUsers.isLoading,
    users: managementUsers.users,
    error: managementUsers.error,
    setUsers,
    createUser,
    setIsLoading
  }
}
