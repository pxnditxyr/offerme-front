import { createContextId } from '@builder.io/qwik'
import { IManagementCategoriesStatus } from '~/interfaces'

export const ManagementCategoriesContext = createContextId<IManagementCategoriesStatus>( 'management-categories-context' )
