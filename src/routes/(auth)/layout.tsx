import { Slot, component$, useStyles$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { AuthNavbar } from '~/components/shared'
import { graphqlExceptionsHandler } from '~/utils'
import { userAuthorizationSchema } from '~/schemas'
import { AuthService } from '~/services'
import { AuthProvider } from '~/context'

import styles from './auth-layout.styles.css?inline'

export const useCheckAuth = routeLoader$( async ({ cookie, redirect }) => {

  const jwt = cookie.get( 'jwt' )
  if ( jwt ) {
    let authResponse : any
    try {
      authResponse = await AuthService.revalidateToken( jwt.value )
    } catch ( error : any ) {
      const errors = graphqlExceptionsHandler( error )
      if ( errors.includes( 'Unauthorized' ) || errors.includes( 'not found' ) ) cookie.delete( 'jwt', { path: '/' } )
    }
    if ( authResponse ) {
      const roleName = authResponse.revalidateToken.user.role.name
      throw redirect( 302, userAuthorizationSchema[ roleName ].entrypoint )
    }
  }
} )

export default component$( () => {

  useStyles$( styles )

  return (
    <AuthProvider>
      <main class="auth__container">
        <AuthNavbar />
        <div class="auth__content">
          <Slot />
        </div>
      </main>
    </AuthProvider>
  )
} )
