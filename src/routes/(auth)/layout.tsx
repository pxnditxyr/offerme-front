import { Slot, component$ } from '@builder.io/qwik'
import { RequestHandler } from '@builder.io/qwik-city'

import styles from './auth-layout.module.css'
import { AuthNavbar } from '~/components/shared'

export const onGet : RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

export default component$( () => {
  return (
    <main class={ styles.container }>
      <AuthNavbar />
      <Slot />
    </main>
  )
} )
