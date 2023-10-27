import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import styles from './public-navbar.module.css'

// import ImgMenuicon from '~/media/icons/menu.icon.svg?jsx'
// import ImgXicon from '~/media/icons/x.icon.svg?jsx'


export const PublicNavbar = component$( () => {
  return (
    <>
      <header class={ styles.header }>
        <nav class={ styles.nav }>
          <ul class={ [ styles.navbar, styles.navbar__left ] }>
            <li>
              <Link
                class={ styles.link__brand }
                href="/"
              > Offer Me </Link>
            </li>
          </ul>
          <ul class={[ styles.navbar, styles.navbar__center ]}>
            <li>
              <Link
                class={ styles.link }
                href="/offers"
              > Offers </Link>
            </li>
            <li>
              <Link
                class={ styles.link }
                href="/sectors"
              > Sectors </Link>
            </li>
            <li>
              <Link
                class={[ styles.link, styles.link__logo ]}
                href="/"
              >
                <img
                  class={ styles.logo }
                  src="/offer-me-icon.svg"
                  alt="Offer Me"
                />
              </Link>
            </li>
            <li>
              <Link
                class={ styles.link }
                href="#about"
              > About </Link>
            </li>
            <li>
              <Link
                class={ styles.link }
                href="#join"
              > Join Us </Link>
            </li>
          </ul>
          <ul class={ [ styles.navbar, styles.navbar__right ] }>
            <li>
              <Link
                class={ styles.link }
                href="/signin"
              > Sign In </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
} )
