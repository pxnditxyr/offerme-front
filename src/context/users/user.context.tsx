import { createContextId } from '@builder.io/qwik'
import { IUser } from '~/interfaces'

export const UserContext = createContextId<IUser>( 'user-context' )
