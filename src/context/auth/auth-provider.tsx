import { Slot, component$, useContextProvider, useStore } from '@builder.io/qwik'
import { AuthContext } from './auth.context'
import { IAuthState } from '~/interfaces'

export const AuthProvider = component$( () => {
  const authState = useStore<IAuthState>({
    user: null,
    status: 'loading',
    token: null,
  })

  useContextProvider( AuthContext, authState )

  return (
    <Slot />
  )
} )
