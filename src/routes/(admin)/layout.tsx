import { Slot, component$, useContextProvider, useStyles$ } from '@builder.io/qwik'
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Sidebar, UnexpectedErrorPage } from '~/components/shared'
import { UserContext } from '~/context'
import { IUser } from '~/interfaces'
import { graphqlExceptionsHandler } from '~/utils'

import { AuthProvider } from '~/context'
import { userAuthorizationSchema } from '~/schemas'

import styles from './admin-layout.styles.css?inline'
import { AuthService } from '~/services'

export const onGet : RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

const useCheckAuth = routeLoader$( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  let authResponse : any
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
  if ( authResponse.revalidateToken.user.role.name !== 'ADMIN' ) {
    const userRole = authResponse.revalidateToken.user.role.name
    throw redirect( 302, userAuthorizationSchema[ userRole ].entrypoint )
  }
  cookie.set( 'jwt', authResponse.revalidateToken.token, { secure: true, path: '/' } )
  return authResponse.revalidateToken.user
} )

export default component$( () => {
  useStyles$( styles )

  const checkAuth = useCheckAuth()

  if ( checkAuth && checkAuth.value.errors ) return <UnexpectedErrorPage />

  const user : IUser = structuredClone( checkAuth.value ) as IUser
  useContextProvider( UserContext, user )
  
  return (
    <AuthProvider>
      <main class="content">
        <Sidebar />
        <div id="content__wrapper">
          <Slot />
        </div>
      </main>
    </AuthProvider>
  )
} )
