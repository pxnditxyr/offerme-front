import { component$, useStyles$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import styles from './auth-navbar.styles.css?inline'

export const AuthNavbar = component$( () => {

  useStyles$( styles )
  return (
    <header class="auth__navbar">
      <nav class="auth__navbar__content">
        <Link href="/" class="auth__navbar__content__link">
          <img src="/icons/home.icon.svg" alt="Home" style="width: 24px; height: 24px;" />
          <span> Back </span>
        </Link>
      </nav>
    </header>
  )
} )
