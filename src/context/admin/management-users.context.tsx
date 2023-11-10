import { createContextId } from '@builder.io/qwik'
import type { IManagementUsersState } from '~/interfaces'

export const ManagementUsersContext = createContextId<IManagementUsersState>( 'management-users-context' )
