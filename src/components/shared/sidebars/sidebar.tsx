import { Slot, component$, useStyles$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import { SidebarSubMenu } from './sidebar-menu'
import { AdminSidebarUserCard } from '../cards/admin-sidebar-user-card'
import { useSidebar } from '~/hooks'

import { adminMenuData } from '~/data'
import styles from './sidebar.styles.css?inline'

export const Sidebar = component$( () => {
  useStyles$( styles )

  const {
    isOpenSidebar, menuData,
    onToggleMenu, onToggleSidebar
  } = useSidebar({ isOpenValue: true, initialMenuData: adminMenuData })

  return (
    <>
      <aside id="sidebar" class={ isOpenSidebar.value ? '' : 'collapsed' }>
        <AdminSidebarUserCard />
        <nav id="sidebar__nav">
          <ul id="sidebar__menu">
          <li class="sidebar__menu__item">
            <Link class="sidebar__menu__title" href="/management/dashboard"> Dashboard </Link>
          </li>
            {
              menuData.map( ( submenu ) => (
                <SidebarSubMenu
                  key={ submenu.name }
                  menuData={ submenu }
                  onToggleMenu={ onToggleMenu }
                />
              ) )
            }
          </ul>
          <ul id="sidebar__menu__bottom">
            <li class="sidebar__menu__item">
              <Slot name="signout" />
            </li>
          </ul>
        </nav>
      </aside>
      <div id="sidebar__toggle">
        <button
          id="btn__toggle"
          onClick$={ onToggleSidebar }
          class={ isOpenSidebar.value ? 'right' : 'left' }
        > 
          {
            ( isOpenSidebar.value )
              ? ( <img src="/icons/x.icon.svg" alt="x" /> )
              : ( <img src="/icons/menu.icon.svg" alt="menu" /> )
          }
        </button>
        
      </div>
    </>
  )
} )


