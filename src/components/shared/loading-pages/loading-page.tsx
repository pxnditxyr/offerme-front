import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './loading.styles.css?inline'

export const LoadingPage = component$( () => {
  useStyles$( styles )
  return (
    <div class="loading__container">
      <h1 class="loading__title"> Offer Me </h1>
      <img class="loading__logo" src="/offer-me-icon.svg" alt="logo" />
      <div class="loading__spinner"></div>
    </div>
  )
} )
