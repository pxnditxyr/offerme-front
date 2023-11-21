import { Slot, component$ } from '@builder.io/qwik'
import { Form, routeAction$ } from '@builder.io/qwik-city'
import { LoadingPage, Sidebar } from '~/components/shared'
import { useAuthStore } from '~/hooks'

export const useSignoutAction = routeAction$( ( _data, { cookie, redirect } ) => {
  cookie.delete( 'jwt', { path: '/' } )
  throw redirect( 302, '/' )
} )
  
export default component$( ()  => {
  const { status } = useAuthStore()
  const signoutAction = useSignoutAction()

  if ( status === 'loading' ) return ( <LoadingPage /> )

  return (
    <main class="content">
      <Sidebar>
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
