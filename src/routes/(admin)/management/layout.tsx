import { Slot, component$ } from '@builder.io/qwik'
import { LoadingPage } from '~/components/shared'
import { useAuthStore } from '~/hooks'

export default component$( ()  => {
  const { status } = useAuthStore()

  if ( status.value === 'loading' ) return ( <LoadingPage /> )

  return (
    <Slot />
  )
} )
