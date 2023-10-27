import { Slot, component$ } from '@builder.io/qwik'
import { RequestHandler } from '@builder.io/qwik-city'
import { PublicNavbar } from '~/components/shared/navbars/public-navbar'

import styles from './public-layout.module.css'

export const onGet : RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

export default component$( () => {
  return (
    <main class={ styles.container }>
      <PublicNavbar />
      <Slot />
    </main>
  )
} )
