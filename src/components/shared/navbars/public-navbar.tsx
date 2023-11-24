import { component$, useStyles$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import styles from './public-navbar.styles.css?inline'

export const PublicNavbar = component$( () => {

  useStyles$( styles )

  return (
    <>
      <header class="header">
        <nav class="nav">
          <ul class="navbar navbar__left">
            <li>
              <Link
                class="link__brand"
                href="/"
              > Offer Me </Link>
            </li>
          </ul>
          <ul class="navbar navbar__center">
            <li>
              <Link
                class="link"
                href="/offers"
              > Offers </Link>
            </li>
            <li>
              <Link
                class="link"
                href="/sectors"
              > Sectors </Link>
            </li>
            <li>
              <Link
                class="link"
                href="/"
              >
                <img
                  class="logo"
                  src="/offer-me-icon.svg"
                  alt="Offer Me"
                />
              </Link>
            </li>
            <li>
              <Link
                class="link"
                href="#about"
              > About </Link>
            </li>
            <li>
              <Link
                class="link"
                href="#join"
              > Join Us </Link>
            </li>
          </ul>
          <ul class="navbar navbar__right">
            <li>
              <Link
                class="link"
                href="/signin"
              > Sign In </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
} )
