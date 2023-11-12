import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './back-button.styles.css?inline'

interface IBackButtonProps {
  href?: string
}

export const BackButton = component$( ( { href = '#' } : IBackButtonProps ) => {

  useStyles$( styles )

  return (
    <a href={ href } class="back-button">
      <svg viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </a>
  )
} )
