import { Slot, component$, useContextProvider, useStore } from '@builder.io/qwik'
import { ManagementUsersContext } from './management-users.context'
import { IManagementUsersState } from '~/interfaces'

export const ManagementProvider = component$( () => {

  const usersManagementState = useStore<IManagementUsersState>({
    users: [],
    isLoading: false,
    error: null
  })

  useContextProvider( ManagementUsersContext, usersManagementState )

  return (
    <Slot />
  )
} )
