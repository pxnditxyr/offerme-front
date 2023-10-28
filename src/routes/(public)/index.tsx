import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$( () => {
  return (
    <>
      <div class="container" id="main">
        <h1> Offer Me </h1>
        <p>
          Welcome to official page of Offer Me. We are a company that provides
        </p>
      </div>
      <div class="container" id="about">
        <h1> About Us </h1>
        <div>
          <article>
            <section> <h2> Our Mission </h2> </section>
            <section>
              <p>
                We are a company that provides the best offers in the market
              </p>
            </section>
          </article>
          <article>
            <section> <h2> Our Vision </h2> </section>
            <section>
              <p>
                We are a company that provides the best offers in the market
              </p>
            </section>
          </article>
        </div>
      </div>
      <div class="container" id="join">
        <h1> Join Us </h1>
        <div>
          <article>
            <section> <h2> You are a company? </h2> </section>
            <section>
              <p>
                Please contact us at <a href="mailto:pxnditxyr@gmail.com" target="_blank" />
              </p>
            </section>
            <form>
              <input type="text" placeholder="Company Name" />
              <input type="text" placeholder="Company Email" />
              <input type="text" placeholder="Reason" />
              <button> Submit </button>
            </form>
          </article>
        </div>
      </div>
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
