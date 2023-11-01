import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

interface ICrudSubMenuProps {
  moduleName: string
  submoduleName: string
}

export const CrudSubMenu = component$( ( { moduleName, submoduleName }: ICrudSubMenuProps ) => {
  return (
    <ul class="sidebar__nav__crud">
      <li>
        <Link
          class="sidebar__nav__crud__link"
          href={ `/management/${ moduleName }/${ submoduleName }` }
        > List </Link>
      </li>
      <li>
        <Link
          class="sidebar__nav__crud__link"
          href={ `/management/${ moduleName }/${ submoduleName }/create` }
        > Create </Link>
      </li>
      <li>
        <Link
          class="sidebar__nav__crud__link"
          href={ `/management/${ moduleName }/${ submoduleName }/update` }
        > Update </Link>
      </li>
      <li>
        <Link
          class="sidebar__nav__crud__link"
          href={ `/management/${ moduleName }/${ submoduleName }/delete` }
        > Delete </Link>
      </li>
    </ul>
  )
} )

