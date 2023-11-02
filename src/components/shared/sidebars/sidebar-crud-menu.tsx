import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

interface ISidebarCrudMenu {
  link: string
}

export const SidebarCrudMenu = component$( ( { link } : ISidebarCrudMenu ) => {
  return (
    <ul class="sidebar__crud__menu">
      <li class="sidebar__crud__menu__item">
        <Link href={ `${ link }/list` }> List </Link>
      </li>
      <li class="sidebar__crud__menu__item">
        <Link href={ `${ link }/create` }> Create </Link>
      </li>
      <li class="sidebar__crud__menu__item">
        <Link href={ `${ link }/update` }> Update </Link>
      </li>
    </ul>
  )
} )
