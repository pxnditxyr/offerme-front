import { Slot, component$, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { AuthContext } from './auth.context'
import { IAuthState } from '~/interfaces'
import { useAuthStore } from '~/hooks'

export const AuthProvider = component$( () => {

  const authState = useStore<IAuthState>({
    user: null,
    status: 'loading',
    token: null,
  })

  useContextProvider( AuthContext, authState )
  const { revalidateToken } = useAuthStore()

  useVisibleTask$( async () => {
    const jwt = document.cookie.split( '; ' ).find( row => row.startsWith( 'jwt' ) )
    if ( jwt ) {
      const token = jwt.split( '=' )[ 1 ]
      await revalidateToken( token )
    }
  } )

  return (
    <Slot />
  )
} )
