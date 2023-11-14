import { Slot, component$, useContextProvider, useStore } from '@builder.io/qwik'
import { ManagementUsersContext } from './management-users.context'
import { IManagementCategoriesStatus, IManagementUsersState } from '~/interfaces'
import { ManagementCategoriesContext } from './manegement-categories.context'

export const ManagementProvider = component$( () => {

  const usersManagementState = useStore<IManagementUsersState>({
    users: [],
    isLoading: false,
    error: null
  })

  const categoriesManagementState = useStore<IManagementCategoriesStatus>({
    categories: [],
    isLoading: false,
    errors: null
  })

  useContextProvider( ManagementUsersContext, usersManagementState )
  useContextProvider( ManagementCategoriesContext, categoriesManagementState )

  return (
    <Slot />
  )
} )
