import { createContextId } from '@builder.io/qwik'
import type { IAuthState } from '~/interfaces'

export const AuthContext = createContextId<IAuthState>( 'auth-context' )
