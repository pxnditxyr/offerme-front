import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export const AuthNavbar = component$( () => {
  return (
    <header>
      <nav>
        <Link href="/">
          <img src="/icons/home.icon.svg" alt="Home" style="width: 24px; height: 24px;" />
          <span> Back </span>
        </Link>
      </nav>
    </header>
  )
} )
