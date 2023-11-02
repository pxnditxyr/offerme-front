import { $, component$, useSignal, useStore, useStyles$ } from '@builder.io/qwik'

import styles from './sidebar.styles.css?inline'
import { Link } from '@builder.io/qwik-city'

interface IMenuData {
  label: string
  name: string
  isExpanded: boolean
  crud: boolean
  link: string
  submenu?: IMenuData[]
}

export const Sidebar = component$( () => {
  useStyles$( styles )

  const isOpenSidebar = useSignal( false )
  const sidebarMenuData = useStore<IMenuData[]>([
    {
      label: 'Categories',
      name: 'categories',
      isExpanded: false,
      crud: true,
      link: '/management/categories',
    },
    {
      label: 'Companies',
      name: 'companies',
      isExpanded: false,
      crud: true,
      link: '/management/companies',
    },
    {
      label: 'Products',
      name: 'products',
      isExpanded: false,
      crud: true,
      link: '/management/products',
    },
    {
      label: 'Parameters',
      name: 'parameters',
      isExpanded: false,
      crud: true,
      link: '/management/parameters',
    },
    {
      label: 'Users',
      name: 'users',
      isExpanded: false,
      crud: true,
      link: '/management/users',
    },
    {
      label: 'Promotions',
      name: 'promotions',
      isExpanded: false,
      crud: false,
      link: '/management/promotions',
      submenu: [
        {
          label: 'Promotions',
          name: 'promotions-sub',
          isExpanded: false,
          crud: true,
          link: '/management/promotions',
        },
        {
          label: 'Code Promotions',
          name: 'code-promotions',
          isExpanded: false,
          crud: true,
          link: '/management/promotions/code-promotions',
        },
      ],
    },
    {
      label: 'Reviews',
      name: 'reviews',
      isExpanded: false,
      crud: true,
      link: '/management/reviews',
    },
  ])
    
  const onToggleSidebar = $( () => {
    isOpenSidebar.value = !isOpenSidebar.value
  } )


  const onToggleMenu = $( ( name : string ) => {
    sidebarMenuData.forEach( ( menu ) => {
      if ( menu.name === name ) menu.isExpanded = !menu.isExpanded
      if ( menu.submenu ) {
        menu.submenu.forEach( ( submenu ) => {
          if ( submenu.crud && submenu.name === name ) submenu.isExpanded = !submenu.isExpanded
        } )
      }
    } )
  } )

  return (
    <>
      <aside id="sidebar" class={ isOpenSidebar.value ? 'collapsed' : '' }>
        <nav id="sidebar__nav">
          <ul id="sidebar__menu">
            {
              sidebarMenuData.map( ( submenu ) => (
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
      > { isOpenSidebar.value ? 'Open' : 'Close' } </button>
    </>
  )
} )

interface ISidebarMenu {
  menuData: IMenuData
  onToggleMenu: ( name : string ) => void
}

export const SidebarSubMenu = component$( ( { menuData, onToggleMenu } : ISidebarMenu ) => {

  const { isExpanded, label, crud, link, submenu, name } = menuData

  return (
    <li
      id={ `${ name }__menu` }
      onClick$={ ( event ) => {
        const elementId = ( event.target as HTMLElement ).id
        if ( elementId === `${ name }__menu` || elementId === `${ name }__title` ) onToggleMenu( name )
      } }
    >
      <span
        id={ `${ name }__title` }
        class="sidebar__menu__title"
      > { label } </span>
      <ul class={ `sidebar__submenu ${ isExpanded ? '' : 'hidden' }` }>
        {
          crud ? (
            <SidebarCrudMenu link={ link } />
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
