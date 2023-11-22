import { Slot, component$, useStyles$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { IUser } from '~/interfaces'
import { graphqlExceptionsHandler } from '~/utils'

import { userAuthorizationSchema } from '~/schemas'

import styles from './company-representative-layout.styles.css?inline'
import { AuthService } from '~/services'
import { UnexpectedErrorPage } from '~/components/shared'
import { AuthProvider } from '~/context'

export const useCheckAuth = routeLoader$<IUser | { errors: string }>( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  let authResponse
  try {
    authResponse = await AuthService.revalidateToken( jwt.value )
  } catch ( error : any ) {
    const errors : string = graphqlExceptionsHandler( error )
    if ( errors.includes( 'Unauthorized' ) ) {
      cookie.delete( 'jwt', { path: '/' } )
      throw redirect( 302, '/signin' )
    }
    return { errors }
  }
  if ( authResponse.revalidateToken.user.role.name !== 'COMPANY_REPRESENTATIVE' ) {
    const userRole = authResponse.revalidateToken.user.role.name
    throw redirect( 302, userAuthorizationSchema[ userRole ].entrypoint )
  }
  cookie.set( 'jwt', authResponse.revalidateToken.token, { secure: true, path: '/' } )
  return authResponse.revalidateToken.user
} )

export default component$( () => {
  useStyles$( styles )

  const user = useCheckAuth()
  if ( 'errors' in user ) return ( <UnexpectedErrorPage /> )

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
} )
