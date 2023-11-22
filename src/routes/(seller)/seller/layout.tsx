import { Slot, component$, useTask$ } from '@builder.io/qwik'
import { Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city'
import { LoadingPage, Sidebar, UnexpectedErrorPage } from '~/components/shared'
import { sellerMenuData } from '~/data'
import { useAuthStore } from '~/hooks'
import { AuthService } from '~/services'

export const useSignoutAction = routeAction$( ( _data, { cookie, redirect } ) => {
  cookie.delete( 'jwt', { path: '/' } )
  throw redirect( 302, '/' )
} )

export const useCheckAuth = routeLoader$( async ({ cookie, redirect }) => {
  const jwt = cookie.get( 'jwt' )
  if ( !jwt ) throw redirect( 302, '/signin' )
  const authResponse = await AuthService.newRevalidateToken( jwt.value )
  return authResponse
} )

export default component$( ()  => {
  const authResponse = useCheckAuth().value
  const signoutAction = useSignoutAction()
  const { status, setUser } = useAuthStore()

  if ( 'errors' in authResponse ) return ( <UnexpectedErrorPage /> )
  useTask$( () => {
    setUser( authResponse.user )
  } )

  if ( status === 'loading' ) return ( <LoadingPage /> )
  

  return (
    <main class="content">
      <Sidebar
        isOpenSidebarInitialValue={ true }
        data={ sellerMenuData }
        theme="seller"
      >
        <Form q:slot="signout" action={ signoutAction }>
          <button class="btn__signout">
            <img src="/icons/signout.icon.svg" alt="signout" />
            <span class="sidebar__menu__title"> Sign Out </span>
          </button>
        </Form>
      </Sidebar>
      <div id="content__wrapper">
        <Slot />
      </div>
    </main>
  )
} )
