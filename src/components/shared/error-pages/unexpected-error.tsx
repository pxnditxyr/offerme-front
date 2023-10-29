import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export const UnexpectedErrorPage = component$( () => {
  return (
    <div>
      <h1> Unexpected Error </h1>
      <p> Something went wrong. </p>
      <div>
        <Link href="/">
          <img src="/offer-me-icon.svg" alt="Home" style="width: 40px; height: 40px; filter: invert( 100% )" />
          Go Home
        </Link>
      </div>
    </div>
  )
} )
