import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './public-navbar.styles.css?inline'

export const PublicNavbar = component$( () => {

  useStyles$( styles )

  return (
    <>
      <header class="header">
        <nav class="nav">
          <ul class="navbar navbar__left">
            <li>
              <a
                class="link__brand"
                href="/"
              > Offer Me </a>
            </li>
          </ul>
          <ul class="navbar navbar__center">
            <li>
              <a
                class="link"
                href="/offers"
              > Offers </a>
            </li>
            <li>
              <a
                class="link"
                href="/categories"
              > Sectors </a>
            </li>
            <li>
              <a
                class="link"
                href="/"
              >
                <img
                  class="logo"
                  src="/offer-me-icon.svg"
                  alt="Offer Me"
                />
              </a>
            </li>
            <li>
              <a
                class="link"
                href="/#about"
              > About </a>
            </li>
            <li>
              <a
                class="link"
                href="/#join"
              > Join Us </a>
            </li>
          </ul>
          <ul class="navbar navbar__right">
            <li>
              <a class="link" href="/signin"> Sign In </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
} )
