import { Slot, component$ } from '@builder.io/qwik'
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { PublicNavbar } from '~/components/shared/navbars/public-navbar'

import styles from './public-layout.module.css'
import { revalidateToken } from '~/graphql'
import { graphqlExceptionsHandler } from '~/utils'
import { userAuthorizationSchema } from '~/auth'

export const onGet : RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

export const useCheckAuth = routeLoader$( async ( { cookie, redirect } ) => {
  const jwt = cookie.get( 'jwt' )
  let authResponse : any
  if ( jwt ) {
    try {
      authResponse = await revalidateToken( jwt.value )
    } catch ( error : any ) {
      const errors = graphqlExceptionsHandler( error )
      if ( errors.includes( 'Unauthorized' ) ) cookie.delete( 'jwt' )
    }
    if ( authResponse ) {
      const roleName = authResponse.revalidateToken.user.role.name
      if ( userAuthorizationSchema[ roleName as string ] && userAuthorizationSchema[ roleName as string ].entrypoint !== '/' )
        throw redirect( 302, userAuthorizationSchema[ roleName as string ].entrypoint )
    }
  }
} )

export default component$( () => {
  return (
    <main class={ styles.container }>
      <PublicNavbar />
      <Slot />
    </main>
  )
} )
