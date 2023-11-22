import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { userAuthorizationSchema } from '~/schemas'

export const useRedirect = routeLoader$( ({ redirect }) => {
  throw redirect( 302, userAuthorizationSchema[ 'COMPANY_REPRESENTATIVE' ].entrypoint )
} )

export default component$( () => { 

  return (
    <>
      <h1> Redirecting... </h1>
    </>
  )
} )
