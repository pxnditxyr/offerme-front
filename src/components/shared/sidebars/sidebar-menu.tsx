import { component$ } from '@builder.io/qwik'
import { SidebarCrudMenu } from './sidebar-crud-menu'
import { IMenuData } from '~/interfaces'

interface ISidebarMenu {
  menuData: IMenuData
  onToggleMenu: ( name : string ) => void
}

export const SidebarSubMenu = component$( ( { menuData, onToggleMenu } : ISidebarMenu ) => {

  const { isExpanded, label, crud, link, submenu, name } = menuData

  return (
    <li
      id={ `${ name }__menu` }
      class={ `sidebar__menu__item ${ isExpanded ? 'expanded' : 'no-expanded' }` }
      onClick$={ ( event ) => {
        const elementId = ( event.target as HTMLElement ).id
        if ( elementId === `${ name }__menu` || elementId === `${ name }__title` ) onToggleMenu( name )
      } }
    >
      <span
        id={ `${ name }__title` }
        class="sidebar__menu__title"
      > { label } </span>
      <ul class={ `sidebar__submenu ${ isExpanded ? 'expanded' : 'hidden' }` }>
        {
          crud ? (
            <SidebarCrudMenu link={ link } isExpanded={ isExpanded } />
          ) : (
            submenu?.map( ( submenu ) => (
              <SidebarSubMenu
                key={ submenu.name }
                menuData={ submenu }
                onToggleMenu={ onToggleMenu }
              />
            ) )
          )
        }
      </ul>
    </li>
  )
} )
