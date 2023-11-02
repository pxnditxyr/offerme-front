import { $, useComputed$, useSignal, useStore } from '@builder.io/qwik';
import { IMenuData } from '~/interfaces';

interface ISidebarHook {
  isOpenValue: boolean
  initialMenuData: IMenuData[]
}

export const useSidebar = ( { isOpenValue, initialMenuData } : ISidebarHook ) => {
  const isOpenSidebar = useSignal<Boolean>( isOpenValue )
  const menuData = useStore<IMenuData[]>( initialMenuData )
    
  const onToggleSidebar = $( () => {
    isOpenSidebar.value = !isOpenSidebar.value
  } )

  const onToggleMenu = $( ( name : string ) => {
    menuData.forEach( ( menu ) => {
      if ( menu.name === name ) menu.isExpanded = !menu.isExpanded
      if ( menu.submenu ) {
        menu.submenu.forEach( ( submenu ) => {
          if ( submenu.crud && submenu.name === name ) submenu.isExpanded = !submenu.isExpanded
        } )
      }
    } )
  } )

  return {
    isOpenSidebar: useComputed$( () => isOpenSidebar.value ),
    menuData,
    onToggleSidebar,
    onToggleMenu,
  }
}

