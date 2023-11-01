import { component$, useContext, useStyles$ } from '@builder.io/qwik'
import { UserContext } from '~/context'

import styles from './admin-sidebar-user-card.css?inline'

export const AdminSidebarUserCard = component$( () => {

  useStyles$( styles )

  const { email, peopleInfo, mainAvatar } = useContext( UserContext )
  const { name, maternalSurname, paternalSurname } = peopleInfo

  return (
    <article class="sidebar__mini-card">
      <section class="sidebar__mini-card__avatar">
        <img
          class="sidebar__mini-card__avatar__image"
          src={ mainAvatar || "/icons/user-avatar.svg" }
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
