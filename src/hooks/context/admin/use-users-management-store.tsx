import { $, useContext } from '@builder.io/qwik'
import { ManagementUsersContext } from '~/context'
import { IManagementUsersData } from '~/interfaces'
import { UsersManagementService } from '~/services'

export const useUsersManagementStore = () => {
  const managementUsers = useContext( ManagementUsersContext )

  const setUsers = $( ( users : IManagementUsersData[] ) => {
    managementUsers.users = [ ...users ]
  } )

  // const createUser = $( async ( data : ICreateUserManagement ) => {
  //   const user = await UsersManagementService.createUser( token.value || '', data )
  //   console.log( user )
  // } )

  const setIsLoading = $( ( value : boolean ) => {
    managementUsers.isLoading = value
  } )

  const onToggleUserStatus = $( async ( id : string, token : string ) => {
    try {
      if ( managementUsers.users.find( ( user ) => user.id === id )?.status ) {
        const newUser = await UsersManagementService.deactivateUser( token, id )
        managementUsers.users = managementUsers.users.map( ( user ) => {
          if ( user.id === id ) return newUser
          return user
        } )
      } else {
        const user = { id, status: true }
        const newUser = await UsersManagementService.updateUser( token, user )
        managementUsers.users = managementUsers.users.map( ( user ) => {
          if ( user.id === id ) return newUser
          return user
        } )
      }
    } catch ( error ) {
      managementUsers.error = error
    }
  } )

  return {
    isLoading: managementUsers.isLoading,
    users: managementUsers.users,
    error: managementUsers.error,
    setUsers,
    // createUser,
    setIsLoading,
    onToggleUserStatus,
  }
}
