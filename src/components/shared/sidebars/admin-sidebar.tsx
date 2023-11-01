import { component$, useStyles$ } from '@builder.io/qwik'
import { AdminSidebarUserCard } from '../cards/admin-sidebar-user-card'
import { modulesData } from '~/data'
import { CrudSubMenu } from './crud-sub-menu'

import styles from './admin-sidebar.css?inline'

export const AdminSidebar = component$( () => {

  useStyles$( styles )

  return (
    <aside class="sidebar">
      <AdminSidebarUserCard />
      <nav class="sidebar__nav">
        <ul class="sidebar__nav__list">
          {
            modulesData.map( ({ name: moduleName, label, submodules }) => (
              <li key={ moduleName } class="sidebar__nav__module">
                <span class="sidebar__nav__module__label"> { label } </span>
                <ul class="sidebar__nav__module__list">
                  {
                    submodules.map( ({ name: submoduleName, label }) => (
                      <li key={ submoduleName } class="sidebar__nav__module__submodule">
                        <span class="sidebar__nav__module__submodule__label"> { label } </span>
                        <CrudSubMenu moduleName={ moduleName } submoduleName={ submoduleName } />
                      </li>
                    ) )
                  }
                </ul>
              </li>
            ) )
          }
        </ul>
      </nav>
    </aside>
  )
} )

