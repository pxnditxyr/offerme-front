import { Slot, component$ } from '@builder.io/qwik'
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city'

import styles from './auth-layout.module.css'
import { AuthNavbar } from '~/components/shared'
import { revalidateToken } from '~/graphql'
import { graphqlExceptionsHandler } from '~/utils'
import { userAuthorizationSchema } from '~/auth'

export const onGet : RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

export const useCheckAuth = routeLoader$( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( jwt ) {
    let authResponse : any
    try {
      authResponse = await revalidateToken( jwt.value )
    } catch ( error : any ) {
      const errors = graphqlExceptionsHandler( error )
      if ( errors.includes( 'Unauthorized' ) ) {
        cookie.delete( 'jwt', { path: '/' } )
      }
    }
    if ( authResponse ) {
      const roleName = authResponse.revalidateToken.user.role.name
      if ( userAuthorizationSchema[ roleName ] ) throw redirect( 302, userAuthorizationSchema[ roleName ].entrypoint )
    }
  }
} )

export default component$( () => {
  return (
    <>
      <main class={ styles.container }>
        <AuthNavbar />
        <Slot />
      </main>
    </>
  )
} )
