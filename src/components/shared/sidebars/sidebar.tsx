import { component$, useStyles$ } from '@builder.io/qwik'
import { SidebarSubMenu } from './sidebar-menu'
import { useSidebar } from '~/hooks/sidebar/use-sidebar'
import { adminMenuData } from '~/data/modules-submodules'

import styles from './sidebar.styles.css?inline'

export const Sidebar = component$( () => {
  useStyles$( styles )

  const { isOpenSidebar, menuData, onToggleMenu, onToggleSidebar } = useSidebar({ isOpenValue: false, initialMenuData: adminMenuData })

  return (
    <>
      <aside id="sidebar" class={ isOpenSidebar.value ? '' : 'collapsed' }>
        <nav id="sidebar__nav">
          <ul id="sidebar__menu">
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
        </nav>
      </aside>
      <button
        id="btn__toggle"
        onClick$={ onToggleSidebar }
      > { isOpenSidebar.value ? 'Close' : 'Open' } </button>
    </>
  )
} )


