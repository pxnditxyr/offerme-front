import { Slot, component$, useContextProvider, useStore } from '@builder.io/qwik'
import { ManagementUsersContext } from './management-users.context'
import { IAdminUsersData } from '~/interfaces'

export const ManagementUsersProvider = component$( () => {

  const authState = useStore<IAdminUsersData[]>([])

  useContextProvider( ManagementUsersContext, authState )

  return (
    <Slot />
  )
} )
