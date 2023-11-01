import { component$, useContext } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { userAuthorizationSchema } from '~/auth'
import { UserContext } from '~/context'

export const useRedirect = routeLoader$( ({ redirect }) => {
  throw redirect( 302, userAuthorizationSchema[ 'ADMIN' ].entrypoint )
} )

export default component$( () => { 

  const user = useContext( UserContext )

  return (
    <>
      <h1> Redirecting... </h1>
    </>
  )
} )
