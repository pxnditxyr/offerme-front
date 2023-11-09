import { component$, useStyles$ } from '@builder.io/qwik'

import styles from './admin-sidebar-user-card.css?inline'
import { useAuthStore } from '~/hooks'

export const AdminSidebarUserCard = component$( () => {

  useStyles$( styles )

  const { user, status } = useAuthStore()
  if ( status.value === 'loading' ) return (
    <article class="sidebar__mini-card">
      Loading...
    </article>
  )

  if ( !user.value ) return (
    <article class="sidebar__mini-card">
      User not found
    </article>
  )
  const { email, peopleInfo } = user.value
  const { name, maternalSurname, paternalSurname } = peopleInfo

  return (
    <article class="sidebar__mini-card">
      <section class="sidebar__mini-card__avatar">
        <img
          class="sidebar__mini-card__avatar__image"
          src={ "/icons/user-avatar.svg" }
          alt="user avatar"
        />
      </section>
      <section class="sidebar__mini-card__info">
        <span class="sidebar__mini-card__info__name" > { paternalSurname } { maternalSurname } </span>
        <span class="sidebar__mini-card__info__name" > { name } </span>
        <span class="sidebar__mini-card__info__email" > { email } </span>
      </section>
    </article>
  )
} )
