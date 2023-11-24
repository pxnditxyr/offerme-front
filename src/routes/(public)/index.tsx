import { component$, useStyles$ } from '@builder.io/qwik'
import { type DocumentHead } from '@builder.io/qwik-city'

import styles from './public.styles.css?inline'

export default component$( () => {

  useStyles$( styles )
  
  return (
    <>
      {/* <div class="public__container" id="main"> */}
      {/*   <h1> Offer Me </h1> */}
      {/*   <p> */}
      {/*     Welcome to official page of Offer Me. We are a company that provides */}
      {/*   </p> */}
      {/* </div> */}
      {/* <div class="public__container" id="about"> */}
      {/*   <h1> About Us </h1> */}
      {/*   <div> */}
      {/*     <article> */}
      {/*       <section> <h2> Our Mission </h2> </section> */}
      {/*       <section> */}
      {/*         <p> */}
      {/*           We are a company that provides the best offers in the market */}
      {/*         </p> */}
      {/*       </section> */}
      {/*     </article> */}
      {/*     <article> */}
      {/*       <section> <h2> Our Vision </h2> </section> */}
      {/*       <section> */}
      {/*         <p> */}
      {/*           We are a company that provides the best offers in the market */}
      {/*         </p> */}
      {/*       </section> */}
      {/*     </article> */}
      {/*   </div> */}
      {/* </div> */}
      {/* <div class="public__container" id="join"> */}
      {/*   <h1> Join Us </h1> */}
      {/*   <div> */}
      {/*     <article> */}
      {/*       <section> <h2> You are a company? </h2> </section> */}
      {/*       <section> */}
      {/*         <p> */}
      {/*           Please contact us at <a href="mailto:pxnditxyr@gmail.com" target="_blank" /> */}
      {/*         </p> */}
      {/*       </section> */}
      {/*       <form> */}
      {/*         <input type="text" placeholder="Company Name" /> */}
      {/*         <input type="text" placeholder="Company Email" /> */}
      {/*         <input type="text" placeholder="Reason" /> */}
      {/*         <button> Submit </button> */}
      {/*       </form> */}
      {/*     </article> */}
      {/*   </div> */}
      {/* </div> */}

      <section class="under">
        <div class="under-inner one">
          <h1 class="fixed">The Issue:</h1>
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1 class="fixed">The Issue:</h1>

        </div>
      </section>
      <section class="over">
        <div class="over-inner centered">
        <p>I needed to have each section start with a different background image, but the section title needed to be fixed position while the content scrolled over both. This wasnt difficult but the tricky part was having mulitple occurrences of pattern. The "fixed" titles would overlap and be in the incorrect sections.</p>
        </div>
      </section>
      <section class="under">
        <div class="under-inner two">
          <h2 class="fixed">The Solution:</h2>
        </div>
      </section>
      <section class="over">
        <div class="over-inner centered">
        <p>Using Waypoints I am hiding and showing section titles as you scroll past the titles. When the title is underneath the section, the title is moved off the screen.</p>
        </div>
      </section>
      <section class="under">
        <div class="under-inner three">
          <h3 class="fixed">The End.</h3>
        </div>
      </section>
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
