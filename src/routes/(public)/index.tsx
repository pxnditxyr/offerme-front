import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$( () => {
  return (
    <>
      <h1> Offer Me </h1>
      <p>
        Welcome to official page of Offer Me. We are a company that provides
      </p>
    </>
  )
} )

export const head : DocumentHead = {
  title: 'Offer Me',
  meta: [
    {
      name: 'Offer me Web App',
      content: 'This Web App provides you with the best offers in the market',
    },
  ],
}
