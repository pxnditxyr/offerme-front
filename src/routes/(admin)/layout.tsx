import { Slot, component$, useContextProvider, useStyles$ } from '@builder.io/qwik'
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Sidebar, UnexpectedErrorPage } from '~/components/shared'
import { UserContext } from '~/context'
import { revalidateToken } from '~/graphql'
import { IUser } from '~/interfaces'
import { graphqlExceptionsHandler } from '~/utils'

import styles from './admin-layout.styles.css?inline'

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
    authResponse = await revalidateToken( jwt.value )
  } catch ( error : any ) {
    const errors : string = graphqlExceptionsHandler( error )
    if ( errors.includes( 'Unauthorized' ) ) {
      cookie.delete( 'jwt', { path: '/' } )
      throw redirect( 302, '/signin' )
    }
    return { errors }
  }
  if ( authResponse.revalidateToken.user.role.name !== 'ADMIN' ) throw redirect( 302, '/' )
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
    <>
      <main class="content">
        <Sidebar />
        <div id="content__wrapper">
          <Slot />
        </div>
      </main>
    </>
  )
} )
