import { useContext } from '@builder.io/qwik'
import { ManagementUsersContext } from '~/context'
import { IAdminUsersData } from '~/interfaces'
import { UsersManagementService } from '~/services'

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
  const jwt = 'huatnsoehut'

  const createUser = async ( data : ICreateUserManagement ) => {
    const user = await UsersManagementService.createUser( jwt, data )
    console.log( user )
  }

  return {
    managementUsers,
    createUser
  }
}
