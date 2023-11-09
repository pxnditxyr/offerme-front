import { createContextId } from '@builder.io/qwik'
import type { IAdminUsersData } from '~/interfaces'

export const ManagementUsersContext = createContextId<IAdminUsersData[]>( 'management-users-context' )
